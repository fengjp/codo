<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    initBar(){
      this.$nextTick(() => {
      let xAxisData = Object.keys(this.value)
      let seriesData = Object.values(this.value)
      let  temp  = {}
      let option = {}
      temp = JSON.stringify(this.value)

      if  (temp == '{}'){

        option = {
        title: {
           text: '暂无数据',
           x: 'center',
           y: 'center',
           textStyle: {
             color: '#000000',
             fontWeight: 'normal',
             fontSize: 16},
          subtext: this.subtext,
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
          type: 'bar'
        }]
      }
      }else{
       option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          //x: 'center'
          y: 'top',
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
          type: 'bar'
        }]
      }}

      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
    }
  },
  mounted () {
    this.initBar()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
