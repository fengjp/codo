<template>
  <div>
    <Row :gutter="10" style="margin-top: 10px;">
      <CustomInfo :data="queryObjList"></CustomInfo>
    </Row>
  </div>
</template>

<script>
  import CustomInfo from '_c/custom-card'
  import {
    getQueryListForshow,
    do_sql
  } from '@/api/customquery/query'
  import {dateFormat} from '@/libs/util'

  export default {
    components: {
      CustomInfo,
    },
    data() {
      return {
        up_tip: '',
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
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
        ]
      }
    },
    methods: {
      changeShow(item) {
        item.isShow = !item.isShow
      },
      getColor(k) {
        if (k === '正常') {
          return '#19be6b'
        } else if (k === '一般') {
          return '#fadb14'
        } else if (k === '严重') {
          return '#ff9900'
        } else if (k === '致命') {
          return '#ed4014'
        }
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
          if (Object.keys(_count).length > 0) {
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
    },
    watch: {
      // queryObjList: function () {
      //   for (let i in this.queryObjList) {
      //     this.do_sql(i, this.queryObjList[i].id)
      //   }
      // }
    },
    mounted() {
      this.getQueryListForshow()
      // 该组件渲染时，判断定时器是否已开启
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
</style>
