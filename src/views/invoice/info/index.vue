<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="发票分类" prop="type">
        <el-select v-model="queryParams.type" clearable  placeholder="请选择发票分类"  size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="所属客户" prop="customerId">
        <el-select  v-model="queryParams.customerId" clearable  placeholder="请选择所属客户" filterable style="width:100%;">
          <el-option
            v-for="dict in customerData"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="发票号码" prop="invoiceNumber">
        <el-input
          v-model="queryParams.invoiceNumber"
          placeholder="请输入发票号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="寄票日期" prop="sendInvoiceTime">
        <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="寄票状态" prop="customerId">
        <el-select  v-model="queryParams.sendStatus" clearable  placeholder="请选择寄票状态" filterable style="width:100%;">
          <el-option
            v-for="dict in sendStatusData"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="快递单号" prop="courierNumber">
        <el-input
          v-model="queryParams.courierNumber"
          placeholder="请输入快递单号"
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
      
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="invoiceInfoList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="发票分类" align="center" prop="type" />
      <el-table-column label="发票号码" align="center" prop="invoiceNumber" />
      <el-table-column label="所属客户" align="center" prop="customerName" />
      <el-table-column label="快递单号" align="center" prop="courierNumber" />
      <el-table-column label="寄票人" align="center" prop="sendInvoiceMan" />
      
      <el-table-column label="寄票类型" align="center" prop="sendInvoiceType" />
      
      <el-table-column label="寄票日期" align="center" prop="sendInvoiceTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sendInvoiceTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="寄票状态" align="center" prop="sendStatus" />
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['invoice:info:edit']"
          >追溯</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleExportInfo(scope.row)"
            v-hasPermi="['invoice:info:export']"
          >导出</el-button>
          
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

    <!-- 添加或修改发票溯源对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属客户">
          <el-select  v-model="form.customerId" disabled filterable style="width:100%;">
          <el-option
            v-for="dict in customerData"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          ></el-option>
        </el-select>
        </el-form-item>
      <el-form-item label="发票类型" >
        <el-select  v-model="form.invoiceType" disabled filterable style="width:100%;">
          <el-option
            v-for="dict in sendStatusData"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发票号码"  prop="invoiceNumber">
        <el-input v-model="form.invoiceNumber" disabled placeholder="请输入发票号码" />
      </el-form-item>
        
        <el-form-item label="寄票方式">
         
          <el-select  v-model="form.sendInvoiceType" placeholder="请选择寄票方式"  filterable style="width:100%;">
          <el-option
            v-for="dict in sendTypeData"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="寄票日期" prop="sendInvoiceTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.sendInvoiceTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择寄票日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收票地址" prop="collectAddress">
          <el-input v-model="form.collectAddress" placeholder="请输入收票地址" type="textarea" maxlength="300" show-word-limit/>
        </el-form-item>
        <el-form-item label="寄票名称" prop="sendTitle">
          <el-input v-model="form.sendTitle" placeholder="请输入寄票名称" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="寄票数量" prop="sendCount">
          <el-input-number :min="1" :max="5" v-model="form.sendCount" placeholder="请输入寄票数量" />
        </el-form-item>
        <el-form-item label="寄票备注" prop="sendRemarks">
          <el-input v-model="form.sendRemarks"  placeholder="请输入内容" type="textarea" maxlength="500" show-word-limit/>
        </el-form-item>
        <el-form-item label="上传附件" prop="invoiceFile">
          <el-upload :limit="5" :on-remove="handleRemove" :on-exceed="handleExceed" :on-change="handleChange" :http-request="requestUpload"  :file-list="fileList"  action="#"
              :before-upload="beforeUpload" >
              <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
          </el-upload>
          <el-input v-model="form.invoiceFile"  placeholder="请输入内容" disabled v-show="false" />
        </el-form-item>
       
        <el-form-item label="快递单号" prop="courierNumber">
          <el-input v-model="form.courierNumber" placeholder="请输入快递单号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInvoiceInfo, getInvoiceInfo, updateInvoiceInfo, customerAll, exportInfo, uploadFile} from "@/api/invoice/invoiceInfo";

