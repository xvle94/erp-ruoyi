<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="维修类型" prop="repairType">
        <el-select v-model="queryParams.repairTypeValue" placeholder="请选择维修状态" clearable size="small">
          <el-option
            v-for="dict in repairTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成本类型" prop="costType">
        <el-input
          v-model="queryParams.costType"
          placeholder="请输入成本类型"
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
          v-hasPermi="['project:cost:add']"
        >新增</el-button>
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

    <el-table v-loading="loading" :data="costList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="维修类型" align="center" prop="repairType">
          <template slot-scope="scope">
              <span>{{scope.row.repairType==0?'校内':scope.row.repairType==1?'校外':''}}</span>
          </template>
      </el-table-column>
      <el-table-column label="成本类型" align="center" prop="costType" />
      <el-table-column label="价格(元)" align="center" prop="price" />
      <el-table-column label="维护人员" align="center" prop="createBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['project:cost:edit']"
            >编辑</el-button>
            <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['project:cost:remove']"
            >删除</el-button>
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

    <!-- 添加或修改维修列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="维修类型" prop="repairType">
              <el-select v-model="form.repairType" placeholder="请选择维修类型" clearable style="width: 100%">
                <el-option
                    v-for="dict in repairTypeOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="成本类型" prop="costType">
              <el-input v-model="form.costType" placeholder="请输入成本类型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="价格" prop="price">
              <el-input v-model.number="form.price" placeholder="请输入价格">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="ramarks">
              <el-input v-model="form.ramarks" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { costList, add, update, del, getDetail } from "@/api/repair/cost";

export default {
  name: "repairCost",
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
      // 表格数据
      costList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //指派弹窗
      assignVisible: false,
      //详情loading
      detailLoading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        costType: null,
        repairTypeValue: null,
      },
      repairTypeOptions:[{
          value:0,
          label:'校内'
      },{
          value:1,
          label:'校外'
      }],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        repairType: [
          { required: true, message: "请选择维修类型", trigger: "blur" }
        ],
        costType: [
          { required: true, message: "请选择成本类型", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" },
          { type: 'number', message: '价格必须为数字'}
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询维修列表列表 */
    getList() {
      this.loading = true;
      costList(this.queryParams).then(response => {
        this.costList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(error => {
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
        repairType: null,
        costType: null,
        price: null,
        ramarks: null,
      };
      this.resetForm("form");
    },
    //弹窗关闭前回调
    handleClose(done) {
      this.assignReset();
      done();
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
        costType: null,
        repairTypeValue: null,
      }
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
      this.open = true;
      this.title = "维修成本维护-新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDetail(id).then(response => {
        this.form = {
          id: response.data.id,
          repairType: response.data.repairType,
          costType: response.data.costType,
          price: response.data.price,
          ramarks: response.data.ramarks,
        };
        this.open = true;
        this.title = "维修成本维护-编辑";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            update(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            add(this.form).then(response => {
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
      this.$confirm('确认删除此条记录吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return del(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
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
</style>