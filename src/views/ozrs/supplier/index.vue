<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="供应商名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入供应商名称"
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
          v-hasPermi="['ozrs:supplier:add']"
        >新增</el-button>
      </el-col>
      
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ozrs:supplier:export']"
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

    <el-table v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="供应商名称" align="center" prop="name" />
      <el-table-column label="创建者" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,1)"
            v-hasPermi="['ozrs:supplier:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ozrs:supplier:remove']"
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

    <!-- 添加或修改基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>

      <el-form ref="form" :model="form" :rules="rules" v-if="this.title=='供应商基本信息详情'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="names">
              <el-input v-model="form.name" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="税率(%)" prop="ratio">
              <el-input type="number"  v-model="form.ratio"  placeholder="请输入税率" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <template>
              <h4>公司地址</h4>
              <el-table :data="form.locationList" style="width: 100%">
                <el-table-column label="序号" type="index">
                </el-table-column>
                <el-table-column prop="locationType" label="地址类型">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.locationType" :disabled="true">
                      <el-option v-for="item in locationTypes" :label="item" :value="item"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="addressDetails" label="详细地址">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.addressDetails" :disabled="true"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="linkMan" label="联系人">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.linkMan" :disabled="true"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="linkPhone" label="联系电话">
                  <template slot-scope="scope">
                    <el-form-item :prop="'locationList.'+ scope.$index +'.linkPhone'" :rules="rules.linkPhone">
                      <el-input v-model="scope.row.linkPhone" :disabled="true"></el-input>
                    </el-form-item>
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
        <el-row :gutter="20">
          <el-col :span="24">
            <template>
              <h4>银行账户</h4>
              <el-table :data="form.bankAccountList" style="width: 100%">
                <el-table-column label="序号" type="index">
                </el-table-column>
                <el-table-column prop="account" label="银行行号">
                  <template slot-scope="scope">
                    <el-form-item :prop="'bankAccountList.'+ scope.$index +'.account'">
                      <el-input v-model="scope.row.account" :disabled="true"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="bankName" label="开户行">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.bankName" :disabled="true"></el-input>
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入供应商名称" maxlength="50" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="税率(%)" prop="ratio">
              <el-input type="number"  v-model="form.ratio"  placeholder="请输入税率" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <template>
              <h4>公司地址</h4>
              <el-table :data="form.locationList" style="width: 100%">
                <el-table-column label="序号" type="index">
                </el-table-column>
                <el-table-column prop="locationType" label="地址类型" min-width="110">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.locationType" placeholder="地址类型">
                      <el-option v-for="item in locationTypes" :label="item" :value="item"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="addressDetails" label="详细地址" min-width="130">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.addressDetails" placeholder="详细地址"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="linkMan" label="联系人" min-width="100">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.linkMan" placeholder="联系人"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="linkPhone" label="联系电话" min-width="130">
                  <template slot-scope="scope">
                    <el-form-item :prop="'locationList.'+ scope.$index +'.linkPhone'" :rules="rules.linkPhone">
                      <el-input v-model="scope.row.linkPhone" placeholder="联系电话"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注" min-width="120">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remarks" placeholder="备注"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="60">
                  <template slot-scope="scope">
                    <i class="el-icon-delete form-icon" @click.prevent="removeLine(scope.row,0)" v-show="scope.$index!=0"></i>
                    <i class="el-icon-circle-plus-outline form-icon" @click="addLine(0)" v-show="scope.$index==0"></i>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <template>
              <h4>银行账户</h4>
              <el-table :data="form.bankAccountList" style="width: 100%">
                <el-table-column label="序号" type="index">
                </el-table-column>
                <el-table-column prop="account" label="银行账号">
                  <template slot-scope="scope">
                    <el-form-item :prop="'bankAccountList.'+ scope.$index +'.account'" :rules="rules.account">
                      <el-input v-model="scope.row.account" placeholder="银行账号"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="bankName" label="开户行">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.bankName" placeholder="开户行"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注"  min-width="60">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remarks" placeholder="备注"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="40">
                  <template  slot-scope="scope">
                    <i class="el-icon-delete form-icon" @click.prevent="removeLine(scope.row,1)" v-show="scope.$index!=0"></i>
                    <i class="el-icon-circle-plus-outline form-icon" @click="addLine(1)" v-show="scope.$index==0"></i>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-col>
        </el-row>
      </el-form>
      
      <div slot="footer" class="dialog-footer" v-show="this.title!='供应商基本信息详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSupplier, getSupplier, delSupplier, addSupplier, updateSupplier, exportSupplier } from "@/api/ozrs/supplier";

