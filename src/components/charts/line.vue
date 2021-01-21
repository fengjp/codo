<template>
  <div ref="dom" class="charts chart-line"></div>
</template>

<script>
  import echarts from 'echarts'
  import tdTheme from './theme.json'
  import {on, off} from '@/libs/tools'

  echarts.registerTheme('tdTheme', tdTheme)
  export default {
    name: 'ChartLine',
    props: {
      value: Object,
      text: String,
      subtext: String
    },
    data() {
      return {
        dom: null
      }
    },
    methods: {
      resize() {
        this.dom.resize()
      },
      initLine(obj) {
        this.$nextTick(() => {
          let xAxisData = Object.keys(this.value)
          let seriesData = Object.values(this.value)
          if (obj) {
            xAxisData = Object.keys(obj)
            seriesData = Object.values(obj)
          }
          let option = {
            title: {
              text: this.text,
              subtext: this.subtext,
              x: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: xAxisData
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              data: seriesData,
              type: 'line'
            }]
          }
          this.dom = echarts.init(this.$refs.dom, 'tdTheme')
          this.dom.setOption(option)
          on(window, 'resize', this.resize)
        })
      }
    },
    mounted() {
      this.initLine()
    },
    beforeDestroy() {
      off(window, 'resize', this.resize)
    }
  }
</script>
