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
    keylist:Array,
    legend:Array,
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
    initLine () {
      this.$nextTick(() => {
        let seriesData = this.value
        let xAxisData = this.keylist
        let legend_list = this.legend
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
        text: '趋势图'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: eval(legend_list)
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: eval(xAxisData)
    },
    yAxis: {
        type: 'value'
    },
            series: seriesData,
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
