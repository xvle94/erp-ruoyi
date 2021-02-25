<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单类型" prop="orderType">
        <el-select v-model="queryParams.orderType" placeholder="请选择订单类型" clearable size="small">
          <el-option
            v-for="dict in orderTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId">
        <!-- <el-select v-model="queryParams.projectId" placeholder="请选择所属项目" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select> -->
         <el-select v-model="queryParams.projectId" filterable placeholder="请选择所属项目">
            <el-option
              v-for="item in projectData"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="过单人" prop="saleMan">
        <el-input
          v-model="queryParams.saleMan"
          placeholder="请输入过单人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售员" >
        <el-input
          v-model="queryParams.createName"
          placeholder="请输入销售员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单日期" prop="returnTime">
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
      <el-form-item label="审核状态" prop="operatorStatus">
        
        <el-select v-model="queryParams.operatorStatus" placeholder="请选择审核状态">
            <el-option
              v-for="dict in examineOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="采购状态" prop="purchaseStatus">
        <el-select v-model="queryParams.purchaseStatus" placeholder="请选择采购状态" clearable size="small">
          <el-option
            v-for="dict in purchaseStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发货状态" prop="deliverGoodsStatus">
        <el-select v-model="queryParams.deliverGoodsStatus" placeholder="请选择发货状态" clearable size="small">
          <el-option
            v-for="dict in deliverGoodsStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开票状态" prop="deliverGoodsStatus">
        <el-select v-model="queryParams.invoiceStatus" placeholder="请选择开票状态" clearable size="small">
          <el-option
            v-for="dict in invoiceDistOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="回款状态" prop="deliverGoodsStatus">
        <el-select v-model="queryParams.returnStatus" placeholder="请选择回款状态" clearable size="small">
          <el-option
            v-for="dict in returnMoneyOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="total">
      <span>合计: </span>
      <div>订单总金额: 
        {{saleMoney}}元
      </div>
      <div>已回款金额: 
        {{invoiceMoney}}元
      </div>
      <div>未回款金额: 
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
          v-hasPermi="['order:orderParent:add']"
        >新增</el-button>
      </el-col>
     
     
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['order:orderParent:export']"
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

    <el-table v-loading="loading" :data="orderParentList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="订单类型" align="center" prop="orderTypeValue" />
      <el-table-column label="订单日期" align="center" prop="orderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属项目" align="center" prop="projectName" />
      <el-table-column label="订单编号" align="center" prop="orderNo" />
      <el-table-column label="过单人" align="center" prop="saleMan" />
      <el-table-column label="销售金额/元" align="center" prop="saleMoney" />
      <el-table-column label="销售员" align="center" prop="createName" />
      <el-table-column label="采购状态" align="center" prop="purchaseStatusValue" />
      <el-table-column label="发货状态" align="center" prop="deliverGoodsStatusValue"/>
      <el-table-column label="开票状态" align="center" prop="invoiceStatusValue" />
      <el-table-column label="回款状态" align="center" prop="returnStatusValue" />
      <el-table-column label="审核状态" align="center" prop="operatorStatusValue" />
      <el-table-column label="是否作废" align="center" prop="delFlagValue" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.delFlagValue!='是'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,0)"
            v-hasPermi="['order:orderParent:edit']"
          >编辑</el-button>
          <el-dropdown v-show="scope.row.delFlagValue!='是'">
            <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['order:orderParent:remove']"
                >作废</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-document"
                  @click="handleUpdate(scope.row,1)"
                >详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-show="scope.row.operatorStatusValue!='已通过'">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-document-checked"
                  @click="handleUpdate(scope.row,2)"
                  v-hasPermi="['order:orderParent:examine']"
                >审核订单</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-shopping-cart-1"
                    @click="goPurchase(scope.row)"
                    v-hasPermi="['order:orderParent:purchase']"
                  >我要采购</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-show="scope.row.deliverGoodsStatusValue!='全部发货'">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-s-promotion"
                    @click="goDelivery(scope.row)"
                  >我要发货</el-button>
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

    <!-- 添加或修改订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="950px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="销售标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入销售标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrderParent, getOrderParent, delOrderParent, addOrderParent, updateOrderParent, exportOrderParent, projectAll, queryOrderMoney} from "@/api/order/orderParent";

