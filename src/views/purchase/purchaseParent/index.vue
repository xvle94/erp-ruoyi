<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="销售订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入销售订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="确认时间" prop="dateRange">
        <el-date-picker clearable size="small"
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          placeholder="选择确认时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="采购类型" prop="typePurchase">
        <el-select v-model="queryParams.typePurchase" placeholder="请选择采购类型" clearable size="small">
          <el-option
            v-for="dict in typePurchaseOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="采购情况" prop="purchaseStatus">
        <el-select v-model="queryParams.purchaseStatus" placeholder="请选择审核状态" clearable size="small">
          <el-option
            v-for="dict in purchaseStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="采购付款状态" label-width="100px" prop="returnStatus">
        <el-select v-model="queryParams.returnStatus" placeholder="请选择采购付款状态" clearable size="small">
          <el-option
            v-for="dict in returnStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商名称" label-width="100px" >
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料名称" >
        <el-input
          v-model="queryParams.materielName"
          placeholder="请输入物料名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报价单号" >
        <el-input
          v-model="queryParams.quotationNo"
          placeholder="请输入报价单号"
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

    <div class="total">
      <span>合计: </span>
      <div>采购总金额: 
        {{purchaseMoney}}元
      </div>
      <div>已付款金额: 
        {{returnMoney}}元
      </div>
      <div>未付款金额: 
        {{nowMoney}}元
      </div>
    </div>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['purchase:purchaseParent:add']"
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

    <el-table v-loading="loading" :data="purchaseParentList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="销售订单编号" align="center" prop="orderNo" />
      <el-table-column label="采购单编号" align="center" prop="purchaseNo" />
      <el-table-column label="物料名称" align="center" prop="materielName" />
      <el-table-column label="供应商" align="center" prop="supplierName" />
      <el-table-column label="销售金额/元" align="center" prop="saleMoney" />
      <el-table-column label="确认时间" align="center" prop="createTime" />
      <el-table-column label="采购情况" align="center" prop="purchaseStatus_dictText" />
      <el-table-column label="采购付款状态" align="center" prop="paymentStatus_dictText" />
      <el-table-column label="税率/%" align="center" prop="ratio" />
      <el-table-column label="采购金额/元" align="center" prop="purchaseTotalMoney" />
      <el-table-column label="税额/元" align="center" prop="ratioMoney" />
      <el-table-column label="发票状态" align="center" prop="receiptStatus_dictText" />
      <el-table-column label="已付款金额/元" align="center" prop="returnMoney" />
      <el-table-column label="入库状态" align="center" prop="inStatus_dictText" />
      <el-table-column label="类型" align="center" prop="typePurchase_dictText" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-document"
                  @click="handleDetail(scope.row)"
                >详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="scope.row.operatorStatus == '0' && scope.row.typePurchase_dictText != '直发客户'"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['purchase:purchaseParent:edit']"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="scope.row.typePurchase_dictText == '直发客户' && scope.row.inStatus != '2' "
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['purchase:purchaseParent:edit']"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.typePurchase_dictText != '直发客户'">
                <el-button
                  v-if="scope.row.operatorStatus == '1' && scope.row.inStatus_dictText != '全部入库'"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleApply(scope.row)"
                  v-hasPermi="['purchase:purchaseParent:edit']"
                >入库提交</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.operatorStatus == '0'">
                <el-button
                  v-if="scope.row.operatorStatus == '0'"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleExamine(scope.row)"
                  v-hasPermi="['purchase:purchaseParent:edit']"
                >审核</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['purchase:purchaseParent:remove']"
                >删除</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

    <!-- 添加或修改采购单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单id" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="采购单类型">
          <el-select v-model="form.purchaseType" placeholder="请选择采购单类型">
            <el-option
              v-for="dict in purchaseTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采购总金额" prop="purchaseMoney">
          <el-input v-model="form.purchaseMoney" placeholder="请输入采购总金额" />
        </el-form-item>
        <el-form-item label="发货数量" prop="number">
          <el-input v-model="form.number" placeholder="请输入发货数量" />
        </el-form-item>
        <el-form-item label="采购附件" prop="purchaseFile">
          <el-input v-model="form.purchaseFile" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="form.operatorStatus">
            <el-radio
              v-for="dict in operatorStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核人" prop="operatorId">
          <el-input v-model="form.operatorId" placeholder="请输入审核人" />
        </el-form-item>
        <el-form-item label="审核时间" prop="operatorTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.operatorTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择审核时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核备注" prop="operatorRemarks">
          <el-input v-model="form.operatorRemarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="采购状态">
          <el-radio-group v-model="form.purchaseStatus">
            <el-radio
              v-for="dict in purchaseStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开票状态">
          <el-radio-group v-model="form.invoiceStatus">
            <el-radio
              v-for="dict in invoiceStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开票总金额" prop="invoiceMoney">
          <el-input v-model="form.invoiceMoney" placeholder="请输入开票总金额" />
        </el-form-item>
        <el-form-item label="最后一次开票日期" prop="invoiceTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.invoiceTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后一次开票日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回款状态">
          <el-radio-group v-model="form.returnStatus">
            <el-radio
              v-for="dict in returnStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="已回款金额" prop="returnMoney">
          <el-input v-model="form.returnMoney" placeholder="请输入已回款金额" />
        </el-form-item>
        <el-form-item label="最后一次回款日期" prop="lastReturnTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.lastReturnTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后一次回款日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库状态">
          <el-radio-group v-model="form.intoStorehouseStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除状态(0-正常、1-删除)" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除状态(0-正常、1-删除)" />
        </el-form-item>
        <el-form-item label="采购类型" prop="typePurchase">
          <el-input v-model="form.typePurchase" placeholder="请输入采购类型" />
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
import { listPurchaseParent, getMoney, getPurchaseParent, delPurchaseParent, addPurchaseParent, updatePurchaseParent, exportPurchaseParent, queryPurchaseMoney } from "@/api/purchase/purchaseParent";

