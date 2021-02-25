<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="报修日期" prop="dateRange">
        <el-date-picker clearable size="small"
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          placeholder="选择需要上门时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable size="small">
          <el-option
            v-for="dict in auditStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修状态" prop="repairStatus">
        <el-select v-model="queryParams.repairStatus" placeholder="请选择维修状态" clearable size="small">
          <el-option
            v-for="dict in repairStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
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
      <el-form-item label="提交人员" prop="createName">
        <el-input
          v-model="queryParams.createName"
          placeholder="请输入提交人名称"
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
          v-hasPermi="['repair:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['repair:listExport']"
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

    <el-table v-loading="loading" :data="repairList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="aaa" align="center" prop="toRepairTime" width="180">
        <template slot-scope="scope">
          <el-cascader :options="options" clearable></el-cascader>
        </template>
      </el-table-column> -->
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="客户名称" align="center" prop="customerCompanyName" />
      <el-table-column label="成本类型" align="center" prop="costTypeName" />
      <el-table-column label="报修日期" align="center" prop="toRepairTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.toRepairTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人员" align="center" prop="createName" />
      <el-table-column label="需要上门时间" align="center" prop="toComeTime" width="180">
        <!-- <template slot-scope="scope">
          <span>{{ parseTime(scope.row.toComeTime, '{y}-{m}-{d}') }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="成本费用(元)" align="center" prop="costMoney" />
      <el-table-column label="维修收费合计(元)" align="center" prop="totalRepairMoney" />
      <el-table-column label="审核状态" align="center" prop="auditStatus" :formatter="auditStatusFormat" />
      <el-table-column label="指派状态" align="center" prop="assignmentStatus" :formatter="assignmentStatusFormat" />
      <el-table-column label="维修状态" align="center" prop="repairStatus" :formatter="repairStatusFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span v-if="scope.row.isAbolish == 1">作废</span>
          <el-dropdown v-if="scope.row.isAbolish == 0">
            <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button
                  type="text"
                  icon="el-icon-download"
                  size="mini"
                  @click="handleExportOne(scope.row.id)"
                  v-hasPermi="['repair:exportDetail']"
                >导出</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-document"
                  @click="handleDetail(scope.row.id)"
                  v-hasPermi="['repair:query']"
                >详情</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="scope.row.auditStatus != 1"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['repair:edit']"
                >编辑</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  v-if="scope.row.auditStatus == 0 || scope.row.auditStatus == 2"
                  size="mini"
                  type="text"
                  icon="el-icon-thumb"
                  @click="handleAssign(scope.row)"
                  v-hasPermi="['repair:audit']"
                >指派</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['repair:abolished']"
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

    <!-- 添加或修改维修列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报修日期" prop="toRepairTime">
              <el-date-picker clearable style="width: 274px"
                v-model="form.toRepairTime"
                type="date"
                :picker-options="expireTimeOption" 
                value-format="yyyy-MM-dd"
                placeholder="选择报修时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需要上门时间" prop="toComeTime">
              <el-date-picker clearable style="width: 274px"
                v-model="form.toComeTime"
                :picker-options="pickerOptionsEnd"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择需要上门时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="对应销售" prop="salesman">
              <el-input v-model="form.salesman" placeholder="请输入销售员" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerCompanyId">
              <el-select v-model="form.customerCompanyId" placeholder="请选择客户名称" clearable style="width: 274px">
                <el-option
                  v-for="dict in customerList"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="salesmanPhone">
              <el-input v-model="form.salesmanPhone" placeholder="请输入销售员联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="customerUser">
              <el-input maxlength="10" v-model="form.customerUser" placeholder="请输入客户联系人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订单编号" prop="orderNumber">
              <el-input maxlength="10" v-model.number="form.orderNumber" placeholder="请输入订单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户电话" prop="customerPhone">
              <el-input v-model="form.customerPhone" placeholder="请输入客户电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="故障现象" prop="reason">
              <el-input v-model="form.reason" placeholder="请输入故障现象" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户地址" prop="customerAddress">
              <el-input v-model="form.customerAddress" placeholder="请输入客户地址" />
            </el-form-item>
          </el-col>
        </el-row>
       
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="成本类型">
              <el-select @change="changeCostType" v-model="form.costType" placeholder="请选择成本类型" clearable style="width: 274px">
                <el-option
                  v-for="dict in costList"
                  :key="dict.id"
                  :label="dict.costType"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本费" prop="costMoney">
              <el-input disabled v-model="form.costMoney" placeholder="请输入成本费">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 指派弹窗 -->
    <el-dialog
      title="指派"
      :visible.sync="assignVisible"
      width="700px"
      :before-close="handleClose">
      <el-form ref="assignForm" label-width="120px">
        <el-form-item label="审核结果说明" prop="auditRemark">
          <el-input maxlength="50" v-model="assignForm.auditRemark" placeholder="50个字符以内" />
        </el-form-item>
        <el-form-item label="指派人员" prop="assignmentUserId">
          <el-select v-model="assignForm.assignmentUserId" placeholder="请选择指派人员" clearable style="width: 100%">
            <el-option
              v-for="dict in assignList"
              :key="dict.userId"
              :label="dict.nickName"
              :value="dict.userId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" @click="adopt">通过</el-button>
        <el-button type="danger" @click="unAdopt">不通过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listRepair, getRepair, delRepair, addRepair, updateRepair, exportRepair, getCustomer, getCost, getAssign, passAudit, noPassAudit, exportRepairOne } from "@/api/repair/repair";

