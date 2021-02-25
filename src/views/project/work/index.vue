<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属项目" prop="projectId">
        <el-select v-model="queryParams.projectId" filterable placeholder="请选择所属项目" clearable size="small">
          <el-option
            v-for="item in projectData"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="汇报人" >
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入汇报人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="汇报日期">
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
      <el-form-item label="汇报标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入汇报标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审批状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择审批状态" clearable size="small">
          <el-option  v-for="dict in approvalStatusData"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目状态" prop="projectStatus">
        <el-select v-model="queryParams.projectStatus" placeholder="请选择项目状态" clearable size="small">
            <el-option
            v-for="dict in projectStatusOption"
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
          v-hasPermi="['project:work:add']"
        >新增</el-button>
      </el-col>
      
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:work:export']"
        >导出</el-button>
      </el-col> -->
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="workList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="所属项目" align="center" width="200" >
        <template slot-scope="scope">
        <el-popover width="120" trigger="hover" placement="top">
          <p>{{ scope.row.projectName }}</p>
          <div slot="reference"  style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
            <span >{{ scope.row.projectName }}</span>
          </div>
        </el-popover>
      </template>
      </el-table-column>
     
      <el-table-column
        label="今日完成内容"
        width="300" >
        <template slot-scope="scope">
          <el-popover width="120" trigger="hover" placement="top">
            <p>{{ scope.row.contentDay }}</p>
            <div slot="reference"  style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
              <span >{{ scope.row.contentDay }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="汇报人员" align="center" prop="createBy" />
      <el-table-column label="审批状态" align="center" prop="status" />
      <el-table-column label="项目状态" align="center" prop="projectStatus"/>
      <el-table-column label="汇报日期" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            v-hasPermi="['project:work:detail']"
            >详情</el-button>
          <el-dropdown  v-show="scope.row.projectStatus !='已验收'">
              <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                   <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['project:work:remove']"
                  >作废</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-show="scope.row.status!='已批阅'">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-document-checked"
                      @click="handleApproval(scope.row)"
                      v-hasPermi="['project:work:examine']"
                    >审批</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                    <el-button
                      v-show="scope.row.status!='已批阅'"
                      size="mini"
                      type="text"
                      icon="el-icon-edit"
                      @click="handleUpdate(scope.row)"
                      v-hasPermi="['project:work:edit']"
                    >编辑</el-button>
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

    <!-- 添加或修改项目进展对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="115px" v-if="this.title=='项目进展详情'">
        <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="form.projectId" filterable :disabled="true" style="width:100%">
            <el-option
              v-for="item in projectData"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇报标题" prop="title">
          <el-input v-model="form.title" :disabled="true" />
        </el-form-item>
        <el-form-item label="今日完成内容" prop="contentDay">
          <el-input v-model="form.contentDay" type="textarea" :rows="5" :disabled="true" />
        </el-form-item>
        <el-form-item label="未解决问题" prop="contentquestion">
          <el-input v-model="form.contentquestion" type="textarea" :rows="5" :disabled="true" />
        </el-form-item>
        <el-form-item label="明日计划" prop="completeTime">
          <el-input v-model="form.completeTime" type="textarea" :rows="5" :disabled="true" />
        </el-form-item>
        <el-form-item label="汇报时间" prop="createTime">
          <el-input v-model="form.createTime" :disabled="true"/>
        </el-form-item>
        <el-form-item label="汇报人" prop="createBy">
          <el-input v-model="form.createName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="审批备注" prop="operatorRemarks">
          <el-input v-model="form.operatorRemarks" type="textarea":disabled="true"/>
        </el-form-item>
      </el-form>
      <!-- 新增、修改框 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="115px" v-else>
        <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="form.projectId" filterable placeholder="请选择所属项目" style="width:100%">
            <el-option
              v-for="item in projectData"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇报标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入汇报标题" maxlength="100" show-word-limit/>
        </el-form-item>
        <el-form-item label="今日完成内容" prop="contentDay">
          <el-input v-model="form.contentDay" type="textarea" :rows="5" placeholder="请输入内容" maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="未解决问题" prop="contentquestion">
          <el-input v-model="form.contentquestion" type="textarea" :rows="5" placeholder="请输入内容" maxlength="1000" show-word-limit/>
        </el-form-item>
        <el-form-item label="明日计划" prop="completeTime">
          <el-input v-model="form.completeTime" type="textarea" :rows="5" placeholder="请输入内容" maxlength="1000" show-word-limit/>
        </el-form-item>
        <el-form-item label="项目状态" prop="projectStatus">
          <el-select v-model="form.projectStatus" placeholder="请选择项目状态" style="width:100%">
             <el-option
              v-for="dict in projectStatusData"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="material">
          <el-upload :limit="5" :multiple="false" accept=".png,.pdf,.jpg" :on-exceed="handleExceed" :on-change="materialHandleChange" :http-request="materialRequestUpload"  :file-list="materialFileList"  action="#"
            :before-upload="beforeUpload" :on-remove="handleRemove">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
          <el-input v-model="form.material"  placeholder="请输入内容" disabled v-show="false" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="this.title!='项目进展详情'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    
    <!-- 审批项目进展对话框 -->
    <el-dialog :title="title" :visible.sync="approval" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="115px">
        <el-form-item label="所属项目" prop="projectId">
          <el-select v-model="form.projectId" filterable :disabled="true" style="width:100%">
            <el-option
              v-for="item in projectData"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇报标题" prop="title">
          <el-input v-model="form.title" :disabled="true" />
        </el-form-item>
        <el-form-item label="今日完成内容" prop="contentDay">
          <el-input v-model="form.contentDay" type="textarea" :disabled="true" />
        </el-form-item>
        <el-form-item label="未解决问题" prop="contentquestion">
          <el-input v-model="form.contentquestion" type="textarea" :disabled="true" />
        </el-form-item>
        <el-form-item label="明日计划" prop="completeTime">
          <el-input v-model="form.completeTime" type="textarea" :disabled="true" />
        </el-form-item>
        <el-form-item label="汇报时间" prop="createTime">
          <el-input v-model="form.createTime" :disabled="true"/>
        </el-form-item>
        <el-form-item label="汇报人" prop="createBy">
          <el-input v-model="form.createBy" :disabled="true"/>
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="form.projectStatus" :disabled="true" style="width:100%">
             <el-option
              v-for="dict in projectStatusData"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <template v-if="form.fileUrl==null">
            <el-link disabled type="primary" target="_blank">暂无</el-link>
          </template>
          <template v-else>
            <el-link v-for="(item,index) in form.fileUrl" :href="item.contractUrl" type="primary" target="_blank">图片{{index+1}} </el-link>
          </template>
        </el-form-item>
        <el-form-item label="批阅内容">
          <el-input v-model="form.operatorRemarks" placeholder="请输入批阅内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitApproval">确 定</el-button>
        <el-button @click="cancelApproval">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listWork, getWork, delWork, addWork, updateWork, exportWork, projectAll, approvalWork, uploadFile} from "@/api/project/work";

