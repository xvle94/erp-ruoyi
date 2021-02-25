<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="客户名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入客户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ozrs:customer:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ozrs:customer:export']"
        >导出</el-button>
      </el-col> -->
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="客户名称" align="center" prop="name" />
      <el-table-column label="客户名称(二类)" align="center" prop="twoClasses" />
      <el-table-column label="客户名称(三类)" align="center" prop="threeClasses" />
      <el-table-column label="联系人" align="center" prop="linkMan" />
      <el-table-column label="税率(%)" align="center" prop="ratio" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,1)"
            v-hasPermi="['ozrs:customer:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ozrs:customer:remove']"
          >作废</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleUpdate(scope.row,2)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客户基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" v-if="this.title=='客户基本信息详情'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="names">
              <el-input v-model="form.name" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称(二类)" prop="twoClasses">
              <el-input v-model="form.twoClasses" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称(三类)" prop="threeClasses">
              <el-input v-model="form.threeClasses" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkMan">
              <el-input v-model="form.linkMan" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
           <el-form-item label="发票类型">
              <el-select v-model="form.invoiceType" :disabled="true">
                <el-option v-for="item in invoiceTypes" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <template>
              <h4>账户信息</h4>
              <el-table :data="form.bankAccountList" style="width: 100%">
                <el-table-column label="序号" type="index">
                </el-table-column>
                <el-table-column prop="dutyParagraph" label="税号">
                  <template slot-scope="scope">
                    <!-- <el-form-item :prop="'bankAccountList.'+ scope.$index +'.dutyParagraph'"> -->
                      <el-input v-model="scope.row.dutyParagraph" :disabled="true"></el-input>
                    <!-- </el-form-item> -->
                  </template>
                </el-table-column>
                <el-table-column prop="bankName" label="开户行">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.bankName" :disabled="true"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="account" label="银行账户">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.account" :disabled="true"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="地址">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.address" :disabled="true"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="linkPhone" label="电话号码">
                  <template slot-scope="scope">
                    <!-- <el-form-item :prop="'bankAccountList.'+ scope.$index +'.linkPhone'"> -->
                      <el-input v-model="scope.row.linkPhone" :disabled="true"></el-input>
                    <!-- </el-form-item> -->
                  </template>
                </el-table-column>
                <el-table-column prop="linkMan" label="联系人">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.linkMan" :disabled="true"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remarks" :disabled="true"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="form" :model="form" :rules="rules" v-else>
        <div class="customCss">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="客户名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入客户名称" maxlength="50" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户名称(二类)" prop="twoClasses">
                <el-input v-model="form.twoClasses" placeholder="请输入客户名称(二类)" maxlength="50" show-word-limit/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="客户名称(三类)" prop="threeClasses">
                <el-input v-model="form.threeClasses" placeholder="请输入客户名称(三类)" maxlength="50" show-word-limit/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="linkMan">
                <el-input v-model="form.linkMan" placeholder="请输入联系人" maxlength="20" show-word-limit/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
            <el-form-item label="发票类型">
                <el-select v-model="form.invoiceType" placeholder="请选择发票类型">
                  <!-- <el-option label="普通发票" value="普通发票" />
                  <el-option label="专用发票" value="专用发票" /> -->
                  <el-option v-for="item in invoiceTypes" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <template>
                <h4>账户信息</h4>
                <el-table :data="form.bankAccountList" style="width: 100%">
                  <el-table-column label="序号" type="index">
                  </el-table-column>
                  <el-table-column prop="dutyParagraph" label="税号" min-width="130">
                    <template slot-scope="scope">
                      <el-form-item :prop="'bankAccountList.'+ scope.$index +'.dutyParagraph'" :rules="rules.dutyParagraph">
                        <el-input v-model="scope.row.dutyParagraph" placeholder="税号" ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="bankName" label="开户行" min-width="140">
                    <template slot-scope="scope">
                      <el-form-item :prop="'bankAccountList.'+ scope.$index +'.bankName'">
                        <el-input v-model="scope.row.bankName" maxlength="100" placeholder="开户行"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="account" label="银行账户" min-width="140">
                    <template slot-scope="scope">
                      <el-form-item :prop="'bankAccountList.'+ scope.$index +'.account'">
                        <el-input v-model="scope.row.account" placeholder="银行账户"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="地址" min-width="130">
                    <template slot-scope="scope">
                      <el-form-item :prop="'bankAccountList.'+ scope.$index +'.address'">
                        <el-input v-model="scope.row.address" maxlength="100" placeholder="地址"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="linkPhone" label="电话号码" min-width="130">
                    <template slot-scope="scope">
                      <el-form-item :prop="'bankAccountList.'+ scope.$index +'.linkPhone'" :rules="rules.linkPhone">
                        <el-input v-model="scope.row.linkPhone" placeholder="电话号码"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="linkMan" label="联系人" min-width="120">
                    <template slot-scope="scope">
                      <el-form-item :prop="'bankAccountList.'+ scope.$index +'.linkMan'">
                        <el-input v-model="scope.row.linkMan" placeholder="联系人" maxlength="30"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remarks" label="备注" min-width="120">
                    <template slot-scope="scope">
                      <el-form-item :prop="'bankAccountList.'+ scope.$index +'.remarks'">
                        <el-input v-model="scope.row.remarks" placeholder="备注" maxlength="500"></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-form-item >
                        <i class="el-icon-delete form-icon" @click.prevent="removeLine(scope.row)" v-show="scope.$index!=0"></i>
                        <i class="el-icon-circle-plus-outline form-icon" @click="addLine" v-show="scope.$index==0"></i>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-col>
          </el-row>
        </div>
      </el-form>
      
      <div slot="footer" class="dialog-footer" v-show="this.title!='客户基本信息详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer, exportCustomer } from "@/api/ozrs/customer";

