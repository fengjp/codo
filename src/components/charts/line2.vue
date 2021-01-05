 <template>
  <div class="charts chart-line2" ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartLine2',
  props: {
    value: Array,
    keylist: Array,
    setcolor:String,
    setname:String,
    text: String,
    subtext: String,
    legend:Array
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
        let set_color = this.setcolor
        let set_name = this.setname
      let  temp  = {}
      let option = {}
      let legend_list = this.legend
        console.log(legend_list)
      temp = JSON.stringify(this.value)
      if  (temp == '[]'){

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
          data: xAxisData,
          color: '#000000',
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
                   legend: {
                      data: ['web', 'app'],
                      x:'center',
                      y:' center',
                      padding:30,
                       // data: legend_list
                   },
                   toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },


                  xAxis: {
                    name:set_name,
                    nameLocation:'center',
                    nameTextStyle:{
                      color:set_color,
                      fontSize:16,
                       padding:20 // 四个数字分别为上右下左与原位置距离
                    },
                    type:'category',
                    data: xAxisData,
                    boundaryGap:'false',
                    axisLabel: {
                            show: true,
                            textStyle: {
                                // color: '#F0F0F0',
                            }
                        }

                  },
                  yAxis: {
                    name:'异常累计时长(秒)',
                    type:'value',
                    axisLabel : {
                            formatter: '{value}',
                            textStyle: {
                                // color: '#F0F0F0',
                            }
                        }

                  },
                   series: seriesData,
                  // series: [
                  //   {
                  //     data: seriesData,
                  //     type: 'line',
                  //     smooth:true,
                  //     areaStyle:{},
                  //     color: set_color,
                  //   },
                  // ],
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
