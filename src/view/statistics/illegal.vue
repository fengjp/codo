<template>
  <div style="height:100%">
    <Card>
      <template>
        <Form label-position="left" :label-width="50" label-colon=":" style="margin-bottom: -25px;">
            <FormItem label="报表">
              <Tag checkable color="primary" style="margin-left: 1px" @on-change="handleChange"
                v-for="tag in allSysTag" v-bind:name="tag.v"   :checked="istype"
              >{{ tag.v }}</Tag>
            </FormItem>
        </Form>
      </template>
        </Card>
      <div style="padding: 10px;">

        <Row>
          <Col span="4">
          <Select  placeholder="请选择存储过程" v-model="storage">
            <Option  :value="item.k" v-for="item in allstorageList">{{item.v}}</Option>
          </Select>
            </Col>
           <Col span="12">
             <DatePicker
                  value="todate"
                  @on-change="todate=$event"
                  format="yyyy-MM" placeholder="请选择日期"
                  style="width: 40%"
                  type="month">
               </DatePicker>
          <Button @click="handleSubmitTable()" style="marginRight: 2px; marginLeft: 5px" type="primary">查询</Button>
             <Button @click="handleSubmitTable2()" style="marginRight: 2px; marginLeft: 5px" type="warning" v-if="isShow">重新生成</Button>
        <Button @click="exportData()" class="case-btn" type="success">
              <Icon type="ios-download-outline"></Icon>
              导出数据
            </Button>
              </Col>
          </Row>
      </div>
    <Card>
    <Table
        :columns="columns"
        :data="tableData"
        ref="selection"
        size="small"
        height="780px"
      >
    </Table>
      </Card>
  </div>
</template>

<script>
  import excel from '@/libs/excel'
  import {getstoragelist,getimplement,getobjlist} from '@/api/cmdb2/asset_sql'

export default {
  components: {
  },
  data () {
    return {
      isShow: false,
      istype: false,
      todate: [],
      allstorageList:[],
      temp_storagelist:[],
      storage:'',
      allSysTag:[],
      columns2:  [
        { title: '在职', key: 'yessum', editable: true },
        { title: '离职', key: 'nosum', editable: true },
        { title: '总数', key: 'allsum', editable: true }
      ],
      columns:  [],
      titlelist:[],
      keylist:[],
      tableData: [], // [{"yessum":20,"nosum":10,"allsum":30}],
    }
  },
  methods: {
    handleChange(name,obj){
        console.log("55555555555555")
        console.log(name)
        console.log(obj)
        console.log(this.temp_storagelist)
        if(name === true){
            for (var i = 0; i < this.allSysTag.length; i++) {
                 if (obj === this.allSysTag[i].v){
                        if(this.allSysTag[i].t == "是"){
                            this.isShow = true
                        }else{ this.isShow = false }
                     }
            }
            for (var i = 0; i < this.temp_storagelist.length; i++) {
                     if (obj === this.temp_storagelist[i].name){
                        this.allstorageList = this.temp_storagelist[i].date
                     }

            }
        }else{
          this.allstorageList= [], this.isShow = false

        }
        this.$forceUpdate()
      },
    handleSubmitTable2 () {
      console.log(JSON.stringify(this.todate))
      console.log(this.todate)
      console.log(JSON.stringify(this.storage))
      if (JSON.stringify(this.todate) == '[]') {
        alert('请选择日期')
      }
      if (JSON.stringify(this.todate) == "") {
        alert('请选择日期')
      } else if(this.storage === ""){alert('请选择存储过程')}
      else{
        this.getimplement(this.todate,this.storage,"2")
      }
    },
    handleSubmitTable () {
      console.log(JSON.stringify(this.todate))
      console.log(JSON.stringify(this.storage))
      if (JSON.stringify(this.todate) == '[]') {
        alert('请选择日期')
      }
      if (JSON.stringify(this.todate) == "") {
        alert('请选择日期')
      } else if(this.storage === ""){alert('请选择存储过程')}
      else{
        this.getimplement(this.todate,this.storage,"1")
      }
    },
    getimplement (date,storage,flag) {
      getimplement(date,storage,flag).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data  //表数据
          this.titlelist = res.data.titlelist  //excel表头数据
          this.columns = res.data.columnslist  //表字段
          this.keylist = res.data.keylist   //excel字段
        } else if(res.data.code === 1){   //执行存储过程没有返回值
            this.tableData = []
            this.titlelist = []
            this.columns = []
            this.keylist = []
            this.handleSubmitTable ()
        }
        else{
          this.tableData = []
          this.titlelist = []
          this.columns = []
          this.keylist = []
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
    getobjlist (department) {
      getobjlist(department).then(res => {
        if (res.data.code === 0) {
          this.allSysTag = res.data.data //需求组列表
          this.temp_storagelist = res.data.storagelist //存储过程列表
        } else {
          this.allSysTag = []
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
    // this.getstoragelist('驾驶人管理科','机动车驾驶人业务数据统计')
    this.getobjlist('执法监督科(秩序管理处)')
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
