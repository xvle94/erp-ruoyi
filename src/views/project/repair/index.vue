<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称" prop="customerCompanyId">
        <el-select v-model="queryParams.customerCompanyId" placeholder="请选择客户名称" clearable size="small">
          <el-option
            v-for="dict in customerList"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="回访日期" prop="dateRange">
        <el-date-picker clearable size="small"
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          placeholder="选择回访日期">
        </el-date-picker>
      </el-form-item>
        <el-form-item label="回访人员" prop="repairStatus">
        <el-input
          v-model="queryParams.createName"
          placeholder="请输入回访人员"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回访状态" prop="visitStatus">
        <el-select v-model="queryParams.visitStatus" placeholder="请选择回访状态" clearable size="small">
          <el-option
            v-for="dict in visitOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修类型" prop="repairType">
        <el-select v-model="queryParams.repairType" placeholder="请选择维修类型" clearable size="small">
          <el-option
            v-for="dict in repairTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:visit:export']"
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

    <el-table v-loading="loading" :data="visitList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
       <el-table-column label="维修类型" align="center" prop="repairTypeValue" />
      <el-table-column label="成本类型" align="center" prop="costType" />
      <el-table-column label="报修日期" align="center" prop="toRepairTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.toRepairTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修完成日期" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回访人员" align="center" prop="createName" />
      <el-table-column label="回访日期" align="center" prop="visitTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.visitTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回访状态" align="center" prop="visitStatusValue" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-document"
                  @click="handleDetail(scope.row.id)"
                >详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="scope.row.visitStatus == 'vs01'"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['project:visit:edit']"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['project:visit:remove']"
                >作废</el-button>
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

    <!-- 编辑弹窗 -->
    <el-dialog
      title="电话回访列表-编辑"
      :visible.sync="editVisible"
      width="700px"
      >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="回访时间" prop="visitTime">
          <el-date-picker clearable style="width: 100%"
            v-model="form.visitTime"
            type="date"
            :picker-options="expireTimeOption" 
            value-format="yyyy-MM-dd"
            placeholder="选择回访时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回访结果" prop="visitResult">
          <el-input maxlength="50" type="textarea" v-model="form.visitResult" placeholder="50个字符以内" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      title="电话回访-详情"
      :visible.sync="detailVisible"
      width="700px"
      >
      <el-form ref="detailform" label-width="100px">
        <el-form-item label="回访日期" prop="visitTime">
          <span>{{detailform.visitTime}}</span>
        </el-form-item>
        <el-form-item label="回访结果" prop="visitResult">
          <el-input disabled v-model="detailform.visitResult" />
        </el-form-item>
        <el-form-item label="回访人员" prop="nickName">
          <el-input disabled v-model="detailform.nickName" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input disabled v-model="detailform.remarks" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getCustomer } from "@/api/repair/repair";
import { visitList, detailFn, update, del, getDetail, exportVisit } from "@/api/repair/visit";

export default {
  name: "repairVisit",
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
      // 电话回访表格数据
      visitList: [],
      //成本列表
      costList: [],
      //编辑弹窗
      editVisible: false,
      //详情弹窗
      detailVisible: false,
      //详情loading
      detailLoading: true,
      //客户名称
      customerList: [],
      // 日期范围
      dateRange: [],
      // 回访状态
      visitOptions: [{
        value: 'vs01',
        label: '待回访'
      },{
        value: 'vs02',
        label: '已回访'
      }],
      // 回访状态
      repairTypeOptions: [{
        value: '0',
        label: '校内'
      },{
        value: '1',
        label: '校外'
      }],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerCompanyId: null,
        createName: null,
        repairType: null,
        beginTime:null,
        endTime:null,
        visitStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        visitTime: [
          { required: true, message: "回访时间不能为空", trigger: "blur" }
        ],
        visitResult: [
          { required: true, message: "回访结果不能为空", trigger: "blur" }
        ],
      },
      detailform:{},
      //当前日期之后不可选
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() > Date.now();
        }
      },
    };
  },
  created() {
    this.getList();
    this.getCustomerList();
  },
  methods: {
    /** 查询维修列表列表 */
    getList() {
      this.loading = true;
      if (this.dateRange != false && this.dateRange != null) {
        this.queryParams.beginTime = this.dateRange[0]
        this.queryParams.endTime = this.dateRange[1]
      }else{
        this.queryParams.beginTime = null
        this.queryParams.endTime = null
      }
      visitList(this.queryParams).then(response => {
        this.visitList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      });
    },
    //获取客户名称
    getCustomerList() {
      getCustomer().then(response => {
        this.customerList = response.data;
      })
    },
    // 取消按钮
    cancel() {
      this.editVisible = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        visitTime: null,
        visitResult: null,
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
      this.dateRange = [];
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        customerCompanyId: null,
        createName: null,
        repairType: null,
        beginTime:null,
        endTime:null,
        visitStatus: null
      };
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.editVisible = true;
      this.reset();
      const id = row.id || this.ids
      getDetail(id).then(response => {
        this.form = {
          id: response.data.id,
          visitTime: response.data.visitTime,
          visitResult: response.data.visitResult,
          remarks: response.data.remarks,
          // repairId: response.data.repairId
        };
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          update(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.editVisible = false;
              this.getList();
            }
          });
        }
      });
    },
    //详情
    handleDetail(id) {
      this.detailVisible = true;
      detailFn(id).then(res =>{
        this.detailform = res.data;
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('确认作废此条记录吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return del(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      if (this.dateRange != false && this.dateRange != null) {
        this.queryParams.beginTime = this.dateRange[0]
        this.queryParams.endTime = this.dateRange[1]
      }else{
        this.queryParams.beginTime= null
        this.queryParams.endTime = null
      }
      let queryParams = this.queryParams;
      this.$confirm('是否确认导出所有维修列表数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportVisit(queryParams);
        }).then(response => {
          this.download(response.msg);
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