<template>
  <div>
    <Card :bordered="false" style="margin-bottom: 20px">
      <div style="padding: 10px; text-align:center;">
        <Row>
          <Col span="24" style="text-align: right; margin-bottom: 5px">
        <Select v-model="searchValue" clearable placeholder='请选择报表' style="width: 200px;marginRight: 2px;">
          <Option v-if="item.value != 'xunjian'" v-for="item in reportList" :value="item.value" :key="item.value">
            {{ item.label }}
          </Option>
        </Select>
        <DatePicker type="daterange" :options="optionsDate" confirm
                    placement="bottom-end" placeholder="请选择开始与结束日期"
                    :value="todate"
                    @on-change="todate=$event"
                    style="width: 230px;marginRight: 2px;">
        </DatePicker>
        <Button type="success" style="marginRight: 2px;" @click="handleSubmitTable()">生成报表
        </Button>
        <Button type="primary" style="marginRight: 2px;" @click="handler_sql('','post', '添加脚本')">定制报表</Button>
        <a :href=surl><span id="surl"></span></a>
            </Col>
        </Row>
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
        <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true width="900"
           :mask-closable=false :styles="{top: '20px'}">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" inline>
        <FormItem label="标题" prop="title" style="display: block">
          <Input v-model="formValidate.title" :maxlength="50" placeholder='请输入标题'></Input>
        </FormItem>
        <FormItem label="excel表头" prop="header" style="display: block">
          <Input v-model="formValidate.header" :maxlength="50" placeholder='请输入excel表头字段,用竖号分开。例：编号|用户名|手机号|地址'></Input>
        </FormItem>
        <FormItem label="数据库源" prop="dblinkstr" style="width: 48%">
          <Select v-model="formValidate.dblinkstr" placeholder='请选择数据库源'>
            <Option v-for="item in databaselist" :value="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="数据库名" prop="dataname" style="width: 48%">
          <Input v-model="formValidate.dataname" :maxlength="50" placeholder="请输入数据库名"></Input>
        </FormItem>
        <FormItem label="数据库脚本" prop="dbid" style="width: 48%">
          <Select v-model="formValidate.dbid" placeholder='请选择脚本'>
            <Option v-for="item in dbList" :value="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="执行时间" prop="times">
          <RadioGroup  vertical>
              <TimePicker size="small" format="HH:mm"
                          v-model="formValidate.times" style="width: 100px;" placeholder="选择时分"></TimePicker>
          </RadioGroup>
        </FormItem>
        <FormItem style="display: block">
          <Button type="primary" @click="handleSubmit_sql('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="modalMapShow.modalVisible"
      :title="modalMapShow.modalTitle"
      :loading=true
      :footer-hide=true
      width=1530

    >
<!--      <Input v-model="modalMapShow.user_key" type="textarea"  :autosize="{minRows: 30,maxRows: 300}" placeholder="Enter something..."></Input>-->
<!--      <Input v-html="modalMapShow.user_key" type="textarea"  :autosize="{minRows: 30,maxRows: 300}" placeholder="Enter something..."></Input>-->
    <Table
        :columns="columns3"
        :data="tabledata3"
        size="small"
        style="width: 1500px;"
      ></Table>
    </Modal>
  </div>
</template>