export default {
  name: "PurchaseParent",
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
      // 采购单表格数据
      purchaseParentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 采购单类型字典
      purchaseTypeOptions: [],
      // 审核状态字典
      operatorStatusOptions: [],
      // 采购状态字典
      purchaseStatusOptions: [],
      // 开票状态字典
      invoiceStatusOptions: [],
      // 回款状态字典
      returnStatusOptions: [],
      // 删除状态(0-正常、1-删除)字典
      delFlagOptions: [],
      // 采购类型字典
      typePurchaseOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        'params.startTime	': null,
        'params.endTime	': null,
        purchaseStatus: null,
        returnStatus: null,
        saleMan: null,
        typePurchase: null,
        materielName: null,
        supplierName: null,
        quotationNo: null,
      },
      // 表单参数
      form: {},
      returnMoney: 0,
      purchaseMoney: 0,
      nowMoney: 0,
      // 表单校验
      rules: {
        orderId: [
          { required: true, message: "订单id不能为空", trigger: "blur" }
        ],
        purchaseType: [
          { required: true, message: "采购单类型不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("purchases_type").then(response => {
      this.purchaseTypeOptions = response.data;
    });
    this.getDicts("purchase_info_paymentStatus").then(response => {
      this.returnStatusOptions = response.data;
    });
    this.getDicts("type_purchas").then(response => {
      this.typePurchaseOptions = response.data;
    });
    
    this.getDicts("examine").then(response => {
      this.operatorStatusOptions = response.data;
    });
    this.getDicts("purchase_status").then(response => {
      this.purchaseStatusOptions = response.data;
    });
    this.getDicts("invoice_dist").then(response => {
      this.invoiceStatusOptions = response.data;
    });
    
    this.getDicts("del_dist").then(response => {
      this.delFlagOptions = response.data;
    });
    //查询采购总金额、已付款金额、未付款金额
    this.getQueryPurchaseMoney();
    
  },
  activated(){
    this.getList();
  },
  methods: {
    /** 查询采购单列表 */
    getList() {
      this.loading = true;
      if (this.dateRange != false && this.dateRange != null) {
        this.queryParams['params.startTime'] = this.dateRange[0]
        this.queryParams['params.endTime'] = this.dateRange[1]
      }else{
        this.queryParams['params.startTime'] = null
        this.queryParams['params.endTime'] = null
      }
      listPurchaseParent(this.queryParams).then(response => {
        this.purchaseParentList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
      
    },
    // 采购单类型字典翻译
    purchaseTypeFormat(row, column) {
      return this.selectDictLabel(this.purchaseTypeOptions, row.purchaseType);
    },
    // 审核状态字典翻译
    operatorStatusFormat(row, column) {
      return this.selectDictLabel(this.operatorStatusOptions, row.operatorStatus);
    },
    // 采购状态字典翻译
    purchaseStatusFormat(row, column) {
      return this.selectDictLabel(this.purchaseStatusOptions, row.purchaseStatus);
    },
    // 开票状态字典翻译
    invoiceStatusFormat(row, column) {
      return this.selectDictLabel(this.invoiceStatusOptions, row.invoiceStatus);
    },
    // 回款状态字典翻译
    returnStatusFormat(row, column) {
      return this.selectDictLabel(this.returnStatusOptions, row.returnStatus);
    },
    // 删除状态(0-正常、1-删除)字典翻译
    delFlagFormat(row, column) {
      return this.selectDictLabel(this.delFlagOptions, row.delFlag);
    },
    // 采购类型字典翻译
    typePurchaseFormat(row, column) {
      return this.selectDictLabel(this.typePurchaseOptions, row.typePurchase);
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
        purchaseType: null,
        purchaseMoney: null,
        number: null,
        purchaseFile: null,
        operatorStatus: "0",
        operatorId: null,
        operatorTime: null,
        operatorRemarks: null,
        purchaseStatus: "0",
        invoiceStatus: "0",
        invoiceMoney: null,
        invoiceTime: null,
        returnStatus: "0",
        returnMoney: null,
        lastReturnTime: null,
        intoStorehouseStatus: "0",
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        typePurchase: null
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
      this.dateRange = [];
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        'params.startTime	': null,
        'params.endTime	': null,
        purchaseStatus: null,
        returnStatus: null,
        saleMan: null,
        typePurchase: null,
        materielName: null,
        supplierName: null,
        quotationNo: null,
      }
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
      // this.reset();
      // this.open = true;
      // this.title = "添加采购单";
      this.$router.push({
          path: "/purchaseEdit/purchaseEdit",
          query: {id:null}
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.$router.push({
          path: "/purchaseEdit/purchaseEdit",
          query: {id:row.id}
      });
    },
    /*详情按钮 */
    handleDetail(row){
      this.$router.push({
          path: "/purchaseDetail/purchaseDetail",
          query: {id:row.id}
      });
    },
    /*入库申请按钮 */
    handleApply(row){
      this.$router.push({
        path: "/purchaseApply/purchaseApply",
        query: {id:row.id}
      });
    },
    /*审核 */
    handleExamine(row){
      this.$router.push({
        path: "/purchaseExamine/purchaseExamine",
        query: {id:row.id}
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePurchaseParent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addPurchaseParent(this.form).then(response => {
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
      this.$confirm('是否确认删除采购单编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPurchaseParent(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPurchaseParent(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // 查询采购总金额、已付款金额、未付款金额
    getQueryPurchaseMoney(){
        queryPurchaseMoney().then(res=>{
        if(res.data != null && res.data != ''){
          this.purchaseMoney = res.data.purchaseMoney;
          this.returnMoney = res.data.returnMoney;
          this.nowMoney = res.data.nowMoney;
        }
      })
    }
  }
};
</script>
<style>
  .el-dropdown-link{
    color: #409EFF;
    font-size: 12px;
    margin-left: 4px
  }
  .total{
    background: #F5F7FA;
    color: #515a6e;
    margin-bottom: 10px;
  }
  .total span{
    font-weight: 400
  }
  .total div{
    display: inline-block;
    border: 1px solid #DCDFE6;
    padding: 2px 2px;
    border-radius: 3px;
    margin: 0 10px
  }
</style>