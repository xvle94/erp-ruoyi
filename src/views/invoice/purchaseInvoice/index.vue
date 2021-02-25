<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      
       <el-form-item label="所属供应商" >
        
         <el-input
          v-model="queryParams.supplierName"
          placeholder="请输入供应商名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="发票日期" >
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <span>当年累计已到票金额:{{totalMoney}}元</span>
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
    

    <el-table v-loading="loading" :data="purchaseInvoiceList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="所属供应商" align="center" prop="supplierName" />
      <el-table-column label="所属采购单编号" align="center" prop="purchaseId" />
      <el-table-column label="物料名称" align="center" prop="materielName" />
      <el-table-column label="付款状态" align="center" prop="returnStatus" />
      <el-table-column label="已到票金额/元" align="center" prop="returnMoney" />
      <el-table-column label="开票状态" align="center" prop="invoiceStatusValue" />
      <el-table-column label="收票日期" align="center" prop="invoiceTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.invoiceTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="operatorStatusValue" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.invoiceStatusValue!='全部开票'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,2)"
            v-hasPermi="['purchase:invoice:edit']"
          >编辑</el-button>
          <el-dropdown>
            <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
               <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['purchase:invoice:remove']"
                >作废</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-show="scope.row.operatorStatusValue=='待审核'">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-document-checked"
                  @click="handleExamine(scope.row)"
                  v-hasPermi="['purchase:invoice:examine']"
                >审核</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-document"
                  @click="handleDetail(scope.row)"
                >详情</el-button>
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

    <!-- 修改采购开票申请对话框 -->
    <el-dialog :title="title" :visible.sync="edit" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
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
        <template v-for="(item,index) in form.infoList" >
          <!-- 编辑开票 -->
          <h3>开票信息</h3>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="发票号码" :prop="'infoList.' + index + '.invoiceNumber'" :rules="rules.invoiceNumber">
                  <el-input v-model="item.invoiceNumber" maxlength="8" placeholder="请输入发票号码" :disabled="item.operatorStatus=='e02' ? true : false"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收票日期" :prop="'infoList.' + index + '.invoiceTime'" :rules="rules.invoiceTime">
                  <el-date-picker clearable style="width:100%" :disabled="item.operatorStatus=='e02' ? true : false"
                    v-model="item.invoiceTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择发票日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发票类型" :prop="'infoList.' + index + '.invoiceType'" :rules="rules.invoiceType">
                <el-select v-model="item.invoiceType" clearable  placeholder="请选择发票类型" style="width:100%;" :disabled="item.operatorStatus=='e02' ? true : false">
                  <el-option
                    v-for="dict in invoiceTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票金额(元)" :prop="'infoList.' + index + '.invoiceMoney'" :rules="rules.invoiceMoney">
                <el-input v-model="item.invoiceMoney" placeholder="请输入发票金额" :disabled="item.operatorStatus=='e02' ? true : false"/>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="item.remarks" maxlength="500" placeholder="请输入内容" :disabled="item.operatorStatus=='e02' ? true : false"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票附件" prop="invoiceFile" v-if="item.operatorStatus=='e02'">
                <template v-if="item.fileUrl==null">
                  <el-link disabled type="primary" target="_blank">暂无</el-link>
                </template>
                <template v-else>
                  <el-link v-for="(fItem,index) in item.fileUrl" :href="fItem.contractUrl" type="primary" target="_blank">附件{{index+1}} </el-link>
                </template>
              </el-form-item>
              <el-form-item label="发票附件" prop="invoiceFile" v-else>
                <el-upload :limit="5" :multiple="false" accept=".png,.pdf,.jpg" :on-exceed="handleExceed" :on-change="invoiceHandleChange" :http-request="invoiceRequestUpload" :file-list="invoiceFileList"  action="#"
                  :before-upload="beforeUpload" :on-remove="handleRemove">
                    <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                  </el-upload>
                <el-input v-model="item.invoiceFile" placeholder="请输入内容" disabled v-show="false" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 审核 -->
          <template v-if="item.operatorStatus=='e02' || item.operatorStatus=='e03'">
            <h3>审核状态</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核状态">
                  <el-select v-model="item.operatorStatus" clearable :disabled="true"  placeholder="请选择审核状态" style="width:100%;">
                    <el-option
                      v-for="dict in examineStatus"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核备注" prop="operatorRemarks">
                  <el-input v-model="item.operatorRemarks" :disabled="true" placeholder="请输入审核备注" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核人" prop="operatorId">
                  <el-input v-model="item.operatorId" :disabled="true" placeholder="请输入审核人" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核采购开票申请对话框 -->
    <el-dialog :title="title" :visible.sync="examine" width="900px" append-to-body>
      <el-form ref="examineForm" :model="examineForm" :rules="rules" label-width="110px">
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
        <template v-for="(item,index) in examineForm.infoList">
          <h3>第{{index+1}}次开票</h3>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="发票号码" :prop="'infoList.' + index + '.invoiceNumber'">
                  <el-input v-model="item.invoiceNumber" :disabled="true" placeholder="/" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收票日期" :prop="'infoList.' + index + '.invoiceTime'">
                  <el-date-picker :disabled="true" style="width:100%"
                    v-model="item.invoiceTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="/">
                  </el-date-picker>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发票类型" :prop="'infoList.' + index + '.invoiceType'">
                <el-select v-model="item.invoiceType" :disabled="true" placeholder="/" style="width:100%;">
                  <el-option
                    v-for="dict in invoiceTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票金额(元)" :prop="'infoList.' + index + '.invoiceMoney'">
                <el-input v-model="item.invoiceMoney" placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="item.remarks" :disabled="true" placeholder="/" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票附件" prop="fileUrl">
                <template v-if="item.fileUrl==null">
                  <el-link disabled type="primary" target="_blank">暂无</el-link>
                </template>
                <template v-else>
                  <el-link v-for="(fItem,index) in item.fileUrl" :href="fItem.contractUrl" type="primary" target="_blank">附件{{index+1}} </el-link>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="item.operatorStatus=='e02'">
            <h3>审核状态</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核状态">
                  <el-select v-model="item.operatorStatus" :disabled="true" placeholder="/" style="width:100%;">
                    <el-option
                      v-for="dict in examineStatus"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
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
                <el-form-item label="审核人" prop="operatorId">
                  <el-input v-model="item.operatorId" placeholder="/" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <h3>审核状态</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核备注" prop="operatorRemarks">
                  <el-input v-model="item.operatorRemarks" placeholder="请输入审核备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitExamine('e03')">不通过</el-button>
        <el-button type="primary" @click="submitExamine('e02')">通过</el-button>
      </div>
    </el-dialog>

    <!-- 详情框 -->
    <el-dialog :title="title" :visible.sync="detail" width="900px" append-to-body>
      <el-form ref="detailForm" :model="detailForm" :rules="rules" label-width="110px">
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
        <template v-for="(item,index) in detailForm.infoList">
          <h3>第{{index+1}}次开票</h3>
          <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="发票号码" :prop="'infoList.' + index + '.invoiceNumber'">
                  <el-input v-model="item.invoiceNumber" :disabled="true" placeholder="/" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收票日期" :prop="'infoList.' + index + '.invoiceTime'">
                  <el-date-picker :disabled="true" style="width:100%"
                    v-model="item.invoiceTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="/">
                  </el-date-picker>
                </el-form-item>
              </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发票类型" :prop="'infoList.' + index + '.invoiceType'">
                <el-select v-model="item.invoiceType" :disabled="true" placeholder="/" style="width:100%;">
                  <el-option
                    v-for="dict in invoiceTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票金额(元)" :prop="'infoList.' + index + '.invoiceMoney'">
                <el-input v-model="item.invoiceMoney" placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开票内容" :prop="'infoList.' + index + '.invoiceContent'">
                <el-input v-model="item.invoiceContent" placeholder="/" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开票状态" :prop="'infoList.' + index + '.invoiceStatus'">
                <el-select v-model="item.invoiceStatus" :disabled="true" placeholder="/" style="width:100%;">
                  <el-option
                    v-for="dict in invoiceStatusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注" prop="remarks">
                <el-input v-model="item.remarks" :disabled="true" placeholder="/" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发票附件" prop="fileUrl">
                <template v-if="item.fileUrl==null">
                  <el-link disabled type="primary" target="_blank">暂无</el-link>
                </template>
                <template v-else>
                  <el-link v-for="(fItem,index) in item.fileUrl" :href="fItem.contractUrl" type="primary" target="_blank">附件{{index+1}} </el-link>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="item.operatorStatus=='e02' || item.operatorStatus=='e03'">
            <h3>审核状态</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核状态">
                  <el-select v-model="item.operatorStatus" :disabled="true" placeholder="/" style="width:100%;">
                    <el-option
                      v-for="dict in examineStatus"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
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
                <el-form-item label="审核人" prop="operatorId">
                  <el-input v-model="item.operatorId" placeholder="/" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <h3>审核状态</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核备注" prop="operatorRemarks">
                  <el-input v-model="item.operatorRemarks" placeholder="/" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listPurchaseInvoice, getPurchaseInvoice, delPurchaseInvoice, updatePurchaseInvoice, uploadFile, toExamine, getPurchaseInfo, countMoney, queryPurchaseMoney} from "@/api/invoice/purchaseInvoice";