export default {
  name: "Work",
  data() {
    return {
      // 项目下拉框
      projectData: [],
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
      // 项目进展表格数据
      workList: [],
      // 弹出层标题
      title: "",
      // 日期范围
      dateRange: [],
      // 是否显示弹出层
      open: false,
      approval:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectId: null,
        createBy: null,
        title: null,
        contentDay: null,
        contentquestion: null,
        completeTime: null,
        material: null,
        remarks: null,
        status: null,
        projectStatus:null
      },
      // 表单参数
      form: {},
      // 项目状态字典
      projectStatusData:[],
      projectStatusOption:[],
      // 审批状态字典
      approvalStatusData:[
        {dictLabel:'未批阅',dictValue: 'dws01'},
        {dictLabel:'已批阅',dictValue: 'dws02'}
      ],
      // 表单校验
      rules: {
        projectId: [
          { required: true, message: "所属项目不能为空", trigger: "blur" }
        ],
        contentDay: [
          { required: true, message: "今日完成内容不能为空", trigger: "blur" }
        ],
        contentquestion: [
          { required: true, message: "未解决问题不能为空", trigger: "blur" }
        ],
        completeTime: [
          { required: true, message: "明日计划不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "审批状态不能为空", trigger: "blur" }
        ],
      },
      //图片
      materialFileList:[],
      materialFormData: [],
    };
  },
  created() {
    this.getList();
    // 项目下拉框
    this.getProjectInfo();
    // 项目状态字典
    this.getDicts("project_dist").then(response => {
      this.projectStatusData = response.data.slice(1,4);
      this.projectStatusOption = response.data.slice(0,4);
    });
  },
  methods: {
    /** 查询项目进展列表 */
    getList() {
      this.loading = true;
      listWork(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.workList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelApproval(){
      this.approval = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        projectId: null,
        title: null,
        contentDay: null,
        contentquestion: null,
        completeTime: null,
        material: null,
        remarks: null,
        status: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
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
        createBy: null,
        title: null,
        contentDay: null,
        contentquestion: null,
        completeTime: null,
        material: null,
        remarks: null,
        status: null,
        projectStatus:null
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
      this.title = "添加项目进展";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWork(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "项目进展编辑";
      });
    },
    // 查看详情按钮操作
    handleDetail(row){
      this.reset();
      const id = row.id || this.ids
      getWork(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "项目进展详情";
      });
    },
    handleApproval(row){
      this.reset();
      const id = row.id || this.ids
      getWork(id).then(response => {
        this.form = response.data;
        this.approval = true;
        this.title = "项目进展审批";
      });
    },
    // 提交审批
    submitApproval(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            let params={
              id:this.form.id,
              operatorRemarks:this.form.operatorRemarks
            }
            approvalWork(params).then(response => {
              if (response.code === 200) {
                this.msgSuccess("审批成功");
                this.approval = false;
                this.getList();
              }
            });
          } else {
          }
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWork(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("编辑成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addWork(this.form).then(response => {
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
      this.$confirm('是否确认作废?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delWork(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有项目进展数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportWork(queryParams);
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
      this.form.material= 0;
      this.form.fileUrl=null
    },
    // 保存合同副本文件
    materialHandleChange(file,fileList){
      let formdata = new FormData();
      formdata.append('file',file.raw);//传文件
      this.materialFormData = formdata;
    },
    //合同副本文件上传
    materialRequestUpload(file,fileList){
        const that = this;
        //项目安装要求
        uploadFile(this.materialFormData).then(res => {
          if(res.data){
              that.form.material = res.data.fileId;
          }
        });
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
  .is-disabled .el-input__suffix{
    display: none;
  }
</style>