<script>
  import {getCaseFile} from '@/api/problem'
  import {createFile, getFileList, getReportList} from '@/api/doc'
  import  {customizedAdd} from '@/api/task'
  import {getDate} from '@/libs/tools'
  import {getSqlIdList} from '@/api/cmdb2/asset_sql'
  import {getDBListForQry} from '@/api/cmdb2/db.js'

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
        tableData: '',
        tabledata3: [],
        mode_type: 'mysql',
        todate: [],
        editor: {
          title: '编辑',
          read: false,
          color: "primary"
        },
        searchKey: '',
        searchValue: '',
        tokey: '',
        tovalue: '',
        dbList: [],
        databaselist:[],
        ruleValidate: {
          title: [{required: true, message: "标题不能为空", trigger: "blur"}],
          // dblinkstr: [{required: true, message: "不能为空", trigger: "blur"}],
          header: [{required: true, message: "请输入excel表头字段,用竖号分开。", trigger: "blur"}],
          times: [{required: true, message: "请选择定时时间", trigger: "blur"}],
          dataname: [{required: true, message: "数据库名不能为空", trigger: "blur"}],
          dbid: [{required: true, message: "脚本数据不能为空", trigger: "blur", type: 'number'}]
        },
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
        columns3: [],
        columns2: [
          {
            title: '文件名称',
            key: 'file_na',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  class: {
                        prspan: "prspan"
                      },
                  attrs: {
                    href: params.row.url
                  }
                }, params.row.file_na)
              ])
            }
          },
          {title: '文件大小', key: 'file_size', align: 'center', width: 110, sortable: true},
          {title: '创建日期', key: 'ctime', align: 'center', sortable: true},
          {title: '', key: '', align: 'center',render: (h, params) => {
              return h('div', [
                h('a', {

                  on: {
                      click: () => {
                        console.log(params.row)
                        // let temp = JSON.stringify(params.row.file_data)
                        this.handlerReadScript2(params.row.file_na,params.row.columns,params.row.file_data)

                      }
                  }
                }, "报表查看")
              ])
            }}
        ],
        reportdata2: [],
        modalMap: {
          modalVisible: false,
          modalTitle: '定制报表',
        },
        modalMapShow: {
        modalVisible: false,
        modalTitle: '查看报表',
      },
        formValidate: {
          id: null,
          title: '',
          header: '',
          dbid: '',
          times: '',
          dblinkstr: '',
          dataname: '',
        },
      }
    },
    methods: {
      // 获取数据库源
      getDBListForQry(key, value) {
        getDBListForQry(key, value).then(res => {
          if (res.data.code === 0) {
            this.databaselist = res.data.data
          }
        })
      },
      getSqlIdList (page, limit, key, value) {
      getSqlIdList(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count
          this.dbList = res.data.data
          console.log(this.dbList)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
       handleReset(name) {
        this.$refs[name].resetFields()
      },
      customizedAdd (data) {
      customizedAdd(data).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.modalMap.modalVisible = false
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
      // 添加查询配置
      editorInit: function () {
        require(`brace/mode/${this.mode_type}`)    //language
        require('brace/theme/terminal')
        require('brace/theme/xcode')
      },
      handleSubmit_sql(value) {
        this.$refs[value].validate((valid) => {
          console.log(this.formValidate)
          if (valid) {
            setTimeout(() => {
                  this.customizedAdd(this.formValidate)
            }, 1000)
          } else {
            this.$Message.error('缺少必要参数')
          }
        })
      },
      handler_sql(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        this.getDBListForQry()
        if (paramsRow && paramsRow.id) {
          this.formValidate = {
            id: paramsRow.id,
            title: paramsRow.title,
            header: paramsRow.header,
            dbid: paramsRow.dbid,
            dblinkstr:paramsRow.dblinkstr,
            times: paramsRow.timesTy,
          }
        } else {
          this.formValidate = {
            id: null,
            title: '',
            header: '',
            dbid: '',
            times: '',
            dblinkstr:'',
          }
        }
      },
      handlerReadScript(row) {
        // console.log(row)
        this.$Modal.info({
          title: row.report_na + '_脚本',
          content: row.report_sql
        });
      },
      handlerReadScript2(name,columns,file_data) {
      this.modalMapShow.modalVisible = true
      this.modalMapShow.modalTitle = name
      this.columns3 = eval(columns)
      this.tabledata3 = eval(file_data)

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
            console.log(this.reportdata2)
            for (let i in this.reportdata2) {
              if (this.reportdata2[i].file_na.indexOf('r') > -1) {
                this.reportdata2[i].cellClassName = {
                  file_na: 'table-error-cell-target'
                }
              }
            }
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
      this.getSqlIdList()
    }
  }
</script>

<style lang="less">
  .ivu-table .table-error-cell-target {
    background-color: #ed4014;
    color: #fff;
  }
  /*.prspan {*/
    /*display: block;*/
    /*color: #F0F0F0;*/
  /*}*/
</style>