export default {
  name: "InvoiceInfo",
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
      // 发票溯源表格数据
      invoiceInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 客户下拉框
      customerData: [],
      // 寄票状态
      sendStatusData: [],
      sendTypeData: [],
      // 日期范围
      dateRange: [],
      typeOptions: [
        {"dictType":"sys_invoice","dictValue": "si01", "dictLabel": "项目发票"},
        {"dictType":"sys_invoice","dictValue": "si02", "dictLabel": "订单发票"},
      ],
      // 文件数组
      formData:[],
      fileList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        invoiceNumber: null,
        type: null,
        courierNumber: null,
        customerId: null,
        sendStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        
      }
    };
  },
  created() {
    
    // this.getDicts("send_dist_status").then(response => {
    //   this.sendStatusData = response.data;
    // });
    this.getDicts("invoice_type").then(response => {
      this.sendStatusData = response.data;
    });
    this.getDicts("send_type").then(response => {
      this.sendTypeData = response.data;
    });
    this.getList();
    //查询全部客户信息
    this.getCustomerAll();
  },
  methods: {
    /** 查询发票溯源列表 */
    getList() {
      this.loading = true;
      listInvoiceInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.invoiceInfoList = response.rows;
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
        applyId: null,
        invoiceTime: null,
        invoiceType: null,
        invoiceMoney: null,
        invoiceNumber: null,
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        projectId: null,
        type: null,
        sendInvoiceType: null,
        sendInvoiceMan: null,
        sendInvoiceTime: null,
        collectAddress: null,
        sendTitle: null,
        sendCount: null,
        sendRemarks: null,
        invoiceFile: null,
        sendStatus: null,
        courierNumber: null
      };
      this.fileList=[];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams ={
        pageNum: 1,
        pageSize: 10,
        invoiceNumber: null,
        type: null,
        courierNumber: null,
        customerId: null,
        sendStatus: null
      };
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInvoiceInfo(id).then(response => {
        this.form = response.data;
        // 图片
        let vm = this;
        if(response.data.fileUrl){
          let a = response.data.fileUrl
            if(a.length > 0) {
              a.forEach(item => {
                var obj = {} 
                  vm.$set(obj,'name',item.fileName);
                  vm.$set(obj,'url',item.contractUrl);  
                  vm.fileList.push(obj);
              })
            }
        }
        this.open = true;
        this.title = "发票溯源追溯";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            updateInvoiceInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("操作成功");
                this.open = false;
                this.getList();
              }
            });
          
        }
      });
    },
    //客户信息下拉框
    getCustomerAll(){
      customerAll().then(response=>{
        this.customerData=response.data;
      })
    },
    //上传之前检验文件
    beforeUpload(file){
      var fileSize = file.size / 1024 / 1024;
      if(fileSize > 5){
         this.$message.error('文件不能超过5MB');
         return false;
      }
      let fileName=file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = fileName === 'png'
      const extension3 = fileName=== 'jpg'
      if(!extension && !extension3) {
        this.$message({
            message: '上传文件只能是png、jpg格式!',
            type: 'warning'
        });
        return false
      }
    },
     // 删除文件事件
    handleRemove(file, fileList){
      this.form.invoiceFile= 0;
      this.form.fileUrl=null
    },
    // 超出文件个数
    handleExceed(files, fileList){
      this.$message.warning(`当前限制最多五个文件上传，请先删除原文件再上传`);
    },
     //保存项目安装要求文件
    handleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.formData = formdata;
    },
    //文件上传
    requestUpload(file,fileList){
      const that = this;
      //项目安装要求
      uploadFile(this.formData).then(res => {
        if(res.data){
          that.form.invoiceFile = res.data.fileId;
        }
      });
    },
    /** 导出发票签收单 */
    handleExportInfo(row){
      exportInfo({"id": row.id}).then(res =>{
        if(res){
            const blob = res;
            const fileName = "发票签收单.doc";
          if (window.navigator.msSaveOrOpenBlob) {
            // IE浏览器下
            navigator.msSaveBlob(blob, fileName);
          } else {
            const binaryData = [];
            binaryData.push(blob);
 
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(
              new Blob(binaryData, { type: 'application/x-download;charset=UTF-8' })
            );
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
          }
        }else{
          this.$message.error('导出失败');
        }
           
      })

    },
  }
};
</script>
