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
                v-hasPermi="['repair:tasklistExport']"
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
            <el-table-column label="成本类型" align="center" prop="costTypeName" />
            <el-table-column label="提交人员" align="center" prop="createName" />
            <el-table-column label="报修日期" align="center" prop="toRepairTime" width="180">
                <template slot-scope="scope">
                <span>{{ parseTime(scope.row.toRepairTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="需要上门时间" align="center" prop="toComeTime" width="180">
                <template slot-scope="scope">
                <span>{{ parseTime(scope.row.toComeTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="维修人员" align="center" prop="assignmentUserName" />
            <el-table-column label="是否更换配件" align="center" prop="repairIsAgreeConfiguration">
                <template slot-scope="scope">
                    <span>{{ scope.row.repairIsAgreeConfiguration == 1?'是':'否' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="到货状态" align="center" prop="repairIsHave">
                <template slot-scope="scope">
                    <span>{{ scope.row.repairIsHave == 1?'已到货':scope.row.repairIsHave == 0?'未到货':'/' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="维修结束时间" align="center" prop="repairEndTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.repairEndTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="维修状态" align="center" prop="repairStatus" :formatter="repairStatusFormat" />
            <el-table-column label="指派状态" align="center" prop="assignmentStatus" :formatter="assignmentStatusFormat" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                <span v-if="scope.row.isAbolish == 1">作废</span>
                <el-dropdown v-if="scope.row.isAbolish == 0">
                    <span class="el-dropdown-link">更多操作<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-document"
                        @click="handleDetail(scope.row.id)"
                        v-hasPermi="['repair:taskList:query']"
                        >详情</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-button
                        v-if="scope.row.assignmentStatus == 0"
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleEdit(scope.row.id)"
                        v-hasPermi="['repair:assignment']"
                        >接单</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-button
                        v-if="scope.row.assignmentStatus == 1 && scope.row.repairStatus == 0"
                        size="mini"
                        type="text"
                        icon="el-icon-setting"
                        @click="handleRepair(scope.row)"
                        v-hasPermi="['repair:repairChange']"
                        >维修</el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-button
                        v-if="scope.row.repairStatus==1&&(scope.row.repairIsNeedConfiguration==0||(scope.row.repairIsNeedConfiguration==1&&scope.row.repairIsAgreeConfiguration==1&&scope.row.repairIsHave==1))"
                        size="mini"
                        type="text"
                        icon="el-icon-document"
                        @click="handleFinish(scope.row)"
                        v-hasPermi="['repair:detail:finish']"
                        >完成</el-button>
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

        <!-- 接单弹窗 -->
        <el-dialog
            title="接单"
            :visible.sync="orderVisible"
            width="700px"
            :before-close="handleClose">
            <el-form ref="orderForm" label-width="120px">
                <el-form-item label="计划出发时间" prop="assignmentTime">
                    <el-date-picker clearable
                        :picker-options="orderDatePicker"
                        v-model="orderForm.assignmentTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="指派结果说明" prop="assignmentRemark">
                    <el-input maxlength="50" v-model="orderForm.assignmentRemark" placeholder="50个字符以内" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="adopt">接受</el-button>
                <el-button type="danger" @click="unAdopt">拒绝</el-button>
            </span>
        </el-dialog>

        <!-- 更换配置申请弹窗 -->
        <el-dialog
            title="更换配置申请"
            :visible.sync="configVisible"
            width="700px"
            :before-close="handleClose">
            <el-form ref="configForm" label-width="120px">
                <el-form-item label="配件配置" prop="repairConfiguration">
                    <el-input maxlength="200" v-model="configForm.repairConfiguration" placeholder="200个字符以内" />
                </el-form-item>
                <el-form-item label="是否到货" prop="repairIsHave">
                    <el-input disabled v-model="repairIsHave" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="changeConfig">更换配件</el-button>
                <el-button type="danger" @click="noChangeConfig">不更换配件</el-button>
            </span>
        </el-dialog>

        <!-- 维修完成弹窗 -->
        <el-dialog
            title="维修"
            :visible.sync="repairVisible"
            width="700px"
            :before-close="handleClose">
            <el-form ref="repairForm" :model="repairForm" :rules="repairRules" label-width="120px">
                <el-form-item label="实际到达时间" prop="realComeTime">
                    <el-date-picker clearable
                        :picker-options="startDatePicker"
                        @change="changeTime"
                        v-model="repairForm.realComeTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="选择实际到达时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="维修结束时间" prop="repairEndTime">
                    <el-date-picker clearable
                        :picker-options="endDatePicker"
                        @change="changeTime"
                        v-model="repairForm.repairEndTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="选择维修结束时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="服务时间" prop="serviceTime">
                    <el-input disabled v-model="repairForm.serviceTime">
                        <template slot="append">时</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="是否收费" prop="isNeedMoney">
                    <el-select v-model="repairForm.isNeedMoney" placeholder="请选择是否收费" clearable style="width: 100%">
                        <el-option
                        v-for="dict in chargeOptions"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="材料费" prop="labourMoney">
                    <el-input v-model="repairForm.labourMoney">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="人工费" prop="materialsMoney">
                    <el-input v-model="repairForm.materialsMoney">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="问题描述" prop="problemRemark">
                    <el-input maxlength="500" v-model="repairForm.problemRemark" placeholder="500个字符以内" />
                </el-form-item>
                <el-form-item label="维修方案" prop="solution">
                    <el-input maxlength="500" v-model="repairForm.solution" placeholder="500个字符以内" />
                </el-form-item>
                <el-form-item label="收费合计" prop="totalMoney">
                    <span>{{ '￥' + parseFloat(Number(repairForm.labourMoney)+Number(repairForm.materialsMoney)).toFixed(2) + ' 元'}}</span>
                </el-form-item>
                <el-form-item label="图片" prop="picPath">
                    <div v-if="repairForm.pic!=null">
                    <el-image style="width:200px" v-for="url in repairForm.picPath" :key="url.id" :src="url.contractUrl" lazy></el-image>
                    </div>
                    <el-upload
                        :limit="5"
                        :on-exceed="handleExceed"
                        :on-change="handleChange"
                        :http-request="requestUpload"
                        :file-list="fileList"
                        action="#"
                        :before-upload="beforeUpload"
                        drag
                        multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em><div>单个文件大小5M以内,最多5张图片</div></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="repairFinish">维修完成</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getDiffTime } from '@/utils/index.js'
import { getTasklist, passAssignment, notPassAssignment, passRepairChange, notPassRepairChange, getRepairFinishDetail, uploadFile, setFinish, exportRepair } from "@/api/repair/task";
import { getCustomer } from "@/api/repair/repair";

export default {
    data() {
        return {
            // 遮罩层
            loading: true,
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
            //维修人员名称
            assignmentUser:null,
            // 维修状态(0待维修1维修中2已维修)字典
            repairStatusOptions: [],
            // 指派状态(0待处理,1接受,2拒绝)字典
            assignmentStatusOptions: [],
            //维修完成弹窗
            repairVisible: false,
            //是否收费
            chargeOptions: [{
                value: 1,
                label: '收费'
            },
            {
                value: 0,
                label: '免费'
            }],
            //接单弹窗
            orderVisible: false,
            //配置申请弹窗
            configVisible: false,
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
            orderForm: {
                id: null,
                assignmentRemark: null,
                assignmentTime: null
            },
            configForm: {
                id: null,
                repairConfiguration: null,
            },
            //维修完成表单参数
            repairForm: {
                parentId: null,
                realComeTime: null,
                repairEndTime: null,
                serviceTime: null,
                isNeedMoney: null,
                labourMoney: null,
                materialsMoney: null,
                problemRemark: null,
                solution: null,
                pic: null,
            },
            // 表单校验
            repairRules: {
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
                    { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的数字格式,可保留两位小数' }
                ],
                materialsMoney: [
                    { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的数字格式,可保留两位小数' }
                ],
            },
            //是否到货
            repairIsHave:null,
            // 文件数组
            formData:[],
            fileList: [],
            startDatePicker: this.beginDate(),
            endDatePicker: this.processDate(),
            orderDatePicker: this.orderDate()
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
            getTasklist(this.queryParams).then(response => {
                this.taskList = response.rows;
                this.total = response.total;
                this.loading = false;
            }).catch(error => {
                this.loading = false;
            });
        },
        orderDate(){
            const self = this
            return {
                disabledDate(time){
                    return Date.now() - 8.64e7 > time.getTime()
                }
            }
        },
        beginDate(){
            const self = this
            return {
                disabledDate(time){
                if (self.repairForm.repairEndTime) {  //如果结束时间不为空，则小于结束时间
                    return new Date(self.repairForm.repairEndTime).getTime() < time.getTime()
                } else {
                    // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                }
                }
            }
        },
        processDate() {
            const  self = this
            return {
                disabledDate(time) {
                if (self.repairForm.realComeTime) {  //如果开始时间不为空，则结束时间大于开始时间
                    return new Date(self.repairForm.realComeTime).getTime() > time.getTime()
                } else {
                    // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                }
                }
            }
        },
        //计算服务时间
        changeTime(val){
            console.log(val);
            let startTime;
            let endTime;
            if(this.repairForm.realComeTime != '' && this.repairForm.realComeTime != null && this.repairForm.repairEndTime != null && this.repairForm.repairEndTime != ''){
                startTime = this.repairForm.realComeTime;
                endTime = this.repairForm.repairEndTime;
                this.repairForm.serviceTime = getDiffTime(startTime,endTime).toFixed(2);
                return getDiffTime(startTime,endTime)
            }else{
                this.repairForm.serviceTime = null;
            }
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
        //维修弹窗
        handleRepair(row) {
            this.configVisible = true;
            this.repairIsHave = row.repairIsHave == 1?'已到货':'未到货';
            this.configForm.id = row.id;
            this.configForm.repairConfiguration = row.repairConfiguration;
        },
        //接单弹窗
        handleEdit(id) {
            this.orderVisible = true;
            this.orderForm.id = id;
        },
        //接单
        adopt() {
            if(this.orderForm.assignmentTime == null || this.orderForm.assignmentTime == ''){
                this.msgError("请选择计划出发时间");
            }else{
                passAssignment(this.orderForm).then(response => {
                if(response.code === 200){
                    this.msgSuccess("提交成功");
                    this.orderVisible = false;
                    this.orderReset();
                    this.getList();
                }
                })
            }
        },
        //不接单
        unAdopt() {
            if(this.orderForm.assignmentRemark == null || this.orderForm.assignmentRemark == ''){
                this.msgError("请输入指派结果说明");
            }else{
                notPassAssignment(this.orderForm).then(response => {
                if(response.code === 200){
                    this.msgSuccess("提交成功");
                    this.orderVisible = false;
                    this.orderReset();
                    this.getList();
                }
                })
            }
        },
        //指派表单重置
        orderReset() {
            this.orderForm = {
                id: null,
                assignmentRemark: null,
                assignmentTime: null
            }
            this.resetForm("orderForm");
        },
        //配置申请表单重置
        configReset() {
            this.configForm = {
                id: null,
                repairConfiguration: null,
            }
            this.resetForm("configForm");
        },
        //维修完成表单重置
        repairReset(){
            this.repairForm = {
                parentId: null,
                realComeTime: null,
                repairEndTime: null,
                serviceTime: null,
                isNeedMoney: null,
                labourMoney: null,
                materialsMoney: null,
                problemRemark: null,
                solution: null,
                pic: null,
            }
        },
        //换配件
        changeConfig() {
            if(this.configForm.repairConfiguration == '' || this.configForm.repairConfiguration == null){
                this.msgError("配件配置不能为空");
            }else{
                passRepairChange(this.configForm).then(res => {
                    if(res.code == 200){
                        this.msgSuccess("提交成功");
                        this.configVisible = false;
                        this.configReset();
                        this.getList();
                    }
                })
            }
        },
        //不换配件
        noChangeConfig() {
            notPassRepairChange({id:this.configForm.id}).then(res => {
                if(res.code == 200){
                    this.msgSuccess("提交成功");
                    this.configVisible = false;
                    this.configReset();
                    this.getList();
                }
            })
        },
        //弹窗关闭前回调
        handleClose(done) {
            this.orderReset();
            this.configReset();
            this.repairReset();
            done();
        },
        //详情
        handleDetail(id) {
            this.$router.push({
                path: "/detail/detail",
                query: {id:id}
            });
        },
        //维修完成弹窗
        handleFinish(row) {
            this.repairVisible = true;
            this.repairForm.parentId = row.id;
            if(row.repairStatus == 2){
                getRepairFinishDetail(row.id).then(res => {
                    this.repairForm = res.data;
                })
            }
        },
        //上传之前检验文件
        beforeUpload(file){
            var fileSize = file.size / 1024 / 1024;
            if(fileSize > 5){
                this.$message.error('文件不能超过5MB');
                return false;
            }else{
                return true;
            }
        },
        // 超出文件个数
        handleExceed(files, fileList){
            this.$message.warning(`当前限制选择 5 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        //保存项目安装要求文件
        handleChange(file,fileList){
            let formdata = new FormData();
            formdata.append('file',file.raw);//传文件
            this.formData = formdata;
        },
        //文件上传
        requestUpload(file,fileList){
            console.log(this.formData)
            const that = this;
            //项目安装要求
            uploadFile(this.formData).then(res => {
            if(res.data){
                if(that.repairForm.pic != null){
                    that.repairForm.pic = that.repairForm.pic + ',' +res.data.fileId;
                }else{
                    that.repairForm.pic = res.data.fileId;
                }
            }
            });
        },
        //确定维修完成
        repairFinish(){
            this.$refs["repairForm"].validate((valid) => {
                console.log(this.repairForm.labourMoney);
                if (valid) {
                    console.log(this.repairForm);
                    if(this.repairForm.isNeedMoney == 1 && (this.repairForm.labourMoney === '' || this.repairForm.labourMoney === null)){
                        this.msgError("请输入材料费");
                        return false;
                    }else if(this.repairForm.isNeedMoney == 1 && (this.repairForm.materialsMoney === '' || this.repairForm.materialsMoney === null)){
                        this.msgError("请输入人工费");
                        return false;
                    }else if(this.repairForm.realComeTime > this.repairForm.repairEndTime){
                        this.msgError("维修结束时间不能大于实际到达时间");
                    }else{
                        let params = {
                            parentId: this.repairForm.parentId,
                            realComeTime: this.repairForm.realComeTime,
                            repairEndTime: this.repairForm.repairEndTime,
                            serviceTime: this.repairForm.serviceTime,
                            isNeedMoney: this.repairForm.isNeedMoney,
                            labourMoney: this.repairForm.labourMoney,
                            materialsMoney: this.repairForm.materialsMoney,
                            problemRemark: this.repairForm.problemRemark,
                            solution: this.repairForm.solution,
                            pic: this.repairForm.pic,
                        };
                        setFinish(params).then(res => {
                            if(res.code == 200){
                                this.msgSuccess("提交成功");
                                this.repairVisible = false;
                                this.getList();
                            }else{
                                this.msgError(res.msg);
                            }
                        })
                    }
                } else {
                    return false;
                }
            });
        }
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
