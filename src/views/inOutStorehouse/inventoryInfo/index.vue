<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      
      <el-form-item label="仓库" >
        <el-input
          v-model="queryParams.warehouseName"
          placeholder="请输入仓库名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      
      <el-form-item label="物料名称" >
        <el-input
          v-model="queryParams.materielName"
          placeholder="请输入物料名称"
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['inOutStorehouse:inventoryInfo:export']"
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

    <el-table v-loading="loading" :data="inventoryInfoList" highlight-current-row>
      <el-table-column label="序号" align="center"  type="index" />
      <el-table-column label="仓库名称" align="center" prop="warehouseName" />
      <el-table-column label="物料名称" align="center" prop="materielName" />
      <el-table-column label="二级物料名称" align="center" prop="materielTwoName" />
      <el-table-column label="一级物料名称" align="center" prop="materielOneMName" />
      <el-table-column label="冻结数量" align="center" prop="freezeNumber" />
      <el-table-column label="即时数量" align="center" prop="nowNumber" />
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    
  </div>
</template>

<script>
import { listInventoryInfo, getInventoryInfo,  exportInventoryInfo } from "@/api/inOutStorehouse/inventoryInfo";

export default {
  name: "InventoryInfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 实时库存表格数据
      inventoryInfoList: [],
      // 弹出层标题
      title: "",
      
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseName: null,
        materielName: null
      },
      
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询实时库存列表 */
    getList() {
      this.loading = true;
      listInventoryInfo(this.queryParams).then(response => {
        this.inventoryInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
   
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        warehouseName: null,
        materielName: null
      }
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInventoryInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
