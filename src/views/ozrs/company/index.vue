<template>
  <div class="app-container">
    

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['ozrs:company:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['ozrs:company:export']"
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

    <el-table v-loading="loading" :data="companyList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center"  type="index"/>
      <el-table-column label="公司名称" align="center" prop="name" />
      <el-table-column label="法人代表" align="center" prop="corporation" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,1)"
            v-hasPermi="['ozrs:company:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['ozrs:company:remove']"
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
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" v-if="this.title=='公司基本信息详情'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="names">
                <el-input v-model="form.name" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人代表" prop="corporations">
              <el-input v-model="form.corporation" :disabled="true" />
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
          <el-col :span="12">
            <el-form-item label="纳税识别号" prop="payTaxesNo">
              <el-input v-model="form.payTaxesNo" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票地址" prop="invoiceAddress">
              <el-input v-model="form.invoiceAddress" :disabled="true"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkMan">
              <el-input v-model="form.linkMan" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="linkPhone">
              <el-input v-model="form.linkPhone" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="网址" prop="website">
              <el-input v-model="form.website" :disabled="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" type="textarea" :disabled="true" />
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
              <h4>银行账户</h4>
              <el-table :data="form.bankAccountList" style="width: 100%">
                <el-table-column label="序号" type="index">
                </el-table-column>
                <el-table-column prop="account" label="银行行号">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.account" :disabled="true"></el-input>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-else>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入公司名称" maxlength="50" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人代表" prop="corporation">
              <el-input v-model="form.corporation" placeholder="请输入法人代表" maxlength="20" show-word-limit/>
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
          <el-col :span="12">
            <el-form-item label="纳税识别号" prop="payTaxesNo">
              <el-input v-model="form.payTaxesNo" onkeyup="this.value=this.value.replace(/\s+/g,'')" placeholder="请输入纳税识别号" maxlength="50" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票地址" prop="invoiceAddress">
              <el-input v-model="form.invoiceAddress" placeholder="请输入开票地址"  maxlength="100" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" prop="linkMan">
              <el-input v-model="form.linkMan" placeholder="请输入联系人" maxlength="20" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="linkPhone">
              <el-input v-model="form.linkPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="网址" prop="website">
              <el-input v-model="form.website" onkeyup="this.value=this.value.replace(/\s+/g,'')"  placeholder="请输入网址"  maxlength="50" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" type="textarea" placeholder="请输入内容" maxlength="100" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发票类型">
              <el-select v-model="form.invoiceType" placeholder="请选择发票类型">
                <!-- <el-option label="普通发票" value="" />
                <el-option label="专用发票" value="" /> -->
                <el-option v-for="item in invoiceTypes" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
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
                    <el-input v-model="scope.row.account" placeholder="银行行号"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="bankName" label="开户行">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.bankName" placeholder="开户行"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注" min-width="60">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remarks" placeholder="备注"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作"  min-width="40">
                  <template slot-scope="scope">
                    <i class="el-icon-delete form-icon" @click.prevent="removeLine(scope.row)" v-show="scope.$index!=0"></i>
                    <i class="el-icon-circle-plus-outline form-icon" @click="addLine" v-show="scope.$index==0"></i>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-col>
        </el-row>
      </el-form>
      
      <div slot="footer" class="dialog-footer" v-show="this.title!='公司基本信息详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCompany, getCompany, delCompany, addCompany, updateCompany, exportCompany } from "@/api/ozrs/company";

export default {
  name: "Company",
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
      companyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form:{
        id: null,
        name: null,
        bankAccountList:[{
          account:null,
          bankName:null,
          remarks:null
        }],
        corporation: null,
        payTaxesNo: null,
        invoiceAddress: null,
        linkMan: null,
        linkPhone: null,
        website: null,
        address: null,
        invoiceType: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        ratio: 0,
      },
      // 表单校验
      rules: {
        name:[
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        corporation: [
          { required: true, message: "法人代表不能为空", trigger: "blur" }
        ],
        ratio:[
          { required: true, message: "税率不能为空", trigger: "blur" },
          {pattern:/^(0|[1-9][0-9]*)$/, message: "税率必须为整数", trigger: "blur" }
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
    /** 查询基本信息列表 */
    getList() {
      this.loading = true;
      listCompany(this.queryParams).then(response => {
        this.companyList = response.rows;
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
        bankAccountList:[{
          account:null,
          bankName:null,
          remarks:null
        }],
        corporation: null,
        payTaxesNo: null,
        invoiceAddress: null,
        linkMan: null,
        linkPhone: null,
        website: null,
        address: null,
        invoiceType: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
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
      this.title = "添加公司基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row,modelType) {
      this.reset();
      const id = row.id || this.ids
      getCompany(id).then(response => {
        this.form = response.data;
        if(response.data.taxRateList==null&&modelType==1){
          this.form.taxRateList=[{}]
        }
        if(response.data.bankAccountList==null&&modelType==1){
          this.form.bankAccountList=[{}]
        }
        this.open = true;
      });
      if(modelType==1){
        this.title = "修改公司基本信息";
      }else{
        this.title = "公司基本信息详情";
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCompany(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addCompany(this.form).then(response => {
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
      this.$confirm('是否确认作废【'+ row.name +'】公司基本信息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCompany(ids);
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
          return exportCompany(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 添加一行 */
    addLine(){
      this.form.bankAccountList.push({
          account:'',
          bankName:'',
          remarks:''
      });
    },
    removeLine(item){
      var index = this.form.bankAccountList.indexOf(item)
        if (index !== -1) {
          this.form.bankAccountList.splice(index, 1)
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
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
  .form-icon{
    font-size: 24px;
    margin-right: 8px;
    line-height: 34px;
  }
  .form-table{
    margin:auto
  }
  .el-form-item__label {
    padding: 0 10px 0 0;
  }
  .el-col-12 .el-form-item__label {
    width: 90px;
  }
  .el-dialog .el-select{
    width: 100%
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
</style>