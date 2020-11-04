<template>
  <div>
    <Row :gutter="20" style="margin-top: 10px;">
      <Col span="8">
        <Card :bordered="false" style="margin-bottom: 10px">
          <div slot="title">
            <row type="flex" justify="center" align="middle">
              <Col>
                <p>
                  累计上报总量
                </p>
              </Col>
            </row>
          </div>
          <div class="dashboard-monitor-base-info-number">
            <span>{{dataAll.sumUpLoad}}</span>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card :bordered="false" style="margin-bottom: 10px">
          <div slot="title">
            <row type="flex" justify="center" align="middle">
              <Col>
                <p>
                  今日上报总量
                </p>
              </Col>
            </row>
          </div>
          <div class="dashboard-monitor-base-info-number">
            <span>{{dataAll.todayUpLoad}}</span>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card :bordered="false" style="margin-bottom: 10px">
          <div slot="title">
            <row type="flex" justify="center" align="middle">
              <Col>
                <p>
                  今日不合格总量
                </p>
              </Col>
            </row>
          </div>
          <div class="dashboard-monitor-base-info-number">
            <span>{{dataAll.todayDownLoad}}</span>
          </div>
        </Card>
      </Col>
    </Row>
    <Row :gutter="10" style="margin-top: 10px;">
      <Col>
        <Card :bordered="false" style="margin-bottom: 10px">
          <div slot="title">
            <row type="flex" justify="center" align="middle">
              <Col span="8">
                <p>
                  {{upLoadLogTitle}}
                </p>
              </Col>
              <Col span="16" style="text-align:right">
                <DatePicker :value="today" confirm type="daterange" style="width: 200px"
                            @on-change="select_date=$event" @on-ok="handleOk('UpLoadLog')"></DatePicker>
              </Col>
            </row>
          </div>
          <Table :columns="upLoadLogColumn" :data="upLoadLogTableData"
                 size="small" height="300">
          </Table>
        </Card>
        <Card :bordered="false" style="margin-bottom: 10px">
          <div slot="title">
            <row type="flex" justify="center" align="middle">
              <Col span="8">
                <p>
                  {{downLoadLogTitle}}
                </p>
              </Col>
              <Col span="16" style="text-align:right">
                <DatePicker :value="today" confirm type="daterange" style="width: 200px"
                            @on-change="select_date=$event" @on-ok="handleOk('DownLoadLog')"></DatePicker>
              </Col>
            </row>
          </div>
          <Table :columns="downLoadLogColumn" :data="downLoadLogTableData"
                 size="small" height="300">
          </Table>
        </Card>
        <Card :bordered="false" style="margin-bottom: 10px">
          <div slot="title">
            <row type="flex" justify="center" align="middle">
              <Col span="8">
                <p>
                  {{upLoadErrorTitle}}
                </p>
              </Col>
              <Col span="16" style="text-align:right">
                <DatePicker :value="today" confirm type="daterange" style="width: 200px"
                            @on-change="select_date=$event" @on-ok="handleOk('UpLoadError')"></DatePicker>
              </Col>
            </row>
          </div>
          <Table :columns="upLoadErrorColumn" :data="upLoadErrorTableData"
                 size="small" height="250">
          </Table>
        </Card>
        <Card :bordered="false" style="margin-bottom: 10px">
          <div slot="title">
            <row type="flex" justify="center" align="middle">
              <Col span="8">
                <p>
                  {{downLoadErrorTitle}}
                </p>
              </Col>
              <Col span="16" style="text-align:right">
                <DatePicker :value="today" confirm type="daterange" style="width: 200px"
                            @on-change="select_date=$event" @on-ok="handleOk('DownLoadError')"></DatePicker>
              </Col>
            </row>
          </div>
          <Table :columns="downLoadErrorColumn" :data="downLoadErrorTableData"
                 size="small" height="250">
          </Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {getCertdata} from "@/api/dataSerUp";
  import ReportInfo from '_c/report-card'
  import {getDate} from '@/libs/tools'

  export default {
    components: {
      ReportInfo
    },
    data() {
      return {
        dataAll: {
          sumUpLoad: 0,
          todayUpLoad: 0,
          todayDownLoad: 0,
        },
        select_date: [getDate(new Date().getTime() / 1000, 'date'), getDate(new Date().getTime() / 1000, 'date')],
        today: [getDate(new Date().getTime() / 1000, 'date'), getDate(new Date().getTime() / 1000, 'date')],
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
        downLoadLogTitle: '不合格记录',
        downLoadLogTableData: [],
        downLoadLogColumn: [
          {
            title: '时间',
            key: 'create_time',
            align: 'center',
          },
          {
            title: '批次号',
            key: 'cd_batch',
            align: 'center',
          },
          {
            title: '不合格原因',
            key: 'error_msg',
            align: 'center',
          },
          // {
          //   title: '数据',
          //   key: 'data',
          //   align: 'center',
          // },
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
      getCertdata(key, date) {
        getCertdata(key, date).then(res => {
          if (res.data.code === 0) {
            if (key === 'UpLoadLog') {
              this.upLoadLogTableData = res.data.data
            }
            if (key === 'DownLoadLog') {
              this.downLoadLogTableData = res.data.data
            }
            if (key === 'UpLoadError') {
              this.upLoadErrorTableData = res.data.data
            }
            if (key === 'DownLoadError') {
              this.downLoadErrorTableData = res.data.data
            }
            if (key === 'dataAll') {
              this.dataAll = res.data.data[0]
            }
          }
        })
      },
      handleOk(key) {
        this.getCertdata(key, this.select_date)
      },
      playTimer() {
        this.timer = setInterval(() => {
          this.getCertdata('dataAll', this.today)
        }, 1000*60*5)
      },
    },
    watch: {
      // reportObj: function () {
      // this.$refs.reportInfo.initChart()
      // }
    },
    mounted() {
      this.getCertdata('UpLoadLog', this.today)
      this.getCertdata('DownLoadLog', this.today)
      this.getCertdata('UpLoadError', this.today)
      this.getCertdata('DownLoadError', this.today)
      this.getCertdata('dataAll', this.today)
      if (this.timer) {
        clearInterval(this.timer)// 销毁定时器 建议该在组件关闭时，再执行此方法来销毁定时器，否则定时器会一直跑下去，造成内存泄漏！！！！
      }
      this.playTimer()// 启用定时器
    },
    // 组件关闭时，执行此方法来销毁定时器
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timer)
      next()
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  };
</script>

<style lang="less" scoped>
  .dashboard-monitor-base-info-number {
    font-size: 28px;
    font-weight: 700;
    margin: 8px 0 4px;
    text-align: center;
  }
</style>
