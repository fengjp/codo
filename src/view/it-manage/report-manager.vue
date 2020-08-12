<template>
  <div>
    <Card :bordered="false" style="margin-bottom: 20px">
      <div style="padding: 10px; text-align:center;">
        <Select v-model="searchValue" clearable placeholder='请选择报表' style="width: 200px; marginRight: 50px;">
          <Option v-if="item.value != 'xunjian'" v-for="item in reportList" :value="item.value" :key="item.value">
            {{ item.label }}
          </Option>
        </Select>
        <DatePicker type="daterange" :options="optionsDate" confirm
                    placement="bottom-end" placeholder="请选择开始与结束日期"
                    :value="todate"
                    @on-change="todate=$event"
                    style="width: 230px">
        </DatePicker>
        <Button type="success" style="marginRight: 2px; marginLeft: 50px" @click="handleSubmitTable()">生成报表
        </Button>
        <a :href=surl><span id="surl"></span></a>
      </div>
    </Card>
    <Row :gutter="16">
      <Col span="6">
        <Card :bordered="false">
          <Table height="500" size="small" :columns="columns" :data="reportdata" @on-row-click="getFileList"></Table>
        </Card>
      </Col>
      <Col span="18">
        <Card :bordered="false">
          <Table height="500" size="small" :columns="columns2" :data="reportdata2"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {getCaseFile} from '@/api/problem'
  import {createFile, getFileList, getReportList} from '@/api/doc'
  import {getDate} from '@/libs/tools'

  export default {
    data() {
      return {
        optionsDate: {
          shortcuts: [
            {
              text: '上周',
              value() {
                const end = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                const day = new Date().getDay()
                const start = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (7 + day - 1))
                end.setTime(end.getTime() - 3600 * 1000 * 24 * day)
                return [start, end]
              }
            },
            {
              text: '本周',
              value() {
                const end = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                const day = new Date().getDay()
                const start = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (day - 1))
                end.setTime(end.getTime() + 3600 * 1000 * 24 * (7 - day))
                return [start, end]
              }
            },
            {
              text: '上个月',
              value() {
                const nowDate = new Date()
                let year = nowDate.getFullYear()
                let month = nowDate.getMonth()
                let days = new Date(year, month, 0).getDate()
                const day = new Date().getDate()
                const end = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                const start = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (days + day - 1))
                end.setTime(end.getTime() - 3600 * 1000 * 24 * day)
                return [start, end]
              }
            }
          ]
        },
        surl: '',
        todate: [],
        searchKey: '',
        searchValue: '',
        reportList: [
          // {
          //   value: 'xunjian',
          //   label: '每日巡检报告'
          // },
          // {
          //   value: 'kcjctj',
          //   label: '客车检查统计'
          // },
          // {
          //   value: 'zfzyyqk',
          //   label: '执法站应用情况'
          // }
        ],
        columns: [
          {title: '报表名称', key: 'report_na', align: 'center'},
          {
            title: ' ',
            key: 'script_rd',
            align: 'center',
            width: 60,
            render: (h, params) => {
              if (params.row.report_sql) {
                return h('div', [
                  h('a', {
                    on: {
                      click: () => {
                        this.handlerReadScript(params.row)
                      }
                    }
                  }, '查看')
                ])
              }
            }
          },
        ],
        reportdata: [],
        columns2: [
          {
            title: '文件名称',
            key: 'file_na',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  attrs: {
                    href: params.row.url
                  }
                }, params.row.file_na)
              ])
            }
          },
          {title: '文件大小', key: 'file_size', align: 'center', width: 110, sortable: true},
          {title: '创建日期', key: 'ctime', align: 'center', sortable: true}
        ],
        reportdata2: []
      }
    },
    methods: {
      handlerReadScript(row) {
        // console.log(row)
        this.$Modal.info({
          title: row.report_na + '_脚本',
          content: row.report_sql
        });
      },
      getCaseFile(startdate, enddate) {
        getCaseFile(startdate, enddate).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.surl = res.data.data
            // console.log(res.data.data)
            setTimeout(() => {
              document.getElementById('surl').click()
            }, 1000)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      getFileList(row, index) {
        getFileList(row.report_na, row.report_val).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.reportdata2 = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
            this.reportdata2 = []
          }
        })
      },
      createFile(searchValue, date) {
        createFile(searchValue, date).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            let _d = {}
            _d.report_na = ''
            _d.report_val = searchValue.searchValue
            this.getFileList(_d)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleSubmitTable() {
        if (!this.searchValue) {
          this.$Message.error('没有选择报表')
          return
        }
        if (this.todate.length) {
          if (this.todate[0].length) {
            let postdata = {}
            postdata.searchValue = this.searchValue
            postdata.stime = this.todate[0]
            postdata.etime = this.todate[1]
            this.createFile(postdata)
          } else {
            this.$Message.error('缺少必要参数')
          }
        } else {
          this.$Message.error('缺少必要参数')
        }
      },
      getReportList() {
        getReportList().then(res => {
          if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.reportdata = res.data.reportdata
            this.reportList = res.data.reportList
          } else {
            // this.$Message.error(`${res.data.msg}`)
            this.reportList = []
            this.reportdata = []
          }
        })
      },
    },

    mounted() {
      this.getReportList()
    }
  }
</script>

<style lang="less" scoped>

</style>
