<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item label="合同类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择合同类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
        <el-select v-model="queryParams.projectId" placeholder="请选择所属项目" clearable size="small">
          <el-option
            v-for="item in projectInfo"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="所属客户" prop="customerId">
        <el-select v-model="queryParams.customerId" placeholder="请选择所属客户" clearable size="small">
          <el-option
            v-for="item in customerInfo"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同编号" prop="number">
        <el-input
          v-model="queryParams.number"
          placeholder="请输入合同编号"
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
          v-hasPermi="['project:contract:add']"
        >新增</el-button>
      </el-col>
    
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="合同类型" align="center" prop="type" :formatter="typeFormat" />
      <el-table-column label="所属项目" align="center" prop="projectName"/>
      <el-table-column label="所属客户" align="center" prop="customerName" />
      <el-table-column label="合同编号" align="center" prop="number" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,1)"
            v-hasPermi="['project:contract:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:contract:remove']"
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

    <!-- 添加或修改合同管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <!-- 详情框 -->
      <el-form ref="form" :model="form" label-width="110px" :rules="rules" v-if="this.title=='合同管理详情'">
        <el-form-item label="合同类型" prop="types">
          <el-select v-model="form.type" :disabled="true">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="form.projectId" filterable :disabled="true">
            <el-option
              v-for="item in projectInfo"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属订单" prop="orderId">
          <el-input v-model="form.orderId" :disabled="true"/>
        </el-form-item>
        <el-form-item label="所属客户" prop="customerIds">
          <el-select v-model="form.customerId" filterable :disabled="true">
            <el-option
              v-for="item in customerInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同编号" prop="numbers">
          <el-input v-model="form.number" :disabled="true"/>
        </el-form-item>
        <el-form-item label="合同双方盖章" prop="seals">
          <el-select v-model="form.seal" :disabled="true">
            <el-option
              v-for="dict in sealOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同副本" prop="copy">
          <el-link v-if="form.copyUrl==null" type="primary" disabled target="_blank">暂无</el-link>
          <el-link v-else :href="form.copyUrl" type="primary" target="_blank">合同副本</el-link>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" :disabled="true"/>
        </el-form-item>
      </el-form>
      <!-- 编辑框 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" v-else>
        <el-form-item label="合同类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择合同类型">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="form.projectId" filterable placeholder="请选择所属项目">
            <el-option
              v-for="item in projectInfo"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属订单" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入所属订单" />
        </el-form-item>
        <el-form-item label="所属客户" prop="customerId">
          <el-select v-model="form.customerId" filterable placeholder="请选择所属客户">
            <el-option
              v-for="item in customerInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="合同编号" prop="number">
          <el-input v-model="form.number" placeholder="请输入所属订单" />
        </el-form-item> -->
        <el-form-item label="合同双方盖章" prop="seal">
          <el-select v-model="form.seal" placeholder="请选择合同双方盖章">
            <el-option
              v-for="dict in sealOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同副本" prop="copy">
          <el-upload :limit="1" :on-exceed="handleExceed" accept=".doc,.docx,.pdf" :on-change="copyHandleChange" :http-request="copyRequestUpload"  :file-list="copyFileList"  action="#"
            :before-upload="beforeUpload" :on-remove="handleRemove">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
          <el-input v-model="form.copy"  placeholder="请输入内容" disabled v-show="false" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="this.title!='合同管理详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listContract, getContract, delContract, addContract, updateContract, exportContract, customerInfo, projectInfo, uploadFile} from "@/api/project/contract";

export default {
  name: "Contract",
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
      // 合同管理表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 合同类型字典
      typeOptions: [],
      // 合同双方盖章字典
      sealOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        projectId: null,
        customerId: null,
        number: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "合同类型不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "所属客户不能为空", trigger: "blur" }
        ],
        number: [
          { required: true, message: "合同编号不能为空", trigger: "blur" }
        ],
        seal: [
          { required: true, message: "合同双方盖章不能为空", trigger: "blur" }
        ],
      },
      // 客户信息
      customerInfo:[],
      //项目信息
      projectInfo:[],
      //合同副本
      copyFileList:[],
      copyFormData: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("contract_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("seal_dist").then(response => {
      this.sealOptions = response.data;
    });
    this.getCustomerInfo();
    this.getProjectInfo();
  },
  methods: {
    /** 查询合同管理列表 */
    getList() {
      this.loading = true;
      listContract(this.queryParams).then(response => {
        this.contractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getCustomerInfo(){
      customerInfo().then(response=>{
        this.customerInfo=response.data;
      })
    },
    getProjectInfo(){
      projectInfo().then(response=>{
        this.projectInfo=response.data;
      })
    },
    // 合同类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 合同双方盖章字典翻译
    sealFormat(row, column) {
      return this.selectDictLabel(this.sealOptions, row.seal);
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
        type: null,
        projectId: null,
        orderId: null,
        customerId: null,
        number: null,
        seal: null,
        copy: 0,
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.copyFileList=[];
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
      this.title = "添加合同管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row,modelType) {
      this.reset();
      const id = row.id || this.ids
      if(modelType===1){
        this.title = "修改合同管理";
      }else{
        this.title = "合同管理详情";
      }
      getContract(id).then(response => {
        this.form = response.data;
        this.open = true;
        let vm = this;
        if(response.data.copyUrl){ 
          let a = (response.data.copyUrl).split(',');  
            if(a.length > 0) {
              a.forEach(item => {
                var obj = {} 
                  let index = item.lastIndexOf('\/');
                  let fileName  = item.substring(index + 1, item.length);
                  vm.$set(obj,'name',fileName);
                  vm.$set(obj,'url',item); 
                  vm.copyFileList.push(obj);
              })
            }
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateContract(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addContract(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认作废合同?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delContract(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有合同?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportContract(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //上传之前检验文件
    beforeUpload(file){
      var fileSize = file.size / 1024 / 1024;
      if(fileSize > 10){
         this.$message.error('文件不能超过10MB');
         return false;
      }
      let fileName=file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = fileName === 'pdf'
      const extension2 = fileName=== 'doc'
      const extension3 = fileName=== 'docx'
      if(!extension && !extension2 && !extension3) {
        this.$message({
            message: '上传文件只能是 pdf、doc、docx格式!',
            type: 'warning'
        });
        return false
      }
    },
    // 删除文件事件
    handleRemove(file, fileList){
      console.log(file, fileList);
      this.form.copy= 0;
      this.form.copyUrl=null
    },
    // 超出文件个数
    handleExceed(files, fileList){
      this.$message.warning(`当前限制单个文件上传，请先删除原文件再上传`);
    },
    // 保存合同副本文件
    copyHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.copyFormData = formdata;
    },
    //合同副本文件上传
    copyRequestUpload(file,fileList){
        const that = this;
        //项目安装要求
        uploadFile(this.copyFormData).then(res => {
          if(res.data){
              that.form.copy = res.data.fileId;
          }
        });
    },
  }
};
</script>
<style>
  .el-dialog .el-select{
    width: 100%
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
</style>

