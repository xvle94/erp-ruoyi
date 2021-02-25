<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属项目" prop="projectId">
        <!-- <el-input
          v-model="queryParams.projectId"
          placeholder="请输入所属项目"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
        <el-select v-model="queryParams.projectId" filterable placeholder="请选择所属项目">
            <el-option
              v-for="item in projectData"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            ></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="回款日期" prop="returnTime">
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
      <el-form-item label="回款状态" prop="planEndTime">
          <el-select v-model="queryParams.returnStatus" placeholder="请选择回款状态" style="width:200px;">
            <el-option
              v-for="dict in returnData"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
      </el-form-item>  
      <el-form-item label="项目状态" prop="planEndTime">
          <el-select v-model="queryParams.status" placeholder="请选择项目状态" style="width:200px;">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
      </el-form-item>  
      <el-form-item label="回款金额" prop="returnMoney">
        <el-input
          v-model="queryParams.beginReturnMoney"
          placeholder="请输入回款金额"
          clearable
          size="small" 
          style="width:46%"/>
          至
          <el-input
          v-model="queryParams.endReturnMoney"
          placeholder="请输入回款金额"
          clearable
          size="small" style="width:46%"/>
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
          v-hasPermi="['project:projectReturn:export']"
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

    <el-table v-loading="loading" :data="projectReturnList"  highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="所属项目" align="center" prop="projectName" />
      
      <el-table-column label="预算金额/元" align="center" prop="budgetMoney" />
      <el-table-column label="项目成本(实际)/元" align="center" prop="projectCostActual" />
      <el-table-column label="项目状态" align="center" prop="status" />
      <el-table-column label="累计回款金额/元" align="center" prop="returnMoney" />
      <el-table-column label="最后回款日期" align="center" prop="lastReturnTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastReturnTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回款状态" align="center" prop="returnStatus" />
      
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row,1)"
            v-hasPermi="['project:projectReturn:add']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleUpdate(scope.row,2)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:projectReturn:remove']"
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

    <!-- 添加或修改项目回款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="125px">
        <!-- 项目信息详情 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input :disabled="true" v-model="projectInfo.projectName" maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerId">
              <el-input :disabled="true" v-model="projectInfo.customerName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户联系人" prop="linkMan">
              <el-input :disabled="true" v-model="projectInfo.linkMan" maxlength="30" show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户联系电话" prop="linkPhone">
              <el-input :disabled="true" v-model="projectInfo.linkPhone" show-word-limit clearable
                :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预算金额/元" prop="budgetMoney">
              <el-input type="number" :disabled="true" v-model="projectInfo.budgetMoney" style="width:100%;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始时间" prop="planStartTime" >
              <el-date-picker clearable size="small" :disabled="true"
                v-model="projectInfo.planStartTime"
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
                v-model="projectInfo.planEndTime"
                type="date"
                value-format="yyyy-MM-dd"
                style="width:100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目负责人" prop="delegateMan">
              <el-input :disabled="true" v-model="projectInfo.delegateMan" maxlength="30" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目成本(预估)/元" prop="projectCostPredict">
              <el-input type="number" :disabled="true" v-model="projectInfo.projectCostPredict" style="width:100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耗材成本(预估)/元" prop="consumablesCostPredict">
              <el-input :disabled="true" type="number" v-model="projectInfo.consumablesCostPredict" style="width:100%;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目成本(实际)" prop="projectCostActual">
              <el-input :disabled="true" v-model="projectInfo.projectCostActual"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="耗材成本(实际)" prop="consumablesCostActual">
              <el-input :disabled="true" v-model="projectInfo.consumablesCostActual"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主要事项分工" prop="workList">
          <template>
            <div v-for="(item,index) in projectInfo.workList" class="tab detail">
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
          <el-input :disabled="true" v-model="projectInfo.brief" :rows="5"  type="textarea" maxlength="500" show-word-limit/>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目安装要求" prop="installAsk">
              <el-link v-if="projectInfo.installAskUrl==null" type="primary" disabled target="_blank">暂无</el-link>
              <el-link v-else :href="projectInfo.installAskUrl" type="primary" target="_blank">项目安装要求</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目预计投入货物清单" prop="goodsInventory">
              <el-link v-if="projectInfo.goodsInventoryUrl==null" disabled type="primary" target="_blank">暂无</el-link>
              <el-link  v-else :href="projectInfo.goodsInventoryUrl" type="primary" target="_blank">项目预计投入货物清单</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="合同双方盖章">
              <el-select :disabled="true" v-model="projectInfo.seal" style="width:100%;" placeholder="/">
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
              <el-link v-if="projectInfo.copyUrl==null" disabled type="primary" target="_blank">暂无</el-link>
              <el-link v-else :href="projectInfo.copyUrl" type="primary" target="_blank">合同副本</el-link>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remarks">
          <el-input :disabled="true" v-model="projectInfo.remarks" :rows="5"  type="textarea" maxlength="500" show-word-limit/>
        </el-form-item>

        <div class="returnDiv" v-if="this.title=='修改项目回款'">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="回款状态" prop="returnStatus" >
                <el-select v-model="form.returnStatus" placeholder="请选择回款状态" style="width:100%;">
                  <el-option
                    v-for="dict in returnData"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
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
                      <el-input v-model="item.returnMoney" placeholder="请输入回款金额" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="回款日期" :prop="'returnInfo.' + index + '.returnTime'" :rules="rules.returnTime">
                      <el-date-picker clearable size="small" style="width:100%"
                      v-model="item.returnTime"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择回款日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="收款银行" :prop="'returnInfo.' + index + '.collectBank'" :rules="rules.collectBank">
                      <el-select v-model="item.collectBank" placeholder="请选择收款银行" style="width:100%;">
                        <el-option
                          v-for="dict in bankOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="dict.dictValue"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="发票号码" :prop="'returnInfo.' + index + '.invoiceNumber'" :rules="rules.invoiceNumber">
                      <el-input v-model="item.invoiceNumber" placeholder="请输入发票号码" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="备注" prop="remarks">
                      <el-input v-model="item.remarks" type="textarea" placeholder="请输入内容" />
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
        <!-- 回款详情 -->
        <div v-else>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="回款状态" prop="returnStatus" >
                <el-select v-model="form.returnStatus" :disabled="true" style="width:100%;">
                  <el-option
                    v-for="dict in returnData"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  ></el-option>
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
                      <el-input v-model="item.returnMoney" :disabled="true"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="回款日期" :prop="'returnInfo.' + index + '.returnTime'" :rules="rules.returnTime">
                      <el-date-picker clearable size="small" style="width:100%" :disabled="true"
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
                      <el-select v-model="item.collectBank" placeholder="/" :disabled="true" style="width:100%;">
                        <el-option
                          v-for="dict in bankOptions"
                          :key="dict.dictValue"
                          :label="dict.dictLabel"
                          :value="dict.dictValue"
                        ></el-option>
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
          </el-form-item>
        </div> 
        <!-- 回款金额 -->
        <template>
          <label>已回款金额：</label>
          <label v-if="returnMoneySum<projectInfo.budgetMoney&&returnMoneySum!=0" class="f-danger">{{returnMoneySum}}</label>
          <label v-else-if="returnMoneySum>projectInfo.budgetMoney||returnMoneySum==projectInfo.budgetMoney" class="f-success">{{returnMoneySum}}</label>
          <label v-else="returnMoneySum==0">{{returnMoneySum}}</label>
          <label>   待回款金额：</label>
          <label v-if="projectInfo.budgetMoney-returnMoneySum<projectInfo.budgetMoney||projectInfo.budgetMoney-returnMoneySum==projectInfo.budgetMoney" class="f-danger">{{projectInfo.budgetMoney-returnMoneySum}}</label>
          <label v-else-if="projectInfo.budgetMoney-returnMoneySum>projectInfo.budgetMoney&&returnMoneySum!=0" class="f-success">{{projectInfo.budgetMoney-returnMoneySum}}</label>
          <label v-else="projectInfo.budgetMoney-returnMoneySum==0">{{projectInfo.budgetMoney-returnMoneySum}}</label>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="this.title=='修改项目回款'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProjectReturn, getProjectReturn, delProjectReturn, addProjectReturn, updateProjectReturn, exportProjectReturn, projectAll, getProjectInfo} from "@/api/project/projectReturn";

