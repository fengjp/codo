 <template>
  <div class="charts chart-line5" ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLine5',
  props: {
    value: Array,
    text: String,
    subtext: String,
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
    initLine5 () {
      this.$nextTick(() => {
        let seriesData = this.value
        let text = this.text
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
              axisLabel: { interval: 0, rotate: 30 },
            },
            yAxis: {
              type:'category',
            },
            series: [
              {
                data: "",
                type: 'bar' }
            ]
          }
        } else {
          option = {
            title: {
              text: text
            },
            dataset: [{
                 dimensions: ['name', 'age', 'profession', 'score', 'date'],
                 source: seriesData,
            },
              {
                 transform: {
                              type: 'sort',
                              config: { dimension: 'score', order: 'asc' }
                }
            }],

    yAxis: {
        type: "category",
    },
    xAxis: {
        type: "value",
        inverse: 1,
    },
            series: [
              {
                type: 'bar',
                encode: { x: 'name', y: 'score' },

                label: {
                      show: true,
                      position: 'right',
                      valueAnimation: true
                }
              },
            ],

          }
        }

        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  },
  mounted () {
    this.initLine5()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
