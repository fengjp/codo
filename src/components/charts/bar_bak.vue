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
          type: 'bar',
          //配置样式
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function (params) {
                var colorList = ['#4962FC','#02ae60','#fe8104','#f376e0','#844ba3'];
                return colorList[params.dataIndex];
              }
            },
          },
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
