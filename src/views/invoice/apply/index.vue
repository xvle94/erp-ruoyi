<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <!-- <el-form-item label="开票申请类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择开票申请类型" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->

      <el-form-item label="所属项目" prop="projectId">
        <el-select v-model="queryParams.projectId" filterable placeholder="请选择所属项目">
          <el-option
            v-for="item in projectData"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
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

      <el-form-item label="开票日期" prop="returnTime">
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
      <el-form-item label="项目状态" prop="planEndTime">
          <el-select v-model="queryParams.projectStatus" placeholder="请选择项目状态" style="width:200px;">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
      </el-form-item> 

      <el-form-item label="所属客户" prop="customerId">
        <el-select  v-model="queryParams.customerId" placeholder="请选择所属客户" filterable style="width:100%;">
          <el-option
            v-for="dict in customerData"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开票状态" prop="type">
        <el-select v-model="queryParams.invoiceValue" placeholder="请选择开票状态" clearable size="small">
          <el-option
            v-for="dict in invoiceStatusOptions"
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
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['invoice:invoiceApply:export']"
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
      <div>项目总金额: 
        {{budgetMoney}}元
      </div>
      <div>已开票金额: 
        {{returnMoney}}元
      </div>
      <div>未开票金额: 
        {{nowReturnMoney}}元
      </div>
      <div>已回款金额: 
        {{invoiceMoney}}元
      </div>
      <div>未回款金额: 
        {{nowInvoiceMoney}}元
      </div>
    </div>

    <el-table v-loading="loading" :data="invoiceApplyList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <!-- <el-table-column label="开票申请类型" align="center" prop="type" /> -->
      <el-table-column label="项目编号" align="center" prop="projectNumber" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <!-- <el-table-column label="所属订单" align="center" prop="orderId" /> -->
      <el-table-column label="所属客户" align="center" prop="customerName" />
      <el-table-column label="申请开票金额/元" align="center" prop="invoiceMoney" />
      <el-table-column label="已开票总金额/元" align="center" prop="invoiceAgreeMoney" />
      <el-table-column label="开票日期" align="center" prop="invoiceTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.invoiceTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目状态" align="center" prop="projectStatus" />
      <el-table-column label="审核状态" align="center" prop="statusValue"  />
     
      <el-table-column label="开票状态" align="center" prop="invoiceValue" />
      <el-table-column label="是否已作废" align="center" prop="delFlagValue" />
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.delFlag == 0">
          <el-button
            v-show="scope.row.statusValue=='待审核'||scope.row.statusValue=='未通过'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,1)"
            v-hasPermi="['invoice:apply:examine']"
          >审核</el-button>
          <el-button
           v-show="scope.row.invoiceValue!='全部开票'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,2)"
            v-hasPermi="['invoice:invoiceApply:edit']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['invoice:invoiceApply:remove']"
          >作废</el-button>
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

    <!-- 添加或修改开票申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <!-- 编辑开票 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-if="this.title=='开票申请编辑'">
        <template v-for="(item,index) in form.applyList"> 
          <div :class="item.status=='e02' ? 'green' : item.status=='e03' ? 'red' : 'gray'">
            <h3>第{{index+1}}次开票</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属客户">
                  <el-select v-model="item.customerId" :disabled="item.status=='e02' ? true : false" filterable style="width:100%;">
                    <el-option
                      v-for="dict in customerData"
                      :key="dict.id"
                      :label="dict.name"
                      :value="dict.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开票日期" :prop="'applyList.' + index + '.invoiceTime'" :rules="rules.invoiceTime">
                  <el-date-picker clearable style="width:100%" :disabled="item.status=='e02' ? true : false"
                    :picker-options="pickerBeginDataAfter"
                    v-model="item.invoiceTime"
                    type="date"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="发票类型" :prop="'applyList.' + index + '.invoiceType'" :rules="rules.invoiceType">
                  <el-select v-model="item.invoiceType" :disabled="item.status=='e02' ? true : false" style="width:100%;">
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
                <el-form-item label="开票状态" :prop="'applyList.' + index + '.invoice'" :rules="rules.invoice">
                  <el-select v-model="item.invoice" :disabled="item.status=='e02' ? true : false" style="width:100%;">
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
                <el-form-item label="开票总金额" :prop="'applyList.' + index + '.invoiceMoney'" :rules="rules.invoiceMoney">
                  <el-input v-model="item.invoiceMoney" :disabled="item.status=='e02' ? true : false"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开票数量" :prop="'applyList.' + index + '.invoiceCount'" :rules="rules.invoiceCount">
                  <el-input v-model="item.invoiceCount" :disabled="item.status=='e02' ? true : false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="开票内容" :prop="'applyList.' + index + '.invoiceContent'" :rules="rules.invoiceContent">
                  <el-input v-model="item.invoiceContent" :disabled="item.status=='e02' ? true : false"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-if="item.remarks==null" v-model="item.remarks" type="text" :disabled="item.status=='e02' ? true : false"/>
                  <el-input v-else WarningColor='warning' v-model="item.remarks" type="text" :disabled="item.status=='e02' ? true : false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="提交人员" :class="item.status=='e02'?'':'hidden'">
                  <el-input  v-model="item.createName" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>

            <template v-if="item.status=='e02' || item.status=='e03'">
              <h3>审核状态</h3>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="审核状态" prop="status">
                      <el-select v-model="item.status" filterable style="width:100%" :disabled="true">
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
                    <el-form-item label="备注">
                      <el-input v-model="item.operatorRemarks" :disabled="true"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="审核人员" prop="operatorName">
                      <el-input v-model="item.operatorName" :disabled="true"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="审核日期" prop="operatorTime">
                      <el-input v-model="item.operatorTime" :disabled="true"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 发票信息 -->
                <template v-for="(invoiceItem,indexs) in item.infoList" v-show="item.infoList!=null"> 
                  <h3>第{{index+1}}次发票</h3>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="发票日期">
                        <el-date-picker clearable style="width:100%"
                        :disabled="true"
                          v-model="invoiceItem.invoiceTime"
                          type="date"
                          value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="发票编号">
                        <el-input v-model="invoiceItem.invoiceNumber" :disabled="true"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="发票类型">
                        <el-select v-model="invoiceItem.invoiceType" :disabled="true" style="width:100%;">
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
                      <el-form-item label="登记日期" prop="createTime">
                        <el-date-picker clearable style="width:100%"
                          :disabled="true"
                          v-model="invoiceItem.createTime"
                          type="date"
                          value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="开票金额">
                        <el-input v-model="invoiceItem.invoiceMoney" :disabled="true"/>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="开发票人员" prop="createName">
                        <el-input v-model="invoiceItem.createName" :disabled="true"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
            </template>
          </div> 
        </template>
      </el-form>

      <!-- 编辑发票 审核开票 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-else>
        <template v-for="(item,index) in form.applyList"> 
          <div :class="item.status=='e02' ? 'green' : item.status=='e03' ? 'red' : 'gray'">
            <h3>第{{index+1}}次开票</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属客户">
                  <el-select v-model="item.customerId" :disabled="true" filterable style="width:100%;">
                  <el-option
                    v-for="dict in customerData"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id"
                  ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开票日期" :prop="'applyList.' + index + '.invoiceTime'" :rules="rules.invoiceTime">
                  <el-date-picker clearable style="width:100%" :disabled="true"
                    v-model="item.invoiceTime"
                    type="date"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="发票类型" :prop="'applyList.' + index + '.invoiceType'" :rules="rules.invoiceType">
                  <el-select v-model="item.invoiceType" :disabled="true" style="width:100%;">
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
                <el-form-item label="开票状态" :prop="'applyList.' + index + '.invoice'" :rules="rules.invoice">
                  <el-select v-model="item.invoice" :disabled="true" style="width:100%;">
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
                <el-form-item label="开票总金额" :prop="'applyList.' + index + '.invoiceMoney'" :rules="rules.invoiceMoney">
                  <el-input v-model="item.invoiceMoney" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="开票数量" prop="invoiceCount">
                  <el-input v-model="item.invoiceCount" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="开票内容" :prop="'applyList.' + index + '.invoiceContent'" :rules="rules.invoiceContent">
                  <el-input v-model="item.invoiceContent" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remarks">
                  <el-input v-if="item.remarks==null" v-model="item.remarks" type="text" :disabled="true"/>
                  <el-input v-else WarningColor='warning' v-model="item.remarks" type="text" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="提交人员">
                  <el-input  v-model="item.createName" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <h3>审核状态</h3>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核状态" :prop="'applyList.' + index + '.status'" :rules="rules.status">
                  <el-select v-model="item.status" filterable style="width:100%" :disabled="status[index]=='e02' ? true : false">
                    <el-option
                      v-for="dict in examineStatus"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="item.status=='e03'">
                <el-form-item label="备注" :prop="'applyList.' + index + '.operatorRemarks'" :rules="rules.operatorRemarks">
                  <el-input v-model="item.operatorRemarks" :disabled="status[index]=='e02' ? true : false"/>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-else>
                <el-form-item label="备注">
                  <el-input v-model="item.operatorRemarks" :disabled="status[index]=='e02' ? true : false"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="审核人员" prop="operatorName" v-show="status[index]=='e02'">
                  <el-input v-model="item.operatorName" :disabled="true"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="审核日期" prop="operatorTime" v-show="status[index]=='e02'">
                  <el-input v-model="item.operatorTime" :disabled="true"/>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 发票编辑 -->
            <template v-if="status[index]=='e02'">
              <template v-for="(invoiceItem,index) in item.infoList"> 
                <h3>发票编辑</h3>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="发票日期">
                      <el-date-picker clearable style="width:100%"
                        :disabled="true"
                        v-model="invoiceItem.invoiceTime"
                        type="date"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="发票编号">
                      <el-input v-model="invoiceItem.invoiceNumber" :disabled="true"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="发票类型">
                      <el-select v-model="invoiceItem.invoiceType" :disabled="true" style="width:100%;">
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
                    <el-form-item label="登记日期" prop="createTime">
                      <el-date-picker clearable style="width:100%"
                        :disabled="true"
                        v-model="invoiceItem.createTime"
                        type="date"
                        value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="开票金额">
                      <el-input v-model="invoiceItem.invoiceMoney" :disabled="true"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="开发票人员" prop="createName">
                      <el-input v-model="invoiceItem.createName" :disabled="true"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </template>
            <template v-else-if="item.status == 'e02'">
              <template v-for="(invoiceItem,index2) in item.infoList"> 
                <h3>发票编辑</h3>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="发票日期" :prop="'applyList.' + index +'.infoList.'+ index2 + '.invoiceTime'" :rules="rules.invoiceTime">
                      <el-date-picker clearable style="width:100%"
                        :picker-options="pickerBeginDateBefore"
                        v-model="invoiceItem.invoiceTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择发票日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="发票编号" :prop="'applyList.' + index +'.infoList.'+ index2 + '.invoiceNumber'" :rules="rules.invoiceNumber">
                      <el-input v-model="invoiceItem.invoiceNumber" placeholder="请输入发票编号"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="发票类型" :prop="'applyList.' + index +'.infoList.'+ index2 + '.invoiceType'" :rules="rules.invoiceType">
                      <el-select v-model="invoiceItem.invoiceType" style="width:100%;" placeholder="请选择发票类型">
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
                    <el-form-item label="开票金额" :prop="'applyList.' + index +'.infoList.'+ index2 + '.invoiceMoney'" :rules="rules.invoiceMoney">
                      <el-input v-model="invoiceItem.invoiceMoney" placeholder="请输入开票金额"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
            </template>
          </div> 
        </template>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInvoiceApply, getInvoiceApply, delInvoiceApply, addInvoiceApply, updateInvoiceApply, exportInvoiceApply, projectAll, customerAll, updateExamine, queryProjectMoney} from "@/api/invoice/invoiceApply";

