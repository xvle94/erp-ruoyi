<template>
    <div class="app-container">
        <div class="hd">
            <div class="title">采购单-审核</div>
            <el-button
                class="back-btn"
                type="primary"
                icon="el-icon-back"
                size="mini"
                @click="back"
            >返回</el-button>
        </div>
        <div class="add-container">
            <h3>待采购列表</h3>
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
                                <el-table-column prop="purchaseMoney" label="采购单价(元)">
                                    <template slot-scope="scope">
                                        {{scope.row.purchaseMoney}}
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
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注" label-width="40px">
                            <el-input size="small" v-model="remark" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-button class="ft-btn" type="danger" @click="submitForm('no')">不通过</el-button>
                        <el-button class="ft-btn" type="success" @click="submitForm('yes')">通过</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { getInfo, pass, notPass } from "@/api/purchase/purchaseParent";
    export default {
        data() {
            return{
                id: null,
                title: '采购单-审核',
                form:{
                    list: [],
                },
                typePurchase_dictText:'采购入库',
                //备注
                remark:'',
                //总价
                purchaseMoney:null
            }
        },
        created() {
            this.id = this.$route.query.id;
            this.handleInfo(this.id);
        },
        methods: {
            handleInfo(id){
                getInfo(id).then(res => {
                    console.log(res);
                    this.form = res.data;
                    this.typePurchase_dictText = res.data.typePurchase_dictText;
                    this.purchaseMoney = res.data.purchaseMoney;
                })
            },
            submitForm(type){
                console.log(this.form);
                console.log(this.remark);
                let params = {
                    parentId: this.form.parentId,
                    remark: this.remark,
                }
                if(type == 'yes'){
                    pass(params).then(res => {
                        if(res.code == 200){
                            this.msgSuccess("操作成功");
                            this.$router.push({path:'/purchase/purchaseParent'}); 
                        }
                    })
                }else if(type == 'no'){
                    if(this.remark == '' || this.remark == null){
                        this.msgError("请填写备注");
                    }else{
                        notPass(params).then(res => {
                            if(res.code == 200){
                                this.msgSuccess("操作成功");
                                this.$router.push({path:'/purchase/purchaseParent'}); 
                            }
                        })
                    }
                    
                }
                
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