export default {
  name: "Customer",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户基本信息表格数据
      customerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name:[
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        
        
        linkPhone:[
        ]
      },
      invoiceTypes:[
        "专用发票","普通发票"
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // checkNull(value){
    //   if(value == ''||value==null){
    //     this.$message.warning(`税号不能为空`);
    //     return false;
    //   }else{
    //     return true;
    //   }
    // },
    // checkPhone(value){
    //   var pattern=/^1[3456789]\d{9}$/
    //   if(value){
    //     if(pattern.test(value)){
    //       return true;
    //     }else{
    //       this.$message.warning(`电话号码格式不正确`);
    //       return false;
    //     }
    //   }
    // },
    /** 查询客户基本信息列表 */
    getList() {
      this.loading = true;
      listCustomer(this.queryParams).then(response => {
        this.customerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        twoClasses: null,
        threeClasses: null,
        linkMan: null,
        invoiceType: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        bankAccountList:[{
          dutyParagraph:null,
          bankName:'',
          account:'',
          address:'',
          linkPhone:'',
          linkMan:'',
          remarks:''
        }]
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客户基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row,modelType) {
      this.reset();
      const id = row.id || this.ids
      if(modelType==1){
        this.title = "修改客户基本信息";
      }else{
        this.title = "客户基本信息详情";
      }
      getCustomer(id).then(response => {
        this.form = response.data;
        if(response.data.bankAccountList==null&&modelType==1){
          this.form.bankAccountList=[{}]
        }
        this.open = true;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          // let bl=this.form.bankAccountList.map(item =>  this.checkNull(item.dutyParagraph))
          // console.log(bl)
          if (this.form.id != null) {
            updateCustomer(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addCustomer(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }

        }
      });
    },
    /** 作废按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认作废【' + row.name +'】客户基本信息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCustomer(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有客户基本信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCustomer(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 添加一行 */
    addLine(){
      this.form.bankAccountList.push({
          dutyParagraph:'',
          bankName:'',
          account:'',
          address:'',
          linkPhone:'',
          linkMan:'',
          remarks:''
      });
    },
    removeLine(item){
      var index = this.form.bankAccountList.indexOf(item)
        if (index !== -1) {
          this.form.bankAccountList.splice(index, 1)
        }
    },
  }
};
</script>
<style>
  .form-icon{
    font-size: 20px;
    margin-right: 2px;
    line-height: 34px;
  }
  .customCss .el-col-12 .el-form-item__content{
    margin-left:110px;
  }
  .customCss .el-col-12 .el-form-item__label{
    width:110px
  }
  .customCss .el-dialog .el-select{
    width: 100%
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
</style>
<style scoped>
.customCss .el-col-12 .el-form-item__content{
    margin-left:110px;
  }
  .customCss .el-col-12 .el-form-item__label{
    width:110px
  }
  .customCss .el-dialog .el-select{
    width: 100%
  }
</style>
