<template>
    <div class="app-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="订单编号" prop="orderNo">
          <el-link @click="toOrderDetail(form.id)" type="primary">{{form.orderNo}}</el-link>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="24">
            <template>
              <h4>订单明细</h4>
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
                  <el-table-column prop="number" label="库存数量">
                      <template slot-scope="scope">
                      <el-input v-model="scope.row.number" :disabled="true"></el-input>
                      </template>
                  </el-table-column>
                  <el-table-column prop="number" label="采购数量">
                      <template slot-scope="scope">
                      <el-input v-model="scope.row.number" :disabled="true"></el-input>
                      </template>
                  </el-table-column>
                  <el-table-column prop="number" label="加入采购单">
                      <template slot-scope="scope">
                          <i class="el-icon-shopping-cart-2 form-icon" @click="addData(scope.row)"></i>
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
                <div class="addList"><h4>待采购列表</h4><el-button type="primary" icon="el-icon-plus" @click="addLine">添加物料</el-button></div>
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
                              <el-cascader filterable v-model="scope.row.materielId" @change="handleChange($event,scope.$index)" :props="optionProps" :options="materielData" :show-all-levels="false"></el-cascader>
                            </el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column label="实际采购配置">
                          <template slot-scope="scope">
                              <el-form-item :prop="'infoList.' + scope.$index + '.purchaseDispose'" :rules="rules.modelDispose">
                                  <el-input v-model="scope.row.purchaseDispose"></el-input>
                              </el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column label="采购数量">
                          <template slot-scope="scope">
                              <el-form-item :prop="'infoList.' + scope.$index + '.purchaseNumber'" :rules="rules.purchaseNumber">
                                  <el-input v-model="scope.row.purchaseNumber"></el-input>
                              </el-form-item>
                          </template>
                      </el-table-column>
                      <el-table-column prop="meteringId" label="计量单位">
                          <template slot-scope="scope">
                              <el-form-item>
                                  <el-select filterable v-model="scope.row.meteringId">
                                      <el-option v-for="item in meteringData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                  </el-select>
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
                <div>
                <el-form-item prop="typePurchase">
                  <el-radio-group v-model="form2.typePurchase">
                      <el-radio label="tp01">直发客户</el-radio>
                      <el-radio label="tp02">采购入库</el-radio>
                  </el-radio-group>
                </el-form-item>
                </div>
              </template>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <div class="page-footer">
                  <el-button type="primary" @click="submitForm()">确认</el-button>
                  <el-button @click="cancel">取 消</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
</template>

<script>
import { getOrderParent, materielAll, meteringAll, getPurchase} from "@/api/order/orderParent";

export default {
  // name: "purchase",
  data() {
    return {
      id: null,
      // 标题
      title: "",
      value:[],
      // 物料下拉框
      materielData:[],
      // 计量单位下拉框
      meteringData :[],
      // 表单参数
      form: {},
      form2:{},
      // 表单校验
      rules: {
        modelDispose: [
          { required: true, message: "实际采购配置不能为空", trigger: "blur" }
        ],
        purchaseNumber: [
          { required: true, message: "采购数量不能为空", trigger: "blur" }
        ],
        typePurchase:[
          { required: true, message: "直发和入库必选一项", trigger: "blur" }
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
      }
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.handleDetail(this.id);
    this.getMaterielInfo();
    this.getmeteringInfo();
  },
  methods: {
    handleChange(value,index) {
      console.log(value);
      var end = value[value.length-1]
      this.form2.infoList[index].materielId=end
    },
    // 取消按钮
    cancel() {
      this.$router.push({path:'/order/orderParent'})  
      this.reset();
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
            getPurchase(this.form2).then(response => {
                if (response.code === 200) {
                    this.msgSuccess("提交成功");
                    this.$router.push({path:'/order/orderParent'})  
                }
            });
        }
      });
    },
    /** 添加一行 */
    addLine(){
       if(this.form2.infoList==null){
            this.form2 = {
                infoList:[{
                }]
            };
       }else{
            this.form2.infoList.push({});
       }
    },
    addData(row){
        if(this.form2.infoList==null){
            this.form2 = {
                infoList:[{
                    materielId:row.materielId,
                    purchaseDispose:row.modelDispose,
                    purchaseNumber:row.number,
                    meteringId:row.meteringId
                }]
            };
        }else{
            this.form2.infoList.push({
                    materielId:row.materielId,
                    purchaseDispose:row.modelDispose,
                    purchaseNumber:row.number,
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
    handleDetail(id){
      this.reset();
      getOrderParent(id).then(response => {
        this.form = response.data;
      });
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
    float: right;
    margin-top: 14px
  }
  .purchaseList .el-form-item {
    margin-bottom: 18px;
  }
</style>

