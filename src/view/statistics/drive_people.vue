<template>
  <div style="height:100%">
    <Card>
      <template>
        <Form label-position="left" :label-width="50" label-colon=":" style="margin-bottom: -25px;" inline>
            <FormItem label="报表">
              <span style="marginRight: 10px;margin-bottom: 10px;" v-for="tag in allSysTag">
                     <Button  @click="handleChange(tag.v)" :type="tag.totype" >{{tag.v}}</Button>
              </span>
            </FormItem>
        </Form>
      </template >

      <div style="padding: 1px;">

        <Row>
          <Col span="3" >
          <Select  placeholder="请选择脚本" v-model="storage" @on-change="tostorage" style="width: 85%" >
            <Option  :value="item.k" v-for="item in allstorageList">{{item.v}}</Option>
          </Select>
            </Col>
           <Col span="21" style="margin-bottom: -18px;" >
             <Form v-for="item in temp_parameter_list"  >
                    <Col span="5"  >
                    <FormItem  :label="item.remarks" v-if="item.format == 'yyyy-mm'">
                           <DatePicker
                             v-model="item.msg"
                             @on-change="item.msg=$event"
                             format="yyyy-MM" placeholder="请选择年月"
                             style="width: 55%"
                             type="month">
                           </DatePicker>
                    </FormItem>
                      <FormItem  :label="item.remarks" v-if="item.format == 'yyyy-mm-dd'">
                           <DatePicker
                             v-model="item.msg"
                             @on-change="item.msg=$event"
                             format="yyyy-MM-dd" placeholder="请选择年月日"
                             style="width: 75%"
                             type="date">
                           </DatePicker>
                    </FormItem>
                      <FormItem  :label="item.remarks"  v-if="item.format == 'yyyy-mm-dd|HHMM'">
                           <DatePicker
                             v-model="item.msg"
                             @on-change="item.msg=$event"
                             format="yyyy-MM-dd HH:mm"  placeholder="请选择时间"
                             style="width: 75%"
                             type="datetime">
                           </DatePicker>
                    </FormItem>
                      <FormItem  :label="item.remarks"  v-if="item.format == 'yyyy-mm-dd|HHMMSS'">
                           <DatePicker
                             v-model="item.msg"
                             @on-change="item.msg=$event"
                             placeholder="请选择时间"
                             style="width: 75%"
                             type="datetime">
                           </DatePicker>
                    </FormItem>
                      <FormItem  :label="item.remarks"  v-if="item.type == '字符串'">
                      <Input v-model="item.msg" :placeholder="item.remarks" style="width:65%"/>
                      </FormItem>
                      </Col>
              </Form>
              </Col>
          </Row>
        <Row>
          <template>
              <Form label-position="left" :label-width="80" label-colon=":" inline>
                    <FormItem label="常用查询" >
                      <span v-for="item in recordList" >
                         <Tooltip  max-width="800"    :content="item.zhname" placement="bottom-start">
                             <Button  @click="handleCreate5(item.id)" :type="item.totype"  style="marginRight: 10px;" >{{item.recordname}}</Button>
                         </Tooltip>
                      </span>
                    </FormItem>
              </Form>
          </template>
        </Row>
        <Row  style="text-align: right;">
             <Button @click="tableList()" style="marginRight: 2px;" type="info">选择字段</Button>
             <Button @click="handleSubmitTable()" style="marginRight: 2px;" type="primary"  :disabled="isDisable2"  >查询</Button>
             <Button @click="handleSubmitTable2()" style="marginRight: 2px;" type="warning" v-if="isShow"  :disabled="isDisable">重新生成</Button>
             <Button @click="exportData()" class="case-btn" type="success">
               <Icon type="ios-download-outline"></Icon>导出数据</Button>
          </Row>
      </div>
       </Card>
    <Card>