export default {
  name: "ProjectReturn",
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
      // 项目回款表格数据
      projectReturnList: [],
      // 项目状态字典
      statusOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        returnMoney: null,
        returnStatus: null,
        status: null,
        beginReturnMoney: null,
        endReturnMoney: null
      },
      
      // 表单参数
      form: {},
      // 项目信息详情
      projectInfo:{},
      // 表单校验
      rules: {
        invoiceNumber:[
          { pattern:/^(\d{8})$/, message: "发票号码仅限8位数字", trigger: "blur"}
        ],
        returnStatus: [
          { required: true, message: "回款状态不能为空", trigger: "blur" }
        ],
        returnMoney:[
          { required: true, message: "回款金额不能为空", trigger: "blur" }
        ],
        returnTime:[
          { required: true, message: "回款日期不能为空", trigger: "blur" }
        ],
        collectBank:[
          { required: true, message: "收款银行不能为空", trigger: "blur" }
        ]
      },
      // 日期范围
      dateRange: [],
      // 项目下拉框
      projectData: [],
      // 项目回款
      returnData: [],
      //安装要求文件列表
      askFileList: [],
      //项目预计投入货物清单
      inventoryFileList: [],
      //合同副本
      copyFileList:[],
      // 合同双方盖章字典
      sealOptions: [],
      // 收款银行
      bankOptions:[],
      // 已回款金额总和
      returnMoneySum:0
    };
  },
  created() {
    this.getList();
    // 项目状态
    this.getDicts("project_dist").then(response => {
      this.statusOptions = response.data;
    });
    // 项目回款
    this.getDicts("return_money").then(response => {
      this.returnData = response.data;
    });
    // 项目下拉框
    this.getProjectInfo();
    // 合同双方盖章字典
    this.getDicts("seal_dist").then(response => {
      this.sealOptions = response.data;
    });
    // 收款银行
    this.getDicts("mark_bank").then(response =>{
      this.bankOptions=response.data
    })
  },
  methods: {
    /** 查询项目回款列表 */
    getList() {
      this.loading = true;
      listProjectReturn(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.projectReturnList = response.rows;
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
        projectId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        
        delFlag: null,
        returnInfo:[{
          returnMoney: null,
          returnTime: null,
          collectBank: null,
          invoiceNumber:null,
          remarks: null,
        }]
      };
      this.askFileList=[];
      this.inventoryFileList=[];
      this.copyFileList=[];
      this.returnMoneySum=0;
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
        returnMoney: null,
        returnStatus: null,
        status: null,
        beginReturnMoney: null,
        endReturnMoney: null
      }
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleUpdate(row,modelType) {
      this.reset();
      const param = {
        projectId:row.id || this.ids
      }
      // 查询回款明细
      getProjectReturn(param).then(response => {
        this.form = response.data;
        const list=response.data.returnInfo
        for(var k in list){
          this.returnMoneySum+=list[k].returnMoney
        }
        if(this.form.returnInfo==null&&modelType==1){
          this.form.returnInfo=[{
          returnMoney: '',
          returnTime: '',
          collectBank: '',
          invoiceNumber:'',
          remarks:'',
          }]
        }
      });
      // 查询项目信息详情
      const projectId = row.id
      if(projectId==null){
        console.log("projectId为空")
      }else{
        getProjectInfo(projectId).then(response => {
          this.projectInfo = response.data;
          this.open = true;
        });
      }
      if(modelType==1){
          this.title = "修改项目回款";
      }else{
        this.title = "项目回款详情";
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            updateProjectReturn(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("操作成功");
                this.open = false;
                this.getList();
              }
            });
        }
      });
    },
    //项目信息下拉框
    getProjectInfo(){
      projectAll().then(response=>{
        this.projectData=response.data;
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const param = {
        'projectId':row.id
      }
      this.$confirm('是否作废该项目回款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProjectReturn(param);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出项目回款?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportProjectReturn(queryParams);
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

  
  }
};
</script>
<style>
  .worklist .el-form-item__content{
      padding: 2px 4px 2px 4px;
      border-left: 1px solid #DCDFE6;
  }
  .worklist textarea,.worklist input{
      border:none
  }
  .worklist{
    border: 1px solid #DCDFE6;
    margin-top: 10px;
    width: 90%;
  }
  .worklist .el-form-item{
    border-bottom: 1px solid #DCDFE6;
    margin-bottom: 0px;
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
  .worklist .el-form-item__error {
    position: absolute;
    top: 31%;
    left: 72%;
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
