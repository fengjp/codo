<template>
  <div ref="dom" class="charts chart-tree"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartTree',
  props: {
    value: Array,
    text: String
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
    initTree () {
      this.$nextTick(() => {
        let temp = {}
        let option = {}
        temp = JSON.stringify(this.value)
        console.log('22222222222222222222222222')
        console.log(temp)
        console.log('22222222222222222222222222')
        // if (temp == '[]') {}
        option = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
          },
          legend: {
            top: '2%',
            left: '3%',
            orient: 'vertical',
            data: [{
              name: '树型图',
              icon: 'rectangle'
            }],
            borderColor: '#c23531'
          },
          series: [
            {
              type: 'tree',

              name: '树型图',

              data: this.value,

              top: '5%',
              left: '7%',
              bottom: '2%',
              right: '60%',

              symbolSize: 7,

              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right'
              },

              leaves: {
                label: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              },

              expandAndCollapse: true,

              animationDuration: 550,
              animationDurationUpdate: 750

            }
          ]
        }

        this.dom = echarts.init(this.$refs.dom, 'tdTheme')
        this.dom.setOption(option)
        on(window, 'resize', this.resize)
      })
    }
  },
  mounted () {
    this.initTree()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
