 <template>
  <div class="charts chart-line3" ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLine3',
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
    initLine () {
      this.$nextTick(() => {
      // let xAxisData = Object.keys(this.value)
        let xAxisData = this.keylist
        let seriesData = this.value
        let temp = {}
        let option = {}

        temp = JSON.stringify(this.value)
        if (temp == '[]') {
          option = {
            title: {
              text: '暂无数据',
              x: 'center',
              y: 'center',
              textStyle: {
                color: '#000000',
                fontWeight: 'normal',
                fontSize: 16 },
              subtext: this.subtext
            },

            xAxis: {
              type: 'category',
              data: xAxisData,
              color: '#000000'
            },
            yAxis: {
              type: 'value'
            },
            series: [
              { data: seriesData,
                type: 'line' }
            ]
          }
        } else {
          option = {
            title: {
              text: this.text,//"得分线性图"
              // color: '#F0F0F0',
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },

            xAxis: {
              name: '月份',
              nameLocation: 'center',
              nameTextStyle: {
                color: '#000',
                fontSize: 16,
                padding: 20 // 四个数字分别为上右下左与原位置距离
              },
              type: 'category',
              data: xAxisData,
              boundaryGap: 'false',
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#000'
                }
              }

            },
            yAxis: {
              name:  '得分',
              type: 'value',
              nameTextStyle: {
                color: '#000',
                fontSize: 16,
                padding: 3 // 四个数字分别为上右下左与原位置距离
              },
              axisLabel: {
                formatter: '{value}',
                textStyle: {
                  color: '#000'
                }
              }

            },
            series: [
              {
                data: seriesData,
                type: 'line',
                smooth: true,
                areaStyle: {}
              }
            ]
          }
        }

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
