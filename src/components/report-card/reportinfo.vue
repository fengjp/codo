<template>
  <div>
    <Col>
      <Card :bordered="false" style="margin-bottom: 10px">
        <p slot="title">
          {{value.title}}
        </p>
        <p slot="extra">
          <Tooltip content="切换" placement="top" :transfer=true>
            <Button type="text" shape="circle" icon="md-swap" @click="changeTable"></Button>
          </Tooltip>
          <Tooltip content="刷新" placement="top" :transfer=true>
            <Button type="text" shape="circle" icon="md-refresh" @click="refresh"></Button>
          </Tooltip>
          <Tooltip content="导出" placement="top" :transfer=true>
            <Button type="text" shape="circle" icon="ios-download" @click="exportData"></Button>
          </Tooltip>
        </p>
        <Table :columns="value.tablecolumn" :data="value.tableData" v-if="isTable"
               size="small" height="300" ref="reportTable">
        </Table>
        <div v-else>
          <chart-bar ref="chartBar" style="height: 300px;" :value="value.chartData" v-if="value.type === 'bar'"/>
          <chart-pie ref="chartPie" style="height: 300px;" :value="value.chartData" v-else-if="value.type === 'pie'"/>
        </div>
      </Card>
    </Col>
  </div>
</template>

<script>
  import {ChartPie, ChartBar} from '_c/charts'

  export default {
    name: 'ReportInfo',
    components: {
      ChartPie,
      ChartBar,
    },
    props: {
      value: Object,
    },
    data() {
      return {
        isTable: false,
      };
    },
    methods: {
      // 导出数据
      exportData() {
        console.log(this.$refs)
        this.$refs.reportTable.exportCsv({
          filename: this.value.title
        });
      },
      // 将table数据转换层chart数据
      toChartBar(tableData) {
        let _d = {}
        for (let i in tableData) {
          _d[Object.values(tableData[i])[0]] = Object.values(tableData[i])[1]
        }
        return _d
      },
      changeTable() {
        this.isTable = !this.isTable
      },
      refresh() {
        this.$parent.$parent.refresh(this.value.key)
        if (this.value.type === 'bar') {
          this.$refs.chartBar.initBar()
        }
        // console.log(this.value)
      },
      initChart() {
        // this.$refs.chartBar.initBar()
        // console.log(this.$refs.chartBar)
      }
    },
    watch: {},
    mounted() {
    }
  }
</script>

<style lang="less" scoped>

</style>
