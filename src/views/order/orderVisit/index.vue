<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customerName">
        <el-select size="small" clearable v-model="queryParams.customerName" placeholder="请选择客户名称" @keyup.enter.native="handleQuery">
          <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="回访时间" prop="visitTime">
        <el-date-picker clearable size="small"
          v-model="value"
          :picker-options="pickerOptions"
          @change="dateChange"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="回访状态" prop="visitStatus">
        <el-select size="small" v-model="queryParams.visitStatus" @keyup.enter.native="handleQuery" clearable placeholder="请选择回访状态">
          <el-option
            v-for="dict in visitStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-select size="small" v-model="queryParams.orderType" @keyup.enter.native="handleQuery" clearable placeholder="请选择订单类型">
          <el-option
            v-for="dict in orderTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['order:orderVisit:export']"
        >导出</el-button>
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

    <el-table v-loading="loading" :data="orderVisitList" highlight-current-row>
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="客户名称" align="center" prop="customerName"/>
      <el-table-column label="订单类型" align="center" prop="orderType"/>
      <el-table-column label="订单编号" align="center" prop="orderNo" />
      <el-table-column label="回访人员" align="center" prop="createName"/>
      <el-table-column label="回访时间" align="center" prop="visitTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.visitTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回访状态" align="center" prop="visitStatusValue" />
      <el-table-column label="回访倒计时/天" align="center" prop="countDown"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,0)"
            v-hasPermi="['order:orderVisit:edit']"
            v-if="scope.row.visitStatus != 'vs02'"
          >修改</el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="handleUpdate(scope.row,1)"
            >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['order:orderVisit:remove']"
          >删除</el-button>
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

    <!-- 添加或修改订单回访对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="回访时间" prop="visitTime">
          <el-date-picker clearable size="small" style="width: 100%" :disabled="this.title=='订单回访详情' ? true : false"
            v-model="form.visitTime"
            :picker-options="pickerVisitTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择回访时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回访结果" prop="visitResult">
          <el-input type="texteare" maxlength="50" :disabled="this.title=='订单回访详情' ? true : false" v-model="form.visitResult"/>
        </el-form-item>
        <el-form-item label="回访人员" prop="createName" v-show="this.title=='订单回访详情'">
          <el-input v-model="form.createName" placeholder="/" :disabled="true"/>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" :disabled="this.title=='订单回访详情' ? true : false"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="this.title!='订单回访详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrderVisit, getOrderVisit, delOrderVisit, addOrderVisit, updateOrderVisit, exportOrderVisit, customerAll} from "@/api/order/orderVisit";
import { unwatchFile } from 'fs';

export default {
  name: "OrderVisit",
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
      // 订单回访表格数据
      orderVisitList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        visitTime: null,
        visitStatus: null,
        visitResult: null,
        orderType: null,
        remarks: null,
      },
      // 订单类型
      orderTypeOptions:[],
      // 回访状态
      visitStatusOptions:[],
      // 客户名称
      customerData:[],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderId: [
          { required: true, message: "订单id不能为空", trigger: "blur" }
        ],
        visitTime: [
          { required: true, message: "回访时间不能为空", trigger: "blur" }
        ],
        visitStatus: [
          { required: true, message: "回访状态不能为空", trigger: "blur" }
        ],
        visitResult: [
          { required: true, message: "回访结果不能为空", trigger: "blur" }
        ],
      },
      pickerOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pickerVisitTime:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      value:[],
      orderId:''
    };
  },
  created() {
    this.getList();
    this.getCustomerInfo();
    this.getDicts("contract_type").then(response => {
      this.orderTypeOptions = response.data;
    });
    this.getDicts("visit_status").then(response =>{
      this.visitStatusOptions=response.data;
    })
  },
  methods: {
    dateChange(value){
      this.queryParams.beginTime=value[0]
      this.queryParams.endTime=value[1]
    },
    // 客户下拉框查询
    getCustomerInfo(){
      customerAll().then(response=>{
        this.customerData=response.data;
      })
    },
    /** 查询订单回访列表 */
    getList() {
      this.loading = true;
      listOrderVisit(this.queryParams).then(response => {
        this.orderVisitList = response.rows;
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
        orderId: null,
        visitTime: null,
        visitStatus: null,
        visitResult: null,
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
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
      this.value = [];
      this.queryParams.beginTime = null;
      this.queryParams.endTime  = null;
      this.resetForm("queryForm");
      this.queryParams ={
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        visitTime: null,
        visitStatus: null,
        visitResult: null,
        orderType: null,
        remarks: null,
      }
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row,modalType) { 
      this.reset();
      const param={
        id : row.id
      }
      this.orderId=row.orderId
      getOrderVisit(param).then(response => {
        if(response.data){
          this.form = response.data;
        }
        this.open = true;
      });
      if(modalType==0){
        this.title = "修改订单回访";
      }else{
        this.title = "订单回访详情";
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.orderId=this.orderId
          addOrderVisit(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("编辑成功");
              this.open = false;
              this.getList();
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$confirm('是否确认删除订单回访信息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrderVisit(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出订单回访数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOrderVisit(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
