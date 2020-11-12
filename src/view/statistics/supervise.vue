<template>
  <div style="height:100%">
    <Card>
      <template>
        <Form label-position="left" :label-width="50" label-colon=":" style="margin-bottom: -25px;">
            <FormItem label="报表">
              <Tag checkable  color="primary" style="margin-left: 1px" @on-change="handleChange"
                v-for="tag in allSysTag" v-bind:name="tag.v"  :checked="istype"
              >{{ tag.v }}</Tag>
            </FormItem>
        </Form>
      </template>

      <div style="padding: 1px;">

        <Row>
          <Col span="4">
          <Select  placeholder="请选择存储过程" v-model="storage" @on-change="tostorage">
            <Option  :value="item.k" v-for="item in allstorageList">{{item.v}}</Option>
          </Select>
            </Col>
           <Col span="16">
             <DatePicker
                  value="todate"
                  @on-change="todate=$event"
                  format="yyyy-MM" placeholder="请选择日期"
                  style="width: 40%"
                  type="month">
               </DatePicker>
             <Button @click="tableList()" style="marginRight: 2px; marginLeft: 5px" type="info">选择字段</Button>
          <Button @click="handleSubmitTable()" style="marginRight: 2px; marginLeft: 5px" type="primary">查询</Button>
             <Button @click="handleSubmitTable2()" style="marginRight: 2px; marginLeft: 5px" type="warning" v-if="isShow"  :disabled="isDisable">重新生成</Button>
        <Button @click="exportData()" class="case-btn" type="success">
              <Icon type="ios-download-outline"></Icon>
              导出数据
            </Button>
              </Col>
          </Row>
      </div>
       </Card>
    <Card>
    <Table
        :height="800"
        :columns="columns"
        :data="tableData"
        ref="selection"
        size="small"
        stripe
        border
      >
    </Table>
      </Card>
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading=true
      :footer-hide=true
      width="900"
    >
    <Transfer
        :data="tablelistdata"
        :target-keys="targetKeys"
        :render-format="render"
        :list-style="listStyle"
        @on-change="tableHandleChange">
    </Transfer>
      <Col style="text-align: right; margin-bottom: 5px">
      <Button @click="tableList2()"  type="primary">确定</Button>
      </Col>
    </Modal>
    <Modal
      v-model="modalMap2.modalVisible"
      :title="modalMap2.modalTitle"
      :loading=true
      :footer-hide=true
      width="800px"
    >
      <div  style="width:780px; height: 500px">
     <Col class="demo-spin-col" span="24"  style="width:780px; height: 500px">
            <Spin fix>
                <Icon type="ios-loading" size=150 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
                <div>请耐心等待......</div>
            </Spin>
        </Col>
    </div>
    </Modal>
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
      listStyle: {
                    width: '350px',
                    height: '500px'
                },
      isDisable: false,
      isShow: false,
      istype:false,
      todate: [],
      tablelistdata:[], // [{ "key": "1", "label": "Content 1"},{ "key": "2", "label": "Content 2"},{ "key": "3", "label": "Content 3"},],
      targetKeys:[],
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
      modalMap: {
          modalVisible: false,
          modalTitle: '选择字段'
        },
      modalMap2: {
          modalVisible: false,
          modalTitle: '请耐性等待。'
        },
      tableData: [], // [{"yessum":20,"nosum":10,"allsum":30}],
    }
  },
  methods: {
    tostorage(date){
      for (var i = 0; i < this.allstorageList.length; i++) {
          if(parseInt(this.allstorageList[i].k)== parseInt(date)){
              console.log(this.allstorageList[i].d)
              let  temp_list =  eval(this.allstorageList[i].d)
              console.log(temp_list)
              console.log(temp_list.length)
              for (var j = 0; j < temp_list.length; j++) {
                     this.tablelistdata.push({"key":temp_list[j].name,"label":temp_list[j].zh_name})
              }
          }
      }
    },
    render(item) {
                return item.label;
            },
    tableHandleChange(newTargetKeys, lable) {
                // console.log(newTargetKeys);
                // console.log(lable);
                this.targetKeys = newTargetKeys;
                console.log("2222222");
                console.log(this.targetKeys);
            },
    tableList() {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = "选择字段"
      },
    tableList2() {
        this.modalMap.modalVisible = false
        this.modalMap.modalTitle = "选择字段"
      },
    handleChange(name,obj,){
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
      // console.log(JSON.stringify(this.storage))
      // console.log(JSON.stringify(this.targetKeys))

      this.isDisable = true

      if (JSON.stringify(this.todate) === '[]') {
        // alert('请选择日期')
        this.$Message.error('请选择日期')
        this.isDisable = false
      }
      if (this.todate === "") {
        // alert('请选择日期')
        this.$Message.error('请选择日期')
        this.isDisable = false
      } else if(this.storage === ""){
        // alert('请选择存储过程')
        this.$Message.error('请选择存储过程')
        this.isDisable = false
      }
      if(JSON.stringify(this.todate) != '[]'  && this.storage  != "" && this.todate != ""   ){
         this.modalMap2.modalVisible = true
         this.modalMap2.modalTitle = "提示框"
         setTimeout(() => {
                  this.getimplement(this.todate,this.storage,JSON.stringify(this.targetKeys),"2")
                  this.isDisable = false
            }, 1000)
      }
    },
    handleSubmitTable () {
      console.log(JSON.stringify(this.todate))
      console.log(JSON.stringify(this.storage))
      console.log(JSON.stringify(this.targetKeys))
      if (JSON.stringify(this.todate) === '[]') {
        // alert('请选择日期')
        this.$Message.error('请选择日期')
      }
      if (this.todate === "") {
        // alert('请选择日期')
        this.$Message.error('请选择日期')
      } else if(this.storage === ""){
        // alert('请选择存储过程')
        this.$Message.error('请选择存储过程')
      }
      if(JSON.stringify(this.todate) != '[]'  && this.storage  != "" && this.todate != "" ){
        this.modalMap2.modalVisible = true
        this.modalMap2.modalTitle = "提示框"
        this.getimplement(this.todate,this.storage,JSON.stringify(this.targetKeys),"1")
      }
    },
    getimplement (date,storage,targetKeys,flag) {
      getimplement(date,storage,targetKeys,flag).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data  //表数据
          this.titlelist = res.data.titlelist  //excel表头数据
          this.columns = res.data.columnslist  //表字段
          this.keylist = res.data.keylist   //excel字段
          this.modalMap2.modalVisible = false
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
    this.getobjlist('执法监督科')
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

  .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
