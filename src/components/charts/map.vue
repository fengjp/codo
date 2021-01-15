 <template>
  <div class="charts chart-map" ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/map/js/china'
import 'echarts/map/js/world'
import 'echarts/map/js/province/guangdong'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartMap',
  props: {
    // value: Array,
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
        var data = [
          { name: '珠海市', value: 250973 },
          { name: '广州市', value: 453088 },
          { name: '中山市', value: 424302 },
          { name: '佛山市', value: 1135329 },
          { name: '揭阳市', value: 30035 },
          { name: '梅州市', value: 47148 },
          { name: '汕头市', value: 65920 },
          { name: '东莞市', value: 428881 },
          { name: '惠州市', value: 300025 },
          { name: '汕尾市', value: 20154 },
          { name: '江门市', value: 231140 },
          { name: '清远市', value: 136351 },
          { name: '肇庆市', value: 126912 },
          { name: '河源市', value: 37704 },
          { name: '韶关市', value: 44550 },
          { name: '云浮市', value: 31672 },
          { name: '潮州市', value: 26802 },
          { name: '阳江市', value: 3114 },
          { name: '茂名市', value: 39238 },
          { name: '湛江市', value: 48422 }
        ]

        var geoCoordMap = {
          '珠海市': [113.353986, 21.924979],
          '广州市': [113.480637, 23.125178],
          '湛江市': [110.264977, 21.274898],
          '茂名市': [110.919229, 21.659751],
          '阳江市': [111.825107, 21.859222],
          '云浮市': [112.044439, 22.629801],
          '肇庆市': [112.472529, 23.051546],
          '江门市': [112.894942, 22.090431],
          '中山市': [113.382391, 22.321113],
          '佛山市': [113.022717, 22.828762],
          '清远市': [113.051227, 23.685022],
          '韶关市': [113.591544, 24.501322],
          '河源市': [114.897802, 23.746266],
          '梅州市': [116.117582, 24.099112],
          '潮州市': [116.692301, 23.661701],
          '揭阳市': [116.255733, 23.143778],
          '汕头市': [116.708463, 22.87102],
          '汕尾市': [115.364238, 22.774485],
          '深圳市': [114.085947, 22.347],
          '东莞市': [113.746262, 22.746237],
          '惠州市': [114.412599, 23.079404]
        }

        function convertData (data) {
          var res = []
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name]
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              })
            }
          }
          return res
        };

        function randomValue () {
          return Math.round(Math.random() * 1000)
        }

        var option = {
          tooltip: {},
          visualMap: {
            min: 0,
            max: 1500,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            seriesIndex: [1],
            inRange: {
              color: ['#e0ffff', '#006edd']
            },
            calculable: true
          },
          geo: {
            show: true,
            type: 'map',
            map: '广东',
            roam: true,
            label: {
              show: true,
              color: 'rgba(0,0,0,0.4)'
            },
            itemStyle: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              itemStyle: {
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              data: convertData(data),
              encode: {
                value: 2
              },
              symbolSize: 30,
              // symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
              symbolRotate: 35,
              label: {
                formatter: '{b}',
                position: 'right',
                show: false
              },
              itemStyle: {
                color: '#F06C00'
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              layoutCenter: ['50%', '50%'],
              layoutSize: 450
            },
            {
              name: '总得分',
              type: 'map',

              geoIndex: 100,
              data: [
                { name: '珠海市', value: 250973 },
                { name: '广州市', value: 453088 },
                { name: '中山市', value: 424302 },
                { name: '佛山市', value: 1135329 },
                { name: '揭阳市', value: 30035 },
                { name: '梅州市', value: 47148 },
                { name: '汕头市', value: 65920 },
                { name: '东莞市', value: 428881 },
                { name: '惠州市', value: 300025 },
                { name: '汕尾市', value: 20154 },
                { name: '江门市', value: 231140 },
                { name: '清远市', value: 136351 },
                { name: '肇庆市', value: 126912 },
                { name: '河源市', value: 37704 },
                { name: '韶关市', value: 44550 },
                { name: '云浮市', value: 31672 },
                { name: '潮州市', value: 26802 },
                { name: '阳江市', value: 3114 },
                { name: '茂名市', value: 39238 },
                { name: '湛江市', value: 48422 }
              ]
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
    this.initLine()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
