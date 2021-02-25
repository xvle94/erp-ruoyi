<template>
  <div class="dashboard-editor-container"  v-if="this.roleKey == 'admin'">
    <div>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="时间类型" prop="timeType">
          <el-select v-model="queryParams.timeType" size="small" @change="handleQuery">
            <el-option v-for="dict in timeTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-select v-model="queryParams.projectType" size="small" @change="handleQuery">
            <el-option v-for="dict in projectTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <panel-group ref="child1"/>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <h3>销售金额统计</h3>
          <bar-chart ref="child2"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <h3>待办事项</h3>
          <card-group/>
        </div>
      </el-col>
    </el-row>

     <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <h3>销售订单统计</h3>
          <pie-chart ref="child3"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <h3>采购统计</h3>
          <Doughnut-Chart ref="child4"/>
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :xs="16" :sm="16" :lg="18">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" ref="child5"/>
        </div>
      </el-col>
      <el-col :xs="16" :sm="8" :lg="6">
        <div class="chart-wrapper">
          <h3>应收应付统计 
            <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >导出</el-button>
          </h3>
          <h4>应收(万元)  {{total.totalReceive}}</h4>
          <h4>应付(万元)  {{total.totalPay}}</h4>
          <h4>应收比应付多(万元)  {{total.diff}}</h4>
        </div>
      </el-col>
    </el-row>
    
  </div>

  <div class="dashboard-editor-container" v-else>
    <div>
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="时间类型" prop="timeType">
          <el-select v-model="queryParams.timeType" clearable size="small" @change="handleQuery">
            <el-option v-for="dict in timeTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-select v-model="queryParams.projectType" clearable size="small" @change="handleQuery">
            <el-option v-for="dict in projectTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <h3>待办事项</h3>
          <card-group/>
        </div>
      </el-col>
    </el-row>
    <panel-group ref="child1"/>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :xs="16" :sm="16" :lg="18">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" ref="child5"/>
        </div>
      </el-col>
      <el-col :xs="16" :sm="8" :lg="6">
        <div class="chart-wrapper">
          <h3>应收应付统计
            <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
          >导出</el-button>
          </h3>
          <h4>应收(万元)  {{total.totalReceive}}</h4>
          <h4>应付(万元)  {{total.totalPay}}</h4>
          <h4>应收比应付多(万元)  {{total.diff}}</h4>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getSalesTotal } from "@/api/index";
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import CardGroup from './dashboard/CardGroup'
import DoughnutChart from './dashboard/DoughnutChart'
import { getARAP,getRole, getExport } from "@/api/index";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    CardGroup,
    DoughnutChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      total:{},
      queryParams:{
        timeType:'1',
        projectType:'',
      },
       // 项目类型
      projectTypeOptions: [
        {"dictValue": "1", "dictLabel": "项目"},
        {"dictValue": "0", "dictLabel": "非项目"},
      ],
      // 时间类型
      timeTypeOptions: [
        {"dictValue": "2", "dictLabel": "年"},
        {"dictValue": "1", "dictLabel": "月"},
        {"dictValue": "0", "dictLabel": "周"},
      ],
      roleKey:'',
    }
  },
  created(){
    this.getARAP();
    this.getRole()
  },
  methods: {
    getARAP(){
      getARAP(this.queryParams).then(response => {
        this.total=response.data
      });
    },
    handleQuery(){
      this.getARAP();
      this.$refs.child1.init(this.queryParams);
      this.$refs.child2.init(this.queryParams);
      this.$refs.child3.init(this.queryParams);
      this.$refs.child4.init(this.queryParams);
      this.$refs.child5.init(this.queryParams);
    },
    getRole(){
      getRole().then(response => {
        var el = response.data[response.data.length - 1]
        this.roleKey=el.roleKey
        console.log(this.roleKey)
      });
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有应收应付统计数据?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return getExport(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  h3 .el-button--warning{
    float: right;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
