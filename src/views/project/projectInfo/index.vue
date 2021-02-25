<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" >
      <el-form-item label="项目编号" prop="projectNumber">
        <el-input
          v-model="queryParams.projectNumber"
          placeholder="请输入项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划开始日期" prop="planStartTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.planStartTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择计划开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计划结束日期" prop="planEndTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.planEndTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择计划结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择项目状态" style="width:200px;">
            <el-option
              v-for="dict in statusOptions"
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['project:projectInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExports"
          v-hasPermi="['project:projectInfo:exports']"
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

    <el-table v-loading="loading" :data="projectInfoList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="项目编号" align="center" prop="projectNumber" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="项目金额/元" align="center" prop="budgetMoney" />
      <el-table-column label="计划开始日期" align="center" prop="planStartTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planStartTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束日期" align="center" prop="planEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目成本(预估)/元" align="center" prop="projectCostPredict" />
      <el-table-column label="是否开票" align="center" prop="invoiceValue" />
      <el-table-column label="项目状态" align="center" prop="statusValue"  />
      <el-table-column label="审核节点" align="center" prop="nodeName"  />
      <el-table-column label="是否已作废" align="center" prop="delFlagValue"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.delFlag == 0">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.examineStatus == 'ed00' && scope.row.banUpdate == 0 || scope.row.examineStatus == 'ex01' && scope.row.banUpdate == 0"
            v-hasPermi="['project:projectInfo:edit']"
          >修改</el-button>
          <el-dropdown>
              <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                   <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.row)"
                      v-hasPermi="['project:projectInfo:remove']"
                    >作废</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-show="scope.row.statusValue=='待验收'">
                   <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-document-checked"
                      @click="handleChecked(scope.row)"
                      v-hasPermi="['project:projectInfo:accept']"
                    >验收</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                   <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-document"
                      @click="handleDetail(scope.row)"
                      v-hasPermi="['project:projectInfo:detail']"
                    >详情</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                   <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-download"
                      @click="handleExport(scope.row)"
                      v-hasPermi="['project:projectInfo:export']"
                    >导出项目立项单</el-button>
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

    <!-- 添加或修改项目信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
      <!-- 详情框 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="155px" v-if="this.title=='项目信息详情'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input :disabled="true" v-model="form.projectName" maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerId">
              <el-select :disabled="true" v-model="form.customerId" filterable style="width:100%;">
                <el-option
                  v-for="dict in customerData"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户联系人" prop="linkMan">
              <el-input :disabled="true" v-model="form.linkMan" maxlength="30" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户联系电话" prop="linkPhone">
              <el-input :disabled="true" v-model="form.linkPhone" :maxlength="11" show-word-limit clearable
                :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预算金额/元" prop="budgetMoney">
              <el-input type="number" :disabled="true" :max="999999999.99"  v-model="form.budgetMoney" style="width:100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始时间" prop="planStartTime" >
              <el-date-picker clearable size="small" :disabled="true"
                v-model="form.planStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:100%">
              </el-date-picker>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计划结束时间" prop="planEndTime">
              <el-date-picker clearable size="small" :disabled="true"
                v-model="form.planEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目负责人" prop="delegateMan">
              <el-input :disabled="true" v-model="form.delegateMan" maxlength="30" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目成本(预估)/元" prop="projectCostPredict">
              <el-input type="number" :disabled="true" v-model="form.projectCostPredict" style="width:100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅材成本(预估)/元" prop="consumablesCostPredict">
              <el-input :disabled="true" type="number" v-model="form.consumablesCostPredict" style="width:100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目成本(实际)" prop="projectCostActual">
              <el-input :disabled="true" v-model="form.projectCostActual"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耗材成本(实际)" prop="consumablesCostActual">
              <el-input :disabled="true" v-model="form.consumablesCostActual"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主要事项分工" prop="workList">
          <template>
            <div v-for="(item,index) in form.workList" class="tab detail">
              <div class="worklist">
                <el-form-item label="姓名" label-width="95px" prop="name">
                  <el-input :disabled="true" type="text" v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="工作内容" label-width="95px" prop="workContent">
                  <el-input :disabled="true" type="textarea" v-model="item.workContent" :rows="5" maxlength="500"></el-input>
                </el-form-item>
                <el-form-item label="完成日期段" label-width="95px" prop="completeTime">
                   <el-date-picker :disabled="true"
                    v-model="item.completeTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" label-width="95px" prop="remarks">
                  <el-input :disabled="true" type="type" v-model="item.remarks"></el-input>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="项目简要说明" prop="brief">
          <el-input :disabled="true" v-model="form.brief" :rows="5"  type="textarea" maxlength="500" show-word-limit/>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目安装要求" prop="installAsk">
              <el-link v-if="form.installAskUrl==null" type="primary" disabled target="_blank">暂无</el-link>
              <el-link v-else :href="form.installAskUrl" type="primary" target="_blank">项目安装要求</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目预计投入货物清单" prop="goodsInventory">
              <el-link v-if="form.goodsInventoryUrl==null" type="primary" disabled target="_blank">暂无</el-link>
              <el-link v-else :href="form.goodsInventoryUrl" type="primary" target="_blank">项目预计投入货物清单</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同双方盖章">
              <el-select :disabled="true" v-model="form.seal" style="width:100%;">
                <el-option
                  v-for="dict in sealOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同副本" prop="copy">
              <el-link v-if="form.copyUrl==null" type="primary" disabled target="_blank">暂无</el-link>
              <el-link v-else :href="form.copyUrl" type="primary" target="_blank">合同副本</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="立项人员" prop="nickName">
              <el-input :disabled="true" v-model="form.nickName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input :disabled="true" v-model="form.remarks" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 审批进程 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item>
              <el-steps :active="1" :space="300" v-for="(item,index) in history">
                <el-step :title="item.nodeName">
                  <template slot="description">
                    <div><span>审批结果:</span><span> {{item.status}}</span></div>
                    <p>审批时间: {{item.updateTime}}</p>
                    <p>审批人: {{item.operatorName}}</p>
                    <p>审批备注: {{item.remarks}}</p>
                  </template>
                </el-step>
              </el-steps>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 验收流程 -->
        <el-row :gutter="20" v-show="this.bl==true">
          <div style="margin-left:40px;">
            <h3>验收流程</h3>
            <el-steps direction="vertical" :active="0">
              <el-step title="项目中标通知书" :status="acceptInfo.noticeUrl==null ? 'wait' : 'success'">
                <template slot="description">
                  <el-link v-if="acceptInfo.noticeUrl==null" type="primary" disabled target="_blank">暂无</el-link>
                  <el-link v-else :href="acceptInfo.noticeUrl" type="primary" target="_blank">中标通知书</el-link>
                </template>
              </el-step>
              <el-step title="合同验收" :status="acceptInfo.contractUrl==null ? 'wait' :'success'">
                <template slot="description">
                  <el-link v-if="acceptInfo.contractUrl==null" type="primary" disabled target="_blank">暂无</el-link>
                  <el-link v-else :href="acceptInfo.contractUrl" type="primary" target="_blank">合同文件</el-link>
                </template>
              </el-step>
              <el-step title="使用手册" :status="acceptInfo.manualUrl==null ? 'wait' :'success'">
                <template slot="description">
                  <el-link v-if="acceptInfo.manualUrl==null" type="primary" disabled target="_blank">暂无</el-link>
                  <el-link v-else :href="acceptInfo.manualUrl" type="primary" target="_blank">合同文件</el-link>
                </template>
              </el-step>
              <el-step title="现场验收" :status="acceptInfo.sceneListUrl==null ? 'wait' :'success'">
                <template slot="description">
                  <template v-if="acceptInfo.sceneListUrl==null">
                    <el-link disabled type="primary" target="_blank">暂无</el-link>
                  </template>
                  <template v-else>
                    <el-link v-for="(item,index) in acceptInfo.sceneListUrl" :href="item.contractUrl" type="primary" target="_blank">图片{{index+1}} </el-link>
                  </template>
                </template>
              </el-step>
              <el-step title="客户验收单" :status="acceptInfo.billListUrl==null ? 'wait' :'success'">
                <template slot="description">
                  <template v-if="acceptInfo.billListUrl==null">
                    <el-link disabled type="primary" target="_blank">暂无</el-link>
                  </template>
                  <template v-else>
                    <el-link v-for="(item,index) in acceptInfo.billListUrl" :href="item.contractUrl" type="primary" target="_blank">图片{{index+1}} </el-link>
                  </template>
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-row>
      </el-form>

      <!-- 添加修改框 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="155px" v-else>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form.projectName" placeholder="请输入项目名称" maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerId">
              <!-- <el-input v-model="form.customerId" placeholder="请输入客户名称" /> -->
              <el-select v-model="form.customerId" filterable  placeholder="请选择客户名称" style="width:100%;">
                <el-option
                  v-for="dict in customerData"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户联系人" prop="linkMan">
              <el-input v-model="form.linkMan" placeholder="请输入客户联系人" maxlength="10" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户联系电话" prop="linkPhone">
              <el-input v-model="form.linkPhone" placeholder="请输入客户联系电话" :maxlength="11" show-word-limit clearable
                prefix-icon='el-icon-mobile' :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预算金额/元" prop="budgetMoney">
              <el-input type="number" :max="999999999.99" @input="budgetMoneyHandleInput" v-model="form.budgetMoney" placeholder="请输入预算金额" style="width:100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始时间" prop="planStartTime" >
              <el-date-picker clearable size="small" 
                v-model="form.planStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择计划开始时间" @change ="checkTime" style="width:100%">
              </el-date-picker>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计划结束时间" prop="planEndTime">
              <el-date-picker clearable size="small" 
                v-model="form.planEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择计划结束时间" @change ="checkTime" style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目负责人" prop="delegateMan">
              <el-input v-model="form.delegateMan" placeholder="请输入项目负责人" maxlength="30" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目成本(预估)/元" prop="projectCostPredict">
              <el-input type="number"  @input="projectCostPredictHandleInput" v-model="form.projectCostPredict" placeholder="请输入项目成本(预估)" style="width:100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅材成本(预估)/元" prop="consumablesCostPredict">
              <el-input  type="number" @input="handleInput" v-model="form.consumablesCostPredict" placeholder="请输入耗材成本(预估)" style="width:100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="主要事项分工" prop="workList">
          <template>
            <div v-for="(item,index) in form.workList" class="tab">
              <div class="worklist">
                <el-form-item label="姓名" label-width="95px" prop="name">
                  <el-input type="text" v-model="item.name" maxlength="10" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="工作内容" label-width="95px" prop="workContent">
                  <el-input type="textarea" v-model="item.workContent" :rows="5" maxlength="500"></el-input>
                </el-form-item>
                <el-form-item label="完成日期段" label-width="95px" prop="completeTime">
                   <el-date-picker
                    v-model="item.completeTime"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" label-width="95px" prop="remarks">
                  <el-input type="type" v-model="item.remarks"></el-input>
                </el-form-item>
              </div>
              <div>
                <i class="el-icon-delete form-icon baseIcon" @click.prevent="removeLine(item)" v-show="index!=0"></i>
              </div>
            </div>
            <div class="handleButton">
              <el-button @click="addLine">增加事项分工表</el-button>
            </div>
          </template>
        </el-form-item>

        <el-form-item label="项目简要说明" prop="brief">
          <el-input v-model="form.brief" :rows="5"  type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit/>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目安装要求" prop="installAsk">
              <el-upload :limit="1" :on-exceed="handleExceed" accept=".doc,.docx,.xlsx,xls" :on-change="askHandleChange" :http-request="askRequestUpload"  :file-list="askFileList"  action="#"
                :before-upload="beforeUpload1" :on-remove="handleRemove1">
                <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
              </el-upload>
              <el-input v-model="form.installAsk"  placeholder="请输入内容" disabled v-show="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目预计投入货物清单" accept=".doc,.docx,.xlsx,xls" prop="goodsInventory">
              <el-upload :limit="1" :on-exceed="handleExceed" :on-change="inventoryHandleChange" :http-request="inventoryRequestUpload"  :file-list="inventoryFileList"  action="#"
                :before-upload="beforeUpload1" :on-remove="handleRemove2">
                <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
              </el-upload>
              <el-input v-model="form.goodsInventory"  placeholder="请输入内容" disabled v-show="false" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同双方盖章">
              <el-select v-model="form.seal" placeholder="请选择合同双方盖章" style="width:100%;">
                <el-option
                  v-for="dict in sealOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同副本" prop="copy">
              <el-upload :limit="1" :on-exceed="handleExceed" accept=".doc,.docx,.pdf" :on-change="copyHandleChange" :http-request="copyRequestUpload"  :file-list="copyFileList"  action="#"
                :before-upload="beforeUpload2" :on-remove="handleRemove3">
                <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
              </el-upload>
              <el-input v-model="form.copy"  placeholder="请输入内容" disabled v-show="false" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" :rows="5"  type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="this.title!='项目信息详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 项目验收 -->
    <el-dialog :title="title" :visible.sync="check" width="850px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="155px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input :disabled="true" v-model="form.projectName" maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerId">
              <el-select :disabled="true" v-model="form.customerId" filterable style="width:100%;">
                <el-option
                  v-for="dict in customerData"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户联系人" prop="linkMan">
              <el-input :disabled="true" v-model="form.linkMan" maxlength="30" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户联系电话" prop="linkPhone">
              <el-input :disabled="true" v-model="form.linkPhone" :maxlength="11" show-word-limit clearable
                :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预算金额/元" prop="budgetMoney">
              <el-input type="number" :disabled="true" :max="999999999.99"  v-model="form.budgetMoney" style="width:100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始时间" prop="planStartTime" >
              <el-date-picker clearable size="small" :disabled="true"
                v-model="form.planStartTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:100%">
              </el-date-picker>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计划结束时间" prop="planEndTime">
              <el-date-picker clearable size="small" :disabled="true"
                v-model="form.planEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目负责人" prop="delegateMan">
              <el-input :disabled="true" v-model="form.delegateMan" maxlength="30" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目成本(预估)/元" prop="projectCostPredict">
              <el-input type="number" :disabled="true" v-model="form.projectCostPredict" style="width:100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耗材成本(预估)/元" prop="consumablesCostPredict">
              <el-input :disabled="true" type="number" v-model="form.consumablesCostPredict" style="width:100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目成本(实际)" prop="projectCostActual">
              <el-input :disabled="true" v-model="form.projectCostActual"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅材成本(实际)" prop="consumablesCostActual">
              <el-input :disabled="true" v-model="form.consumablesCostActual"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主要事项分工" prop="workList">
          <template>
            <div v-for="(item,index) in form.workList" class="tab detail">
              <div class="worklist">
                <el-form-item label="姓名" label-width="95px" prop="name">
                  <el-input :disabled="true" type="text" v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="工作内容" label-width="95px" prop="workContent">
                  <el-input :disabled="true" type="textarea" v-model="item.workContent" :rows="5" maxlength="500"></el-input>
                </el-form-item>
                <el-form-item label="完成日期段" label-width="95px" prop="completeTime">
                   <el-date-picker :disabled="true"
                    v-model="item.completeTime"
                    type="date"
                    placeholder="">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" label-width="95px" prop="remarks">
                  <el-input :disabled="true" type="type" v-model="item.remarks"></el-input>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="项目简要说明" prop="brief">
          <el-input :disabled="true" v-model="form.brief" :rows="5"  type="textarea" maxlength="500" show-word-limit/>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目安装要求" prop="installAsk">
              <el-link v-if="form.installAskUrl==null" type="primary" disabled target="_blank">暂无</el-link>
              <el-link v-else :href="form.installAskUrl" type="primary" target="_blank">项目安装要求</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目预计投入货物清单" prop="goodsInventory">
              <el-link v-if="form.goodsInventoryUrl==null" type="primary" disabled target="_blank">暂无</el-link>
              <el-link v-else :href="form.goodsInventoryUrl" type="primary" target="_blank">项目预计投入货物清单</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同双方盖章">
              <el-select :disabled="true" v-model="form.seal" style="width:100%;">
                <el-option
                  v-for="dict in sealOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同副本" prop="copy">
              <el-link v-if="form.copyUrl==null" type="primary" disabled target="_blank">暂无</el-link>
              <el-link v-else :href="form.copyUrl" type="primary" target="_blank">合同副本</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="立项人员" prop="nickName">
              <el-input :disabled="true" v-model="form.nickName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input :disabled="true" v-model="form.remarks"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="验收结果" prop="result">
              <el-select v-model="acceptInfo.result" placeholder="请选择验收结果" style="width:200px;">
                <el-option
                  v-for="dict in acceptStatusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="acceptInfo.remarks" maxlength="500"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <div style="margin-left:40px;">
            <h3>验收流程</h3>
            <el-steps direction="vertical" :active="0">
              <el-step title="项目中标通知书" :status="acceptInfo.notice==null ? 'wait' : 'success'">
                <template slot="description">
                  <el-form-item label="中标通知书" prop="notice">
                    <el-upload :limit="1" :on-exceed="handleExceed" accept=".doc,.docx,.xlsx,.xls" :on-change="noticeHandleChange" :http-request="noticeRequestUpload" :file-list="noticeFileList"  action="#"
                      :before-upload="beforeUpload1" :on-remove="handleRemove4">
                      <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                    </el-upload>
                    <el-input v-model="acceptInfo.notice"  placeholder="请输入内容" disabled v-show="false" />
                  </el-form-item>
                </template>
              </el-step>
              <el-step title="合同验收" :status="acceptInfo.acceptContract==null ? 'wait' : 'success'">
                <template slot="description">
                  <el-form-item label="合同文件" prop="acceptContract">
                    <el-upload :limit="1" :on-exceed="handleExceed" accept=".doc,.docx,.pdf" :on-change="contractHandleChange" :http-request="contractRequestUpload" :file-list="contractFileList" action="#"
                      :before-upload="beforeUpload2" :on-remove="handleRemove5">
                      <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                    </el-upload>
                    <el-input v-model="acceptInfo.acceptContract"  placeholder="请输入内容" disabled v-show="false" />
                  </el-form-item>
                </template>
              </el-step>
              <el-step title="使用手册" :status="acceptInfo.manual==null ? 'wait' : 'success'">
                <template slot="description">
                  <el-form-item label="使用手册" prop="manual">
                    <el-upload :limit="1" :on-exceed="handleExceed" accept=".doc,.docx,.xlsx,.xls" :on-change="manualHandleChange" :http-request="manualRequestUpload" :file-list="manualFileList" action="#"
                      :before-upload="beforeUpload1" :on-remove="handleRemove6">
                      <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                    </el-upload>
                    <el-input v-model="acceptInfo.manual" placeholder="请输入内容" disabled v-show="false" />
                  </el-form-item>
                </template>
              </el-step>
              <el-step title="现场验收" :status="acceptInfo.acceptScene==null ? 'wait' : 'success'">
                <template slot="description">
                  <el-form-item label="现场图片" prop="acceptScene">
                    <el-upload :limit="5" :on-exceed="handleExceeds" accept=".png,.pdf,.jpg" :on-change="sceneHandleChange" :http-request="sceneRequestUpload" :file-list="sceneFileList" action="#"
                      :before-upload="beforeUpload3" :on-remove="handleRemove7">
                      <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                    </el-upload>
                    <el-input v-model="acceptInfo.acceptScene" placeholder="请输入内容" disabled v-show="false" />
                  </el-form-item>
                </template>
              </el-step>
              <el-step title="客户验收单" :status="acceptInfo.acceptBill==null ? 'wait' : 'success'">
                <template slot="description">
                  <el-form-item label="验收单图片" prop="acceptBill">
                    <el-upload :limit="5" :on-exceed="handleExceeds" accept=".png,.pdf,.jpg" :on-change="billHandleChange" :http-request="billRequestUpload" :file-list="billFileList" action="#"
                      :before-upload="beforeUpload3" :on-remove="handleRemove8">
                      <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                    </el-upload>
                    <el-input v-model="acceptInfo.acceptBill" placeholder="请输入内容" disabled v-show="false" />
                  </el-form-item>
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAccept">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listProjectInfo, getProjectInfo, delProjectInfo, addProjectInfo, updateProjectInfo, exportProjectInfo, uploadFile, getCustomerAll, exportInfo, getProcessHistory, exportsInfo, conserveAcceptInfo, getAcceptInfo} from "@/api/project/projectInfo";

