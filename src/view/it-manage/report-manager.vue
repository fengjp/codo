<template>
  <div>
    <Card :bordered="false" style="margin-bottom: 20px">
        <Row>
          <Col span="24" style="text-align: left; margin-bottom: 1px">
        <Select v-model="searchValue" clearable placeholder='请选择报表' style="width: 200px;marginRight: 2px;">
          <Option v-if="item.download_dir != 'xunjian'" v-for="item in reportList" :value="item.download_dir" :key="item.download_dir">
            {{ item.totitle }}
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
    </Card>
    <Row :gutter="16">
      <Col span="8">
        <Card :bordered="false">
          <Table height="650" size="small" :columns="columns" :data="reportdata" ></Table>
          <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :current="pageNum" :page-size="pageSize"
                :page-size-opts=[10,15,25,35,50,100,150,200,300,500,800,1000,1500]
                :total="pageTotal"
                @on-change="changePage" @on-page-size-change="handlePageSize" show-sizer show-total></Page>
        </div>
      </div>
        </Card>
      </Col>
      <Col span="16">
        <Card :bordered="false">
          <Table height="700" size="small" :columns="columns2" :data="reportdata2"></Table>
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
<!--        <FormItem label="数据库源" prop="dbname_id" style="width: 48%">-->
<!--          <Select v-model="formValidate.dbname_id" placeholder='请选择数据库源'>-->
<!--            <Option v-for="item in databaselist" :value="item.id">{{ item.name }}-->
<!--            </Option>-->
<!--          </Select>-->
<!--        </FormItem>-->
        <FormItem label="数据库源" prop="dbname_id" style="width: 48%">
          <Select v-model="formValidate.dbname_id" placeholder='请选择脚本'>
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
        <FormItem label="执行周期" prop="cycle">
        <Select v-model="formValidate.cycle" multiple style="width:260px">
        <Option v-for="item in cycleList" :value="item.k">{{ item.v}}</Option>
    </Select>
          </FormItem>
        <FormItem label="执行时间" prop="times">
          <RadioGroup  vertical>
              <TimePicker size="small" format="HH:mm"
                          v-model="formValidate.times" style="width: 100px;" placeholder="选择时分"></TimePicker>
          </RadioGroup>
        </FormItem>
        <FormItem style="display: block">
          <Button type="primary" @click="handleSubmit_sql('formValidate')"  :disabled="isDisable" >提交</Button>
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
  import  {customizedAdd,customizedList,customizedDelete} from '@/api/task'
  import {getDate} from '@/libs/tools'
  import {getSqlIdList} from '@/api/cmdb2/asset_sql'
  import {getDBListForQry} from '@/api/cmdb2/db.js'
  import {getSqlIdDate} from '@/api/cmdb2/asset_sql'

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
        isDisable: false,
        tabledata3: [],
        mode_type: 'mysql',
        todate: [],
        editor: {
          title: '编辑',
          read: false,
          color: "primary"
        },
        searchKey: '',
        cycleList:[{
                        k: '1',
                        v: '星期一'
                    },
                    {
                        k: '2',
                        v: '星期二'
                    },
                    {
                        k: '3',
                        v: '星期三'
                    },
                    {
                        k: '4',
                        v: '星期四'
                    },
                    {
                        k: '5',
                        v: '星期五'
                    },
                    {
                        k: '6',
                        v: '星期六'
                    },
                   {
                        k: '7',
                        v: '星期日'
                    }
        ],
        searchValue: '',
        tokey: '',
        tovalue: '',
        dbList: [],
        databaselist:[],
        ruleValidate: {
          title: [{required: true, message: "标题不能为空", trigger: "blur"}],
          header: [{required: true, message: "请输入excel表头字段,用竖号分开。", trigger: "blur"}],
          times: [{required: true, message: "请选择定时时间", trigger: "blur"}],
          // dataname: [{required: true, message: "数据库名不能为空", trigger: "blur"}],
          dbid: [{required: true, message: "脚本数据不能为空", trigger: "blur", type: 'number'}],
          dbname_id: [{required: true, message: "数据源不能为空", trigger: "change",type: 'number'}],
          // cycle: [{required: true, message: "执行周期不能为空", trigger: "change"}],
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
          {title: '报表名称', key: 'totitle', align: 'center',
          render: (h, params) => {
                return h('div', [
                  h(
                    'Button',
                    {props: {
                      type: 'text',
                      size: 'small',
                    },
                    style: {
                      marginRight: '1px',
                      color: '#409eff'
                    },
                    on: {
                      click: () => {
                        console.log(params.row.totitle)
                        this.getFileList(params.row.totitle,params.row.download_dir)
                      }
                    }
                  }, params.row.totitle)
                ])
            }},
          {
            title: '操作 ',
            key: '',
            align: 'center',
            width: 240,
            render: (h, params) => {
              if (params.row.dbid) {
                return h('div', [
                  h(
                    'Button',
                    {props: {
                      type: 'text',
                      size: 'small',
                      icon: "ios-eye-outline"
                    },
                    style: {
                      marginRight: '1px',
                      color: '#409eff'
                    },
                    on: {
                      click: () => {
                        this.handlerReadScript(params.row)
                      }
                    }
                  }, ''),
                  h(
                  'Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'ios-create-outline',
                    },
                    style: {
                      marginRight: '1px',
                      color: '#409eff'
                    },
                    on: {
                      click: () => {
                        this.handler_sql(params.row, 'put', '编辑')
                      }
                    }
                  },
                  ''
                ),
                  h(
                  'Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'ios-trash-outline',
                    },
                    style: {
                      marginRight: '1px',
                      color: '#ed4014'
                    },
                    on: {
                      click: () => {
                        this.delData(params)
                      }
                    }
                  },
                  ''
                )
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
        assetSqldata : [],
        pageNum: 1, // 当前页码
        pageTotal: 0, // 数据总数
        pageSize: 15, // 每页条数
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
          dbname_id: '',
          dataname: '',
          download_dir: '',
          cycle: '',
        },
      }
    },
    methods: {
      // 删除
      delData(params) {
        if (confirm(`确定要删除 ${params.row.totitle}`)) {
          customizedDelete(
            {
              id: params.row.id,
              download_dir:params.row.download_dir,
            }
          ).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.customizedList(this.pageNum, this.pageSize)
              this.getFileList(params.row.totitle,params.row.download_dir)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      },
      getSqlIdDate(value) {
        getSqlIdDate(value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.assetSqldata  = res.data.data
          } else {
            this.assetSqldata =  []
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
       changePage(value) {
        this.pageNum = value
        this.customizedList(this.pageNum, this.pageSize,
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.customizedList(1, this.pageSize)
      },
      customizedList(page, limit) {
        customizedList(page, limit).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.reportdata = res.data.data
            this.reportList = res.data.data
          } else {
            // this.reportdata =  []
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
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
      customizedAdd (data,meth) {
      customizedAdd(data,meth).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.modalMap.modalVisible = false
          this.customizedList(this.pageNum, this.pageSize)
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
            this.isDisable = true
            setTimeout(() => {
                  this.customizedAdd(this.formValidate,this.editModalData)
                  this.isDisable = false
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
        console.log(paramsRow)
        if (paramsRow && paramsRow.id) {
          this.formValidate = {
            id: paramsRow.id,
            title: paramsRow.totitle,
            header: paramsRow.header,
            dbid: parseInt(paramsRow.dbid),
            dbname_id:parseInt(paramsRow.dbname_id),
            dataname:paramsRow.dataname,
            times: paramsRow.times,
            download_dir: paramsRow.download_dir,
            cycle:eval(paramsRow.cycle),
          }
        } else {
          this.formValidate = {
            id: null,
            title: '',
            header: '',
            dbid: '',
            times: '',
            dbname_id:'',
            dbname: '',
            download_dir: '',
            cycle: '',
          }
        }
      },
      handlerReadScript(row) {
        this.getSqlIdDate(row.dbid)
        setTimeout(() => {
              this.$Modal.info({
                title: row.totitle + '_脚本',
                content: this.assetSqldata[0].sqlstr
              });
        }, 1000)
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
      getFileList(totile,download_dir) {
        getFileList(totile,download_dir).then(res => {
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
            // this.reportdata = res.data.reportdata
            // this.reportList = res.data.reportList
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
      this.customizedList(this.pageNum, this.pageSize)
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
