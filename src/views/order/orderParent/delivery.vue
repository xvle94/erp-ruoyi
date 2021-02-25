<template>
    <div class="app-container">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="订单编号" prop="orderNo">
                <el-link @click="toOrderDetail(form.id)" type="primary">{{form.orderNo}}</el-link>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="24">
                <template>
                    <h4>订单物料列表</h4>
                    <el-table :data="form.infoList" style="width: 100%">
                        <el-table-column label="序号" type="index">
                        </el-table-column>
                        <el-table-column prop="id" label="物料编号">
                            <template slot-scope="scope">
                                <el-cascader v-model="scope.row.materielId" :props="optionProps2" :disabled="true" :options="materielData" :show-all-levels="false"></el-cascader>
                            </template>
                        </el-table-column>
                        <el-table-column prop="materielId" label="物料名称">
                            <template slot-scope="scope">
                                <el-cascader v-model="scope.row.materielId" :props="optionProps" :disabled="true" :options="materielData" :show-all-levels="false"></el-cascader>
                            </template>
                        </el-table-column>
                        <el-table-column prop="modelDispose" label="实际供货配置">
                            <template slot-scope="scope">
                            <el-input v-model="scope.row.modelDispose" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="meteringId" label="计量单位">
                            <template slot-scope="scope">
                            <el-select v-model="scope.row.meteringId" :disabled="true">
                                <el-option v-for="item in meteringData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="number" label="订单数量">
                            <template slot-scope="scope">
                            <el-input v-model="scope.row.number" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="inventoryNumber" label="库存数量">
                            <template slot-scope="scope">
                            <el-input v-model="scope.row.inventoryNumber" :disabled="true"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="handle" label="加入发货列表">
                            <template slot-scope="scope">
                                <i class="el-icon-s-promotion form-icon" @click="addData(scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                </el-col>
            </el-row>
        </el-form>
        <el-form ref="form2" :model="form2" :rules="rules">
            <div class="purchaseList">
            <el-row :gutter="20">
                <el-col :span="24">
                <template>
                    <div class="addList"><h4>待送货列表</h4><el-button type="primary" icon="el-icon-plus" @click="addDelivery">添加物料</el-button></div>
                    <el-table :data="form2.infoList" style="width: 100%">
                        <el-table-column label="序号" type="index">
                        </el-table-column>
                        <el-table-column prop="materielId" label="物料编号">
                            <template slot-scope="scope">
                                <el-form-item>
                                <el-cascader placeholder="/" v-model="scope.row.materielId" :disabled="true" :props="optionProps2" :options="materielData" :show-all-levels="false"></el-cascader>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="materielId" label="物料名称">
                            <template slot-scope="scope">
                                <el-form-item>
                                 <el-cascader v-model="scope.row.materielId" :disabled="true" :props="optionProps" :options="materielData" :show-all-levels="false"></el-cascader>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="实际采购配置">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infoList.' + scope.$index + '.purchaseDispose'" :rules="rules.purchaseDispose">
                                    <el-input v-model="scope.row.purchaseDispose" :disabled="true"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="meteringId" label="计量单位">
                            <template slot-scope="scope">
                                <el-form-item>
                                    <el-select v-model="scope.row.meteringId" :disabled="true">
                                        <el-option v-for="item in meteringData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="送货数量">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infoList.' + scope.$index + '.purchaseNumber'" :rules="rules.purchaseNumber">
                                    <el-input v-model="scope.row.purchaseNumber"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="仓库">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infoList.' + scope.$index + '.warehouseId'" :rules="rules.warehouseId">
                                    <el-select filterable @change="changeWarehouse(scope.row)" v-model="scope.row.warehouseId">
                                        <el-option v-for="item in warehouseData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <span>{{nowNumber}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="质保年限">
                            <template slot-scope="scope">
                                <el-form-item :prop="'infoList.' + scope.$index + '.purchase'" :rules="rules.purchase">
                                    <el-input v-model="scope.row.purchase"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="number" label="操作">
                            <template slot-scope="scope">
                                <el-form-item>
                                <i class="el-icon-delete form-icon" @click.prevent="removeLine(scope.row)"></i>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div class="page-footer">
                        <el-button type="primary" @click="submitForm">确认</el-button>
                        <el-button @click="cancel">取 消</el-button>
                    </div>
                </el-col>
            </el-row>
            </div>
        </el-form>
        <!-- 添加 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form3" :model="form3" :rules="rules" label-width="100px">
                <el-form-item label="物料名称" prop="materielId">
                    <el-select filterable v-model="form3.materielId" placeholder="请选择订单类型" clearable style="width:100%" @change="changeMateriel">
                        <el-option
                            v-for="dict in inventorydata"
                            :key="dict.materielId"
                            :label="dict.materielName"
                            :value="dict.materielId"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="送货数量" prop="number">
                    <el-input v-model="form3.number" placeholder="请输入送货数量" />
                </el-form-item>
                <el-form-item label="单位" prop="meteringId">
                    <el-select filterable v-model="form3.meteringId" placeholder="请选择单位" >
                        <el-option v-for="item in meteringData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm3">确 定</el-button>
                <el-button @click="modalCancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>  
</template>

<script>
import { getOrderParent, materielAll, meteringAll, getDelivery, getInventoryInfo, getInventoryCount, getWarehouse} from "@/api/order/orderParent";

