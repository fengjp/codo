<template>
  <div>
    <Row :gutter="10" style="margin-top: 10px;">
      <ReportInfo ref="reportInfo" :value="reportObj"></ReportInfo>
    </Row>
    <Row :gutter="10" style="margin-top: 10px;">
      <ReportInfo ref="reportInfo1" :value="reportObj"></ReportInfo>
    </Row>
    <Row :gutter="10" style="margin-top: 10px;">
      <ReportInfo ref="reportInfo1" :value="reportObj"></ReportInfo>
    </Row>
  </div>
</template>

<script>
  import {getFacilityReport} from "@/api/cmdb/facility";
  import ReportInfo from '_c/report-card'

  export default {
    components: {
      ReportInfo
    },
    data() {
      return {
        reportObj: {
          key: '',
          title: '',
          type: '',
          tableData: [],
          tablecolumn: [],
          chartData: {},
        },
        reportObj1:{},
      };
    },
    methods: {
      getFacilityReport(key) {
        getFacilityReport(key).then(res => {
          if (res.data.code === 0) {
            let _obj = {}
            let columns = []
            let chartData = {}
            let tableData = res.data.data
            if (key === 'brand') {
              _obj.type = 'bar'
              _obj.title = '品牌统计'
              chartData = this.$refs.reportInfo.toChartBar(tableData)
              columns = [
                {
                  title: "品牌",
                  key: "facility_brand",
                  align: "center",
                  minWidth: 100,
                },
                {
                  title: "数量",
                  key: "cnt",
                  align: "center",
                  minWidth: 100,
                },
              ]
            }
            _obj.tablecolumn = columns
            _obj.tableData = tableData
            _obj.chartData = chartData
            _obj.key = key
            this.reportObj = _obj
          }
        })
      },
      // 报表组件刷新按钮
      refresh(key) {
        this.getFacilityReport(key)
      },
    },
    watch: {
      // reportObj: function () {
        // this.$refs.reportInfo.initChart()
      // }
    },
    mounted() {
      this.getFacilityReport('brand')
    }
  };
</script>

<style lang="less" scoped>
  .search-con {
    padding: 10px 0;

    .search {
      &-col {
        display: inline-block;
        width: 200px;
      }

      &-input {
        display: inline-block;
        width: 200px;
        margin-left: 2px;
      }

      &-btn {
        margin-left: 2px;
      }
    }
  }
</style>
