<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="项目编号" prop="projectNumber">
        <el-input
          v-model="queryParams.projectNumber"
          placeholder="请输入项目编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流程定义" prop="definitionId">
        <el-select v-model="queryParams.definitionId" placeholder="请选择所属流程定义" clearable size="small">
          <el-option
            v-for="dict in definitionData"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="流程状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择流程状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
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
      
      <div class="top-right-btn">
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
          <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
        </el-tooltip>
      </div>
    </el-row>

    <el-table v-loading="loading" :data="exampleList" highlight-current-row >
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="项目编号" align="center" prop="projectNumber" />
      <el-table-column label="流程定义" align="center" prop="definitionName"  />
      <el-table-column label="当前节点" align="center" prop="nodeName" />
      <el-table-column label="流程状态" align="center" prop="status" :formatter="statusFormat" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改流程实例对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="订单" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="所属流程定义" prop="definitionId" >
          <el-select v-model="form.definitionId" placeholder="请选择所属流程定义" clearable size="small" style="width:100%;">
          <el-option
            v-for="dict in definitionData"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          />
        </el-select>
        </el-form-item>
       
        <el-form-item label="流程状态" v-if="showStatus">
         <el-select v-model="form.status" placeholder="请选择流程状态" clearable size="small" style="width:100%;">
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item> 
        
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容"  maxlength="300" show-word-limit/>
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
import { listExample, getExample, delExample, addExample, updateExample, exportExample, getAllDefinition } from "@/api/process/example";

export default {
  name: "Example",
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
      // 流程实例表格数据
      exampleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 流程状态
      statusOptions: [],
      // 流程定义
      definitionData:[],
      //是否显示流程状态
      showStatus: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectNumber: null,
        definitionId: null,
        status: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderId: [
          { required: true, message: "订单不能为空", trigger: "blur" }
        ],
        definitionId: [
          { required: true, message: "流程定义不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "流程类型", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getAllDefinition();
    this.getList();
    this.getDicts("process_status").then(response => {
      this.statusOptions = response.data;
    });
    
  },
  methods: {
    /** 查询流程实例列表 */
    getList() {
      this.loading = true;
      listExample(this.queryParams).then(response => {
        this.exampleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 流程状态(pes_01-待审批 pes_02-审批中 pes_03-已驳回 pes_04-已完成)字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 查询流程定义数组
    getAllDefinition(){
      const that = this;
      getAllDefinition().then(res =>{
        if(res.data){
          that.definitionData = res.data;
        }
      })
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
        definitionId: null,
        nodeId: null,
        status: null,
        type: null,
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.showStatus = false;
      this.open = true;
      this.title = "添加流程实例";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.showStatus = true;
      const id = row.id || this.ids
      getExample(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程实例";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateExample(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.showStatus = false;
                this.getList();
              }
            });
          } else {
            addExample(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.showStatus = false;
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 作废按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否作废流程实例?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delExample(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
  }
};
</script>
