<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :md="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="documentation" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            销售单(单)
          </div>
          <span class="num">{{lineChartData.total}}</span>
          <!-- <count-to :start-val="0" :end-val="lineChartData.total" :duration="2600" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :md="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            销售金额(万元)
          </div>
          <span class="num">{{lineChartData.totalSale}}</span>
          <!-- <count-to :start-val="0" :end-val="lineChartData.totalSale" :duration="3000" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :md="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已开票待回款(万元)
          </div>
          <span class="num">{{lineChartData.kaiDai}}</span>
          <!-- <count-to :start-val="0" :end-val="lineChartData.kaiDai" :duration="3200" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :md="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            未开票待回款(万元)
          </div>
          <span class="num">{{lineChartData.unkaiDai}}</span>
          <!-- <count-to :start-val="0" :end-val="lineChartData.unkaiDai" :duration="3600" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :md="12" :sm="12" :lg="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="skill" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            已回款(万元)
          </div>
          <span class="num">{{lineChartData.returnMoney}}</span>
          <!-- <count-to :start-val="0" :end-val="lineChartData.returnMoney" :duration="3600" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getSalesTotal } from "@/api/index";

export default {
  components: {
    CountTo
  },
  data() {
    return {
      lineChartData:{},
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
      queryParams:{
        timeType:'1',
        projectType:'',
      }
    }
  },
  created(){
     this.getSalesTotal();
  },
  methods: {
    getSalesTotal(){
      getSalesTotal(this.queryParams).then(response => {
        this.lineChartData = response.data;
      });
    },
    init(params){
      this.queryParams = params;
      this.getSalesTotal()
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
  .num{
    font-size: 20px;
    font-weight: bold
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
