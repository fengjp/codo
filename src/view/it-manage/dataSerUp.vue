<template>
  <div>
    <Row :gutter="10" style="margin-top: 10px;">
      <Col>
        <Card :bordered="false" style="margin-bottom: 10px">
          <p slot="title">
            {{upLoadLogTitle}}
          </p>
          <Table :columns="upLoadLogColumn" :data="upLoadLogTableData"
                 size="small" height="300">
          </Table>
        </Card>
        <Card :bordered="false" style="margin-bottom: 10px">
          <p slot="title">
            {{upLoadErrorTitle}}
          </p>
          <Table :columns="upLoadErrorColumn" :data="upLoadErrorTableData"
                 size="small" height="300">
          </Table>
        </Card>
        <Card :bordered="false" style="margin-bottom: 10px">
          <p slot="title">
            {{downLoadErrorTitle}}
          </p>
          <Table :columns="downLoadErrorColumn" :data="downLoadErrorTableData"
                 size="small" height="300">
          </Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {getCertdata} from "@/api/dataSerUp";
  import ReportInfo from '_c/report-card'

  export default {
    components: {
      ReportInfo
    },
    data() {
      return {
        upLoadLogTitle: '数据上报记录',
        upLoadLogTableData: [],
        upLoadLogColumn: [
          {
            title: '时间',
            key: 'create_time',
            align: 'center',
          },
          {
            title: '主题',
            key: 'topic',
            align: 'center',
          },
          {
            title: '总数',
            key: 'total',
            align: 'center',
          },
          {
            title: '成功',
            key: 'success',
            align: 'center',
          },
          {
            title: '失败',
            key: 'failed',
            align: 'center',
          },
        ],
        upLoadErrorTitle: '上报失败记录',
        upLoadErrorTableData: [],
        upLoadErrorColumn: [
          {
            title: '时间',
            key: 'create_time',
            align: 'center',
            width: 150
          },
          {
            title: '主题',
            key: 'topic',
            align: 'center',
          },
          {
            title: '上报数据',
            key: 'data',
            align: 'center',
          },
        ],
        downLoadErrorTitle: '拉取失败记录',
        downLoadErrorTableData: [],
        downLoadErrorColumn: [
          {
            title: '时间',
            key: 'create_time',
            align: 'center',
            width: 150
          },
          {
            title: '主题',
            key: 'topic',
            align: 'center',
          },
          {
            title: '拉取数据',
            key: 'data',
            align: 'center',
          },
        ],
      };
    },
    methods: {
      getCertdata(key) {
        getCertdata(key).then(res => {
          if (res.data.code === 0) {
            if (key === 'UpLoadLog') {
              this.upLoadLogTableData = res.data.data
            }
            if (key === 'UpLoadError') {
              this.upLoadErrorTableData = res.data.data
            }
            if (key === 'DownLoadError') {
              this.downLoadErrorTableData = res.data.data
            }
          }
        })
      },
    },
    watch: {
      // reportObj: function () {
      // this.$refs.reportInfo.initChart()
      // }
    },
    mounted() {
      this.getCertdata('UpLoadLog')
      this.getCertdata('UpLoadError')
      this.getCertdata('DownLoadError')
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
