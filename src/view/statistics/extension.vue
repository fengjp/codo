<template>
  <div style="height:100%">


      <div style="padding: 10px; text-align:right;">
      <DatePicker  :value="todate" @on-change="todate=$event"
                      confirm placeholder="请选择开始与结束日期"
                      placement="bottom-end"
                      type="daterange">
          </DatePicker>
          <Button @click="handleSubmitTable()" style="marginRight: 2px; marginLeft: 5px" type="primary">查询
          </Button>
        <Button @click="exportData()" class="case-btn" type="success">
              <Icon type="ios-download-outline"></Icon>
              导出数据
            </Button>
      </div>
    <Table
        :columns="columns"
        :data="tableData"
        ref="selection"
        size="small"
      >
    </Table>
  </div>
</template>

<script>
  import excel from '@/libs/excel'
import {getdatelist} from '@/api/peoples'

export default {
  components: {
  },
  data () {
    return {
      todate: [],
      columns: [
        { title: '在职', key: 'yessum', editable: true },
        { title: '离职', key: 'nosum', editable: true },
        { title: '总数', key: 'allsum', editable: true }
      ],
      tableData: [], // [{"yessum":20,"nosum":10,"allsum":30}],
    }
  },
  methods: {
    handleSubmitTable () {
      console.log(JSON.stringify(this.todate))
      if (JSON.stringify(this.todate) == '[]') {
        alert('请选择日期范围')
      } else {
        this.getdatelist(this.todate[0], this.todate[1])
      }
    },
    getdatelist (start, end) {
      getdatelist(start, end).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
        } else {
          this.tableData = []
        }
      })
    },
    // 导出数据、支持分页、过滤、搜索、排序后导出
    exportData () {
      if (this.tableData.length) {
        // this.exportLoading = true
        const params = {
          title: ['在职',  '离职', '总数'],
          key: ['yessum', 'nosum', 'allsum'],
          data: this.tableData,
          autoWidth: true,
          filename: '列表'
        }
        excel.export_array_to_excel(params)
        // this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    },
  },
  watch: {
  },
  mounted () {
  }

}
</script>

<style lang="less">
  .search-con {
    padding: 10px 0;

    .search {
      &-col {
        display: inline-block;
        width: 400px;
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

  .bg-color-orange {
    color: #fff;
    background-color: orange;
  }
</style>
