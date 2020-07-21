<template>
  <div ref="dom" class="charts chart-line"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLine',
  props: {
    value: Array,
    keylist: Array,
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
    initLine(){
      this.$nextTick(() => {
      // let xAxisData = Object.keys(this.value)
      let xAxisData = this.keylist
      let seriesData = this.value
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
        series: [
          {data: seriesData,
          type: 'line'},
          ]
      }
      }else{
       option = {
        title: {
          text: this.text,
          x: 'top',
          y: 'top',
        },

        xAxis: {
          data: xAxisData,
        },
        yAxis: {
        },
        series: [
          {data: seriesData[0],
           name: '来文',
          type: 'line'},
          {data: seriesData[1],
            name: '应用升级',
          type: 'line'},
          {data: seriesData[2],
            name: '故障',
          type: 'line'},
          {data: seriesData[3],
            name: '重要工作',
          type: 'line'},
          {data: seriesData[4],
            name: '其他',
          type: 'line'},
        ],
         legend: { // 图例
                // align: 'right', //水平方向位置
// 　　            verticalAlign: 'top', //垂直方向位置
                },
      }}

      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
    }
  },
  mounted () {
    this.initLine()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
