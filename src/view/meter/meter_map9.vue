<template>

  <div>
            <Row>
               <Col span="12" >
              <chart-map  ref="childLine"  style="width: 100%;height: 700px;" />
                  </Col>
                     <Col span="12" >
            <chart-line5  ref="Line5" :value="lineData2" style="width: 100%;height: 700px;"  :text="text"/>
                        </Col>
              </Row>
  </div>
</template>

<script>
import { ChartBar2, ChartTree, ChartLine2, ChartMap ,ChartLine5,} from '_c/charts'
export default {
  components: {
    ChartBar2,
    ChartTree,
    ChartLine2,
    ChartMap,
    ChartLine5
  },
  data () {
    return {
      bar_list: {},
      barData: {}, // {"在职":20,"离职":10,"总数":30},
      lineData: [],
      lineData2:[
            [' Hannah Krause ', 41, 'Engineer', 314, '2011-02-12'],
            ['Zhao Qian ', 20, 'Teacher', 351, '2011-03-01'],
            [' Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],
            ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],
            [' Karle Neumann ', 25, 'Engineer', 253, '2011-04-02'],
            [' Adrian Groß', 19, 'Teacher', null, '2011-01-16'],
            ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],
            [' Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],
            ['Han Meimei ', 67, 'Engineer', 366, '2011-03-12'],
        ],
      text:"得分排行"
    }
  },
  methods: {},
  watch: {
    lineData: function () {
      this.$refs.childLine.initLine()

    },
    lineData2:function (){
      this.$refs.Line5.initLine5()
    }

  },
  mounted () {

  }

}
</script>

<style lang="less">

</style>
