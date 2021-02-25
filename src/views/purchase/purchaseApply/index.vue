<template>
    <div class="app-container">
        <div class="hd">
            <div class="title">采购单-申请</div>
            <el-button
                class="back-btn"
                type="primary"
                icon="el-icon-back"
                size="mini"
                @click="back"
            >返回</el-button>
        </div>
        <div class="add-container">
            <h3>采购单物料列表</h3>
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
                                <el-table-column prop="meteringId" label="单位">
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
                                <el-table-column label="采购金额">
                                    <template slot-scope="scope">
                                        {{scope.row.purchaseTotalMoney}}
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
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <i class="el-icon-circle-plus-outline form-icon" @click="addLine(scope.row)"></i>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <h4>采购下单</h4>
                    </el-col>
                </el-row>
            </el-form>

            <h3>入库列表</h3>
            <el-form ref="form" :model="form" label-width="0">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <template>
                            <el-table :data="applyForm.list" style="width: 100%">
                                <el-table-column label="序号" type="index"></el-table-column>
                                <el-table-column prop="materielCode" label="物料编号">
                                </el-table-column>
                                <el-table-column prop="materielName" label="物料名称">
                                </el-table-column>
                                <el-table-column prop="purchaseDispose" label="实际采购配置">
                                </el-table-column>
                                <el-table-column prop="meteringName" label="单位">
                                </el-table-column>
                                <el-table-column prop="purchaseNumber" label="采购数量">
                                </el-table-column>
                                <el-table-column prop="inJoinNumber" label="历史入库数量">
                                    <template slot-scope="scope">
                                        {{scope.row.inJoinNumber || 0}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="joinApplyNumber" label="入库数量">
                                    <template slot-scope="scope">
                                        <el-input size="small" v-model="scope.row.joinApplyNumber" placeholder="入库数量"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <i class="el-icon-delete form-icon" @click.prevent="removeLine(scope.row)"></i>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-button class="ft-btn" @click="cancel">取 消</el-button>
                        <el-button class="ft-btn" type="primary" @click="submitForm">保存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { getInfo, getApplyInfo, applyForIn } from "@/api/purchase/purchaseParent";
    export default {
        data() {
            return{
                id: null,
                title: '入库申请',
                form:{
                    list: []
                },
                applyForm:{
                    list:[]
                },
                typePurchase_dictText:'采购入库',
                //订单编号
                orderNumber:'',
                //总价
                price:0
            }
        },
        created() {
            this.id = this.$route.query.id;
            this.handleInfo(this.id);
            this.handleApplyInfo(this.id);
        },
        methods: {
            handleInfo(id){
                getInfo(id).then(res => {
                    console.log(res);
                    this.form = res.data;
                })
            },
            handleApplyInfo(id){
                getApplyInfo(id).then(res => {
                    this.applyForm.list = res.data;
                })
            },
            submitForm(){
                // this.$refs["applyForm"].validate(valid => {
                    // if (valid) {
                        let arr = [];
                        this.applyForm.list.map(item => {
                            arr.push({
                                id:item.id,
                                number: item.joinApplyNumber
                            })
                        })
                        console.log(arr);
                        applyForIn(arr,this.form.parentId).then(response => {
                            if (response.code === 200) {
                            this.msgSuccess("操作成功");
                            this.$router.push({path:'/purchase/purchaseParent'})  
                            }
                        });
                    // }
                // });
            },
            /** 添加一行 */
            addLine(row){
                console.log(row);
                console.log(this.applyForm);
                this.applyForm.list.push({
                    id:row.id,
                    materielName:row.materielName,
                    materielCode:row.materielCode,
                    purchaseDispose:row.purchaseDispose,
                    meteringName:row.meteringName,
                    purchaseNumber:row.purchaseNumber,
                    inJoinNumber:row.inJoinNumber,
                    joinApplyNumber:'',
                });
            },
            removeLine(item){
                var index = this.applyForm.list.indexOf(item)
                    if (index !== -1) {
                    this.applyForm.list.splice(index, 1)
                }
            },
            // 取消按钮
            cancel() {
                
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