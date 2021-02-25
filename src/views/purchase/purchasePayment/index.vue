<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
       <el-form-item label="采购单类型" >
        <el-select v-model="queryParams.purchaseType" placeholder="请选择采购单类型" clearable size="small">
          <el-option
            v-for="dict in purchaseTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="采购类型" >
        <el-select v-model="queryParams.typePurchase" placeholder="请选择采购类型" clearable size="small">
          <el-option
            v-for="dict in typePurchaseOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属采购单编号" prop="purchaseId">
        <el-input
          v-model="queryParams.purchaseId"
          placeholder="请输入所属采购单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
       <el-form-item label="所属供应商" >
        <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

       <el-form-item label="付款日期" >
        <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="发票日期"
              end-placeholder="发票日期"
        ></el-date-picker>
      </el-form-item>
     
      <el-form-item label="付款状态" >
        <el-select v-model="queryParams.returnStatus" placeholder="请选择付款状态" clearable size="small">
          <el-option
            v-for="dict in returnStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请状态" prop="operatorStatus">
        <el-select v-model="queryParams.operatorStatus" placeholder="请选择申请状态" clearable size="small">
          <el-option
            v-for="dict in operatorStatusOptions"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <span>当年累计付款金额:{{totalMoney}}元</span>
      </el-col>
    </el-row>

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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['purchase:payment:export']"
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

    <el-table v-loading="loading" :data="purchasePaymentList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="采购单类型" align="center" prop="purchaseTypeValue" />
      <el-table-column label="采购类型" align="center" prop="typePurchaseValue" />
      <el-table-column label="采购单编号" align="center" prop="purchaseId" />
      <el-table-column label="订单编号" align="center" prop="orderNo" />
      <el-table-column label="订单金额/元" align="center" prop="saleMoney" />
      <el-table-column label="物料名称" align="center" prop="materielName" />
      <el-table-column label="所属供应商" align="center" prop="supplierName" />
      <el-table-column label="采购日期" align="center" prop="purchaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.purchaseTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购金额/元" align="center" prop="purchaseTotalMoney" />
      <el-table-column label="开票状态" align="center" prop="invoiceStatusValue" />
      <el-table-column label="付款状态" align="center" prop="returnStatusValue" />
      <el-table-column label="已付款金额/元" align="center" prop="returnMoney" />
       <el-table-column label="付款日期" align="center" prop="lastReturnTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastReturnTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center" prop="operatorStatusValue" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['purchase:payment:edit']">编辑</el-button>
          <el-dropdown>
            <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                  <el-button size="mini" type="text" icon="el-icon-document" @click="handleDetail(scope.row)">详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-show="scope.row.operatorStatusValue=='待审核'">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-document-checked"
                    @click="handleExamine(scope.row)"
                    v-hasPermi="['purchase:payment:examine']"
                  >审核</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                  <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['purchase:payment:remove']"
                >作废</el-button>
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

    <!-- 修改采购付款对话框 -->
    <el-dialog :title="title" :visible.sync="edit" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="115px">
        <el-form-item label="订单编号" prop="orderNo" v-if="form.orderNo!=null">
          <el-link @click="toOrderDetail(form.orderId,1)" type="primary">{{form.orderNo}}</el-link>
        </el-form-item>
        <el-form-item  v-else>
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="物料编号" prop="materielCode">
                <el-input v-model="purchaseInfo.materielCode"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购单价" prop="purchaseMoney">
                <el-input v-model="purchaseInfo.purchaseMoney"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="物料名称" prop="materielName">
                <el-input v-model="purchaseInfo.materielName"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报价单号" prop="quotationNo">
                <el-input v-model="purchaseInfo.quotationNo"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="实际采购配置" prop="purchaseDispose">
                <el-input v-model="purchaseInfo.purchaseDispose"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购金额" prop="purchaseTotalMoney">
                <el-input v-model="purchaseInfo.purchaseTotalMoney"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="采购数量" prop="purchaseNumber">
                <el-input v-model="purchaseInfo.purchaseNumber"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购情况" prop="purchaseStatus">
                <el-input v-model="purchaseInfo.purchaseStatus"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplierName">
                <el-input v-model="purchaseInfo.supplierName"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购日期" prop="purchaseTime">
                <el-input v-model="purchaseInfo.purchaseTime"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <template v-for="(item,index) in form.paymentList">
          <h3>{{index+1}}</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申请付款金额" :prop="'paymentList.' + index + '.applyMoney'" :rules="rules.applyMoney">
                <el-input v-model="item.applyMoney"  placeholder="请输入申请付款金额" :disabled="item.operatorStatusValue=='已通过' ? true :false"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款状态" :prop="'paymentList.' + index + '.applyStatus'" :rules="rules.applyStatus">
                <el-select v-model="item.applyStatus" placeholder="请选择付款状态" clearable style="width:100%" :disabled="item.operatorStatusValue=='已通过' ? true :false">
                  <el-option
                    v-for="dict in returnStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="付款日期" :prop="'paymentList.' + index + '.payTime'" :rules="rules.payTime">
                <el-date-picker clearable style="width:100%" :disabled="item.operatorStatusValue=='已通过' ? true :false"
                  :picker-options="pickerBeginDataAfter"
                  v-model="item.payTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择付款日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="item.remarks" maxlength="500" placeholder="请输入备注" :disabled="item.operatorStatusValue=='已通过' ? true :false"/>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-show="item.operatorStatusValue!='待审核' && item.operatorStatusValue!=null">
            <h3>审核</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核状态" prop="operatorStatusValue">
                  <el-input v-model="item.operatorStatusValue" :disabled="true" placeholder="/"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核备注" prop="operatorRemarks">
                  <el-input v-model="item.operatorRemarks" :disabled="true" placeholder="/"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="付款金额" prop="operatorPayMoney">
                  <el-input v-model="item.operatorPayMoney" :disabled="true" placeholder="/"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核人员" prop="operatorName">
                  <el-input v-model="item.operatorName" :disabled="true" placeholder="/"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>
        <div class="totalTab">
          <label>合计: </label>
          <span>历史申请付款金额:{{form.historyMoney}} 元</span>
          <span> 申请中金额:{{form.applyMoney}} 元</span>
          <span> 剩余申请付款金额:{{form.surplusMoney}} 元</span>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核 -->
    <el-dialog :title="title" :visible.sync="examine" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="115px">
        <el-form-item label="订单编号" prop="orderNo" v-if="form.orderNo!=null">
          <el-link @click="toOrderDetail(form.orderId,2)" type="primary">{{form.orderNo}}</el-link>
        </el-form-item>
        <el-form-item  v-else>
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="物料编号" prop="materielCode">
                <el-input v-model="purchaseInfo.materielCode"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购单价" prop="purchaseMoney">
                <el-input v-model="purchaseInfo.purchaseMoney"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="物料名称" prop="materielName">
                <el-input v-model="purchaseInfo.materielName"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报价单号" prop="quotationNo">
                <el-input v-model="purchaseInfo.quotationNo"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="实际采购配置" prop="purchaseDispose">
                <el-input v-model="purchaseInfo.purchaseDispose"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购金额" prop="purchaseTotalMoney">
                <el-input v-model="purchaseInfo.purchaseTotalMoney"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="采购数量" prop="purchaseNumber">
                <el-input v-model="purchaseInfo.purchaseNumber"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购情况" prop="purchaseStatus">
                <el-input v-model="purchaseInfo.purchaseStatus"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplierName">
                <el-input v-model="purchaseInfo.supplierName"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购日期" prop="purchaseTime">
                <el-input v-model="purchaseInfo.purchaseTime"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <template v-for="(item,index) in form.paymentList">
          <h3>{{index+1}}</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申请付款金额" :prop="'paymentList.' + index + '.applyMoney'">
                <el-input v-model="item.applyMoney" placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款状态" prop="applyStatusValue">
                <el-select v-model="item.applyStatusValue" placeholder="/" :disabled="true" clearable style="width:100%">
                  <el-option
                    v-for="dict in returnStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="付款日期" :prop="'paymentList.' + index + '.payTime'">
                <el-date-picker clearable style="width:100%" :disabled="true"
                  v-model="item.payTime"
                  type="date"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="item.remarks"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="item.operatorStatusValue=='已通过'">
            <h3>审核</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核状态" prop="operatorStatusValue">
                  <el-input v-model="item.operatorStatusValue"  placeholder="/" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核备注" prop="operatorRemarks">
                  <el-input v-model="item.operatorRemarks" placeholder="/" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="付款金额" prop="operatorPayMoney">
                  <el-input v-model="item.operatorPayMoney"  placeholder="/" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核人员" prop="operatorName">
                  <el-input v-model="item.operatorName"  placeholder="/" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <h3>审核</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="付款金额" prop="operatorPayMoney" :prop="'paymentList.' + index + '.operatorPayMoney'" :rules="rules.operatorPayMoney">
                  <el-input v-model="item.operatorPayMoney" placeholder="请输入申请付款金额"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核备注" prop="operatorRemarks">
                  <el-input v-model="item.operatorRemarks" placeholder="请输入备注" maxlength="500"/>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </template>
        <div class="totalTab">
          <label>合计: </label>
          <span>历史申请付款金额:{{form.historyMoney}} 元</span>
          <span> 申请中金额:{{form.applyMoney}} 元</span>
          <span> 剩余申请付款金额:{{form.surplusMoney}} 元</span>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitExamine('e03')">不通过</el-button>
        <el-button type="primary" @click="submitExamine('e02')">通过</el-button>
      </div>
    </el-dialog>
    
    <!-- 详情 -->
    <el-dialog :title="title" :visible.sync="detail" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="115px">
        <el-form-item label="订单编号" prop="orderNo" v-if="form.orderNo!=null">
          <el-link @click="toOrderDetail(form.orderId,3)" type="primary">{{form.orderNo}}</el-link>
        </el-form-item>
        <el-form-item  v-else>
        </el-form-item>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="物料编号" prop="materielCode">
                <el-input v-model="purchaseInfo.materielCode"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购单价" prop="purchaseMoney">
                <el-input v-model="purchaseInfo.purchaseMoney"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="物料名称" prop="materielName">
                <el-input v-model="purchaseInfo.materielName"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报价单号" prop="quotationNo">
                <el-input v-model="purchaseInfo.quotationNo"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="实际采购配置" prop="purchaseDispose">
                <el-input v-model="purchaseInfo.purchaseDispose"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购金额" prop="purchaseTotalMoney">
                <el-input v-model="purchaseInfo.purchaseTotalMoney"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="采购数量" prop="purchaseNumber">
                <el-input v-model="purchaseInfo.purchaseNumber"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购情况" prop="purchaseStatus">
                <el-input v-model="purchaseInfo.purchaseStatus"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="供应商" prop="supplierName">
                <el-input v-model="purchaseInfo.supplierName"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购日期" prop="purchaseTime">
                <el-input v-model="purchaseInfo.purchaseTime"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
        </el-row>
        <template v-for="(item,index) in form.paymentList">
          <h3>{{index+1}}</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="申请付款金额" prop="applyMoney">
                <el-input v-model="item.applyMoney"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款状态" prop="applyStatusValue">
                <el-select v-model="item.applyStatusValue" placeholder="/" :disabled="true" clearable style="width:100%">
                  <el-option
                    v-for="dict in returnStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="付款日期" prop="payTime">
                <el-input v-model="item.payTime"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="item.remarks"  placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <h3>审核</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核状态" prop="operatorStatusValue">
                  <el-input v-model="item.operatorStatusValue" :disabled="true" placeholder="/"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核备注" prop="operatorRemarks" v-show="item.operatorStatusValue!='待审核'">
                  <el-input v-model="item.operatorRemarks" :disabled="true" placeholder="/"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-show="item.operatorStatusValue!='待审核'">
              <el-col :span="12">
                <el-form-item label="付款金额" prop="operatorPayMoney">
                  <el-input v-model="item.operatorPayMoney" :disabled="true" placeholder="/"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核人员" prop="operatorName">
                  <el-input v-model="item.operatorName" :disabled="true" placeholder="/"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>
        <div class="totalTab">
          <label>合计: </label>
          <span>历史申请付款金额:{{form.historyMoney}} 元</span>
          <span> 申请中金额:{{form.applyMoney}} 元</span>
          <span> 剩余申请付款金额:{{form.surplusMoney}} 元</span>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listPurchasePayment, getPurchasePayment, delPurchasePayment, addPurchasePayment, updatePurchasePayment, exportPurchasePayment, selectByMoney, getPurchaseInfo, examinePayment, queryPurchaseMoney} from "@/api/purchase/purchasePayment";