export default {
  name: "InvoiceApply",
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
      // 开票申请表格数据
      invoiceApplyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 发票类型字典
      invoiceTypeOptions: [],
      // 开票类型字典
      typeOptions: [],
      // 开票状态字典
      invoiceStatusOptions: [
      ],
      // 项目状态
      statusOptions: [],
      //项目下拉
      projectData: [],
      //客户下拉
      customerData: [],
      // 日期范围
      dateRange: [],
      // 审核状态字典
      examineStatus: [
        {"dictType":"examine","dictValue": "e01", "dictLabel": "待审核"},
        {"dictType":"examine","dictValue": "e02", "dictLabel": "已通过"},
        {"dictType":"examine","dictValue": "e03", "dictLabel": "未通过"},
      ],
      status:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        customerId: null,
        invoiceTime: null,
        invoiceType: null,
        type: null,
        status: null,
        orderId: null,
        invoice: null,
        projectStatus: null,
        invoiceValue: null,
        invoiceNumber: null,
      },
      // 表单参数
      form: {},
      budgetMoney: 0,
      returnMoney: 0,
      nowReturnMoney: 0,
      invoiceMoney: 0,
      nowInvoiceMoney: 0,
      // 表单校验
      rules: {
        invoiceNumber:[
           { required: true, message: "发票编号不能为空", trigger: "blur" },
           { pattern:/^(\d{8})+(,\d{8}){0,4}$/, message: "发票号码仅限8位数字,限最多5个发票号码", trigger: "blur"}
        ],
        customerId: [
          { required: true, message: "所属客户不能为空", trigger: "blur" }
        ],
        invoiceTime: [
          { required: true, message: "开票日期不能为空", trigger: "blur" }
        ],
        invoiceType: [
          { required: true, message: "发票类型不能为空", trigger: "blur" }
        ],
        invoice: [
          { required: true, message: "开票状态不能为空", trigger: "blur" }
        ],
        invoiceMoney: [
          { required: true, message: "开票总金额不能为空", trigger: "blur" },
          { pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "仅限小数点前9位数，后2位数", trigger: "blur" }
        ],
        invoiceContent: [
          { required: true, message: "开票内容不能为空", trigger: "blur" }
        ],
        operatorRemarks:[
          { required: true, message: "审核状态不通过时备注不能为空", trigger: "blur" }
        ],
        invoiceCount:[
          { pattern:/^[1-5]{1}?$/, message: "限最多5个发票号码", trigger: "blur" }
        ]
      },
       // 禁用当前之前日期
      pickerBeginDataAfter:{
        disabledDate(time) {
          return time.getTime() < Date.now()-8.64e7;
        }
      },
       // 禁用当前之后日期
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("invoice_type").then(response => {
      this.invoiceTypeOptions = response.data;
    });
    this.getDicts("contract_type").then(response => {
      this.typeOptions = response.data;
    });
    
    this.getDicts("invoice_dist").then(response => {
      this.invoiceStatusOptions = response.data;
    });
    this.getDicts("project_dist").then(response => {
      this.statusOptions = response.data;
    });
    //查询全部客户信息
    this.getCustomerAll();
    //查询项目下拉框
    this.getProjectInfo();
    //查询项目总金额、已开票金额、已回款金额
    this.getQueryProjectMoney();
  },
  methods: {
    /** 查询开票申请列表 */
    getList() {
      this.loading = true;
      listInvoiceApply(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.invoiceApplyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 发票类型字典翻译
    invoiceTypeFormat(row, column) {
      return this.selectDictLabel(this.invoiceTypeOptions, row.invoiceType);
    },
    // 开票类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 审核状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        applyList:[{
          id: null,
          createBy: null,
          createName: null,
          createTime: null,
          customerId: null,
          delFlag: null,
          infoList: [{}],
          invoiceContent: null,
          invoice: "0",
          invoiceCount: null,
          invoiceMoney: "0",
          invoiceTime: null,
          invoiceTime: null,
          invoiceValue: null,
          operatorId: null,
          status:null,
          statusValue:null,
          operatorName: null,
          operatorRemarks: null,
          operatorTime: null,
          projectId: null,
          projectStatus: null,
          type:null
        }],
        customerId: null,
        id: null,
        invoiceMoney: null,
        invoiceTime: null,
        operatorRemarks: null,
        orderId: null,
        projectId: null,
        purchaseId: null,
        status: null,
        supplierId: null,
        type: null,
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
        projectId: null,
        customerId: null,
        invoiceTime: null,
        invoiceType: null,
        type: null,
        status: null,
        orderId: null,
        invoice: null,
        projectStatus: null,
        invoiceValue: null,
        invoiceNumber: null,
      },
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
      this.title = "添加开票申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row,type){
      this.reset();
      const param = {
        projectId:row.projectId
      }
      if(type==1){
        // 审核
        getInvoiceApply(param).then(response => {
          this.form = response.data;
          for(var k in this.form.applyList){
            if(this.form.applyList[k].infoList==null){
              this.form.applyList[k].infoList=[{}];
            }else{
            }
          }
          if(this.form.applyList==null){
          }else{
            // 取审核状态
            this.status=this.form.applyList.map(v=>v.status);
            this.open = true;
            this.title = "发票编辑";
          }
        });
      }else{
        // 编辑
        getInvoiceApply(param).then(response => {
          // this.form = response.data;
          if(response.data.applyList==null){
            this.form=response.data
            this.form.applyList=[{}]
          }else{
            // 取开票最后一条数据
            var endInfo=response.data.applyList[response.data.applyList.length-1]
            console.log(endInfo)
            if(endInfo.status=='e02'){
              this.form=response.data
              this.form.applyList.push({});
            }else{
              this.form=response.data
            }
          }
          this.open = true;
          this.title = "开票申请编辑";
        });
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title == '开票申请编辑') {
            updateInvoiceApply(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("编辑成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            updateExamine(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("审核成功");
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
      const projectId = row.projectId;
      this.$confirm('是否作废该项目开票?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInvoiceApply(projectId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有开票申请数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInvoiceApply(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //项目信息下拉框
    getProjectInfo(){
      projectAll().then(response=>{
        this.projectData=response.data;
      })
    },
    //客户信息下拉框
    getCustomerAll(){
      customerAll().then(response=>{
        this.customerData=response.data;
      })
    },
    getQueryProjectMoney(){
      queryProjectMoney().then(res=>{
        if(res.data != null && res.data != ''){
          this.budgetMoney = res.data.budgetMoney;
          this.returnMoney =  res.data.returnMoney;
          this.nowReturnMoney = res.data.nowReturnMoney;
          this.invoiceMoney =  res.data.invoiceMoney;
          this.nowInvoiceMoney =  res.data.nowInvoiceMoney;
        }
      })
    }
    
  }
};
</script>
<style>
  .is-disabled .el-input__suffix{
    display: none;
  }
  .hidden{
    display: none;
  }
  .green{
    border: 1px solid #67C23A;
    padding: 0 10px;
    margin-bottom: 10px
  }
  .gray{
    border: 1px solid #DCDFE6;
    padding: 0 10px;
    margin-bottom: 10px
  }
  .red{
    border: 1px solid #F56C6C;
    padding: 0 10px;
    margin-bottom: 10px
  }
  .el-input.is-disabled .el-input__inner[WarningColor="warning"]{
    background-color:#E6A23C;
    color: #fff;
    border-color: #E6A23C;
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