export default {
//   name: "purchase",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      value:[],
      // 物料下拉框
      materielData:[],
      // 计量单位下拉框
      meteringData :[],
      // 表单参数
      form: {},
      form2:{},
      form3:{},
      // 表单校验
      rules: {
        warehouseId: [
          { required: true, message: "仓库不能为空", trigger: "blur" }
        ],
        purchaseNumber: [
          { required: true, message: "送货数量不能为空", trigger: "blur" }
        ],
        purchase:[
          { pattern:/^([1-9][0-9]{0,2})$/, message: "最多三位正整数", trigger: "blur" } 
        ]
      },
      optionProps:{
        value: 'id',
        label: 'label',
        children: 'children'
      },
      optionProps2:{
        value: 'id',
        label: 'code',
        children: 'children'
      },
      //库存物料数据
      inventorydata:[],
      //仓库数据
      warehouseData:[],
      //  库存数量
      nowNumber:0
    };
  },
  created() {
    this.handleDetail();
    this.getMaterielInfo();
    this.getmeteringInfo();
    this.getWarehouse();
  },
  methods: {
    handleChange(value,index){
      console.log(value);
      var end = value[value.length-1]
      this.form2.infoList[index].materielId=end
    },
    // 取消按钮
    cancel() {
      this.$router.push({path:'/order/orderParent'})  
      this.reset();
    },
    modalCancel(){
        this.open = false;
        this.reset2();
    },
    // 表单重置
    reset() {
      this.form = {
        infoList:[{
            materielId:null,
            meteringId:null,
            money:0,
            number:null,
            modelDispose:null,
            purchase:null
        }]
      };
      this.resetForm("form");
    },
    reset2(){
      this.form3 = {
          materielId:null,
          meteringId:null,
          purchaseNumberv:null
      };
      this.resetForm("form3");
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
    /** 提交按钮 */
    submitForm() {
      this.$refs["form2"].validate(valid => {
        if (valid) {
            this.form2.orderId=this.$route.query.id
            getDelivery(this.form2).then(response => {
                if (response.code === 200) {
                    this.msgSuccess("提交成功");
                    this.$router.push({path:'/order/orderParent'})  
                }
            });
        }
      });
    },
    /** 添加一行 */
    addData(row){
        if(this.form2.infoList==null){
            this.form2 = {
                infoList:[{
                    materielId:row.materielId,
                    purchaseDispose:row.modelDispose,
                    meteringId:row.meteringId,
                    orderNumber:row.number,
                }]
            };
        }else{
            this.form2.infoList.push({
                materielId:row.materielId,
                purchaseDispose:row.modelDispose,
                orderNumber:row.number,
                meteringId:row.meteringId
            });
        }
    },
    removeLine(item){
      var index = this.form2.infoList.indexOf(item)
        if (index !== -1) {
          this.form2.infoList.splice(index, 1)
        }
    },
    // 查询下单详情
    handleDetail(){
        this.reset();
        var id=this.$route.query.id
        getOrderParent(id).then(response => {
          this.form = response.data;
        });
    },
    addDelivery(){
        this.reset2();
        this.open = true;
        this.getInventoryInfo();
    },
    //查询库存中全部物料 
    getInventoryInfo(){
      getInventoryInfo().then(response=>{
        this.inventorydata=response.data;
      })
    },
    // 选择物料时 查询库存配置、计量单位
    changeMateriel(value){
        console.log(value)
        let data=this.inventorydata.map((item,index) =>{
          if(value==item.materielId){
            this.form3.purchaseDispose=item.purchaseDispose
            this.form3.meteringId=parseInt(item.meteringId)
          }
        });
    },
    submitForm3(){
        this.$refs["form3"].validate(valid => {
            if (valid) {
                if(this.form2.infoList==null){
                    this.form2 = {
                        infoList:[{
                            materielId:this.form3.materielId,
                            purchaseDispose:this.form3.purchaseDispose,
                            meteringId:this.form3.meteringId,
                            purchaseNumber:this.form3.number,
                            orderNumber:this.form3.number,
                        }]
                    };
                }else{
                    this.form2.infoList.push({
                        materielId:this.form3.materielId,
                        purchaseDispose:this.form3.modelDispose,
                        meteringId:this.form3.meteringId,
                        purchaseNumber:this.form3.number
                    });
                }
                this.open=false
            }
      });
    },
    // 查询仓库
    getWarehouse(){
      getWarehouse().then(response=>{
        this.warehouseData=response.data;
      })
    },
    // 仓库
    changeWarehouse(row){
        var param={
            materielId:row.materielId,
            purchaseDispose:row.purchaseDispose,
            meteringId:row.meteringId,
            warehouseId:row.warehouseId
        }
        getInventoryCount(param).then(response=>{
            this.nowNumber=response.data.nowNumber;
        })
    },
     // 跳转项目详情
    toOrderDetail(id){
      this.$router.push({path: '/order/orderAdd',query: { id:id ,type:1}})
    }
  }
};
</script>
<style>
  .el-select{
    width: 100%
  }
  .form-box{
      padding: 2rem
  }
  .page-footer .el-button{
      float: right;
      margin: 1rem 1rem 0 0;
  }
  .form-icon{
    font-size: 24px;
    margin-right: 8px;
    line-height: 34px;
  }
  .el-upload .el-button{
    margin: 0rem 1rem 0 0;
  }
  .titles{
    margin-top: 0
  }
  .is-disabled .el-input__suffix{
    display: none;
  }
  .el-table{
    margin-bottom: 1.8rem;
  }
  .addList h4{
      display: inline-block;
  }
  .addList .el-button{
      margin-top: 14px;
      float: right
  }
  .purchaseList .el-form-item {
    margin-bottom: 18px;
  }
</style>

