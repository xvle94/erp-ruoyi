<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customerName">
        <el-select size="small" clearable v-model="queryParams.customerName" placeholder="请选择客户名称" @keyup.enter.native="handleQuery">
          <el-option v-for="item in customerData" :key="item.id" :label="item.name" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="回款金额" prop="returnMoney">
        <el-input style="width:47%"
          v-model="queryParams.beginReturnMoney"
          placeholder="请输入回款金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />至
        <el-input style="width:47%"
          v-model="queryParams.endReturnMoney"
          placeholder="请输入回款金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回款日期" prop="returnTime">
        <el-date-picker clearable size="small"
          v-model="value"
          @change="dateChange"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="回款状态" prop="returnStatus">
        <el-select v-model="queryParams.returnStatus" placeholder="请选择回款状态" clearable size="small">
          <el-option
            v-for="dict in returnStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"/>
        </el-select>
      </el-form-item>
       <el-form-item label="发票号码" >
        <el-input
          v-model="queryParams.invoiceNumber"
          placeholder="请输入发票号码"
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['order:orderReturn:export']"
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
        <span>当年累计回款金额:{{totalMoney}}元</span>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="orderReturnList" highlight-current-row>
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="客户名称" align="center" prop="customerName"/>
      <el-table-column label="订单编号" align="center" prop="orderNo"/>
      <el-table-column label="销售金额/元" align="center" prop="saleMoney"/>
      <el-table-column label="回款日期" align="center" prop="lastReturnTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastReturnTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回款金额/元" align="center" prop="returnMoney"/>
      <el-table-column label="回款状态" align="center" prop="returnStatusValue"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,0)"
            v-hasPermi="['order:orderReturn:edit']"
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
            v-hasPermi="['order:orderReturn:remove']"
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

    <!-- 添加或修改订单回款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-if="this.title!='订单回款详情'">
        <el-form-item label="订单编号" prop="orderNo">
          <el-link @click="toOrderDetail(form.id)" type="primary">{{form.orderNo}}</el-link>
        </el-form-item>
        <div class="returnDiv">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="回款状态" prop="returnStatus">
                <el-select v-model="form.returnStatus" placeholder="请选择回款状态" clearable style="width:100%">
                  <el-option
                    v-for="dict in returnStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="回款明细" prop="returnInfo">
            <div v-for="(item,index) in form.returnInfo" class="myFrame">
              <div class="iframe">
                <h4>第{{index+1}}次回款</h4>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="回款金额" :prop="'returnInfo.' + index + '.returnMoney'" :rules="rules.returnMoney">
                      <el-input v-model="item.returnMoney"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="回款日期" :prop="'returnInfo.' + index + '.returnTime'" :rules="rules.returnTime">
                      <el-date-picker clearable size="small" style="width:100%"
                        v-model="item.returnTime"
                        type="date"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="收款银行" :prop="'returnInfo.' + index + '.collectBank'" :rules="rules.collectBank">
                      <el-select v-model="item.collectBank" placeholder="请选择收款银行" clearable>
                        <el-option
                          v-for="dict in bankOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="dict.dictValue"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="发票号码" :prop="'returnInfo.' + index + '.invoiceNumber'" :rules="rules.invoiceNumber">
                      <el-input v-model="item.invoiceNumber" maxlength="8"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="备注" prop="remarks">
                      <el-input v-model="item.remarks" type="textarea"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <div>
                <i class="el-icon-delete form-icon baseIcon" @click.prevent="removeLine(item)" v-show="index!=0"></i>
              </div>
            </div>
            <div class="handleButton">
              <el-button @click="addLine">增加回款次数</el-button>
            </div>
          </el-form-item>
        </div>
        <template>
          <label>已回款金额：</label>
          <label>{{form.returnMoney}}</label>
          <label> 待回款金额：</label>
           <label>{{form.saleMoney-form.returnMoney}}</label>
        </template>
      </el-form>
      <!-- 详情 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" v-else>
        <el-form-item label="订单编号" prop="orderNo">
          <el-link @click="toOrderDetail(form.id)" type="primary">{{form.orderNo}}</el-link>
        </el-form-item>
        <div class="returnDiv">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="回款状态" prop="returnStatus1">
                <el-select v-model="form.returnStatus" :disabled="true" clearable style="width:100%">
                  <el-option
                    v-for="dict in returnStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="回款明细" prop="returnInfo">
            <template v-if="form.returnInfo!=null">
              <div v-for="(item,index) in form.returnInfo" class="myFrame">
                <div class="iframe">
                  <h4>第{{index+1}}次回款</h4>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="回款金额" prop="returnMoney1">
                        <el-input v-model="item.returnMoney" :disabled="true"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="回款日期" prop="returnTime1">
                        <el-date-picker style="width:100%" :disabled="true"
                          v-model="item.returnTime"
                          type="date"
                          value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="收款银行" prop="collectBank1">
                        <el-select v-model="item.collectBank" :disabled="true">
                          <el-option
                            v-for="dict in bankOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <el-form-item label="发票号码" prop="invoiceNumber">
                        <el-input v-model="item.invoiceNumber" :disabled="true"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="备注" prop="remarks">
                        <el-input v-model="item.remarks" type="textarea" :disabled="true"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </template>
            <template v-else>
              <span>暂无回款明细</span>
            </template>
          </el-form-item>
        </div>
        <template>
          <label>已回款金额：</label>
          <label>{{form.returnMoney}}</label>
          <label> 待回款金额：</label>
           <label>{{form.saleMoney-form.returnMoney}}</label>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="this.title!='订单回款详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrderReturn, getOrderReturn, delOrderReturn, addOrderReturn, updateOrderReturn, exportOrderReturn, customerAll, getTotalMoney, queryOrderMoney} from "@/api/order/orderReturn";

