<template>
    <div class="app-container">
        <div class="hd">
            <div class="title">维修列表-详情</div>
            <el-button
                class="back-btn"
                type="primary"
                icon="el-icon-back"
                size="mini"
                @click="back"
            >返回</el-button>
        </div>
        <el-form ref="form" :model="detailForm" v-loading="detailLoading" label-width="120px">
        <div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="报修日期" prop="toRepairTime">
                <el-input v-model="detailForm.toRepairTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="需要上门时间" prop="toComeTime">
                <el-input v-model="detailForm.toComeTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="对应销售" prop="salesman">
                <el-input v-model="detailForm.salesman" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户名称" prop="customerCompanyName">
                <el-input v-model="detailForm.customerCompanyName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系电话" prop="salesmanPhone">
                <el-input v-model="detailForm.salesmanPhone" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="customerUser">
                <el-input v-model="detailForm.customerUser" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="订单编号" prop="orderNumber">
                <el-input v-model="detailForm.orderNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户电话" prop="customerPhone">
                <el-input v-model="detailForm.customerPhone" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="故障现象" prop="reason">
                <el-input v-model="detailForm.reason" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户地址" prop="customerAddress">
                <el-input v-model="detailForm.customerAddress" disabled />
              </el-form-item>
            </el-col>
          </el-row>
         
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="成本类型" prop="costTypeName">
                <el-input v-model="detailForm.costTypeName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成本费" prop="costMoney">
                <el-input v-model="detailForm.costMoney" disabled >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="detailForm.remark" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="提交部门" prop="createDeptName">
                <el-input v-model="detailForm.createDeptName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="提交人员" prop="createName">
                <el-input v-model="detailForm.createName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="detailForm.auditStatus == 0">
            <el-col :span="12">
              <el-form-item label="审核结果" prop="auditStatus">
                <el-input :value="detailForm.auditStatus == 0?'待审核':detailForm.auditStatus == 1?'已通过':detailForm.auditStatus == 2?'未通过':'/'" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="detailForm.auditStatus == 2 || detailForm.auditStatus == 1">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="审核结果" prop="auditStatus">
                <el-input :value="detailForm.auditStatus == 0?'待审核':detailForm.auditStatus == 1?'已通过':detailForm.auditStatus == 2?'未通过':'/'" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核结果说明" prop="auditRemark">
                <el-input v-model="detailForm.auditRemark" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="审核人员" prop="auditUserName">
                <el-input v-model="detailForm.auditUserName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="接受指派人员" prop="assignmentUserName">
                <el-input v-model="detailForm.assignmentUserName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="审核日期" prop="auditTime">
                <el-input v-model="detailForm.auditTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="指派日期" prop="assignmentTime">
                <el-input v-model="detailForm.assignmentTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="detailForm.repairStatus == 2">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="实际到达时间" prop="realComeTime">
                <el-input v-model="detailForm.realComeTime" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" prop="repairEndTime">
                <el-input v-model="detailForm.repairEndTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="服务时间" prop="serviceTime">
                <el-input v-model="detailForm.serviceTime" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="是否收费" prop="isNeedMoney">
                <el-input v-model="detailForm.isNeedMoney" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="人工费" prop="materialsMoney">
                <el-input v-model="detailForm.materialsMoney" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="材料费" prop="labourMoney">
                <el-input v-model="detailForm.labourMoney" disabled>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="问题描述" prop="problemRemark">
                <el-input type="textarea" :rows="2" v-model="detailForm.problemRemark" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="维修方案" prop="solution">
                <el-input type="textarea" :rows="2" v-model="detailForm.solution" disabled />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="收费合计" prop="totalMoney">
                <span v-if="detailForm.totalMoney">{{'￥'+detailForm.totalMoney+'元'}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="图片" prop="pic">
                <span v-if="detailForm.pic==null">暂无图片</span>
                <div v-if="detailForm.pic!=null">
                  <el-image style="width:200px" v-for="url in detailForm.pic" :key="url" :src="url" lazy></el-image>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
</template>
<script>
import { getRepairDetail } from "@/api/repair/repair";

export default {
    data() {
        return {
            detailLoading: true,
            id: null,
            detailForm: {},
        }
    },
    created() {
        this.id = this.$route.query.id
        this.handleDetail(this.id);
    },
    methods: {
        handleDetail(id) {
            this.detailVisible = true;
            getRepairDetail(id).then(response => {
                let obj = response.data.obj==null?{}:response.data.obj;
                let detail = response.data.detail==null?{}:response.data.detail;
                detail.isNeedMoney = detail.isNeedMoney==1?'收费':'免费';
                let newObj = {};
                this.detailForm = Object.assign(newObj,detail,obj);
                this.detailForm.pic = this.detailForm.pic.split(',');
                this.detailLoading = false;
            }).catch(error => {
                this.detailLoading = false;
            })
            console.log(this.detailForm);
        },
        back() {
            this.$router.go(-1);

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
</style>