<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getSalesAmount } from "@/api/index";


const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      queryParams:{
        timeType:'1',
        projectType:'',
      },
      xData:[]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  created(){
    this.getSalesAmount();
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.xData,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '销售金额',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.yData,
          animationDuration
        }]
      })
    },
    getSalesAmount(){
      getSalesAmount(this.queryParams).then(response => {
        this.barChartData = response.data;
        this.xData = response.data.map(item => item.title)
        this.yData = response.data.map(item => item.money)
        this.initChart()
      });
    },
    init(params){
      this.queryParams = params;
      this.getSalesAmount()
    }
  }
}
</script>
