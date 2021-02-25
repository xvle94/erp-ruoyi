<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getOrderStatistics } from "@/api/index";

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
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  created(){
    this.getOrderStatistics();
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
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['待采购', '待送货', '已完成']
        },
        series: [
          {
            name: '销售订单统计',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: this.toSend, name: '待采购' },
              { value: this.toPurchase, name: '待送货' },
              { value: this.finish, name: '已完成' },
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    getOrderStatistics(){
      getOrderStatistics(this.queryParams).then(response => {
        this.toSend = response.data.toSend
        this.toPurchase= response.data.toPurchase
        this.finish= response.data.finish
        this.initChart()
      });
    },
    init(params){
      this.queryParams = params;
      this.getOrderStatistics()
    }
  }
}
</script>