<!--      <span  v-if="isShow6">预计总耗时:{{time_consume}}，  <span class="temp_span">已用{{newTimes.hh}}时{{newTimes.mm}}分{{newTimes.ss}}秒 </span>   </span>-->
      <span class="temp_span" v-if="isShow6">系统正在统计，请勿刷新或关闭页面......</span>
    <Table
        :loading="table_loading"
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
      width="820"
    >
    <Transfer
        :data="tablelistdata"
        :target-keys="targetKeys"
        :render-format="render"
        :list-style="listStyle"
        :titles="['备选字段', '已选字段']"
        @on-change="tableHandleChange">
    </Transfer>
            <Form label-position="left"  label-colon=":" >
              <Row >
                 <Col span="18">
                      <FormItem label="模板名">
                        <Input v-model="recordname" placeholder="模板名" style="width: 150px;marginRight: 2px; marginLeft: 5px" />
                        <Button @click="handleReset()" class="case-btn" style="marginRight: 2px;">重置</Button>
                        <Button @click="handleadd()" class="case-btn" type="info" v-if="isShow2" style="marginRight: 2px;">新模板</Button>
                        <Button @click="tableList3()"  type="error" v-if="isShow2" style="marginRight: 2px;">删除模板</Button>
                      </FormItem>
                   </Col>
                    <Col span="6">
                  <FormItem  style="text-align: right;">
                     <Button @click="tableList2()"  type="primary">确定</Button>
                    </FormItem>
                       </Col>
              </Row>
            </Form>
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
  import {
    getrecordlist,
    addrecordlist,
    delrecordlist,
    updaterecordlist,
    record_getdata,
  } from '@/api/cmdb2/record'

  import {
    storage_iddata,
  } from '@/api/cmdb2/storage'

