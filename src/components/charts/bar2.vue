<template>
  <div class="charts chart-bar2" ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'

echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar2',
  props: {
    value: Object,
    bar_data: Object,
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
    initBar () {
      this.$nextTick(() => {
        let xAxisData = Object.keys(this.value)
        let seriesData = Object.values(this.value)
        let title_str = ''
        let title_str2 = ''
        if (JSON.stringify(this.bar_data) != '{}') {
          var zaizhi_list = new Array()
          zaizhi_list = this.bar_data.在职
          for (let i = 0, len = zaizhi_list.length; i < len; i++) {
            title_str += zaizhi_list[i].username + '      ' + zaizhi_list[i].department + '     ' + zaizhi_list[i].startdate + '     ' + zaizhi_list[i].enddate + '<br/>'
          }
          var lizhi_list = new Array()
          lizhi_list = this.bar_data.离职
          for (let i = 0, len = lizhi_list.length; i < len; i++) {
            title_str2 += lizhi_list[i].username + '      ' + lizhi_list[i].department + '     ' + lizhi_list[i].startdate + '     ' + lizhi_list[i].enddate + '<br/>'
          }
        }
        let temp = {}
        let option = {}
        temp = JSON.stringify(this.value)

        if (temp == '{}') {
          option = {
            title: {
              text: '暂无数据',
              x: 'center',
              y: 'center',
              textStyle: {
                color: '#000000',
                fontWeight: 'normal',
                fontSize: 16
              },
              subtext: this.subtext
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
        } else {
          option = {
            title: {
              text: this.text,
              subtext: this.subtext,
              // x: 'center'
              y: 'top'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: function (params) {
                var tar = params[0]
                var alltitle_str = '姓 名：  ' + '      ' + '  部 门：   ' + '       ' + '  入职日期：  ' + '    ' + '   辞职日期：' + '<br/>'
                // var data_str =  "大佬" +'      ' +"销售"+ '     '  + "2020-10-01"  +  '     ' + "2900-12-31"  +  '<br/>'
                // alltitle_str =  alltitle_str  +  data_str
                if (tar.name == '在职') {
                  if (title_str == '') {
                    return alltitle_str + '[暂无数据]'
                  } else {
                    return alltitle_str + title_str
                  }
                }
                if (tar.name == '离职') {
                  if (title_str2 == '') {
                    return alltitle_str + '[暂无数据]'
                  } else {
                    return alltitle_str + title_str2
                  }
                }
                if (tar.name == '总数') {
                  return tar.name
                }
              }
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
              // 配置样式
              itemStyle: {
                // 通常情况下：
                normal: {
                  // 每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                  color: function (params) {
                    var colorList = ['#4962FC', '#02ae60', '#fe8104', '#f376e0', '#844ba3']
                    return colorList[params.dataIndex]
                  }
                }
              }
            }]
          }
        }

        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        // 点击事件
        this.dom.on('click', function (params) {
          console.log(params)
          return '1111111111111111111111'
        })
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