export default {
  name: "PurchasePayment",
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
      // 采购付款表格数据
      purchasePaymentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      edit: false,
      examine:false,
      detail:false,
      // 付款状态字典
      returnStatusOptions: [],
      // 采购单类型字典
      purchaseTypeOptions: [],
      // 采购类型字典
      typePurchaseOptions: [],
      // 审核状态字典
      operatorStatusOptions: [
        {"dictType":"examine","dictValue": "e01", "dictLabel": "待审核"},
        {"dictType":"examine","dictValue": "e02", "dictLabel": "已通过"},
        {"dictType":"examine","dictValue": "e03", "dictLabel": "未通过"},
      ],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        purchaseType: null,
        typePurchase: null,
        purchaseId: null,
        payTime: null,
        operatorStatus: null,
        returnStatus: null,
        orderNo: null,
        supplierName: null,
      },
      //当年付款金额
      totalMoney: 0,
      // 表单参数
      form: {},
      returnMoney: 0,
      purchaseMoney: 0,
      nowMoney: 0,
      // 采购明细详情
      purchaseInfo:{},
      // 表单校验
      rules: {
        applyMoney: [
          { required: true, message: "申请付款金额不能为空", trigger: "blur" },
          { pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "仅限小数点前最大9位数，后2位数", trigger: "blur" }
        ],
        applyStatus: [
          { required: true, message: "付款状态不能为空", trigger: "blur" }
        ],
        payTime: [
          { required: true, message: "付款日期不能为空", trigger: "blur" }
        ],
        operatorPayMoney:[
          { pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "仅限小数点前最大9位数，后2位数", trigger: "blur" }
        ]
      },
      // 禁用当前之前日期
      pickerBeginDataAfter:{
        disabledDate(time) {
          return time.getTime() < Date.now()-8.64e7;
        }
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("purchases_type").then(response => {
      this.purchaseTypeOptions = response.data;
    });
    this.getDicts("type_purchas").then(response => {
      this.typePurchaseOptions = response.data;
    });
    this.getDicts("purchase_info_paymentStatus").then(response => {
      this.returnStatusOptions = response.data;
    });

    //查询采购总金额、已付款金额、未付款金额
    this.getQueryPurchaseMoney();
    
  },
  methods: {
    /** 查询采购付款列表 */
    getList() {
      this.loading = true;
      listPurchasePayment(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.purchasePaymentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.getMoney();
    },
    getMoney(){
      this.loading = true;
        selectByMoney(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.totalMoney = res.data;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.edit = false;
      this.detail = false;
      this.examine = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        purchaseId: null,
        purchaseInfoId: null,
        applyMoney: null,
        applyStatus: null,
        payTime: null,
        operatorStatus: null,
        operatorStatusValue:null,
        operatorId: null,
        operatorTime: null,
        operatorRemarks: null,
        operatorPayMoney: null,
        remarks: null,
        createBy: null,
        crateTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
      };
      this.purchaseInfo={
        materielCode:null,
        materielName:null,
        purchaseDispose:null,
        purchaseNumber:null,
        purchaseMoney:null,
        purchaseTotalMoney:null,
        quotationNo:null,
        purchaseTime:null,
        supplierName:null,
        purchaseStatus:null
      }
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.totalMoney = 0;
      this.dateRange = [];
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        purchaseType: null,
        typePurchase: null,
        purchaseId: null,
        payTime: null,
        operatorStatus: null,
        returnStatus: null,
        orderNo: null,
        supplierName: null,
      };
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const params = {
        purchaseInfoId:row.purchaseInfoId
      }
      getPurchasePayment(params).then(response => {
        // 等于空新增一条付款申请数据
        if(response.data.paymentList==null){
          this.form = response.data;
          this.form.paymentList=[{}]
        }else{
          //审核通过增一条付款申请数据
          var endInfo=response.data.paymentList[response.data.paymentList.length-1]
          if(endInfo.operatorStatus=='e02'){
            this.form = response.data;
            this.form.paymentList.push({})
          }else{
            this.form = response.data;
          }
        }
        this.edit = true;
        this.title = "采购付款编辑";
      });
      getPurchaseInfo(params).then(response=>{
        this.purchaseInfo = response.data;
      })
    },
    // 详情按钮操作
    handleDetail(row){
      this.reset();
      const params = {
        purchaseInfoId:row.purchaseInfoId
      }
      getPurchasePayment(params).then(response => {
        this.form = response.data;
        this.detail = true;
        this.title = "采购付款详情";
      });
      getPurchaseInfo(params).then(response=>{
        this.purchaseInfo = response.data;
      })
    },
    // 审核按钮操作
    handleExamine(row){
      this.reset();
      const params = {
        purchaseInfoId:row.purchaseInfoId
      }
      getPurchasePayment(params).then(response => {
        this.form = response.data;
        this.examine = true;
        this.title = "采购付款审核";
      });
      getPurchaseInfo(params).then(response=>{
        this.purchaseInfo = response.data;
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          var endInfo=this.form.paymentList[this.form.paymentList.length-1]
          endInfo.purchaseInfoId=this.form.purchaseInfoId
          if(endInfo.id!=undefined){
            endInfo.id=endInfo.id
          }  
          updatePurchasePayment(endInfo).then(response => {
            if (response.code === 200) {
              this.msgSuccess("编辑成功");
              this.edit = false;
              this.getList();
            }
          });
        }
      });
    },
    submitExamine(status){
      this.$refs["form"].validate(valid => {
        if (valid) {
          var endInfo=this.form.paymentList[this.form.paymentList.length-1]
          var examineInfo={
            id:endInfo.id,
            operatorStatus:status,
            remarks:endInfo.operatorRemarks,
            operatorPayMoney:endInfo.operatorPayMoney,
          }
          if(status =='e02'){
            if(endInfo.operatorPayMoney == null || endInfo.operatorPayMoney == ""){
                this.$message.warning('【通过】时，付款金额必填');
            }else{
              examinePayment(examineInfo).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("审核成功");
                  this.examine = false;
                  this.getList();
                }
              });
            }
          }else{
            if(endInfo.operatorRemarks == null || endInfo.operatorRemarks == ""){
              this.$message.warning('【不通过】时，备注必填');
            }else{
              examinePayment(examineInfo).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("审核成功");
                  this.examine = false;
                  this.getList();
                }
              });
            }
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const purchaseInfoId = row.purchaseInfoId;
      this.$confirm('是否确认作废采购付款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPurchasePayment(purchaseInfoId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购付款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPurchasePayment(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // 跳转项目详情
    toOrderDetail(id,types){
      this.$router.push({path: '/order/orderAdd',query: { id:id ,type:1}})
      if(types==1){
        this.edit=false
      }
      if(types==2){
        this.examine=false
      }
      if(types==3){
        this.detail=false
      }
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
  .el-form h3{
    margin-top: 0;
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
  .totalTab{
    background-color: #F5F7FA;
    padding: 15px 5px
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