export default {
  name: "ProjectInfo",
  data() {
    return {
      baseIcon:null,
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
      // 项目信息表格数据
      projectInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      check:false,
      // 合同双方盖章字典
      sealOptions: [],
      // 是否开票字典
      invoiceOptions: [],
      // 项目状态字典
      statusOptions: [],
      // 审核状态字典
      examineStatusOptions: [],
      // 删除状态字典
      delStatusOptions: [],
      // 验收结果字典
      acceptStatusOptions:[],
      //安装要求文件列表
      askFileList: [],
      askFormData: [],
      //项目预计投入货物清单
      inventoryFileList: [],
      inventoryFormData: [],
      //合同副本
      copyFileList:[],
      copyFormData: [],

      // 项目中标通知书
      noticeFileList:[],
      noticeFormData:[],
      // 合同验收
      contractFileList:[],
      contractFormData:[],
      // 使用手册
      manualFileList:[],
      manualFileList:[],
      // 现场验收
      sceneFileList:[],
      sceneFormData:[],
      // 客户验收单
      billFileList:[],
      billFormData:[],
      // 客户信息
      customerData: [],
      uploadUrl: '/common/shiYue/upload',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectNumber: null,
        projectName: null,
        planStartTime: null,
        planEndTime: null,
        status: null,
      },
      // 表单参数
      form: {},
      acceptInfo:{},
      // 历史节点数据
      history:[],
      // 表单校验
      rules: {
        projectNumber: [
         
        ],
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        customerId: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        linkMan: [
          { required: true, message: "客户联系人不能为空", trigger: "blur" }
        ],
        linkPhone: [
          { required: true, message: "客户联系电话不能为空", trigger: "blur" }
        ],
        budgetMoney: [
          { required: true, message: "预算金额不能为空", trigger: "blur" },
          {pattern:/^[1-9]{1,1}\d{0,8}(\.\d{1,2})?$/,message: '最大不能超过999999999.99',trigger: 'blur'}
        ],
        planStartTime: [
          { required: true, message: "计划开始日期不能为空", trigger: "blur" }
        ],
        planEndTime: [
          { required: true, message: "计划结束日期不能为空", trigger: "blur" }
        ],
        delegateMan: [
          { required: true, message: "项目负责人不能为空", trigger: "blur" }
        ],
        projectCostPredict: [
          { required: true, message: "项目成本(预估)不能为空", trigger: "blur" },
          {pattern:/^[1-9]{1,1}\d{0,8}(\.\d{1,2})?$/,message: '最大不能超过999999999.99',trigger: 'blur'}
        ],
        consumablesCostPredict: [
          // { required: true, message: "耗材成本(预估)不能为空", trigger: "blur" },
          {pattern:/^[0-9]{1,1}\d{0,8}(\.\d{1,2})?$/,message: '最大不能超过999999999.99',trigger: 'blur'}
        ],
        seal: [
          { required: true, message: "合同双方盖章不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "项目状态不能为空", trigger: "blur" }
        ],
        examineStatus: [
          { required: true, message: "审核状态不能为空", trigger: "blur" }
        ],
      },
      // 判断是否存在项目验收信息
      bl:false,
      aa:true
    };
  },
  created() {
    this.getList();
    this.getDicts("seal_dist").then(response => {
      this.sealOptions = response.data;
    });
    this.getDicts("invoice_dist").then(response => {
      this.invoiceOptions = response.data;
    });
    this.getDicts("project_dist").then(response => {
      this.statusOptions = response.data;
    });
    
    this.getDicts("accept_dist").then(response => {
      this.acceptStatusOptions = response.data;
    });
    //删除状态
    this.getDicts("del_dist").then(response => {
      this.delStatusOptions = response.data;
    });
    this.getCustomer();
  },
  methods: {
    // 查询客户信息
    getCustomer(){
      getCustomerAll().then(res =>{
        if(res.data){
            this.customerData = res.data;
        }
      })

    },
    //预算金额只能输入两位小数
    budgetMoneyHandleInput(value) {
      if(value != '') {
          if(value.indexOf('.') > -1) {
                  this.form.budgetMoney = value.slice(0, value.indexOf('.') + 3)
          }else{ 
                  this.form.budgetMoney = value
          }
      }
    },
    //项目成本只能输入两位小数
    projectCostPredictHandleInput(value) {
      if(value != '') {
          if(value.indexOf('.') > -1) {
                  this.form.projectCostPredict = value.slice(0, value.indexOf('.') + 3)
          }else{ 
                  this.form.projectCostPredict = value
          }
      }
    },
    //耗材成本只能输入两位小数
    handleInput(value) {
      if(value != '') {
          if(value.indexOf('.') > -1) {
                  this.form.consumablesCostPredict = value.slice(0, value.indexOf('.') + 3)
          }else{ 
                  this.form.consumablesCostPredict = value
          }
      }
    },
    /** 查询项目信息列表 */
    getList() {
      this.loading = true;
      listProjectInfo(this.queryParams).then(response => {
        this.projectInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.check=false
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        projectNumber: null,
        projectName: null,
        customerId: null,
        linkMan: null,
        linkPhone: null,
        budgetMoney: null,
        planStartTime: null,
        planEndTime: null,
        delegateMan: null,
        projectCostPredict: null,
        consumablesCostPredict: null,
        projectCostActual: null,
        consumablesCostActual: null,
        brief: null,
        installAsk: 0,
        installAskUrl:null,
        goodsInventoryUrl:null,
        goodsInventory: 0,
        seal: null,
        copy: 0,
        copyUrl:null,
        invoice: null,
        status: null,
        examineStatus: null,
        delFlag: null,
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        acceptStatus: null,
        workList:[{
          name: null,
          completeTime: null,
          workContent: null,
          remarks: null,
        }],
      };
      this.acceptInfo={
        notice:0,
        acceptContract:0,
        manual:0,
        acceptScene:0,
        acceptBill:0,
        result:null,
        remarks:null
      }
      // 重置文件上传文档
      this.askFileList=[],
      this.inventoryFileList=[],
      this.copyFileList=[],
      this.noticeFileList=[];
      this.contractFileList=[];
      this.manualFileList=[];
      this.sceneFileList=[];
      this.billFileList=[];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams ={
        pageNum: 1,
        pageSize: 10,
        projectNumber: null,
        projectName: null,
        planStartTime: null,
        planEndTime: null,
        status: null,
      };
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
      this.title = "添加项目信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getProjectInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目信息";
        let vm = this;
        // 项目安装要求
        if(response.data.installAskUrl){ //后台返回的文件链接
          let a = (response.data.installAskUrl).split(',');  
            if(a.length > 0) {
              a.forEach(item => {
                var obj = {} 
                  let index = item.lastIndexOf('\/');
                  let fileName  = item.substring(index + 1, item.length); //最后的文件名截取出来
                  vm.$set(obj,'name',fileName);
                  vm.$set(obj,'url',item);  //修改files里面的结构（name,url）
                  vm.askFileList.push(obj);
              })
            }
        }
        // 项目预计投入货物清单
        if(response.data.goodsInventoryUrl){
          let a = (response.data.goodsInventoryUrl).split(',');  
            if(a.length > 0) {
              a.forEach(item => {
                var obj = {} 
                  let index = item.lastIndexOf('\/');
                  let fileName  = item.substring(index + 1, item.length);
                  vm.$set(obj,'name',fileName);
                  vm.$set(obj,'url',item); 
                  vm.inventoryFileList.push(obj);
              })
            }
        }
        // 项目预计投入货物清单
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
     /** 详情按钮操作 */
    handleDetail(row) {
      this.reset();
      const id = row.id || this.ids
      getProjectInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "项目信息详情";
      });
      // 项目审核进度
      const params={
        exampleId:row.exampleId
      }
      if(params.exampleId==null){
      }else{
        getProcessHistory(params).then(response => {
          this.history = response.data;
          this.open = true;
          this.title = "项目信息详情";
        });
      }
      // 项目验收进度
      const param={
        projectId:row.id
      }
      if(param.projectId==null){
      }else{
        getAcceptInfo(param).then(response => {
          if(response.data){
            this.acceptInfo = response.data;
            this.bl=true
          }else{
            this.bl=false
          }
        });
      }
    },
    // 项目验收按钮操作
    handleChecked(row){
      this.reset();
      const id = row.id || this.ids
      getProjectInfo(id).then(response => {
        this.form = response.data;
        this.check = true;
        this.title = "项目验收-编辑";
      });
      const params={
        projectId:row.id
      }
      if(params.projectId==null){
      }else{
        getAcceptInfo(params).then(response => {
          if(response.data){
            this.acceptInfo = response.data;
            let vm = this;
            // 中标通知书
            if(response.data.noticeUrl){ 
              let a = (response.data.noticeUrl).split(',');  
                if(a.length > 0) {
                  a.forEach(item => {
                    var obj = {} 
                      let index = item.lastIndexOf('\/');
                      let fileName  = item.substring(index + 1, item.length); 
                      vm.$set(obj,'name',fileName);
                      vm.$set(obj,'url',item);
                      vm.noticeFileList.push(obj);
                  })
                }
            }
            // 合同验收
            if(response.data.contractUrl){ //后台返回的文件链接
              let a = (response.data.contractUrl).split(',');  
                if(a.length > 0) {
                  a.forEach(item => {
                    var obj = {} 
                      let index = item.lastIndexOf('\/');
                      let fileName  = item.substring(index + 1, item.length); //最后的文件名截取出来
                      vm.$set(obj,'name',fileName);
                      vm.$set(obj,'url',item);  //修改files里面的结构（name,url）
                      vm.contractFileList.push(obj);
                  })
                }
            }
            // 使用手册
            if(response.data.manualUrl){
              let a = (response.data.manualUrl).split(',');  
                if(a.length > 0) {
                  a.forEach(item => {
                    var obj = {} 
                      let index = item.lastIndexOf('\/');
                      let fileName  = item.substring(index + 1, item.length);
                      vm.$set(obj,'name',fileName);
                      vm.$set(obj,'url',item); 
                      vm.manualFileList.push(obj);
                  })
                }
            }
            // 现场验收
            if(response.data.sceneListUrl){
              let a = response.data.sceneListUrl
                if(a.length > 0) {
                  a.forEach(item => {
                    var obj = {} 
                      let index = item.contractUrl.lastIndexOf('\/');
                      let fileName  = item.contractUrl.substring(index + 1, item.contractUrl.length);
                      vm.$set(obj,'name',fileName);
                      vm.$set(obj,'url',item.contractUrl); 
                      vm.sceneFileList.push(obj);
                  })
                }
            }
            // 客户验收单
            if(response.data.billListUrl){
              let a = response.data.billListUrl
                if(a.length > 0) {
                  a.forEach(item => {
                    var obj = {} 
                      let index = item.contractUrl.lastIndexOf('\/');
                      let fileName  = item.contractUrl.substring(index + 1, item.length);
                      vm.$set(obj,'name',fileName);
                      vm.$set(obj,'url',item.contractUrl);  
                      vm.billFileList.push(obj);
                  })
                }
            }
          }
          this.check = true;
        });
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateProjectInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addProjectInfo(this.form).then(response => {
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
      this.$confirm('是否确认作废项目?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProjectInfo(id);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExports() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出项目信息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportsInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    /** 导出项目立项单 */
    handleExport(row){
      //window.open('http://localhost:8080/emp/project/projectInfo/export/infoWord?id=' + row.id)
      exportInfo({"id": row.id}).then(res =>{
        if(res){
            const blob = res;
            const fileName = row.projectName + "项目立项单.doc";
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
    //上传之前检验文件
    beforeUpload1(file){
      var fileSize = file.size / 1024 / 1024;
      if(fileSize > 10){
         this.$message.error('文件不能超过10MB');
         return false;
      }
      let fileName=file.name.substring(file.name.lastIndexOf('.')+1)
      const extension = fileName === 'xls'
      const extension2 = fileName=== 'xlsx'
      const extension3 = fileName=== 'docx'
      const extension4 = fileName=== 'doc'
      if(!extension && !extension2 && !extension3&& !extension4) {
        this.$message({
            message: '上传文件只能是 xls、xlsx、doc、docx格式!',
            type: 'warning'
        });
        return false
      }
    },
    beforeUpload2(file){
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
    beforeUpload3(file){
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
     // 删除文件事件
    handleRemove1(file, fileList){
      this.form.installAsk= 0;
      this.form.installAskUrl=null
    },
    handleRemove2(file, fileList){
      this.form.goodsInventory= 0;
      this.form.goodsInventoryUrl=null
    },
    handleRemove3(file, fileList){
      this.form.copy= 0;
      this.form.copyUrl=null
    },
    handleRemove4(file, fileList){
      this.acceptInfo.notice= 0;
      this.acceptInfo.noticeUrl=null
    },
    handleRemove5(file, fileList){
      this.acceptInfo.acceptContract= 0;
      this.acceptInfo.contractUrl=null
    },
    handleRemove6(file, fileList){
      this.acceptInfo.manual= 0;
      this.acceptInfo.manualUrl=null
    },
    handleRemove7(file, fileList){
      this.acceptInfo.acceptScene= 0;
      this.acceptInfo.sceneListUrl=null
    },
    handleRemove8(file, fileList){
      this.acceptInfo.acceptBill= 0;
      this.acceptInfo.billListUrl=null
    },
    // 超出文件个数
    handleExceed(files, fileList){
      this.$message.warning(`当前限制单个文件上传，请先删除原文件再上传`);
    },
     // 超出文件个数
    handleExceeds(files, fileList){
      this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //保存项目安装要求文件
    askHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.askFormData = formdata;
    },
    //文件上传
    askRequestUpload(file,fileList){
        const that = this;
        //项目安装要求
        uploadFile(this.askFormData).then(res => {
          if(res.data){
              that.form.installAsk = res.data.fileId;
          }
        });
    },
    // 保存项目预计投入货物清单文件
    inventoryHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.inventoryFormData = formdata;
    },
    //货物清单文件上传
    inventoryRequestUpload(file,fileList){
        const that = this;
        //项目安装要求
        uploadFile(this.inventoryFormData).then(res => {
          if(res.data){
              that.form.goodsInventory = res.data.fileId;
          }
        });
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

    // 项目中标通知书
    noticeHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.noticeFormData = formdata;
    },
    noticeRequestUpload(file,fileList){
      const that = this;
      //项目安装要求
      uploadFile(this.noticeFormData).then(res => {
        if(res.data){
          that.acceptInfo.notice = res.data.fileId;
        }
      });
    },
     // 合同验收
    contractHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.contractFormData = formdata;
    },
    contractRequestUpload(file,fileList){
        const that = this;
        //项目安装要求
        uploadFile(this.contractFormData).then(res => {
          if(res.data){
              that.acceptInfo.acceptContract = res.data.fileId;
          }
        });
    },
     // 使用手册
    manualHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.manualFormData = formdata;
    },
    manualRequestUpload(file,fileList){
        const that = this;
        //项目安装要求
        uploadFile(this.manualFormData).then(res => {
          if(res.data){
              that.acceptInfo.manual = res.data.fileId;
          }
        });
    },
     // 现场验收
    sceneHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.sceneFormData = formdata;
    },
    sceneRequestUpload(file,fileList){
        const that = this;
        //项目安装要求
        uploadFile(this.sceneFormData).then(res => {
          if(res.data){
              that.acceptInfo.acceptScene = res.data.fileId;
          }
        });
    },
     // 客户验收单
    billHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.billFormData = formdata;
    },
    billRequestUpload(file,fileList){
        const that = this;
        uploadFile(this.billFormData).then(res => {
          if(res.data){
              that.acceptInfo.acceptBill = res.data.fileId;
          }
        });
    },
    // 保存验收信息
    submitAccept(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.acceptInfo.projectId=this.form.id
            conserveAcceptInfo(this.acceptInfo).then(response => {
              if (response.code === 200) {
                this.msgSuccess("验收成功");
                this.check = false;
                this.getList();
              }
            });
          } else {
            
          }
        }
      });
    },
    //验证计划结束日期不能小于开始日期
    checkTime(){
      if(this.form.planStartTime === null || this.form.planStartTime === ""){
        this.$message.warning('请选择计划开始日期');
         return false;
      }
      //只要选择计划结束日期才会触发
      if(this.form.planEndTime != null && this.form.planEndTime != ""){
        const startTime = new Date(this.form.planStartTime) ;
        const endTime = new Date(this.form.planEndTime);
        if(endTime.getTime() < startTime.getTime()){
          this.$message.warning('计划结束日期不能小于计划开始日期');
          this.form.planStartTime = "";
          this.form.planEndTime = "";
          return false;
        }else{
          return true;
        }
      }
      
    },
    //添加项目分工列表	
    addLine(){
      this.form.workList.push({});
      // let vue = this;
      // var baseIcon =() => import('../../util/baseIcon.vue');
      // return vue.baseIcon =baseIcon;
    },
    removeLine(item){
      var index = this.form.workList.indexOf(item)
        if (index !== -1) {
          this.form.workList.splice(index, 1)
        }
    },
  }
};
</script>
<style>
  .el-dropdown-link{
    color: #409EFF;
    font-size: 12px;
    margin-left: 4px
  }
  .worklist .el-form-item__content{
      padding: 2px 4px 2px 4px;
      border-left: 1px solid #DCDFE6;
  }
  .worklist input,.worklist textarea{
      border:none
  }
  .worklist{
    border: 1px solid #DCDFE6;
    margin-top: 10px;
    width: 90%;
  }
  .worklist .el-form-item{
    border-bottom: 1px solid #DCDFE6;
  }
  .worklist .el-form-item:last-child{
    border-bottom: none
  }
  .form-icon{
    font-size: 20px;
    margin-right: 2px;
    line-height: 34px;
  }
  .handleIcon{
    text-align: right;
  }
  .tab{
    display: flex;
    align-items: center
  }
  .tab .el-icon-delete{
    margin-left: 10px;
  }
  .handleButton{
    text-align: center;
    margin-top: 10px
  }
  .detail .worklist{
    background: #F5F7FA
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
</style>

