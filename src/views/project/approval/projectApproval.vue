<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" >
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
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

    <el-table v-loading="loading" :data="projectApprovalList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="项目编号" align="center" prop="projectNumber" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="当前节点" align="center" prop="nodeName"  />
      <el-table-column label="申请人" align="center" prop="nickName"  />
      <el-table-column label="申请时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="approval(scope.row)"
            v-hasPermi="['approval:project:approval']"
          >审核</el-button>
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

    <!-- 审批项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
      <!-- 审核 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="155px">
        <!-- 详情 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input :disabled="true" v-model="form.projectName" maxlength="30" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerId">
              <!-- <el-input v-model="form.customerId" placeholder="请输入客户名称" /> -->
              <el-input :disabled="true" v-model="form.customerName"/>
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
                prefix-icon='el-icon-mobile' :style="{width: '100%'}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预算金额/元" prop="budgetMoney">
              <el-input type="number" :disabled="true" :max="999999999.99" v-model="form.budgetMoney" style="width:100%;"/>
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
              <div v-for="(item,index) in askFileList">
                <span>{{item.name}}</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目预计投入货物清单" prop="goodsInventory">
              <div v-for="(item,index) in inventoryFileList">
                <span>{{item.name}}</span>
              </div>
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
              <div v-for="(item,index) in copyFileList">
                <span>{{item.name}}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remarks">
          <el-input :disabled="true" v-model="form.remarks" :rows="5"  type="textarea" maxlength="500" show-word-limit/>
        </el-form-item>
        <!-- 审批进程 -->
        <el-row :gutter="20">
          <el-col >
            <el-form-item>
                <el-steps :active="activeSize"   direction="vertical">
                  <div v-for="(item,index) in history" >
                    <el-step :title="item.nodeName" v-if="item.status === '已完成' || item.status === '已驳回' ">
                      <template slot="description" >
                        <div><span>审批结果:</span><span> {{item.status}}</span></div>
                        <p>审批时间: {{item.updateTime}}</p>
                        <p>审批人: {{item.operatorName}}</p>
                        <p>审批备注: {{item.remarks}}</p>
                      </template>
                    </el-step>
                  </div>
                </el-steps>
              
              
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 审核 -->
        <el-form-item label="审核结果" prop="status">
          <el-select v-model="approvalform.status" placeholder="请选择审核结果" style="width:100%;">
            <el-option
              v-for="dict in approvalStatusData"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="approvalform.remarks" :rows="5"  type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit/>
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
import {listProject, projectApproval, getProjectInfo, getProcessHistory} from "@/api/project/projectApproval";
export default {
  name: "ProjectApproval",
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
      // 审核结果数组
      approvalStatusData: [],
      // 列表数据
      projectApprovalList:[],
      
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      
      uploadUrl: '/common/shiYue/upload',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectNumber: null,
        projectName: null,
       
      },
      // 表单参数
      form: {
      },
      //审核表单参数
      approvalform:{
        projectId: null,
        status: null,
        remarks: null,
      },
      // 表单校验
      rules: {
        status:[
           { required: true, message: "审核结果不能为空", trigger: "blur" }
        ]
        
      },
      //安装要求文件列表
      askFileList: [],
      //项目预计投入货物清单
      inventoryFileList: [],
      //合同副本
      copyFileList:[],
      // 合同双方盖章字典
      sealOptions: [],
      // 历史节点数据
      history:[],
      activeSize: 0,
    };
  },
  created() {
    this.getList();
    // 查询审核结果字典项
    this.getDicts("examine_dist").then(response => {
      this.approvalStatusData = response.data;
    });
    this.getDicts("seal_dist").then(response => {
      this.sealOptions = response.data;
    });
  },
  methods: {
    /** 查询项目信息列表 */
    getList() {
      this.loading = true;
      listProject(this.queryParams).then(response => {
        this.projectApprovalList = response.rows;
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
        projectId: null,
        status: null,
        remarks: null,
      };
      this.askFileList=[];
      this.inventoryFileList=[];
      this.copyFileList=[];
      this.approvalform ={
        projectId: null,
        status: null,
        remarks: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /**打开审核页面 */
    approval(row){
      this.approvalform.projectId = row.id;
      const id = row.id || this.ids
      getProjectInfo(id).then(response => {
        this.form = response.data;
        let vm = this;
        // 项目安装要求
        if(response.data.installAskUrl){
          let a = (response.data.installAskUrl).split(',');  
            if(a.length > 0) {
              a.forEach(item => {
                var obj = {} 
                  let index = item.lastIndexOf('\/');
                  let fileName  = item.substring(index + 1, item.length);
                  vm.$set(obj,'name',fileName);
                  vm.$set(obj,'url',item);
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
        this.open = true;
        this.title = "项目审核";
      });
      const params={
        exampleId:row.exampleId
      }
      if(params.exampleId==null){
      }else{
        getProcessHistory(params).then(response => {
          this.history = response.data;
          this.activeSize = response.data.length;
          this.open = true;
          this.title = "项目审核";
        });
      }
    },
    /** 审核项目 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if(this.approvalform.status === 'ed02'){
            if(this.approvalform.remarks === undefined || this.approvalform.remarks === null || this.approvalform.remarks === ''){
              this.msgError('请填写备注');
              return false;
            }
          }
         
          projectApproval(this.approvalform).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.cancel();
              this.getList();
            }
          });
        }
      })
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
  .worklist{
    background: #F5F7FA
  }
  .worklist input,.worklist textarea{
      border:none
  }
  .worklist{
    border: 1px solid #DCDFE6;
    margin-top: 10px;
    width: 100%;
  }
  .worklist .el-form-item{
    border-bottom: 1px solid #DCDFE6;
  }
  .worklist .el-form-item:last-child{
    border-bottom: none
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
</style>

