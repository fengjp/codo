<template>
  <div ref="dom" class="charts chart-lime"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLime',
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
    initLime(){
      this.$nextTick(() => {
      let xAxisData = Object.keys(this.value)
      let seriesData = Object.values(this.value)
      let  temp  = {}
      let option = {}
      temp = JSON.stringify(this.value)
      console.log("1111111111111111111111111111111111111111")
      console.log(this.value)
      console.log("1111111111111111111111111111111111111111")
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
          type: 'line'
        }]
      }
      }else{
       option = {
        title: {
          text: "折線圖",
          //x: 'center'
          y: 'top',
        },
        xAxis: {
          data: ["智联招聘","51job","拉钩","Boss直聘"]
        },
        yAxis: {
        },
        series: [{
          name: "數據量",
          data: [600,310,200,800],
          type: 'line',
        }]
      }}

      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
    }
  },
  mounted () {
    this.initLime()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