export default {
  name: "Supplier",
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
      // 基本信息表格数据
      supplierList: [],
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
      form: {
        id: null,
        name: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        locationList:[{
            locationType:'',
            addressDetails:'',
            linkMan:'',
            linkPhone:'',
            remarks:''
        }],
        bankAccountList:[{
            account:'',
            bankName:'',
            remarks:''
        }],
        ratio: 0,
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        ratio:[
          { required: true, message: "税率不能为空", trigger: "blur" },
          {pattern:/^(0|[1-9][0-9]*)$/, message: "税率必须为整数", trigger: "blur" }
        ],
        account:[
          { required: true, message: "行号不能为空", trigger: "blur" }
        ],
        linkPhone:[
        ]
      },
      locationTypes:[
        "公司地址","送货地址","临时地址","发票地址","其他"
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询基本信息列表 */
    getList() {
      this.loading = true;
      listSupplier(this.queryParams).then(response => {
        this.supplierList = response.rows;
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
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        locationList:[{
            locationType:'',
            addressDetails:'',
            linkMan:'',
            linkPhone:'',
            remarks:''
        }],
        bankAccountList:[{
            account:'',
            bankName:'',
            remarks:''
        }],
        ratio: 0,
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
      this.title = "添加供应商基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row,modelType){
      this.reset();
      const id = row.id || this.ids
      if(modelType==1){
        this.title = "修改供应商基本信息";
      }else{
        this.title = "供应商基本信息详情";
      }
      getSupplier(id).then(response => {
        this.form = response.data;
        if(response.data.taxRateList==null&&modelType==1){
          this.form.taxRateList=[{}]
        }
        if(response.data.bankAccountList==null&&modelType==1){
          this.form.bankAccountList=[{}]
        }
        if(response.data.locationList==null&&modelType==1){
          this.form.locationList=[{}]
        }
        this.open = true;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSupplier(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSupplier(this.form).then(response => {
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
      this.$confirm('是否确认作废【' + row.name + '】供应商基本信息编?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSupplier(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有基本信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSupplier(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 添加一行 */
    addLine(type){
      if(type==0){
        this.form.locationList.push({
            locationType:'',
            addressDetails:'',
            linkMan:'',
            linkPhone:'',
            remarks:''
        });
      }else{
        this.form.bankAccountList.push({
            account:'',
            bankName:'',
            remarks:''
        });
      }
    },
    addRatio(){
      this.form.taxRateList.push({
          ratio: '',
      });
    },
    removeRatio(item){
      var index = this.form.taxRateList.indexOf(item)
        if (index !== -1) {
          this.form.taxRateList.splice(index, 1)
        }
    },
    removeLine(item,type){
      if(type==0){
        var index = this.form.locationList.indexOf(item)
        if (index !== -1) {
          this.form.locationList.splice(index, 1)
        }
      }else{
        var index = this.form.bankAccountList.indexOf(item)
        if (index !== -1) {
          this.form.bankAccountList.splice(index, 1)
        }
      }
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
  .form-icon{
    font-size: 20px;
    margin-right: 2px;
    line-height: 34px;
  }
  .el-col-12 .el-form-item__content{
    margin-left:95px;
  }
  .el-col-12 .el-form-item__label{
    width:95px
  }
  .el-col-24 .el-table .el-form-item {
    margin-bottom: 15px;
    margin-top: 15px;
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
</style>
