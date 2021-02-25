<template>
    <div class="app-container">
        <div class="hd">
            <div class="title" v-if="this.id == null">采购单-新增</div>
            <div class="title" v-if="this.id != null">订单编号：<el-link @click="toOrderDetail()" type="primary">{{orderNumber}}</el-link></div>
            <el-button
                class="back-btn"
                type="primary"
                icon="el-icon-back"
                size="mini"
                @click="back"
            >返回</el-button>
        </div>
        <div class="add-container">
            <h3>待采购列表<i style="float:right" class="el-icon-circle-plus" @click="addMateriel"></i></h3>
            <el-form ref="form" :model="form" :rules="rules" label-width="0">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <template>
                            <el-table :data="form.list" style="width: 100%">
                                <el-table-column label="序号" type="index"></el-table-column>
                                <el-table-column prop="materielId" label="物料编号">
                                    <template slot-scope="scope">
                                        {{scope.row.materielCode}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="materielId" label="物料名称">
                                    <template slot-scope="scope">
                                        {{scope.row.materielName}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="purchaseDispose" label="实际采购配置">
                                </el-table-column>
                                <el-table-column prop="meteringName" label="单位">
                                </el-table-column>
                                <el-table-column prop="purchaseNumber" label="采购数量">
                                </el-table-column>
                                <el-table-column class="column-default" prop="supplierId" label="供应商">
                                    <template slot-scope="scope">
                                        <el-form-item style="margin-top:20px" :prop="'list.'+scope.$index+'.supplierId'" :rules="rules.supplierId">
                                            <el-select filterable size="small" v-model="scope.row.supplierId" placeholder="请选择供应商" @change="selectChange">
                                                <el-option v-for="item in supplierData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="purchaseMoney" label="采购单价/元" >
                                    <template slot-scope="scope">
                                        <el-form-item style="margin-top:20px" :prop="'list.'+scope.$index+'.purchaseMoney'" :rules="rules.purchaseMoney">
                                            <el-input size="small" v-model="scope.row.purchaseMoney" placeholder="采购单价(元)" @input="purchaseMoneyChange"></el-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="税率/%">
                                    <template slot-scope="scope">
                                        <!-- <el-form-item style="margin-top:20px" :prop="'list.'+scope.$index+'.ratio'" :rules="rules.ratio">
                                            <el-input size="small" v-model="scope.row.ratio" placeholder="税率"></el-input>
                                        </el-form-item> -->
                                        {{ratio}}
                                    </template>
                                </el-table-column>

                                <el-table-column label="采购总金额/元">
                                    <template slot-scope="scope">
                                        {{scope.row.purchaseMoney*scope.row.purchaseNumber}}
                                    </template>
                                </el-table-column>

                                <el-table-column label="税额/元">
                                    <template slot-scope="scope">
                                         <!-- <el-form-item style="margin-top:20px" :prop="'list.'+scope.$index+'.ratioMoney'" :rules="rules.ratioMoney">
                                            <el-input size="small" v-model="scope.row.ratioMoney" placeholder="税额"></el-input>
                                        </el-form-item> -->
                                        <!-- {{(scope.row.purchaseMoney/1.13*ratio/100).toFixed(2)}} -->
                                        {{purchaseMoney}}
                                    </template>
                                </el-table-column>

                                <el-table-column prop="quotationNo" label="报价单号">
                                    <template slot-scope="scope">
                                        <el-form-item style="margin-top:20px" :prop="'list.'+scope.$index+'.quotationNo'" :rules="rules.quotationNo">
                                            <el-input size="small" v-model="scope.row.quotationNo" placeholder="报价单号"></el-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="purchaseStatus" label="采购情况">
                                    <template slot-scope="scope">
                                        <el-form-item style="margin-top:20px" :prop="'list.'+scope.$index+'.purchaseStatus'" :rules="rules.purchaseStatus">
                                            <el-select filterable size="small" v-model="scope.row.purchaseStatus" placeholder="请选择采购情况">
                                                <el-option
                                                    v-for="dict in purchaseStatusOptions"
                                                    :key="dict.dictValue"
                                                    :label="dict.dictLabel"
                                                    :value="dict.dictValue"
                                                />
                                            </el-select>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column width="padding-right:20px" prop="purchaseTime" label="采购日期">
                                    <template slot-scope="scope">
                                        <el-form-item style="margin-top:20px" :prop="'list.'+scope.$index+'.purchaseTime'" :rules="rules.purchaseTime">
                                              <el-date-picker clearable size="small" style="width: 100%"
                                                :picker-options="orderDatePicker"
                                                v-model="scope.row.purchaseTime"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="采购日期">
                                            </el-date-picker>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="warranty" label="质保年限">
                                    <template slot-scope="scope">
                                        <el-form-item style="margin-top:20px" :prop="'list.'+scope.$index+'.warranty'" :rules="rules.warranty">
                                            <el-input size="small" v-model.number="scope.row.warranty" placeholder="质保年限"></el-input>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="expectArrivalTime" label="预计到货日期">
                                    <template slot-scope="scope">
                                        <el-form-item style="margin-top:20px" :prop="'list.'+scope.$index+'.expectArrivalTime'" :rules="rules.expectArrivalTime">
                                              <el-date-picker clearable size="small" style="width: 100%"
                                                :picker-options="orderDatePicker"
                                                v-model="scope.row.expectArrivalTime"
                                                type="date"
                                                value-format="yyyy-MM-dd"
                                                placeholder="预计到货日期">
                                            </el-date-picker>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <i class="el-icon-delete form-icon" @click.prevent="removeLine(scope.row)" v-show="scope.$index!=0"></i>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <h4>{{typePurchase_dictText}}</h4>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <h4>合计：采购总价：{{price?price.toFixed(2):''}}</h4>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="typePurchase_dictText == '直发客户'">
                    <el-col :span="4">
                        <el-form-item label="到货数量" label-width="80px">
                            <el-input v-model="form.number" placeholder="数量"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="入库状态" label-width="80px">
                            <el-select v-model="form.inStatus" placeholder="请选择入库状态" clearable size="small">
                            <el-option
                                v-for="dict in joinStatusOpstion"
                                :key="dict.dictValue"
                                :label="dict.dictLabel"
                                :value="dict.dictValue"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        
                         <el-form-item label="上传附件" label-width="80px">
                            <el-upload :limit="5" :on-remove="handleRemove" accept=".doc,.docx,.xlsx,.xls,.jpg,.png" :on-exceed="handleExceed" :on-change="fileChange" :http-request="requestUpload"  :file-list="fileList"  action="#"
                                :before-upload="beforeUpload" >
                                <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传jpg/png/doc/docx/xlsx/xls文件，且不超过10MB</div>
                            </el-upload>
                            <el-input v-model="form.purchaseFile"  placeholder="请输入内容" disabled v-show="false" />
                        </el-form-item>


                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-button class="ft-btn" @click="cancel">取 消</el-button>
                        <el-button class="ft-btn" type="primary" @click="submitForm(1)">确定</el-button>
                    </el-col>
                </el-row>
            </el-form>

            <!-- 采购物料 -->
            <el-dialog
                title="采购物料"
                :visible.sync="dialogVisible"
                width="600px"
                >
                    <el-form :model="ruleForm" :rules="materielRules" ref="ruleForm" label-width="110px">
                        <el-form-item label="物料名称" prop="materielId">
                            <el-cascader ref="myCascader" :props="optionProps" :options="materielData" v-model="ruleForm.materielId" @change="handleChange" :show-all-levels="false" placeholder="请选择物料名称" style="width:100%"></el-cascader>
                        </el-form-item>
                        <el-form-item label="实际采购配置" prop="purchaseDispose">
                            <el-input v-model="ruleForm.purchaseDispose"></el-input>
                        </el-form-item>
                        <el-form-item label="数量" prop="purchaseNumber">
                            <el-input v-model="ruleForm.purchaseNumber"></el-input>
                        </el-form-item>
                        <el-form-item label="单位" prop="meteringId">
                            <el-select filterable v-model="ruleForm.meteringId" placeholder="请选择单位" style="width:100%">
                                <el-option
                                    v-for="item in meteringData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                 ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addLine">确 定</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import { materielAll, meteringAll, uploadFile} from "@/api/order/orderParent";
    import { getSupplier, addPurchaseParent, getInfo, updatePurchaseParent } from "@/api/purchase/purchaseParent";
    export default {
        data() {
            return{
                id: null,
                title: '采购单-新增',
                form:{
                    number: 0,
                    list: [],
                    purchaseFile: [],
                },
                typePurchase_dictText:'采购入库',
                //入库状态
                joinStatusOpstion: [],
                //订单编号
                orderNumber:'',
                // 文件数组
                formData:[],
                fileList: [],
                // 表单校验
                rules: {
                    supplierId: [
                    { required: true, message: "请选择供应商", trigger: "blur" }
                    ],
                    purchaseMoney: [
                    { required: true, message: "请输入采购单价", trigger: "blur" },
                    // { type: 'number', message: '采购单价必须为数字'}
                    { pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "限小数点前9位数,后2位数", trigger: "blur" }
                    ],
                    purchaseStatus: [
                    { required: true, message: "请选择采购情况", trigger: "blur" }
                    ],
                    purchaseTime: [
                    { required: true, message: "请选择采购日期", trigger: "blur" }
                    ],
                    warranty: [
                        { required: true, message: "请输入质保年限", trigger: "blur" },
                        { type: 'number', message: '质保年限必须为数字'}
                    ],
                    expectArrivalTime: [
                    { required: true, message: "请选择预计到货日期", trigger: "blur" }
                    ],
                    quotationNo:[
                    { pattern:/^[0-9]{0,20}$/, message: "最多20位数字", trigger: "blur" } 
                    ],
                    //税率
                    ratio: [
                        { required: true, message: "税率必填", trigger: "blur" }
                    ],
                    //税额
                    ratioMoney: [
                        { required: true, message: "税额必填", trigger: "blur" }
                    ],
                },
                ratio: 0,
                //物料弹窗visible
                dialogVisible:false,
                // 物料下拉框
                materielData:[],
                optionProps:{
                    value: 'id',
                    currentLabels: 'label',
                    id: 'id',
                    code: 'code',
                    children: 'children'
                },
                // 计量单位下拉框
                meteringData :[],
                //供应商下拉框
                supplierData: [],
                // 采购状态字典
                purchaseStatusOptions: [],
                purchaseMoney: 0,
                //弹窗表单
                ruleForm: {
                    materielId:null,
                    purchaseDispose:null,
                    purchaseNumber:null,
                    meteringId:null,
                },
                materielRules: {
                    materielId: [
                        { required: true, message: '请选择物料名称', trigger: 'change' }
                    ],
                    purchaseDispose: [
                        { required: true, message: '请输入实际采购配置', trigger: 'blur' }
                    ],
                    purchaseNumber: [
                        { required: true, pattern:/^(([1-9]{1}\d{0,8})|(0{1}))(\.\d{0,2})?$/, message: "仅限小数点前最大9位数，后2位数", trigger: "blur" }
                    ],
                    meteringId: [
                        { required: true, message: '请选择单位', trigger: 'change' },
                    ],
                },
                //总价
                price:0,
                //图片上传
                picData:[],
                picFileList:[],
                orderDatePicker: this.orderDate()
            }
        },
        created() {
            this.id = this.$route.query.id;
            if(this.id != null){
                this.handleInfo(this.id);
            }
            this.getMaterielInfo();
            this.getmeteringInfo();
            this.getSupplierInfo();
            this.getDicts("purchase_status").then(response => {
                this.purchaseStatusOptions = response.data;
            });
            this.getDicts("purchase_info_inStatus").then(response =>{
                this.joinStatusOpstion = response.data;
            })
            //初始化重置文件集合
            this.fileList=[];
        },
        watch: {
            form: {
                handler(newName, oldName) {
                    let newPrice = 0;
                    newName.list.map(item => {
                        if(item.purchaseMoney !=null && item.purchaseMoney !='' && item.purchaseMoney != undefined){
                            newPrice = parseFloat(item.purchaseMoney)*parseFloat(item.purchaseNumber)+newPrice;
                        }
                    });
                    this.price = newPrice;
                },
                immediate: true,
                deep: true
            }
        },
        methods: {
            handleInfo(id){
                getInfo(id).then(res => {
                    this.form = res.data;
                    this.orderNumber = res.data.orderNumber;
                    this.typePurchase_dictText = res.data.typePurchase_dictText;
                    let that = this;
                    if(res.data.purchaseFileList){
                        if(res.data.purchaseFileList.length>0){
                            res.data.purchaseFileList.forEach(item => {
                                var obj = {};
                                that.$set(obj,'name',item.fileName);
                                that.$set(obj,'url',item.contractUrl);
                                that.$set(obj,'id',item.id);
                                that.fileList.push(obj);
                            })
                        }
                    }
                })
            },
            orderDate(){
                const self = this
                return {
                    disabledDate(time){
                        return Date.now() - 8.64e7 > time.getTime()
                    }
                }
            },
            // 跳转项目详情
            toOrderDetail(id){
                this.$router.push({path: '/order/orderAdd',query: { id:this.id ,type:1}})
            },
            /** 提交按钮 */
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if(this.id == null){
                            addPurchaseParent(this.form.list).then(response => {
                                if (response.code === 200) {
                                this.msgSuccess("添加成功");
                                this.$router.push({path:'/purchase/purchaseParent'})  
                                }
                            });
                        }else{
                            updatePurchaseParent(this.form).then(res => {
                                if (res.code === 200) {
                                    this.msgSuccess("修改成功");
                                this.$router.push({path:'/purchase/purchaseParent'})  
                                }
                            })
                        }
                        
                    }
                });
            },
            handleChange(value){
                var thsAreaCode = this.$refs;
                console.log(thsAreaCode);
                if(value){
                    var end = value[value.length-1];
                    this.ruleForm.materielId = end;
                }
                
            },
            // 表单重置
            reset() {
                this.form ={
                    number: 0,
                    list: [],
                    purchaseFile: [],
                },
                //初始化重置文件集合
                this.fileList=[];
                this.resetForm("form");
            },
            // 取消按钮
            cancel() {
                this.editVisible = false;
                this.reset();
            },
            // 物料下拉框
            getMaterielInfo(){
                materielAll().then(response=>{
                    this.materielData=response.data;
                })
            },
            // 计量单位下拉框
            getmeteringInfo(){
                meteringAll().then(response=>{
                    this.meteringData=response.data;
                })
            },
            //供应商下拉框
            getSupplierInfo(){
                getSupplier().then(res => {
                    this.supplierData=res.data;
                })
            },
            //返回
            back() {
                this.$router.go(-1);
            },
            addMateriel() {
                this.dialogVisible = true;
            },
            recursionFindObj(data,id){
                let result = null;
                if(!data){
                    return;
                }
                for(let i in data){
                    if(result !== null){
                        break;
                    }
                    var item = data[i];
                    if(item.id == id){
                        result = item;
                        break;
                    }else if(item.children){
                        result = this.recursionFindObj(item.children, id)
                    }
                }
                return result;
            },
            /** 添加一行 */
            addLine(){
                this.$refs["ruleForm"].validate(valid => {
                    if(valid){
                        let result = this.recursionFindObj(this.materielData,this.ruleForm.materielId);
                        this.form.list.push({
                            materielId:this.ruleForm.materielId,
                            purchaseDispose:this.ruleForm.purchaseDispose,
                            meteringId:this.ruleForm.meteringId,
                            purchaseNumber:this.ruleForm.purchaseNumber,
                            materielName:result.label,
                            materielCode:result.code,
                            meteringName:this.meteringData.map(item => {if(item.id == this.ruleForm.meteringId) return item.name}),
                            purchaseTime:new Date()
                        });
                        this.dialogVisible = false;
                        this.resetForm('ruleForm');
                    }
                })
            },
            removeLine(item){
                var index = this.form.list.indexOf(item)
                    if (index !== -1) {
                    this.form.list.splice(index, 1)
                }
            },

            /** 文件上传 */
            //上传之前检验文件
            beforeUpload(file){
                var fileSize = file.size / 1024 / 1024;
                if(fileSize > 10){
                    this.$message.error('文件不能超过10MB');
                    return false;
                }
                let fileName=file.name.substring(file.name.lastIndexOf('.')+1)
                const extension = fileName === 'png'
                const extension3 = fileName === 'jpg'
                const extension4 = fileName === 'xls'
                const extension5 = fileName === 'xlsx'
                const extension6 = fileName === 'doc'
                const extension7 = fileName === 'docx'
                if(!extension && !extension3 && !extension4 && !extension5 && !extension6 && !extension7) {
                    this.$message({
                        message: '只能上传jpg/png/doc/docx/xlsx/xls文件',
                        type: 'warning'
                    });
                    return false
                }
            },
            // 删除文件事件
            handleRemove(file, fileList){
                this.form.purchaseFile= 0;
                this.form.fileUrl=null
            },
            // 超出文件个数
            handleExceed(files, fileList){
                this.$message.warning(`当前限制最多五个文件上传，请先删除原文件再上传`);
            },
            //保存项目安装要求文件
            fileChange(file,fileList){
                let formdata = new FormData();
                formdata.append('file',file.raw);//传文件
                this.formData = formdata;
            },
            //文件上传
            requestUpload(file,fileList){
                const that = this;
                //项目安装要求
                uploadFile(this.formData).then(res => {
                    if(res.data){
                        that.form.purchaseFile = res.data.fileId;
                    }
                });
            },
            //显示税率
            selectChange(value){
                this.supplierData.map(item => {
                    if(item.id == value){
                        this.ratio = item.ratio;
                        this.purchaseMoney = (this.form.purchaseMoney/1.13*this.ratio/100).toFixed(2);
                    }
                });
            },
            purchaseMoneyChange(value){
                console.log(value);
                console.log(this.form.purchaseMoney);
                console.log(this.ratio);
                this.purchaseMoney = (value/1.13*this.ratio/100).toFixed(2);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .hd{
        margin-bottom: 20px;
        overflow: hidden;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
    }
    .title{
        float: left;
        height: 26px;
        line-height: 26px;
    }
    .back-btn{
        float: right;
    }
    .ft-btn{
        float: right;
        margin: 2rem 1rem 0 0;
    }
    .add-container{
        .el-table--medium th, .el-table--medium td,.el-table th, .el-table td{
            padding: 0 !important;
        }
        .column-default{
            padding: 0 !important;
        }
    }
</style>