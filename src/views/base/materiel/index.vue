<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--物流数据-->
      <el-col :span="6" :xs="24">
        <div class="head-container">
          <el-input
            v-model="materielName"
            placeholder="请输入物料名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="materielData"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--物料信息-->
      <el-col :span="18" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="物料名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入物料名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="物料编码" prop="code">
            <el-input
              v-model="queryParams.code"
              placeholder="请输入物料编码"
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
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['base:materiel:add']"
            >新增</el-button>
          </el-col>
          <div class="top-right-btn">
            <el-tooltip class="item" effect="dark" content="刷新" placement="top">
              <el-button size="mini" circle icon="el-icon-refresh" @click="handleQuery" />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              :content="showSearch ? '隐藏搜索' : '显示搜索'"
              placement="top"
            >
              <el-button size="mini" circle icon="el-icon-search" @click="showSearch=!showSearch" />
            </el-tooltip>
          </div>
        </el-row>

        <el-table v-loading="loading" :data="infoList" highlight-current-row >
          <el-table-column label="序号" align="center"  type="index" />
          <el-table-column label="物料编码" align="center" prop="code" />
          <el-table-column label="物料名称" align="center" prop="name" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['base:materiel:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['base:materiel:remove']"
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
      </el-col>
    </el-row>

    <!-- 添加或修改物料信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父级编码" prop="superiorId" v-show="checkSuperior">
           <treeselect v-model="form.superiorId" :options="materielData" :props="defaultProps"   :show-count="true"  placeholder="请选择父级编码" />
           
        </el-form-item>
        <el-form-item label="物料名称" prop="name">
          <el-input  v-model="form.name" placeholder="请输入物料名称" maxlength="20" show-word-limit/>
        </el-form-item>
         <el-form-item label="规格型号" >
          <el-input  v-model="form.specsModel" placeholder="请输入规格型号" maxlength="100" show-word-limit/>
        </el-form-item>
        <el-form-item label="税率(%)" prop="ratio">
          <el-input type="number"  v-model="form.ratio" @input="handleInput" placeholder="请输入税率" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit/>
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
import {
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
  exportInfo,
  treeselect,
  checkName
} from "@/api/base/materiel/info";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Info",
  components: { Treeselect },
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
      // 物料信息表格数据
      infoList: [],
       // 物料信息树选项
      infoOptions: [],
      // 弹出层标题
      title: "",
      //当前操作行
      rowData: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        code: null,
        superiorCode: null,
      },
      //物料树数组
      materielData: [],
      //物料名称
      materielName: undefined,
      //是否可以父级
      checkSuperior: true,
      // 表单参数
      form: {},
      //下拉树节点
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        name: [{ required: true, message: "物料名称不能为空", trigger: "blur" }],
        ratio:[
          { required: true, message: "税率不能为空", trigger: "blur" },
          {pattern:/^(0|[1-9][0-9]*)$/, message: "税率必须为整数", trigger: "blur" }
        ],
      },
      
    };
  },
  watch: {
    // 根据名称筛选部门树
    materielName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    //查询下拉树数据
    this.getTreeselect();
    //查询table数据
    this.getList();
    
  },
  methods: {
    //正则匹配税率只能输入两位小数
    handleInput(value) {
      if(value != '') {
          if(value.indexOf('.') > -1) {
                  this.form.ratio = value.slice(0, value.indexOf('.') + 3)
          }else{ 
                  this.form.ratio = value
          }
      }
    },
    /** 查询物料信息列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询物料下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.materielData = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.superiorCode = data.code;
      this.getList();
    },
    /** 转换物料信息数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.code,
        label: node.name,
        children: node.children
      };
    },
	  /** 查询父级物料下拉结构 */
    superiorSelect() {
      this.infoOptions = [];
      const data = this.materielData
      
      this.infoOptions.push(data);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.checkSuperior = true;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        code: null,
        ratio: 0,
        superiorId: null,
        remarks: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        specsModel: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.materielName = undefined;
      this.queryParams.pageNum = 1;
      //查询下拉树数据
      this.getTreeselect();
      //查询右边table数据
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.superiorCode = "";
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      //查询父级物料下拉结构
      this.superiorSelect();
      
      this.checkSuperior = true;
      this.open = true;
      this.rowData = [];
      this.title = "添加物料信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      if(row != undefined && row != null && row != ''){
        this.reset();
        //查询父级物料下拉结构
        this.superiorSelect();
        //父级禁止编辑
        this.checkSuperior = false;
        const id = row.id || this.ids;
        getInfo(id).then((response) => {
          this.form = response.data;
          this.open = true;
          this.title = "修改物料信息";
          this.rowData = response.data;
          if(this.form.superiorCode === '0'){
            this.form.superiorCode = null;
          }
        });
      }
      
    },
    /** 提交按钮 */
    submitForm() {
      const that = this;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          //如果物料名称修改了
            if(this.rowData.name === null || this.rowData.name === undefined || this.rowData.name === '' || this.form.name != this.rowData.name){
                //验证物料名称是否重复
              const checkResult = 0;
              checkName(this.form.name).then((res) => {
                if(res.data > 0){
                  that.msgError("物料" + this.form.name + "已存在");
                  return false;
                }else{
                  //保存数据
                  that.pushSubmit();
                }
              }).catch(function () {
                that.msgError("请求失败,请重试");
                return false;
              });
              
            }else{
               //保存数据
               that.pushSubmit();
            }
        }
      });
    },
    /**提交参数 */
    pushSubmit(){
      const that = this;
        if (this.form.id != null) {
            updateInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.open = false;
                that.checkSuperior = true;
                //查询下拉树数据
                this.getTreeselect();
                //查询table数据
                this.getList();
                this.msgSuccess("修改成功");
              }
            });
          } else {
            addInfo(this.form).then((response) => {
              if (response.code === 200) {
                this.open = false;
                //查询下拉树数据
                this.getTreeselect();
                //查询table数据
                this.getList();
                this.msgSuccess("新增成功");
              }
            });
          }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const code = row.code;
      this.$confirm(
        '是否作废所选物料?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delInfo(code);
        })
        .then(() => {
          //查询下拉树数据
          this.getTreeselect();
          //查询table数据
          this.getList();
          this.msgSuccess("操作成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有物料?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportInfo(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    }
    
  },
};
</script>
