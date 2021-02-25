<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="114px;">
      
      <el-form-item label="所属流程定义" >
        <el-input
          v-model="queryParams.definitionId"
          size="small" v-show="false" disabled
        />
        <el-input
          v-model="definitionName"
          size="small" disabled/>
      </el-form-item>
      <el-form-item label="节点名称" >
        <el-input
          v-model="queryParams.name"
          placeholder="请输入节点名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >作废</el-button>
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

    <el-table v-loading="loading" :data="nodeList" highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="节点名称" align="center" prop="name" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['process:node:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['process:node:remove']"
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

    <!-- 添加或修改流程节点对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="流程定义" prop="definitionId">
          <el-input v-model="form.definitionId" disabled v-show="false"/>
           <el-input v-model="definitionName" disabled/>
        </el-form-item>
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入节点名称" maxlength="40" show-word-limit />
        </el-form-item>
        
        <el-form-item label="审批人" prop="operatorId">
          <el-select v-model="form.operatorId" placeholder="请选择审批人" style="width:100%"> 
            <el-option
              v-for="dict in operatorOptions"
              :key="dict.userId"
              :label="dict.nickName"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit />
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
import { listNode, getNode, delNode, addNode, updateNode, exportNode, userOption } from "@/api/process/node";
import { getDefinition } from "@/api/process/definition";
export default {
  name: "Node",
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
      // 流程节点表格数据
      nodeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //审批人
      operatorOptions:[],
      //所属流程
      definitionName: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        definitionId: null,
        sort: null,
        operatorId: null,
        operatorType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "节点名称不能为空", trigger: "blur" }
        ],
        operatorId: [
          
        ],
        
      }
    };
  },
  created() {
     //拿到传过来的参数
    const definitionId = this.$route.params && this.$route.params.definitionId;
    //只要拿到传递的参数，才进行查询
    if(definitionId !=  undefined && definitionId != null && definitionId != ''){
      this.queryParams.definitionId = definitionId;
      //拿到所属流程定义
      this.getDefinitionName(definitionId);
      //查询数据
      this.getList();
      this.queryOperator();
    }
    
  },
  methods: {
    //拿到所属流程定义
    getDefinitionName(id){
      const that = this;
      this.definitionName = "";
      getDefinition(id).then(response => {
        if(response.data){
          that.definitionName = response.data.name;
        }
      });
    },
    /** 查询流程节点列表 */
    getList() {
      this.loading = true;
      listNode(this.queryParams).then(response => {
        this.nodeList = response.rows;
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
        name: null,
        definitionId: null,
        sort: null,
        operatorId: null,
        operatorType: null,
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
    
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 查询审批人
    queryOperator() {
        userOption().then(res => {
          this.operatorOptions = res.data;
        })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.definitionId = this.queryParams.definitionId;
      this.open = true;
      this.title = "添加流程节点";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getNode(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程节点";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        this.form.definitionId = this.queryParams.definitionId;
        if (valid) {
          if (this.form.id != null) {
            updateNode(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addNode(this.form).then(response => {
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
    /** 作废按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否作废流程节点?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delNode(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },

  }
};
</script>