export default {
  name: "OrderParent",
  data() {
    return {
      value:[],
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
      // 订单表格数据
      orderParentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 订单类型字典
      orderTypeOptions: [],
      // 是否过单字典
      delDist:[],
      // 发票类型字典
      invoiceTypeOptions: [],
      // 采购类型字典
      purchaseTypeOptions: [],
      // 采购状态字典
      purchaseStatusOptions: [],
      // 发货状态字典
      deliverGoodsStatusOptions: [],
      //审核状态字典项
      examineOptions: [],
      // 项目下拉框
      projectData: [],
      //开票状态
      invoiceDistOptions: [],
      //回款状态
      returnMoneyOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderType: null,
        projectId: null,
        orderNo: null,
        saleMan: null,
        orderTime: null,
        operatorStatus: null,
        purchaseStatus: null,
        deliverGoodsStatus: null,
        createName: null,
        invoiceStatus: null,
        returnStatus: null,
      },
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      nowMoney: 0,
      invoiceMoney: 0,
      saleMoney: 0,
      // 表单校验
      rules: {
        orderType: [
          { required: true, message: "订单类型不能为空", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "所属项目不能为空", trigger: "blur" }
        ],
        orderNo: [
          { required: true, message: "订单编号不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "销售标题不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "所属客户不能为空", trigger: "blur" }
        ],
        linkMan: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        linkPhone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        payAddress: [
          { required: true, message: "交付地址不能为空", trigger: "blur" }
        ],
        payTime: [
          { required: true, message: "交付日期不能为空", trigger: "blur" }
        ],
        overOrderStatus: [
          { required: true, message: "是否过单不能为空", trigger: "blur" }
        ],
        companyId: [
          { required: true, message: "所属销售组织机构不能为空", trigger: "blur" }
        ],
        orderTime: [
          { required: true, message: "订单日期不能为空", trigger: "blur" }
        ],
        modelDispose: [
          { required: true, message: "点击型号及配置不能为空", trigger: "blur" }
        ],
        purchaseType: [
          { required: true, message: "采购类型不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("contract_type").then(response => {
      this.orderTypeOptions = response.data;
    });
    this.getDicts("invoice_type").then(response => {
      this.invoiceTypeOptions = response.data;
    });
    this.getDicts("purchase_type").then(response => {
      this.purchaseTypeOptions = response.data;
    });
    this.getDicts("purchase_status").then(response => {
      this.purchaseStatusOptions = response.data;
    });
    this.getDicts("deliver_goods_status").then(response => {
      this.deliverGoodsStatusOptions = response.data;
    });
    this.getDicts("examine").then(response => {
      this.examineOptions = response.data;
    });
    this.getDicts("del_dist").then(response =>{
      this.delDist = response.data;
    })
    this.getDicts("invoice_dist").then(response => {
      this.invoiceDistOptions = response.data;
    });
    this.getDicts("return_money").then(response =>{
      this.returnMoneyOptions = response.data;
    })
    // 项目下拉框
    this.getProjectInfo();
    // 查询合计金额
    this.getQueryOrderMoney();
  },
  watch: {
    $route () {
      this.getList()
    }
  },
  methods: {
    /** 查询订单列表 */
    getList() {
      this.loading = true;
      listOrderParent(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.orderParentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 订单类型字典翻译
    orderTypeFormat(row, column) {
      return this.selectDictLabel(this.orderTypeOptions, row.orderType);
    },
    // 发票类型字典翻译
    invoiceTypeFormat(row, column) {
      return this.selectDictLabel(this.invoiceTypeOptions, row.invoiceType);
    },
    // 采购类型字典翻译
    purchaseTypeFormat(row, column) {
      return this.selectDictLabel(this.purchaseTypeOptions, row.purchaseType);
    },
    // 采购状态字典翻译
    purchaseStatusFormat(row, column) {
      return this.selectDictLabel(this.purchaseStatusOptions, row.purchaseStatus);
    },
    // 发货状态字典翻译
    deliverGoodsStatusFormat(row, column) {
      return this.selectDictLabel(this.deliverGoodsStatusOptions, row.deliverGoodsStatus);
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
        orderType: null,
        projectId: null,
        orderNo: null,
        title: null,
        customerId: null,
        linkMan: null,
        linkPhone: null,
        payAddress: null,
        payTime: null,
        overOrderStatus: null,
        saleMoney: null,
        overOrderMoney: null,
        saleMan: null,
        endUser: null,
        overOrderTax: null,
        companyId: null,
        orderTime: null,
        discountMoney: null,
        modelDispose: null,
        invoiceType: null,
        purchaseType: null,
        orderFile: null,
        operatorStatus: "0",
        operatorId: null,
        operatorTime: null,
        operatorRemarks: null,
        purchaseStatus: null,
        deliverGoodsStatus: "0",
        invoiceStatus: "0",
        invoiceMoney: null,
        invoiceTime: null,
        returnStatus: null,
        returnMoney: null,
        lastReturnTime: null,
        totalSaleMoney: null,
        totalTaxMoney: null,
        totalMoney: null,
        repairStatus: "0",
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        infoList:[{
          materielId:null,
          meteringId:null,
          saleMoney:null,
          ratio:null,
          ratioMoney:null,
          money:null,
          number:null,
          modelDispose:null,
          purchase:null
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
      this.dateRange = [];
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        orderType: null,
        projectId: null,
        orderNo: null,
        saleMan: null,
        orderTime: null,
        operatorStatus: null,
        purchaseStatus: null,
        deliverGoodsStatus: null,
        createName: null,
        invoiceStatus: null,
        returnStatus: null,
      }
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
      this.$router.push({path: '/order/orderAdd'})
    },
    /** 修改 详情按钮操作 */
    handleUpdate(row,type) {
      this.reset();
      const id = row.id || this.ids
      this.$router.push({path: '/order/orderAdd',query: { id:id ,type:type}})
    },
    // 采购按钮操作
    goPurchase(row){
      const id = row.id || this.ids
      this.$router.push({path: '/order/purchase',query: { id:id}})
    },
    // 发货按钮操作
    goDelivery(row){
      const id = row.id || this.ids
      this.$router.push({path: '/order/delivery',query: { id:id}})
    },
    //项目信息下拉框
    getProjectInfo(){
      projectAll().then(response=>{
        this.projectData=response.data;
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrderParent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addOrderParent(this.form).then(response => {
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
      const id = row.id;
      this.$confirm('是否确认作废订单?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrderParent(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有订单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOrderParent(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    getQueryOrderMoney(){
      queryOrderMoney().then(res=>{
        if(res.data != null && res.data != ''){
          this.saleMoney = res.data.saleMoney;
          this.invoiceMoney = res.data.invoiceMoney;
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

