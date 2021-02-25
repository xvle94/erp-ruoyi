<template>
    <div class="app-container">
        <div class="hd">
            <div class="title">采购单-详情</div>
            <el-button
                class="back-btn"
                type="primary"
                icon="el-icon-back"
                size="mini"
                @click="back"
            >返回</el-button>
        </div>
        <div class="add-container">
            <div v-if="this.orderNumber!=''">订单编号：<el-link @click="toOrderDetail()" type="primary">{{orderNumber}}</el-link></div>
            <h3 v-else>待采购列表</h3>
            <el-form ref="form" :model="form" label-width="0">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <template>
                            <el-table :data="form.list" style="width: 100%">
                                <el-table-column label="序号" type="index"></el-table-column>
                                <el-table-column prop="materielCode" label="物料编号">
                                    <template slot-scope="scope">
                                        {{scope.row.materielCode}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="materielName" label="物料名称">
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
                                        {{scope.row.supplierName}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="purchaseMoney" label="采购单价/元">
                                    <template slot-scope="scope">
                                        {{scope.row.purchaseMoney}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="税率/%">
                                    <template slot-scope="scope">
                                        {{scope.row.ratio}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="采购总金额/元">
                                    <template slot-scope="scope">
                                        {{scope.row.purchaseTotalMoney}}
                                    </template>
                                </el-table-column>
                                 <el-table-column label="税额/元">
                                    <template slot-scope="scope">
                                        {{scope.row.ratioMoney}}
                                    </template>
                                </el-table-column>

                                <el-table-column prop="quotationNo" label="报价单号">
                                    <template slot-scope="scope">
                                        {{scope.row.quotationNo}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="purchaseStatus_dictText" label="采购情况">
                                    <template slot-scope="scope">
                                        {{scope.row.purchaseStatus_dictText}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="purchaseTime" label="采购日期">
                                    <template slot-scope="scope">
                                        {{scope.row.purchaseTime}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="warranty" label="质保年限">
                                    <template slot-scope="scope">
                                        {{scope.row.warranty}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="expectArrivalTime" label="预计到货日期">
                                    <template slot-scope="scope">
                                        {{scope.row.expectArrivalTime}}
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
                        <h4>合计：采购总价：{{purchaseMoney}}</h4>
                    </el-col>
                </el-row>

                <el-row :gutter="20" v-if="typePurchase_dictText == '直发客户'">
                    <el-col :span="4">
                        <el-form-item label="到货数量" label-width="80px">
                            <el-input v-model="number" placeholder="数量" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="入库状态" label-width="80px">
                            <el-select v-model="inStatus" placeholder="请选择入库状态" clearable size="small" disabled>
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
                           
                            <template v-if="form.purchaseFileList==null">
                                <el-link type="primary" disabled>暂无</el-link>
                                </template>
                                <template v-else>
                                <el-link v-for="(item,index) in form.purchaseFileList" :href="item.contractUrl" type="primary" target="_blank">{{item.fileName}}</el-link>
                            </template>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </div>
    </div>
</template>
<script>
    import { getSupplier, addPurchaseParent, getInfo, updatePurchaseParent } from "@/api/purchase/purchaseParent";
    export default {
        data() {
            return{
                id: null,
                title: '采购单-新增',
                form:{
                    list: []
                },
                typePurchase_dictText:'采购入库',
                //订单编号
                orderNumber:'',
                //总价
                price:0,
                //到货数量
                number: 0,
                //入库状态
                inStatus: null,
                 //入库状态
                joinStatusOpstion: [],
                // 文件数组
                formData:[],
                fileList: [],
                purchaseMoney: 0,
            }
        },
        created() {
            this.id = this.$route.query.id;
            this.handleInfo(this.id);
            this.getDicts("purchase_info_inStatus").then(response =>{
                this.joinStatusOpstion = response.data;
            })
        },
        methods: {
            handleInfo(id){
                getInfo(id).then(res => {
                    this.form = res.data;
                    this.orderNumber = res.data.orderNumber;
                    this.typePurchase_dictText = res.data.typePurchase_dictText;
                    this.purchaseMoney = res.data.purchaseMoney;
                    this.number = res.data.number;
                    this.inStatus = res.data.inStatus;
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
            // 跳转项目详情
            toOrderDetail(id){
                this.$router.push({path: '/order/orderAdd',query: { id:this.id ,type:1}})
            },
            //返回
            back() {
                this.$router.go(-1);
            },
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
</style>