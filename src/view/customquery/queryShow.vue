<template>
  <div>
    <Col span="11" style="margin: 10px;" v-for="(item, index) in queryObjList">
      <Card :bordered="false">
        <p slot="title" v-text="item.title"></p>
        <Table :columns="item.columns" :data="item.tableData" size="small" height="250"></Table>
      </Card>
    </Col>
  </div>
</template>


<script>
  import {
    getQueryListForshow,
    do_sql
  } from '@/api/customquery/query'

  export default {
    data() {
      return {
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        queryObjList: [],
      }
    },
    methods: {
      getQueryListForshow(page, limit, key, value, dateValue) {
        getQueryListForshow(page, limit, key, value, dateValue).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            let data = res.data.data
            let queryObjList = res.data.data
            for (let i in data) {
              let item = data[i]
              let columns = []
              for (let j in item.colnames) {
                let col = {title: '', key: '', align: 'center', minWidth: 80}
                col.title = item.colnames[j].name
                col.key = item.colnames[j].col
                if (col.key === 'target') {
                  col.render = (h, params) => {
                    let target = params.row.target
                    if (target === '正常') {
                      return h('div', [h('Tag', {props: {color: 'success'}}, target)])
                    } else if (target === '一般') {
                      return h('div', [h('Tag', {props: {color: 'blue'}}, target)])
                    } else if (target === '严重') {
                      return h('div', [h('Tag', {props: {color: 'warning'}}, target)])
                    } else if (target === '致命') {
                      return h('div', [h('Tag', {props: {color: 'error'}}, target)])
                    }
                  }
                }
                columns.push(col)
              }
              queryObjList[i].columns = columns
              queryObjList[i].tableData = []
            }
            this.queryObjList = queryObjList
            // console.log(this.queryObjList)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      do_sql(index, query_id) {
        do_sql('id', query_id).then(
          res => {
            if (res.data.code === 0) {
              this.queryObjList[index].tableData = res.data.data
            }
          }
        );
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
    }
  }
</script>

<style lang="less" scoped>
</style>
