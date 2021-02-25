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
            <el-form-item label="提交人员" prop="createName">
                <el-input
                v-model="queryParams.createName"
                placeholder="请输入提交人名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
                />
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
            <el-form-item label="维修人员" prop="assignmentUser">
                <el-input
                v-model="assignmentUser"
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
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['repair:sourcelistExport']"
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

        <el-table v-loading="loading" :data="taskList">
            <el-table-column label="序号" align="center" prop="id" />
            <el-table-column label="客户名称" align="center" prop="customerCompanyName" />
            <el-table-column label="提交人员" align="center" prop="createName" />
            <el-table-column label="成本类型" align="center" prop="costTypeName" />
            <el-table-column label="报修日期" align="center" prop="toRepairTime" width="180" />
            <el-table-column label="维修人员" align="center" prop="assignmentUserName" />
            <el-table-column label="维修状态" align="center" prop="repairStatus" :formatter="repairStatusFormat" />
            <el-table-column label="是否同意更换配件" align="center" prop="repairIsAgreeConfiguration">
                <template slot-scope="scope">
                    <span>{{ scope.row.repairIsAgreeConfiguration == 1?'是':scope.row.repairIsAgreeConfiguration == 0?'否':'/' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="到货状态" align="center" prop="repairIsHave">
                <template slot-scope="scope">
                    <span>{{ scope.row.repairIsHave == 1?'已到货':scope.row.repairIsHave == 0?'未到货':'/' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="预计到货日期" align="center" prop="repairWillHaveTime" width="180" />

            <el-table-column label="处理状态" align="center" prop="repairHandleStatus">
                <template slot-scope="scope">
                    <span>{{ scope.row.repairHandleStatus == 0?'待处理':scope.row.repairHandleStatus == 1?'处理中':scope.row.repairHandleStatus == 2?'已处理':'/' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-document"
                        @click="handleDetail(scope.row.id)"
                        >详情</el-button>
                    <el-button
                        v-if="scope.row.repairHandleStatus != 2"
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleEdit(scope.row.id)"
                        v-hasPermi="['repair:sourceAudit']"
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

        <!-- 编辑弹窗 -->
        <el-dialog
            title="维修溯源列表-编辑"
            :visible.sync="editVisible"
            width="850px"
            :before-close="handleClose">
            <el-form ref="form" :model="form" :rules="rules" v-loading="editLoading" label-width="120px">
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="报修日期" prop="toRepairTime">
                        <el-input v-model="form.toRepairTime" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="需要上门时间" prop="toComeTime">
                        <el-input v-model="form.toComeTime" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="对应销售" prop="salesman">
                        <el-input v-model="form.salesman" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户名称" prop="customerCompanyId">
                        <el-input v-model="form.customerCompanyName" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="联系电话" prop="salesmanPhone">
                        <el-input v-model="form.salesmanPhone" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系人" prop="customerUser">
                        <el-input v-model="form.customerUser" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="订单编号" prop="orderNumber">
                        <el-input v-model="form.orderNumber" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户电话" prop="customerPhone">
                        <el-input v-model="form.customerPhone" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="故障现象" prop="reason">
                        <el-input v-model="form.reason" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="客户地址" prop="customerAddress">
                        <el-input v-model="form.customerAddress" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="成本类型">
                        <el-input v-model="form.costTypeName" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="成本费" prop="costMoney">
                    <el-input disabled v-model="form.costMoney" >
                        <template slot="append">元</template>
                    </el-input>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="提交部门" prop="createDeptName">
                    <el-input v-model="form.createDeptName" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="提交人员" prop="createName">
                    <el-input v-model="form.createName" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="审核结果" prop="auditStatus">
                    <el-input :value="form.auditStatus == 0?'待审核':form.auditStatus == 1?'已通过':form.auditStatus == 2?'未通过':'/'" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="审核结果说明" prop="auditRemark">
                    <el-input v-model="form.auditRemark" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="审核人员" prop="auditUserName">
                    <el-input v-model="form.auditUserName" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="接受指派人员" prop="assignmentUserName">
                    <el-input v-model="form.assignmentUserName" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="审核日期" prop="auditTime">
                    <el-input v-model="form.auditTime" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="指派日期" prop="assignmentTime">
                    <el-input v-model="form.assignmentTime" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="是否更换配件" prop="repairIsNeedConfiguration">
                    <el-input v-model="form.repairIsNeedConfiguration" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请时间" prop="repairTime">
                    <el-input v-model="form.repairTime" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="配件配置" prop="repairConfiguration">
                    <el-input v-model="form.repairConfiguration" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="申请人" prop="repairUserName">
                    <el-input v-model="form.repairUserName" disabled />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="预计到货时间" prop="repairWillHaveTime">
                        <el-date-picker clearable
                            v-model="form.repairWillHaveTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            placeholder="选择预计到货时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="到货状态" prop="repairIsHave">
                        <el-select v-model="form.repairIsHave" placeholder="请选择到货状态" clearable style="width: 274px">
                            <el-option
                            v-for="dict in statusOptions"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="备注" prop="repairRemark">
                    <el-input type="textarea" :rows="2" maxlength="100" v-model="form.repairRemark" placeholder="100个文字以内" />
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="pass(form.id)">同意</el-button>
                <el-button type="danger" @click="noPass(form.id)" v-if="form.repairIsAgreeConfiguration != 1">不同意</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getSourceList, exportRepair, passSource, notPassSource } from "@/api/repair/source";
import { getCustomer, getRepairDetail } from "@/api/repair/repair";

export default {
    data() {
        return {
            // 遮罩层
            loading: true,
            //编辑loading
            editLoading: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 维修列表表格数据
            taskList: [],
            //客户名称
            customerList: [],
            // 日期范围
            dateRange: [],
            //到货状态选择
            statusOptions:[{
                value:0,
                label:'未到货'
            },{
                value:1,
                label:'已到货'
            }],
            //维修人员名称
            assignmentUser:null,
            // 维修状态(0待维修1维修中2已维修)字典
            repairStatusOptions: [],
            // 指派状态(0待处理,1接受,2拒绝)字典
            assignmentStatusOptions: [],
            //编辑弹窗
            editVisible: false,
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
                'params.endToComeTime':null,
                'params.assignmentUser':null
            },
            form: {},
            // 表单校验
            rules: {
                realComeTime: [
                    { required: true, message: "实际到达时间不能为空", trigger: "blur" }
                ],
                repairEndTime: [
                    { required: true, message: "维修结束时间不能为空", trigger: "blur" }
                ],
                isNeedMoney: [
                    { required: true, message: "请选择是否收费", trigger: "blur" }
                ],
                labourMoney: [
                    { type: 'number', message: '材料费必须为数字'}
                ],
                materialsMoney: [
                    { type: 'number', message: '人工费必须为数字'}
                ],
            },
            //是否到货
            repairIsHave:null,
        }
    },
    created() {
        this.getList();
        this.getCustomerList();
        this.getDicts("repair_status").then(response => {
            this.repairStatusOptions = response.data;
        });
        this.getDicts("repair_assignment").then(response => {
            this.assignmentStatusOptions = response.data;
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
            if (this.assignmentUser != '' && this.assignmentUser != null) {
                this.queryParams['params.assignmentUser'] = this.assignmentUser
            }else{
                this.queryParams['params.assignmentUser'] = null
            }
            getSourceList(this.queryParams).then(response => {
                this.taskList = response.rows;
                this.total = response.total;
                this.loading = false;
            }).catch(error => {
                this.loading = false;
            });
        },
        //同意换配件
        pass(id) {
            if(this.form.repairWillHaveTime == '' || this.form.repairWillHaveTime == null){
                this.msgError('请选择预计到货时间');
            }else{
                let params = {
                    id: id,
                    repairRemark: this.form.repairRemark,
                    repairIsHave: this.form.repairIsHave,
                    repairWillHaveTime: this.form.repairWillHaveTime,
                }
                passSource(params).then(res => {
                    if(res.code == 200){
                        this.msgSuccess("提交成功");
                        this.editVisible = false;
                        this.getList();
                    }
                })
            }
        },
        //不同意
        noPass(id) {
            if(this.form.repairRemark == '' || this.form.repairRemark == null){
                this.msgError('请填写备注');
            }else{
                let params = {
                    id: id,
                    repairRemark: this.form.repairRemark,
                }
                notPassSource(params).then(res => {
                    if(res.code == 200){
                        this.msgSuccess("提交成功");
                        this.editVisible = false;
                        this.getList();
                    }
                })
            }
        },
        //不同意换配件
        //编辑弹窗
        handleEdit(id) {
            this.editVisible = true;
            this.form.id = id;
            getRepairDetail(id).then(response => {
                let obj = response.data.obj;
                let detail = response.data.detail;
                let newObj = {};
                this.form = Object.assign(newObj,detail,obj);
                this.editLoading = false;
            }).catch(error => {
                this.editLoading = false;
            })
        },
        //获取客户名称
        getCustomerList() {
            getCustomer().then(response => {
                this.customerList = response.data;
            })
        },
        // 维修状态(0待维修1维修中2已维修)字典翻译
        repairStatusFormat(row, column) {
            return this.selectDictLabel(this.repairStatusOptions, row.repairStatus);
        },
        // 指派状态(0待处理,1接受,2拒绝)字典翻译
        assignmentStatusFormat(row, column) {
            return this.selectDictLabel(this.assignmentStatusOptions, row.assignmentStatus);
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
            this.queryParams['params.assignmentUser'] = null;
            this.resetForm("queryForm");
            this.handleQuery();
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
        if (this.assignmentUser != '' && this.assignmentUser != null) {
            this.queryParams['params.assignmentUser'] = this.assignmentUser
        }else{
            this.queryParams['params.assignmentUser'] = null
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
        //指派表单重置
        orderReset() {
            this.editForm = {
                id: null,
                assignmentRemark: null,
                assignmentTime: null
            }
            this.resetForm("editForm");
        },
        //弹窗关闭前回调
        handleClose(done) {
            this.orderReset();
            done();
        },
        //详情
        handleDetail(id) {
            this.$router.push({
                path: "/detail/detail",
                query: {id:id}
            });
        },
    }
}
</script>
<style>
  .el-dropdown-link{
    color: #409EFF;
    font-size: 12px;
    margin-left: 4px
  }
</style>
