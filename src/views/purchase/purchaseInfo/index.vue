<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属采购单" prop="purchaseId">
        <el-input
          v-model="queryParams.purchaseId"
          placeholder="请输入所属采购单"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料id" prop="materielId">
        <el-input
          v-model="queryParams.materielId"
          placeholder="请输入物料id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际采购配置" prop="purchaseDispose">
        <el-input
          v-model="queryParams.purchaseDispose"
          placeholder="请输入实际采购配置"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计量单位id" prop="meteringId">
        <el-input
          v-model="queryParams.meteringId"
          placeholder="请输入计量单位id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购数量" prop="purchaseNumber">
        <el-input
          v-model="queryParams.purchaseNumber"
          placeholder="请输入采购数量"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购单价/元" prop="purchaseMoney">
        <el-input
          v-model="queryParams.purchaseMoney"
          placeholder="请输入采购单价/元"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="报价单号" prop="quotationNo">
        <el-input
          v-model="queryParams.quotationNo"
          placeholder="请输入报价单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购情况" prop="purchaseStatus">
        <el-select v-model="queryParams.purchaseStatus" placeholder="请选择采购情况" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="质保年限" prop="purchase">
        <el-input
          v-model="queryParams.purchase"
          placeholder="请输入质保年限"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="质保日期" prop="purchaseTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.purchaseTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择质保日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="预计到货时间" prop="expectArrivalTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.expectArrivalTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择预计到货时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="已入库数量" prop="intoStorehouseNumber">
        <el-input
          v-model="queryParams.intoStorehouseNumber"
          placeholder="请输入已入库数量"
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
          v-hasPermi="['purchase:purchaseInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['purchase:purchaseInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['purchase:purchaseInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['purchase:purchaseInfo:export']"
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

    <el-table v-loading="loading" :data="purchaseInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="所属采购单" align="center" prop="purchaseId" />
      <el-table-column label="物料id" align="center" prop="materielId" />
      <el-table-column label="实际采购配置" align="center" prop="purchaseDispose" />
      <el-table-column label="计量单位id" align="center" prop="meteringId" />
      <el-table-column label="采购数量" align="center" prop="purchaseNumber" />
      <el-table-column label="采购单价/元" align="center" prop="purchaseMoney" />
      <el-table-column label="报价单号" align="center" prop="quotationNo" />
      <el-table-column label="采购情况" align="center" prop="purchaseStatus" />
      <el-table-column label="质保年限" align="center" prop="purchase" />
      <el-table-column label="质保日期" align="center" prop="purchaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.purchaseTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计到货时间" align="center" prop="expectArrivalTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expectArrivalTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已入库数量" align="center" prop="intoStorehouseNumber" />
      <el-table-column label="备注" align="center" prop="remarks" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['purchase:purchaseInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['purchase:purchaseInfo:remove']"
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

    <!-- 添加或修改采购详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属采购单" prop="purchaseId">
          <el-input v-model="form.purchaseId" placeholder="请输入所属采购单" />
        </el-form-item>
        <el-form-item label="物料id" prop="materielId">
          <el-input v-model="form.materielId" placeholder="请输入物料id" />
        </el-form-item>
        <el-form-item label="实际采购配置" prop="purchaseDispose">
          <el-input v-model="form.purchaseDispose" placeholder="请输入实际采购配置" />
        </el-form-item>
        <el-form-item label="计量单位id" prop="meteringId">
          <el-input v-model="form.meteringId" placeholder="请输入计量单位id" />
        </el-form-item>
        <el-form-item label="采购数量" prop="purchaseNumber">
          <el-input v-model="form.purchaseNumber" placeholder="请输入采购数量" />
        </el-form-item>
        <el-form-item label="采购单价/元" prop="purchaseMoney">
          <el-input v-model="form.purchaseMoney" placeholder="请输入采购单价/元" />
        </el-form-item>
        <el-form-item label="报价单号" prop="quotationNo">
          <el-input v-model="form.quotationNo" placeholder="请输入报价单号" />
        </el-form-item>
        <el-form-item label="采购情况">
          <el-radio-group v-model="form.purchaseStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="质保年限" prop="purchase">
          <el-input v-model="form.purchase" placeholder="请输入质保年限" />
        </el-form-item>
        <el-form-item label="质保日期" prop="purchaseTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.purchaseTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择质保日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计到货时间" prop="expectArrivalTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.expectArrivalTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择预计到货时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="已入库数量" prop="intoStorehouseNumber">
          <el-input v-model="form.intoStorehouseNumber" placeholder="请输入已入库数量" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="删除状态(0-正常、1-删除)" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除状态(0-正常、1-删除)" />
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
import { listPurchaseInfo, getPurchaseInfo, delPurchaseInfo, addPurchaseInfo, updatePurchaseInfo, exportPurchaseInfo } from "@/api/purchase/purchaseInfo";

export default {
  name: "PurchaseInfo",
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
      // 采购详情表格数据
      purchaseInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        purchaseId: null,
        materielId: null,
        purchaseDispose: null,
        meteringId: null,
        purchaseNumber: null,
        purchaseMoney: null,
        quotationNo: null,
        purchaseStatus: null,
        purchase: null,
        purchaseTime: null,
        expectArrivalTime: null,
        intoStorehouseNumber: null,
        remarks: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        purchaseId: [
          { required: true, message: "所属采购单不能为空", trigger: "blur" }
        ],
        materielId: [
          { required: true, message: "物料id不能为空", trigger: "blur" }
        ],
        meteringId: [
          { required: true, message: "计量单位id不能为空", trigger: "blur" }
        ],
        purchaseNumber: [
          { required: true, message: "采购数量不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询采购详情列表 */
    getList() {
      this.loading = true;
      listPurchaseInfo(this.queryParams).then(response => {
        this.purchaseInfoList = response.rows;
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
        purchaseId: null,
        materielId: null,
        purchaseDispose: null,
        meteringId: null,
        purchaseNumber: null,
        purchaseMoney: null,
        quotationNo: null,
        purchaseStatus: "0",
        purchase: null,
        purchaseTime: null,
        expectArrivalTime: null,
        intoStorehouseNumber: null,
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
      this.open = true;
      this.title = "添加采购详情";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPurchaseInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改采购详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePurchaseInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addPurchaseInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除采购详情编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPurchaseInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购详情数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPurchaseInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
