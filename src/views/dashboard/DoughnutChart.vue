<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getPurchaseStatistics } from "@/api/index";

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
    this.getPurchaseStatistics();
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
        formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: ['已完成', '询价中', '已下单', '等通知']
        },
        series: [
            {
                name: '采购统计',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: this.caigouwancheng, name: '已完成'},
                    {value: this.xunjiazhong, name: '询价中'},
                    {value: this.yixiadan, name: '已下单'},
                    {value: this.dengtongzhi, name: '等通知'},
                ]
            }
        ]
      })
    },
    getPurchaseStatistics(){
      getPurchaseStatistics(this.queryParams).then(response => {
        this.caigouwancheng = response.data.caigouwancheng  
        this.xunjiazhong = response.data.xunjiazhong
        this.yixiadan= response.data.yixiadan
        this.dengtongzhi= response.data.dengtongzhi
        this.initChart()
      });
    },
    init(params){
      this.queryParams = params;
      this.getPurchaseStatistics()
    }
  }
}
</script>
