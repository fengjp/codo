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
    setcolor: String,
    setname: String,
    text: String,
    subtext: String,
    legend: Array,
    weblist: Array,
    applist: Array
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
        let set_color = this.setcolor
        let set_name = this.setname
        let temp = {}
        let option = {}
        let legend_list = this.legend
        let get_weblist = this.weblist
        let get_applist = this.applist

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
              text: this.text
              // color: '#F0F0F0',
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              },
              formatter: function (params) {
                var allweb_str_flag = 0
                var allapp_str_flag = 0
                var allweb_str = ''
                var allapp_str = ''
                var alltitle_str = params[0].name + '<br/>' + 'web:总时长' + params[0].value + '秒' + '<br/>' + 'app:总时长' + params[1].value + '秒' + '<br/>'
                // alltitle_str += '类型：  ' + '&#12288;'+ '&#12288;' + '  时间：   ' + '&#12288;'+ '&#12288;' + '  时长：  ' + '&#12288;'+ '&#12288;' +  '<br/>'
                // console.log("pppppppppppppppppppp")
                // console.log(xAxisData)
                // console.log(get_weblist)
                // console.log(get_applist)
                for (let i = 0; i < get_weblist.length; i++) {
                  if (params[0].name === get_weblist[i].times) {
                    // console.log(get_weblist[i].times)
                    // console.log(get_weblist[i].remarks)
                    let temp_remarks = eval(get_weblist[i].remarks)
                    if (temp_remarks.length > 0) {
                      for (let h = 0; h < temp_remarks.length; h++) {
                        console.log(temp_remarks[h]['gettime'])
                        if (temp_remarks[h]['getlongtime'] > 3600) {
                          allweb_str_flag = 1
                          allweb_str += 'web  ' + '&#12288;' + '&#12288;' + '&#12288;' + temp_remarks[h]['gettime'] + '&#12288;' + '&#12288;' + '&#12288;' + temp_remarks[h]['getlongtime'] + '&#12288;' + '&#12288;' + '&#12288;' + '<br/>'
                        }
                      }
                    }
                  }
                }
                for (let i = 0; i < get_applist.length; i++) {
                  if (params[0].name === get_applist[i].times) {
                    // console.log(get_weblist[i].times)
                    // console.log(get_weblist[i].remarks)
                    let temp_remarks2 = eval(get_applist[i].remarks)
                    if (temp_remarks2.length > 0) {
                      for (let h = 0; h < temp_remarks2.length; h++) {
                        // console.log(temp_remarks2[h]["gettime"])
                        if (temp_remarks2[h]['getlongtime'] > 3600) {
                          allapp_str_flag = 1
                          allapp_str += 'app  ' + '&#12288;' + '&#12288;' + '&#12288;' + temp_remarks2[h]['gettime'] + '&#12288;' + '&#12288;' + '&#12288;' + temp_remarks2[h]['getlongtime'] + '&#12288;' + '&#12288;' + '&#12288;' + '<br/>'
                        }
                      }
                    }
                  }
                }

                if (allweb_str_flag === 0 && allapp_str_flag === 0) {
                  return alltitle_str
                } else {
                  alltitle_str += '类型：  ' + '&#12288;' + '&#12288;' + '  时间：   ' + '&#12288;' + '&#12288;' + '  时长：  ' + '&#12288;' + '&#12288;' + '<br/>'
                  return alltitle_str + allweb_str + allapp_str
                }
                // alltitle_str += '类型：  ' + '&#12288;'+ '&#12288;' + '  时间：   ' + '&#12288;'+ '&#12288;' + '  时长：  ' + '&#12288;'+ '&#12288;' +  '<br/>'
                // return alltitle_str  + allweb_str + allapp_str
              }
            },
            legend: {
              data: ['web', 'app'],
              x: 'center',
              y: ' center',
              padding: 30
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
              name: set_name,
              nameLocation: 'center',
              nameTextStyle: {
                color: set_color,
                fontSize: 16,
                padding: 20 // 四个数字分别为上右下左与原位置距离
              },
              type: 'category',
              data: xAxisData,
              boundaryGap: 'false',
              axisLabel: {
                show: true,
                textStyle: {
                  // color: '#F0F0F0',
                }
              }

            },
            yAxis: {
              name: '异常累计时长(秒)',
              type: 'value',
              axisLabel: {
                formatter: '{value}',
                textStyle: {
                  // color: '#F0F0F0',
                }
              }

            },
            series: seriesData
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