export default {
  name: "OrderReturn",
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
      // 订单回款表格数据
      orderReturnList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      nowMoney: 0,
      invoiceMoney: 0,
      saleMoney: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        beginTime: null,
        endTime: null,
        customerName: null,
        beginReturnMoney: null,
        returnStatus: null,
        endReturnMoney: null,
        invoiceNumber: null
      },
      // 表单参数
      form: {},
      // 回款状态
      returnStatusOptions:[],
      // 客户名称
      customerData:[],
      // 收款银行
      bankOptions:[],
      // 表单校验
      rules: {
        returnStatus: [
          { required: true, message: "回款状态不能为空", trigger: "blur" }
        ],
        returnMoney:[
          { required: true, message: "回款金额不能为空", trigger: "blur" },
          { pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "仅限小数点前9位数,后2位数", trigger: "blur" }
        ],
        returnTime:[
          { required: true, message: "回款日期不能为空", trigger: "blur" }
        ],
        collectBank:[
          { required: true, message: "收款银行不能为空", trigger: "blur" }
        ],
        invoiceNumber:[
          { pattern:/^\d{8}$/, message: "发票号码为8位数字", trigger: "blur" },
        ],
      },
      // 累计金额
      totalMoney:0
    };
  },
  created() {
    this.getList();
    this.getTotalMoney();
    this.getCustomerInfo();
    this.getDicts("return_money").then(response => {
      this.returnStatusOptions = response.data;
    });
    this.getDicts("mark_bank").then(response => {
      this.bankOptions = response.data;
    });
    // 查询合计金额
    this.getQueryOrderMoney();
  },
  methods: {
    dateChange(value){
      this.queryParams.beginTime=value[0]
      this.queryParams.endTime=value[1]
    },
    // 订单类型字典翻译
    returnStatusFormat(row, column) {
      return this.selectDictLabel(this.returnStatusOptions, row.returnStatus);
    },
    // 客户下拉框查询
    getCustomerInfo(){
      customerAll().then(response=>{
        this.customerData=response.data;
      })
    },
    /** 查询订单回款列表 */
    getList() {
      this.loading = true;
      listOrderReturn(this.queryParams).then(response => {
        this.orderReturnList = response.rows;
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
        returnMoney:null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        returnInfo:[{
          remarks:null,
          invoiceNumber:null,
          collectBank:null,
          returnTime:null,
          returnMoney:null
        }]
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
      this.getTotalMoney();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.value=[],
      this.resetForm("queryForm");
      this.queryParams ={
        pageNum: 1,
        pageSize: 10,
        beginTime: null,
        endTime: null,
        customerName: null,
        beginReturnMoney: null,
        returnStatus: null,
        endReturnMoney: null,
        invoiceNumber: null
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
      this.open = true;
      this.title = "添加订单回款";
    },
    /** 修改按钮操作 */
    handleUpdate(row,modalType) {
      this.reset();
      const orderId = row.orderId
      if(modalType==0){
        getOrderReturn(orderId).then(response => {
          this.form = response.data;
          if(this.form.returnInfo==null){
            this.form.returnInfo=[{
              remarks:null,
              invoiceNumber:null,
              collectBank:null,
              returnTime:null,
              returnMoney:null
            }]
          }
          this.open = true;
          this.title = "修改订单回款";
        });
      }else{
        getOrderReturn(orderId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "订单回款详情";
        });
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrderReturn(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addOrderReturn(this.form).then(response => {
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
      const orderId = row.orderId
      this.$confirm('是否确认作废订单回款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOrderReturn(orderId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有订单回款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOrderReturn(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //添加回款次数	
    addLine(){
      this.form.returnInfo.push({});
    },
    removeLine(item){
      var index = this.form.returnInfo.indexOf(item)
        if (index !== -1) {
          this.form.returnInfo.splice(index, 1)
        }
    },
    // 查询已回款总金额
    getTotalMoney(){
      getTotalMoney(this.queryParams).then(response => {
        this.totalMoney = response.data;
        console.log(response.data)
      });
    },
    // 跳转项目详情
    toOrderDetail(id){
      this.$router.push({path: '/order/orderAdd',query: { id:id ,type:1}})
      this.open=false
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
<style scoped>
  .form-icon{
    font-size: 20px;
    margin-right: 2px;
    line-height: 34px;
  }
  .handleIcon{
    text-align: right;
  }
  .handleButton{
    text-align: center;
    margin-top: 10px
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
  .f-danger{
    color: #F56C6C
  }
  .f-success{
    color: #67C23A
  }
  .myFrame{
    display: flex;
    align-items: center;
  }
  .iframe{
    border: 1px solid #DCDFE6;
    width: 88%;
    padding: 0 10px;
    margin: 0 15px 15px 0px;
  }
  .returnDiv{
    border-top: 1px solid #DCDFE6;
    padding-top: 15px;
  }
  .iframe h4{
    margin: 0
  }
  .iframe .el-form-item{
    margin-bottom: 20px
  }
</style>
<style>
  .form-icon{
    font-size: 20px;
    margin-right: 2px;
    line-height: 34px;
  }
  .handleIcon{
    text-align: right;
  }
  .handleButton{
    text-align: center;
    margin-top: 10px
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
  .f-danger{
    color: #F56C6C
  }
  .f-success{
    color: #67C23A
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