export default {
  name: "PurchaseInvoice",
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
      // 采购开票申请表格数据
      purchaseInvoiceList: [],
      // 发票类型字典
      invoiceTypeOptions: [],
      // 开票状态字典
      invoiceStatusOptions: [],
      // 审核状态字典
      examineStatus: [
        {"dictType":"examine","dictValue": "e01", "dictLabel": "待审核"},
        {"dictType":"examine","dictValue": "e02", "dictLabel": "已通过"},
        {"dictType":"examine","dictValue": "e03", "dictLabel": "未通过"},
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      edit: false,
      examine: false,
      detail: false,
      // 日期范围
      dateRange: [],
      //当年已开票金额
      totalMoney: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supplierName: null,
        invoiceNumber: null,
        
      },
      returnMoney: 0,
      purchaseMoney: 0,
      nowMoney: 0,
      // 表单参数
      form: {
        infoList:[]
      },
      examineForm:{
        infoList:[]
      },
      detailForm:{
        infoList:[]
      },
      // 采购明细
      purchaseInfo:{},
      // 审核状态
      examineOptions:[],
      // 开票状态
      invoiceStatusOptions:[],
      // 发票类型
      invoiceTypeOptions:[],
      // 表单校验
      rules: {
        invoiceNumber: [
          { required: true, message: "发票号码不能为空", trigger: "blur" },
          { pattern:/^\d{8}$/, message: "仅限8位数发票号码", trigger: "blur" }
        ],
        invoiceTime: [
          { required: true, message: "发票日期不能为空", trigger: "blur" }
        ],
        invoiceType: [
          { required: true, message: "发票类型不能为空", trigger: "blur" }
        ],
        invoiceMoney:[
          { required: true, message: "发票金额不能为空", trigger: "blur" },
          { pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "仅限小数点前最大9位数，后2位数", trigger: "blur" }
        ],
        invoiceContent:[
          { required: true, message: "发票内容不能为空", trigger: "blur" }
        ],
        invoiceStatus:[
          { required: true, message: "开票状态不能为空", trigger: "blur" }
        ]
      },
      //文件列表
      invoiceFileList: [],
      invoiceFormData: [],
      // 采购明细id	
      purchaseInfoId:''
    };
  },
  created() {
    this.getList();
    this.getDicts("examine").then(response => {
      this.examineOptions = response.data;
    });
    this.getDicts("invoice_type").then(response => {
      this.invoiceTypeOptions = response.data;
    });
    this.getDicts("invoice_dist").then(response => {
      this.invoiceStatusOptions = response.data;
    });
    //查询采购总金额、已付款金额、未付款金额
    this.getQueryPurchaseMoney();
  },
  methods: {
    /** 查询采购开票申请列表 */
    getList() {
      this.loading = true;
      listPurchaseInvoice(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.purchaseInvoiceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      //查询当前已开票金额
      this.getTotalMoney();
    },
    // 查询当前已开票金额
    getTotalMoney(){
      countMoney(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.totalMoney = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.edit = false;
      this.examine = false;
      this.detail = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        infoList:[{
          id: null,
          purchaseId: null,
          invoiceNumber: null,
          invoiceTime: null,
          invoiceType: null,
          invoiceMoney: null,
          invoiceCount: null,
          invoiceContent: null,
          invoiceStatus: "0",
          invoiceFile: 0,
          operatorStatus: "0",
          operatorId: null,
          operatorTime: null,
          operatorRemarks: null,
          remarks: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          delFlag: null
        }],
      };
      this.examineForm = {
        infoList:[{
          id: null,
          purchaseId: null,
          invoiceNumber: null,
          invoiceTime: null,
          invoiceType: null,
          invoiceMoney: null,
          invoiceCount: null,
          invoiceContent: null,
          invoiceStatus: "0",
          invoiceFile: 0,
          operatorStatus: "0",
          operatorId: null,
          operatorTime: null,
          operatorRemarks: null,
          remarks: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          delFlag: null
        }],
      };
      this.detailForm = {
        infoList:[{
          id: null,
          purchaseId: null,
          invoiceNumber: null,
          invoiceTime: null,
          invoiceType: null,
          invoiceMoney: null,
          invoiceCount: null,
          invoiceContent: null,
          invoiceStatus: "0",
          invoiceFile: 0,
          operatorStatus: "0",
          operatorId: null,
          operatorTime: null,
          operatorRemarks: null,
          remarks: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          delFlag: null
        }],
      };
      this.resetForm("form");
      this.resetForm("examineForm");
      this.resetForm("detailForm");
      this.purchaseInfo={
        id:null,
        purchaseId: null,
        materielCode:null,
        materielName:null,
        purchaseDispose:null,
        purchaseNumber:null,
        purchaseMoney:null,
        purchaseTotalMoney:null,
        quotationNo:null,
        purchaseTime:null,
        supplierId:null,
        supplierName:null,
        purchaseStatus:null,
      };
      this.invoiceFileList=[];
      this.resetForm("purchaseInfo");
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
        supplierName: null,
        invoiceNumber: null,
        
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
      this.title = "添加采购开票申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row,type) {
      this.reset();
      const id = {
        purchaseInfoId:row.purchaseInfoId
      }
      getPurchaseInfo(id).then(response => {
        this.purchaseInfo=response.data
      })
      getPurchaseInvoice(id).then(response => {
        // 保存当前采购明细id
        this.purchaseInfoId=id.purchaseInfoId
        if(response.data.length==0){
          this.form.infoList=[{}]
          var endInfo=this.form.infoList[this.form.infoList.length-1]  
          endInfo.invoiceMoney= this.purchaseInfo.purchaseTotalMoney
          endInfo.invoiceContent= this.purchaseInfo.materielName
        }else{
            this.form.infoList=response.data
            // 取开票最后一条数据
            var endInfos=response.data[response.data.length-1]  
            // 图片
            let vm = this;
            if(endInfos.fileUrl){ 
              let a = endInfo.fileUrl
                if(a.length > 0) {
                  a.forEach(item => {
                    var obj = {} 
                    vm.$set(obj,'name',item.fileName);
                    vm.$set(obj,'url',item.contractUrl);
                    vm.invoiceFileList.push(obj);
                  })
                }
            }
        }
        this.edit = true;
        this.title = "供应商发票管理";
      });
      
    },
    // 审核按钮操作
    handleExamine(row){
      this.reset();
      const id = {
        purchaseInfoId:row.purchaseInfoId
      }
      getPurchaseInvoice(id).then(response => {
        this.examineForm.infoList=response.data
        this.examine = true;
        this.title = "供应商发票审核";
      });
       getPurchaseInfo(id).then(response => {
        this.purchaseInfo=response.data
      })
    },
    handleDetail(row){
      this.reset();
      const id = {
        purchaseInfoId:row.purchaseInfoId
      }
      getPurchaseInvoice(id).then(response => {
        this.detailForm.infoList=response.data
        this.detail = true;
        this.title = "供应商发票详情";
      });
      getPurchaseInfo(id).then(response => {
        this.purchaseInfo=response.data
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            var arr = this.form.infoList
            var endList = arr[arr.length-1]
            endList.purchaseInfoId=this.purchaseInfoId
            updatePurchaseInvoice(endList).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.edit = false;
                this.getList();
              }
            });
        }
      });
    },
    // 提交审核
    submitExamine(status){
      this.$refs["examineForm"].validate(valid => {
        if (valid) {
            var arr = this.examineForm.infoList
            console.log(arr)
            var endList = arr[arr.length-1]
            var params={
              invoiceId:endList.id,
              status:status,
              remarks:endList.operatorRemarks,
            }
            toExamine(params).then(response => {
              if (response.code === 200) {
                this.msgSuccess("审核成功");
                this.examine = false;
                this.getList();
              }
            });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.purchaseInfoId;
      this.$confirm('是否确认作废采购开票申请?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPurchaseInvoice(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
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
      const extension2 = fileName=== 'pdf'
      const extension3 = fileName=== 'jpg'
      if(!extension && !extension2 && !extension3) {
        this.$message({
            message: '上传文件只能是 pdf、png、jpg格式!',
            type: 'warning'
        });
        return false
      }
    },
    // 超出文件个数
    handleExceed(files, fileList){
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    // 删除文件
    handleRemove(file, fileList){
      var endInfo=this.form.infoList[this.form.infoList.length-1]
      endInfo.invoiceFile = 0;
      this.form.fileUrl=null
    },
    //保存项目安装要求文件
    invoiceHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.invoiceFormData = formdata;
    },
    //文件上传
    invoiceRequestUpload(file,fileList){
      const that = this;
      //项目安装要求
      uploadFile(this.invoiceFormData).then(res => {
        if(res.data){
          var endInfo=that.form.infoList[that.form.infoList.length-1]
          endInfo.invoiceFile = res.data.fileId;
        }
      });
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
