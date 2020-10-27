<template>
  <div style="height:100%">
      <div style="padding: 10px; text-align:right;">
        <Row>
          <Col span="6">
          <Select  placeholder="请选择存储过程" v-model="storage">
            <Option  :value="item.k" v-for="item in allstorageList">{{item.v}}</Option>
          </Select>
            </Col>
           <Col span="6">
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
              </Col>
          </Row>
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
  import {getstoragelist,getimplement} from '@/api/cmdb2/asset_sql'

export default {
  components: {
  },
  data () {
    return {
      todate: [],
      allstorageList:[],
      storage:'',
      columns: [
        { title: '在职', key: 'yessum', editable: true },
        { title: '离职', key: 'nosum', editable: true },
        { title: '总数', key: 'allsum', editable: true }
      ],
      titlelist:[],
      keylist:[],
      tableData: [], // [{"yessum":20,"nosum":10,"allsum":30}],
    }
  },
  methods: {
    handleSubmitTable () {
      console.log(JSON.stringify(this.todate))
      console.log(JSON.stringify(this.storage))
      if (JSON.stringify(this.todate) == '[]') {
        alert('请选择日期范围')
      } else if(this.storage === ""){alert('请选择存储过程')}
      else{
        this.getimplement(this.todate[0], this.todate[1],this.storage)
      }
    },
    getimplement (start, end,storage) {
      getimplement(start, end,storage).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data  //表数据
          this.titlelist = res.data.titlelist  //excel表头数据
          this.columns = res.data.columnslist  //表字段
          this.keylist = res.data.keylist   //excel字段
        } else {
          this.tableData = []
          this.headerlist = []
        }
      })
    },
    getstoragelist (department,obj) {
      getstoragelist(department,obj).then(res => {
        if (res.data.code === 0) {
          this.allstorageList = res.data.data //存储过程列表
        } else {
          this.allstorageList = []
        }
      })
    },
    // 导出数据、支持分页、过滤、搜索、排序后导出
    exportData () {
      if (this.tableData.length) {
        // this.exportLoading = true
        const params = {
          title: this.titlelist,
          key: this.keylist,
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
    this.getstoragelist('驾驶人管理科','机动车驾驶人业务数据统计')
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
