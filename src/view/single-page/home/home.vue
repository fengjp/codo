<template>
  <div>
    <Row :gutter="10">
      <i-col :xs="12" :md="8" :lg="4">
        <Select :value="tmpValue" @on-select="selectTmp">
          <Option v-for="item in tmpList" :value="item.label" :key="item.value">{{ item.label }}</Option>
        </Select>
      </i-col>
      <i-col :xs="12" :md="8" :lg="4">
        <ButtonGroup>
          <Button icon="ios-add" @click="handlerTmp('','post', '添加配置')"></Button>
          <Button icon="ios-settings" @click="handlerTmp('','put', '修改配置')"></Button>
          <Button icon="ios-trash" @click="handlerDeleteTmp(tid)"></Button>
        </ButtonGroup>
      </i-col>
    </Row>

    <Row :gutter="10" style="margin-top: 10px;">
      <CustomInfo :data="queryObjList"></CustomInfo>
    </Row>

    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true width="540"
           :mask-closable=false >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <!--<alert>温馨提示：xxx</alert>-->
        <FormItem label="模版名称" prop="tmpNa">
          <Input v-model="formValidate.tmpNa" :maxlength="50" placeholder='请输入模版名称'></Input>
        </FormItem>
        <FormItem label="选择监控" prop="tmptable">
          <Table class="tmptable" ref="tmpSelection" size="small" max-height="300" :draggable="true"
                 :columns="tmpColumns" :data="tmpTableDate" @on-select="onSelected"
                 @on-select-cancel="onSelectCancel" @on-select-all="onSelectAll"
                 @on-select-all-cancel="onSelectAllCancel">
          </Table>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitTmp('formValidate')">保存</Button>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
  import {ChartPie, ChartBar, ChartLine} from '_c/charts'
  import {operationTmp, getTmpList} from '@/api/dashboard/home.js'
  import CustomInfo from '_c/custom-card'
  import {
    getQueryListForshow,
    do_sql,
    getQueryList,
  } from '@/api/customquery/query'
  import {dateFormat} from '@/libs/util'
  import {swapArr, toFirst} from '@/libs/tools'

  export default {
    name: 'home',
    components: {
      // ChartPie,
      // ChartBar,
      // ChartLine,
      CustomInfo,
    },
    data() {
      return {
        tid: 0, //当前模版ID
        tmpValue: '',
        tmpList: [],
        tmpData: [],
        up_tip: '',
        queryObjList: [],
        timer: null, // 保存定时器，用于销毁
        tList: [
          {
            tName: '',
            expireTime: 0, // 时间戳（13位）
            interval: 0,
            xcsj: {
              dd: '',
              hh: '',
              mm: '',
              ss: ''
            }
          }
        ],
        modalMap: {
          modalVisible: false,
          modalTitle: '添加配置',
        },
        formValidate: {
          id: '',
          tmpNa: '',
          username: '',
        },
        _formValidate: {},
        ruleValidate: {
          tmpNa: [{required: true, message: "标题不能为空", trigger: "blur"}],
        },
        tmpTableDate: [],
        selectionAll: [],
        tmpColumns: [
          // {
          //   title: ' ',
          //   width: 25,
          //   render: (h, params, vm) => {
          //     return h('Icon', {
          //       props: {
          //         type: 'md-menu'
          //       },
          //     }, '')
          //   }
          // },
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '标题',
            key: 'title',
            align: 'center',
          },
          {
            title: '轮询频率',
            key: 'timesTy',
            align: 'center',
            render: (h, params, vm) => {
              if (params.row.timesTy === 'timesTy1') {
                var tt = '每' + params.row.timesTy1Val + '分钟'
              } else {
                var tt = '每天' + params.row.timesTy2Val
              }
              return h('div', [
                h('span', {}, tt)
              ])
            }
          },
        ],
      }
    },
    methods: {
      // // 拖动行 拖拽排序
      // dragrow(index1, index2) {
      //   swapArr(this.tmpTableDate, index1, index2)
      // },
      onSelected(selection, row) {
        // let objData = this.$refs.tmpSelection.$refs.tbody.objData
        this.selectionAll = selection
      },
      onSelectCancel(selection, row) {
        this.selectionAll = selection
      },
      onSelectAll(selection, row) {
        this.selectionAll = selection
      },
      onSelectAllCancel(selection, row) {
        this.selectionAll = selection
      },
      // 获取模版列表
      getTmpList() {
        getTmpList().then(res => {
          if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.tmpList = res.data.tmpList
            let loginUser = JSON.parse(sessionStorage.vuex).user.userName;
            this.tmpData = res.data.data
            this.tid = 0
            this.tmpValue = ''
            this.selectionAll = []
            this._formValidate = {}
            for (let i in this.tmpData) {
              if (loginUser === i) {
                this.tid = this.tmpData[i][0].id
                this.tmpValue = this.tmpData[i][0].tmpNa
                this.selectionAll = this.tmpData[i][0].selectionAll
                this._formValidate = {
                  id: this.tmpData[i][0].id,
                  tmpNa: this.tmpData[i][0].tmpNa,
                  username: i,
                }
              }
            }
            this.getQueryListForshow()
          } else {
            this.$Message.error('模版列表' + `${res.data.msg}`)
          }
        })
      },
      // 选择模版
      selectTmp(val) {
        // console.log(val)
        // console.log(this.tmpData)
        let loginUser = JSON.parse(sessionStorage.vuex).user.userName;
        for (let i in this.tmpData) {
          if (loginUser === i) {
            for (let j in this.tmpData[i]) {
              if (this.tmpData[i][j].tmpNa === val.value) {
                this.tid = this.tmpData[i][j].id
                this.tmpValue = this.tmpData[i][j].tmpNa
                this.selectionAll = this.tmpData[i][j].selectionAll
                this._formValidate = {
                  id: this.tmpData[i][j].id,
                  tmpNa: this.tmpData[i][j].tmpNa,
                  username: i,
                }
              }
            }
          }
        }
        this.getQueryListForshow()
      },
      // 添加/修改模版
      handlerTmp(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        let objData = this.$refs.tmpSelection.$refs.tbody.objData
        this.formValidate = {
          id: null,
          tmpNa: '',
          username: '',
        }
        for (let j in objData) {
          objData[j]._isChecked = false
        }
        if (meth === 'put') {
          if (this.tid === 0) {
            this.$Message.error('请先添加模版')
            this.modalMap.modalVisible = false
            return
          }
          this.formValidate = this._formValidate
          for (let i in this.selectionAll) {
            for (let j in objData) {
              if (this.selectionAll[i].id === objData[j].id) {
                objData[j]._isChecked = true
                continue
              }
            }
          }
        }
      },
      handlerDeleteTmp(tid) {
        if (tid > 0 && confirm('确定要删除吗')) {
          operationTmp({id: tid}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
                this.getTmpList()
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
        }
      },
      //
      handleSubmitTmp(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              this.formValidate.selectionAll = this.selectionAll;
              this.formValidate.username = JSON.parse(sessionStorage.vuex).user.userName;
              operationTmp(this.formValidate, this.editModalData).then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`);
                  this.modalMap.modalVisible = false;
                  this.getTmpList()
                } else {
                  this.$Message.error(`${res.data.msg}`);
                }
              });
            }, 500)
          } else {
            this.$Message.error('表单校验错误')
          }
        })
      },
      playTimer() {
        this.timer = setInterval(() => {
          for (let i in this.tList) {
            // console.log(this.countTime(this.tList[i].expireTime))
            let ret = this.countTime(this.tList[i].expireTime)
            if (ret === false) {
              this.tList[i].expireTime = this.tList[i].expireTime + this.tList[i].interval
              this.do_sql(i, this.queryObjList, this.tList)
            } else {
              this.tList[i].xcsj = this.countTime(this.tList[i].expireTime)
              this.queryObjList[i].up_tip = ret.hh + '时' + ret.mm + '分' + ret.ss + '秒后更新'
            }
          }
        }, 1000)
      },
      // 倒计时
      countTime(expireTime) {
        // 获取当前时间
        let date = new Date()
        let now = date.getTime()
        // 设置截止时间
        // let endDate = new Date('2020-07-24 11:08:00');
        // let end = endDate.getTime();
        // 时间差
        let leftTime = expireTime - now
        // 定义变量 d,h,m,s保存倒计时的时间
        if (leftTime >= 0) {
          var newTimes = {
            hh: Math.floor(leftTime / 1000 / 60 / 60 % 24),
            mm: Math.floor(leftTime / 1000 / 60 % 60),
            ss: Math.floor(leftTime / 1000 % 60)
          }
        } else {
          return false
        }
        return newTimes
      },
      getQueryListForshow(key, value) {
        // console.log(this.tid)
        // console.log(this.selectionAll.length)
        if (this.tid > 0 && this.selectionAll.length > 0) {
          key = 'tid'
          value = JSON.stringify(this.selectionAll)
        }
        getQueryListForshow(key, value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            let data = res.data.data
            let queryObjList = res.data.data
            this.tList = []
            this.queryObjList = []
            for (let i in data) {
              let item = data[i]
              let columns = []
              for (let j in item.colnames) {
                let col = {title: '', key: '', align: 'center', minWidth: 80}
                col.title = item.colnames[j].name
                col.key = item.colnames[j].col
                columns.push(col)
              }
              queryObjList[i].columns = columns
              queryObjList[i].tableData = []
              queryObjList[i].isShow = false

              // 处理倒计时参数
              let t_obj = {
                tName: '',
                expireTime: 0, // 时间戳（13位）
                interval: 0,
                xcsj: {
                  dd: '',
                  hh: '',
                  mm: '',
                  ss: ''
                }
              }
              let date = new Date()
              let now = date.getTime()
              t_obj.tName = item.title
              if (item.timesTy === 'timesTy1') {
                t_obj.interval = parseInt(item.timesTyVal) * 60 * 1000
                t_obj.expireTime = now + t_obj.interval
              } else {
                let _date = dateFormat('YYYY-mm-dd HH:MM', date)
                let dateStr = _date.split(' ')
                dateStr[1] = item.timesTyVal
                _date = dateStr.join(' ')
                let endDate = new Date(_date)
                t_obj.expireTime = endDate.getTime()
                t_obj.interval = 24 * 60 * 60 * 1000
              }
              this.tList.push(t_obj)
              queryObjList[i].up_tip = ''
            }
            this.queryObjList = queryObjList
            // console.log(this.tList)
            for (let i in this.queryObjList) {
              this.do_sql(i, this.queryObjList, this.tList)
            }
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      do_sql(index, queryObjList, tList) {
        let query_id = queryObjList[index].id
        do_sql('id', query_id).then(
          res => {
            if (res.data.code === 0) {
              let tableData = res.data.data
              for (let i in tableData) {
                if (tableData[i].target === '一般') {
                  tableData[i].cellClassName = {
                    target: 'table-info-cell-target'
                  }
                } else if (tableData[i].target === '严重') {
                  tableData[i].cellClassName = {
                    target: 'table-warning-cell-target'
                  }
                } else if (tableData[i].target === '致命') {
                  tableData[i].cellClassName = {
                    target: 'table-error-cell-target'
                  }
                } else {
                  tableData[i].cellClassName = {
                    target: 'table-success-cell-target'
                  }
                }
              }
              // console.log(tableData)
              queryObjList[index].tableData = tableData
              queryObjList[index].count = res.data.count
            } else {
              queryObjList[index].errormsg = res.data.errormsg
            }
            this.checkqueryObjSort(queryObjList, tList)
          }
        )
      },
      // 全部排序
      checkqueryObjSort(queryObjList, tList) {
        let l1 = []
        let l2 = []
        let l3 = []
        let l4 = []
        let l5 = []
        for (let i in queryObjList) {
          let _count = queryObjList[i].count
          if (_count && Object.keys(_count).length > 0) {
            for (let j in _count) {
              if (j === '致命') {
                l1.push(queryObjList[i])
                break
              } else if (j === '严重') {
                l2.push(queryObjList[i])
                break
              } else if (j === '一般') {
                l3.push(queryObjList[i])
                break
              } else if (j === '正常') {
                l4.push(queryObjList[i])
                break
              } else {
                l5.push(queryObjList[i])
                break
              }
            }
          } else {
            l5.push(queryObjList[i])
          }
        }
        l1.push(...l2)
        l1.push(...l3)
        l1.push(...l4)
        l1.push(...l5)
        // console.log(queryObjList)
        // console.log(l1)
        let new_tList = []
        for (let i in l1) {
          for (let j in tList) {
            if (l1[i].title === tList[j].tName) {
              new_tList.push(tList[j])
            }
          }
        }
        // console.log(this.tList)
        // console.log(new_tList)
        this.queryObjList = l1
        this.tList = new_tList
      },
      getQueryList(key, value) {
        getQueryList(1, 888, key, value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tmpTableDate = res.data.data
          } else {
            this.$Message.error('选择项目' + `${res.data.msg}`)
          }
        })
      },
    },
    mounted() {
      this.getTmpList()
      this.getQueryList('isTmp', 1)
      if (this.timer) {
        clearInterval(this.timer)// 销毁定时器 建议该在组件关闭时，再执行此方法来销毁定时器，否则定时器会一直跑下去，造成内存泄漏！！！！
      }
      this.playTimer()// 启用定时器
    },
    watch: {
      // queryObjList: function () {
      //   for (let i in this.queryObjList) {
      //     this.do_sql(i, this.queryObjList[i].id)
      //   }
      // }
    },
    // 组件关闭时，执行此方法来销毁定时器
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timer)
      next()
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  }
</script>

<style lang="less">
  .ivu-table .table-info-cell-target {
    background-color: #fadb14;
    color: #fff;
  }

  .ivu-table .table-warning-cell-target {
    background-color: #ff9900;
    color: #fff;
  }

  .ivu-table .table-error-cell-target {
    background-color: #ed4014;
    color: #fff;
  }

  .ivu-table .table-success-cell-target {
    background-color: #19be6b;
    color: #fff;
  }

  .tmptable.ivu-table-wrapper thead tr th {
    background-color: #fff;
  }

  .customtable .ivu-table-small td {
    height: 30px;
  }

  .customtable.ivu-table-wrapper thead tr th {
    background-color: #fff;
  }

</style>