export default {
  name: "Repair",
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
      // 维修列表表格数据
      repairList: [],
      //成本列表
      costList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //指派弹窗
      assignVisible: false,
      //详情loading
      detailLoading: true,
      //客户名称
      customerList: [],
      //指派人员
      assignList:[],
      // 日期范围
      dateRange: [],
      // 审核状态(0待审核1已通过2未通过)字典
      auditStatusOptions: [],
      // 维修状态(0待维修1维修中2已维修)字典
      repairStatusOptions: [],
      // 指派状态(0待处理,1接受,2拒绝)字典
      assignmentStatusOptions: [],
      // 是否废除(1是，0否)字典
      isAbolishOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createName: null,
        customerCompanyId: null,
        auditStatus: null,
        repairStatus: null,
        repairType:0,
        'params.beginToComeTime':null,
        'params.endToComeTime':null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        toRepairTime: [
          { required: true, message: "报修时间不能为空", trigger: "blur" }
        ],
        toComeTime: [
          { required: true, message: "需要上门时间不能为空", trigger: "blur" }
        ],
        salesman: [
          { required: true, message: "销售员不能为空", trigger: "blur" }
        ],
        orderNumber:[
          { type: 'number', message: '订单编号必须为数字值'}
        ],
        salesmanPhone: [
          { required: true, message: "销售员联系电话不能为空", trigger: ["blur","change"] },
          
        ],
        customerCompanyId: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        customerUser: [
          { required: true, message: "客户联系人不能为空", trigger: "blur" }
        ],
        customerPhone: [
          { required: true, message: "客户电话不能为空", trigger: ["blur","change"] },
          
        ],
        customerAddress: [
          { required: true, message: "客户地址不能为空", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "故障现象不能为空", trigger: "blur" }
        ],
      },
      assignForm:{
        id:null,
        auditRemark:null,
        assignmentUserId:null
      },
      detailForm: {},
      //当前日期之后不可选
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() > Date.now();
        }
      },
      pickerOptionsEnd: {
        disabledDate(date) {
          return date.getTime() < Date.now()-8.64e7;
        }
      }
    };
  },
  created() {
    this.getList();
    this.getCustomerList();
    this.getCostList();
    this.getAssignList();
    this.getDicts("repair_audit").then(response => {
      this.auditStatusOptions = response.data;
    });
    this.getDicts("repair_status").then(response => {
      this.repairStatusOptions = response.data;
    });
    this.getDicts("repair_assignment").then(response => {
      this.assignmentStatusOptions = response.data;
    });
    this.getDicts("del_dist").then(response => {
      this.isAbolishOptions = response.data;
    });
  },
  methods: {
    /** 查询维修列表列表 */
    getList() {
      this.loading = true;
      if (this.dateRange != false && this.dateRange != null) {
        this.queryParams['params.beginToComeTime'] = this.dateRange[0]
        this.queryParams['params.endToComeTime'] = this.dateRange[1]
      }else{
        this.queryParams['params.beginToComeTime'] = null
        this.queryParams['params.endToComeTime'] = null
      }
      listRepair(this.queryParams).then(response => {
        this.repairList = response.rows;
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
    //获取成本类型
    getCostList() {
      getCost().then(response => {
        this.costList = response.rows;
      })
    },
    //获取指派人员
    getAssignList() {
      getAssign().then(response => {
        this.assignList = response.data;
      })
    },
    //成本类型改变算成本费
    changeCostType(price) {
      console.log(price);
      if(this.form.costType!=null && this.form.costType!=''){
        this.costList.map(item => {
          if(price == item.id){
            this.form.costMoney = item.price;
          }
        })
      }else{
        this.form.costMoney = null;
      }
    },
    // 审核状态(0待审核1已通过2未通过)字典翻译
    auditStatusFormat(row, column) {
      return this.selectDictLabel(this.auditStatusOptions, row.auditStatus);
    },
    // 维修状态(0待维修1维修中2已维修)字典翻译
    repairStatusFormat(row, column) {
      return this.selectDictLabel(this.repairStatusOptions, row.repairStatus);
    },
    // 指派状态(0待处理,1接受,2拒绝)字典翻译
    assignmentStatusFormat(row, column) {
      return this.selectDictLabel(this.assignmentStatusOptions, row.assignmentStatus);
    },
    // 是否废除(1是，0否)字典翻译
    isAbolishFormat(row, column) {
      return this.selectDictLabel(this.isAbolishOptions, row.isAbolish);
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
        toRepairTime: null,
        toComeTime: null,
        salesman: null,
        salesmanPhone: null,
        customerCompanyId: null,
        customerUser: null,
        customerPhone: null,
        customerAddress: null,
        orderNumber: null,
        reason: null,
        costType: null,
        costMoney: null,
        remark: null,
      };
      this.resetForm("form");
    },
    //指派表单重置
    assignReset() {
      this.assignForm = {
        id: null,
        auditRemark: null,
        assignmentUserId: null
      }
      this.resetForm("assignForm");
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
      this.queryParams['params.beginToComeTime'] = null;
      this.queryParams['params.endToComeTime'] = null;
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
      this.title = "添加维修列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRepair(id).then(response => {
        this.form = {
          id: response.data.id,
          toRepairTime: response.data.toRepairTime,
          toComeTime: response.data.toComeTime,
          salesman: response.data.salesman,
          salesmanPhone: response.data.salesmanPhone,
          customerCompanyId: response.data.customerCompanyId,
          customerUser: response.data.customerUser,
          customerPhone: response.data.customerPhone,
          customerAddress: response.data.customerAddress,
          orderNumber: Number(response.data.orderNumber),
          reason: response.data.reason,
          costType: response.data.costType,
          costMoney: response.data.costMoney,
          remark: response.data.remark,
        };
        this.open = true;
        this.title = "修改维修列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRepair(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addRepair(this.form).then(response => {
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
    //指派
    handleAssign(row){
      this.assignVisible = true;
      this.assignForm.id = row.id;
    },
    adopt() {
      console.log(this.assignForm);
      if(this.assignForm.assignmentUserId == null || this.assignForm.assignmentUserId == ''){
        this.msgError("请选择指派人员");
      }else{
        passAudit(this.assignForm).then(response => {
          if(response.code === 200){
            this.msgSuccess("提交成功");
            this.assignVisible = false;
            this.assignReset();
            this.getList();
          }
        })
      }
    },
    unAdopt() {
      if(this.assignForm.auditRemark == null || this.assignForm.auditRemark == ''){
        this.msgError("请输入审核结果说明");
      }else{
        noPassAudit(this.assignForm).then(response => {
          if(response.code === 200){
            this.msgSuccess("提交成功");
            this.assignVisible = false;
            this.assignReset();
            this.getList();
          }
        })
      }
    },
    //详情
    handleDetail(id) {
      this.$router.push({
          path: "/detail/detail",
          query: {id:id}
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('确认作废此条记录吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRepair(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("作废成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      if (this.dateRange != false && this.dateRange != null) {
        this.queryParams['params.beginToComeTime'] = this.dateRange[0]
        this.queryParams['params.endToComeTime'] = this.dateRange[1]
      }else{
        this.queryParams['params.beginToComeTime'] = null
        this.queryParams['params.endToComeTime'] = null
      }
      let queryParams = this.queryParams;
      this.$confirm('是否确认导出所有维修列表数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRepair(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //单个导出
    handleExportOne(id){
      exportRepairOne(id).then(res =>{
        const fileName = '技术上门服务单.xlsx';
        if ('download' in document.createElement('a')) { // 非IE下载
          const blob = new Blob([res], {type: 'application/ms-excel'});
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        }
      });
    }
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
