<template>
  <div>
    <Row :gutter="10">
      <Col span="12" style="margin-bottom: 10px" v-for="(item, index) in queryObjList">
        <Card :bordered="false">
          <p slot="title">{{item.title}}</p>
          <p slot="extra" style="font-size: 12px;">
            <Badge status="processing"/>
            <span v-text="item.up_tip"></span>
            <!--<span>{{tList[index].xcsj.hh}}时{{tList[index].xcsj.mm}}分{{tList[index].xcsj.ss}}秒后更新</span>-->
          </p>
          <Table :no-data-text="item.errormsg" :columns="item.columns" :data="item.tableData" size="small"
                 height="250"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {
    getQueryListForshow,
    do_sql
  } from '@/api/customquery/query'
  import {dateFormat} from '@/libs/util'

  export default {
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
      playTimer() {
        this.timer = setInterval(() => {
          for (let i in this.tList) {
            // console.log(this.countTime(this.tList[i].expireTime))
            let ret = this.countTime(this.tList[i].expireTime)
            if (ret === false) {
              this.tList[i].expireTime = this.tList[i].expireTime + this.tList[i].interval
              this.do_sql(i, this.queryObjList[i].id)
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
        // this.d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        // this.h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
        // this.m = Math.floor(leftTime / 1000 / 60 % 60);
        // this.s = Math.floor(leftTime / 1000 % 60);
        // this.sum_h = this.d * 24 + this.h
        return newTimes
      },
      getQueryListForshow(page, limit, key, value, dateValue) {
        getQueryListForshow(page, limit, key, value, dateValue).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            let data = res.data.data
            let queryObjList = res.data.data
            this.tList = []
            for (let i in data) {
              let item = data[i]
              let columns = []
              for (let j in item.colnames) {
                let col = {title: '', key: '', align: 'center', minWidth: 80}
                col.title = item.colnames[j].name
                col.key = item.colnames[j].col
                // if (col.key === 'target') {
                //   col.render = (h, params) => {
                //     let target = params.row.target
                //     if (target === '一般') {
                //       return h('div', [h('Tag', {props: {color: 'blue'}}, target)])
                //     } else if (target === '严重') {
                //       return h('div', [h('Tag', {props: {color: 'warning'}}, target)])
                //     } else if (target === '致命') {
                //       return h('div', [h('Tag', {props: {color: 'error'}}, target)])
                //     } else {
                //       return h('div', [h('Tag', {props: {color: 'success'}}, target)])
                //     }
                //   }
                // }
                columns.push(col)
              }
              queryObjList[i].columns = columns
              queryObjList[i].tableData = []

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
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      do_sql(index, query_id) {
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
              this.queryObjList[index].tableData = tableData
            } else {
              this.queryObjList[index].errormsg = res.data.errormsg
            }
          }
        )
      }

    },
    watch: {
      queryObjList: function () {
        for (let i in this.queryObjList) {
          this.do_sql(i, this.queryObjList[i].id)
        }
      }
    },
    mounted() {
      this.getQueryListForshow(this.pageNum, 888)
      // this.countTime()
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
    background-color: #2d8cf0;
    color: #fff;
  }

  .ivu-table .table-warning-cell-target {
    background-color: #f90;
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

</style>
