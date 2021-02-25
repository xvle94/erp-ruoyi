<template>
    <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getARAP } from "@/api/index";

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      queryParams:{
        timeType:'1',
        projectType:'',
      },
      time:[],
      receive:[],
      pay:[],
      total:{}
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  created(){
    this.getARAP();
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      this.setOptions(this.chartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data:this.time,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['应收', '应付']
        },
        series: [{
          name: '应收', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: this.receive,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '应付',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.pay,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    getARAP(){
      getARAP(this.queryParams).then(response => {
        // 应收列表	
        this.total=response.data
        this.receive = response.data.receive.map(item => item.money)
        // 应付列表	
        this.pay = response.data.pay.map(item => item.money)
        this.time = response.data.pay.map(item => item.dateTime)
        this.initChart()
      });
    },
    init(params){
      this.queryParams = params;
      this.getARAP()
    }
  }
}
</script>