export default {
  components: {
  },
  data () {
    return {
      Interval_flag:0,
      newTimes:'',
      listStyle: {
                    width: '350px',
                    height: '500px'
                },
      isDisable: false,
      isDisable2: false,
      isShow: false,
      isShow2: false,
      isShow6: false,
      table_loading:false,
      totemp_parameter:'', //临时参数
      totemp_parameter_list:[], //临时参数列表
      storage_getid_list:'',
      istype:false,
      todate: [],
      time_consume:'',
      temp_parameter_list:[],
      temp_filename_title:'',
      temp_filename:'',
      recordList:'',
      tousername:'',
      recordname:'',
      tablelistdata:[], // [{ "key": "1", "label": "Content 1"},{ "key": "2", "label": "Content 2"},{ "key": "3", "label": "Content 3"},],
      targetKeys:[],
      allstorageList:[],
      temp_storagelist:[],
      storage:'',
      storagename:'',
      storagename2:'',
      record:'',
      temp_targetKeys_flag:0, //1为真，0为假
      allSysTag:[],
      columns2:  [
        { title: '在职', key: 'yessum', editable: true },
        { title: '离职', key: 'nosum', editable: true },
        { title: '总数', key: 'allsum', editable: true }
      ],
      columns:  [],
      titlelist:[],
      temp_recordList_one:[],
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
    storage_iddata(name) {
      storage_iddata(name).then(res => {
      if (res.data.code === 0) {
        this.storage_getid_list = eval(res.data.data)
        this.time_consume =   this.storage_getid_list[0].consume
        // this.$Message.success(`${res.data.msg}`)
      } else {
        this.storage_getid_list = []
        // this.$Message.error(`${res.data.msg}`)
      }
    })
  },
    parameterFunc(){
      console.log(this.totemp_parameter)
    },
    updaterecordlist(data){
      updaterecordlist(data).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
           this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    delrecordlist(data){
      delrecordlist(data).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.targetKeys = []
          this.recordname = ''
        } else {
           this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    addrecordlist(data){
      addrecordlist(data).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
           this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    record_getdata(username,tablename){
      record_getdata(username,tablename).then(res => {
        if (res.data.code === 0) {
          this.recordList = res.data.data //存储过程列表
          console.log(this.recordList)
        } else {
          this.recordList = []
        }
      })
    },
    handleCreate5(data){
      this.Interval_flag = 2
       for (var i = 0; i < this.recordList.length; i++) {
         if (JSON.stringify(this.recordList[i].id) === JSON.stringify(data)) {
           this.temp_recordList_one = this.recordList[i]
           this.targetKeys = eval(this.recordList[i].recordlist)
           this.recordname = this.recordList[i].recordname
           this.temp_filename_title = this.recordList[i].recordname //当选择模板时的execle文件名
           this.recordList[i].totype = "info"
         }else{
           this.recordList[i].totype = "default"
         }
       }
       this.isShow2 = true
       this.temp_targetKeys_flag = 1
    },
    tostorage(date){
      this.Interval_flag = 2
      this.targetKeys = []
      for (var i = 0; i < this.allstorageList.length; i++) {
          // if(parseInt(this.allstorageList[i].k) === parseInt(date)){
          if(JSON.stringify(this.allstorageList[i].k) === JSON.stringify(date)){
              this.tablelistdata = []
              console.log(this.allstorageList[i].d)
              //表字段列表
              let  temp_list =  eval(this.allstorageList[i].d)
              for (var j = 0; j < temp_list.length; j++) {
                     this.tablelistdata.push({"key":temp_list[j].name,"label":temp_list[j].zh_name})
              }

              //数据表名
              // console.log(this.allstorageList[i].f)
              this.temp_filename =  this.allstorageList[i].f
              // console.log(this.allstorageList[i].c)
               //查询存储过程参数列表
              this.temp_parameter_list = eval(this.allstorageList[i].c)

              //获取模板列表
              this.record_getdata(String(this.tousername),String(this.temp_filename))
              this.storagename = this.allstorageList[i].s
              this.storagename2 = this.allstorageList[i].st

          }
      }

    },
    render(item) {
                return item.label;
            },
    tableHandleChange(newTargetKeys, lable) {
                // console.log(newTargetKeys);
                this.targetKeys = newTargetKeys;
                // console.log(this.targetKeys);
            },
    tableList() {
        // if(this.temp_targetKeys_flag  === 0){
        // this.targetKeys = []
        // this.recordname = ''
        //   }
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = "字段列表"
      },
    handleReset(){
        this.targetKeys = []
        this.recordname = ''
        this.isShow2 = false
      },
    handleadd(){
        this.temp_recordList_one = []
        this.targetKeys = []
        this.recordname = ''
        this.isShow2 = false
      },
    tableList2() {
        if(JSON.stringify(this.recordname)  != '""') {
            let temp_zhname = []
            for (var i = 0; i < this.targetKeys.length; i++) {
              for (var h = 0; h < this.tablelistdata.length; h++) {
                if (this.tablelistdata[h].key == this.targetKeys[i]) {
                  temp_zhname.push(this.tablelistdata[h].label)
                }
              }
            }
            if (JSON.stringify(this.temp_recordList_one) === '[]') {
              let temp_dict = {
                recordname: this.recordname,
                recordlist: this.targetKeys,
                zhname: temp_zhname,
                tablename: this.temp_filename,
                number: 1,
                username: this.tousername,
              }
              this.addrecordlist(temp_dict)
            } else {
              let temp_dict = {
                id: this.temp_recordList_one["id"],
                recordname: this.recordname,
                recordlist: this.targetKeys,
                tablename: this.temp_recordList_one["tablename"],
                number: parseInt(this.temp_recordList_one["number"]) + 1,
                zhname: temp_zhname,
                username: this.temp_recordList_one["username"],
              }
              this.updaterecordlist(temp_dict)

            }
        }
        this.record_getdata(String(this.tousername),String(this.temp_filename))
        this.isShow2 = false
        // this.temp_targetKeys_flag  = 0
        this.modalMap.modalVisible = false
        this.modalMap.modalTitle = "字段列表"
      },
    tableList3() {
         this.delrecordlist(this.temp_recordList_one)
         this.record_getdata(String(this.tousername),String(this.temp_filename))
         this.temp_recordList_one = []
         this.isShow2 = false
      },
    handleChange(obj){
        this.targetKeys = []
        this.temp_parameter_list = []
        this.temp_filename_title = obj //当没有模板时的execle文件名
        this.Interval_flag = 2
        if(obj){
          for (var i = 0; i < this.allSysTag.length; i++) {
                 if (obj === this.allSysTag[i].v){
                        if(this.allSysTag[i].t == "是"){
                            this.isShow = true
                        }else{ this.isShow = false }
                        this.allSysTag[i].totype = "primary"
                     }else{
                   this.allSysTag[i].totype = "default"
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
            // this.$forceUpdate()
    },
    // handleChange(name,obj,){
    //     this.targetKeys = []
    //     if(name === true){
    //         for (var i = 0; i < this.allSysTag.length; i++) {
    //              if (obj === this.allSysTag[i].v){
    //                     if(this.allSysTag[i].t == "是"){
    //                         this.isShow = true
    //                     }else{ this.isShow = false }
    //                  }
    //         }
    //         for (var i = 0; i < this.temp_storagelist.length; i++) {
    //                  if (obj === this.temp_storagelist[i].name){
    //                     this.allstorageList = this.temp_storagelist[i].date
    //                  }
    //
    //         }
    //     }else{
    //       this.allstorageList= [], this.isShow = false
    //
    //     }
    //         this.$forceUpdate()
    // },
    handleSubmitTable2 () {
      this.Interval_flag = 0
      this.storage_iddata(this.storagename2)
      let temp_flag_str = 1
      if (JSON.stringify(this.storage) === '""'){
             temp_flag_str = 0
             this.$Message.error("请选择脚本")
      }
      else if(JSON.stringify(this.targetKeys) == '[]'){
          temp_flag_str = 0
          this.$Message.error("请选择字段或模板")
      }
      for (var h = 0; h < this.temp_parameter_list.length; h++) {
        if (JSON.stringify(this.temp_parameter_list[h].msg) == '""') {
          temp_flag_str = 0
          this.$Message.error(this.temp_parameter_list[h].remarks + "不能为空")
        }
      }

      if (temp_flag_str === 1) {
          this.isDisable = true
          // this.modalMap2.modalVisible = true
          // this.modalMap2.modalTitle = "提示框"
          this.table_loading = true
          this.isShow6 = true
          setTimeout(() => {
                  this.playTimer()// 计时器
                  this.getimplement(JSON.stringify(this.temp_parameter_list),this.storage,JSON.stringify(this.targetKeys),"2")
                  this.isDisable = false
            }, 1000)
          }
      // this.table_loading = false
      // this.isShow6 = false
    },
    handleSubmitTable () {
      this.storage_iddata(this.storagename)
      let temp_flag_str = 1
      if (JSON.stringify(this.storage) === '""'){
             temp_flag_str = 0
             this.$Message.error("请选择脚本")
      }
      else if(JSON.stringify(this.targetKeys) == '[]'){
          temp_flag_str = 0
          this.$Message.error("请选择字段或模板")
      }
      for (var h = 0; h < this.temp_parameter_list.length; h++) {
        if (JSON.stringify(this.temp_parameter_list[h].msg) == '""') {
          temp_flag_str = 0
          this.$Message.error(this.temp_parameter_list[h].remarks + "不能为空")
        }
      }

      if (temp_flag_str === 1) {
          this.Interval_flag = 0
          this.isDisable2 = true
          // this.modalMap2.modalVisible = true
          // this.modalMap2.modalTitle = "提示框"
          this.table_loading = true
          this.isShow6 = true
          setTimeout(() => {
                this.playTimer()// 计时器
                this.getimplement(JSON.stringify(this.temp_parameter_list), this.storage, JSON.stringify(this.targetKeys), "1")
               this.isDisable2 = false
            }, 1000)
          }
      // this.table_loading = false
      // this.isShow6 = false
    },
    getimplement (date,storage,targetKeys,flag) {
      getimplement(date,storage,targetKeys,flag).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data  //表数据
          this.titlelist = res.data.titlelist  //excel表头数据
          this.columns = res.data.columnslist  //表字段
          this.keylist = res.data.keylist   //excel字段
          this.modalMap2.modalVisible = false
          this.table_loading = false
          this.isShow6 = false
          this.Interval_flag = 2
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
          this.table_loading = false
          this.isShow6 = false
          this.Interval_flag = 2
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
          filename: this.temp_filename_title,
        }
        excel.export_array_to_excel(params)
        // this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    },
    playTimer() {
        let date = new Date()
        let start_now = date.getTime()
        var Interval_id = setInterval(() => {//每秒执行一次
              if (this.Interval_flag === 2){
                     this.isShow6 = false
                     this.time_consume = ''
                     this.newTimes = {hh: "", mm: "", ss: ""}
                     clearInterval(Interval_id) //停止计时

              }
              // 获取当前时间
             let date = new Date()
             let now = date.getTime() - start_now
             // 变量 d,h,m,s保存倒计时间
             this.newTimes = {
                   hh: Math.floor(now / 1000 / 60 / 60 % 24),
                   mm: Math.floor(now / 1000 / 60 % 60),
                   ss: Math.floor(now / 1000 % 60)
                   }
        }, 1000)
      },
  },
  watch: {
  },
  mounted () {
    // this.getstoragelist('驾驶人管理科','机动车驾驶人业务数据统计')
    //当前用户名
    let loginUser = JSON.parse(sessionStorage.vuex).user.nickName
    this.tousername = loginUser
    this.getobjlist('驾驶人管理科')
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
  .temp_span{

    color: red;

}
</style>
