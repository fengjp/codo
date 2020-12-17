<template>
  <div>
    <Card style="margin-top: 5px">
      <Row>
        <Col span="12">
          <Form autocomplete="off" label-colon=":" class="case-form" ref="formValidate2" :model="formValidate2">
            <Col span="8">
              <FormItem label="脚本名称" prop="name" :label-width="100">
                <Input
                  v-model="formValidate2.name"
                  placeholder="请输入脚本名称"
                ></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="详情描述" prop="remarks" :label-width="100">
                <Input
                  v-model="formValidate2.remarks"
                  placeholder="详细描述"
                ></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="类型" prop="totype" :label-width="100">
                <Select placeholder="类型" v-model="formValidate2.totype">
                <Option :value="item.v" v-for="item in typelist">{{item.v}}
                </Option>
              </Select>
              </FormItem>
            </Col>
          </Form>
        </Col>
        <Col span="12" style="text-align: right; margin-bottom: 5px">
          <Button
            @click="handleSearch" class="case-btn"
            type="primary"
            style=""
          >搜索
          </Button>
          <Button
            @click="handleReset('formValidate2')" class="case-btn"
            style=""
          >重置
          </Button>
          <slot name="new_btn">
            <Button
              type="info"
              @click="editModal('', 'post', '新建脚本')" class="case-btn"
              style=""
            >新建脚本
            </Button>
          </slot>
          <Button type="success" @click="exportDateALL()" class="case-btn"
                  style="">
            <Icon type="ios-download-outline"></Icon>
            导出数据
          </Button>
        </Col>
      </Row>
      <Table
        id="table"
        size="small"
        ref="selection"
        :columns="columns"
        :data="tableData"
      ></Table>

      <Modal
        v-model="modalMap.modalVisible"
        :title="modalMap.modalTitle"
        :loading=true
        :footer-hide=true
        width="680"
      >
        <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="105" :inline="true">

          <div v-if="editModalData && editModalData == 'put'">
            <FormItem label="脚本名" prop="name" style="width:350px;margin-right:20px">
              <Input
                v-model="formValidate.name"
                disabled
                :maxlength="45"
                placeholder="请输入脚本名"
              ></Input>
            </FormItem>
          </div>
          <div v-else>
            <FormItem label="脚本名" prop="name" style="width:350px;margin-right:20px">
              <Input
                v-model="formValidate.name"
                :maxlength="45"
                placeholder="请输入脚本名"
              ></Input>
            </FormItem>
          </div>

          <FormItem label="数据库源" prop="dbname_id" style="width:350px;">
              <Select placeholder="数据库源" v-model="formValidate.dbname_id">
                <Option :value="item.id" v-for="item in databaselist">{{item.name}}
                </Option>
              </Select>
            </FormItem>
          <FormItem label="数据表名" prop="fieldname" style="width:350px;" v-if="isShow">
              <Input v-model="formValidate.fieldname" placeholder="请输入数据表的名称"></Input>
            </FormItem>
          <FormItem label="类型" prop="totype" style="width:500px;">
              <RadioGroup v-model="formValidate.totype"   @on-change="change_totype">
                <Radio label="sql"></Radio>
                <Radio label="存储过程"></Radio>
              </RadioGroup>
            </FormItem>
          <FormItem label="执行方式" prop="mode" style="width:500px;">
              <RadioGroup v-model="formValidate.mode"   @on-change="change_totype">
                <Radio label="定时"></Radio>
                <Radio label="触发"></Radio>
              </RadioGroup>
            </FormItem>
          <FormItem label="状态" prop="state" style="width:500px;">
              <RadioGroup v-model="formValidate.state" >
                <Radio label="运行"></Radio>
                <Radio label="停止"></Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="重新生成" prop="flag" style="width:500px;"  v-if="isShow3">
              <RadioGroup v-model="formValidate.flag" >
                <Radio label="是"></Radio>
                <Radio label="否"></Radio>
              </RadioGroup>
            </FormItem>

            <FormItem label="查询存储过程" prop="storage" style="width:350px;" v-if="isShow">
              <Select  allow-create filterable   placeholder="查询存储过程" v-model="formValidate.storage" @on-query-change="tempusername2"  @on-change="temp_storage_str">
            <Option  :value="item.name" v-for="item in storageList2"  >{{ item.name }}</Option>
          </Select>
            </FormItem>
             <Row :gutter="5" style="margin-bottom: 5px">
            <FormItem label="生成存储过程" prop="storage2" style="width:350px;" v-if="isShow">
              <Select  allow-create filterable  placeholder="生成存储过程" v-model="formValidate.storage2" @on-query-change="tempusername3" @on-change="temp_storage_str2">
            <Option  :value="item.name" v-for="item in storageList5">{{ item.name }}</Option>
          </Select>
            </FormItem>
            <FormItem label="excel表头" prop="header" style="display: block"  v-if="isShow2">
            <Input v-model="formValidate.header" type="textarea"
                   placeholder='请输入excel表头字段,用竖号分开。例：编号|用户名|手机号|地址'></Input>
          </FormItem>
            <FormItem
              label="SQL语句"
              prop="sqlstr" style="width:500px;margin-right:500px"
              v-if="isShow2"
            >
              <Input
                v-model="formValidate.sqlstr"
                type="textarea"
                :rows="5"
                placeholder="SQL语句"
              ></Input>
            </FormItem>
               <hr/>
               <br>
            <FormItem label="部门名称" prop="department" style="width:500px;margin-right:500px" >
          <Select @on-create="handleCreate2" allow-create multiple filterable placeholder="部门名称" v-model="formValidate.department">
            <Option  :value="item.v" v-for="item in alldepartmentList">{{item.v}}</Option>
          </Select>
        </FormItem>
            <FormItem label="报表名" prop="obj" style="width:500px;margin-right:500px"  >
              <Select @on-create="handleCreate5" allow-create  filterable placeholder="报表名" v-model="formValidate.obj">
            <Option  :value="item.v" v-for="item in allobjList">{{item.v}}</Option>
          </Select>
            </FormItem>
            <FormItem label="授权用户" prop="authorized" style="width:500px;margin-right:500px" >
              <Select  allow-create filterable  multiple   placeholder="授权用户" v-model="formValidate.authorized" @on-query-change="tempusername">
            <Option  :value="item.nickname" v-for="item in allNameList2">{{ item.nickname }}</Option>
          </Select>
            </FormItem>
            <FormItem
              label="详情描述"
              prop="remarks" style="width:500px;margin-right:500px"
            >
              <Input
                v-model="formValidate.remarks"
                type="textarea"
                placeholder="详细描述"
              ></Input>
            </FormItem>
          </Row>

          <FormItem>
            <Button
              type="primary"
              @click="handleSubmit('formValidate')"
              :disabled="isDisable"
            >提交
            </Button>
            <Button
              @click="handleReset('formValidate')"
              style="margin-left: 8px"
            >重置
            </Button>
          </FormItem>

        </Form>
      </Modal>
      <Modal
        v-model="modalMapShow.modalVisible"
        :title="modalMapShow.modalTitle"
        :loading=true
        :footer-hide=true
        width=600

      >
        <Input v-model="modalMapShow.user_key" type="textarea" :autosize="{minRows: 30,maxRows: 300}"
               placeholder="Enter something..."></Input>
      </Modal>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize"
                :page-size-opts=[10,15,25,35,50,100,150,200,300,500,800,1000,1500]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { getuserlist } from '@/api/user'
import { routerMap } from '@/router/routers'

import { SqlAdd, getCase, getSqlList, getname, sqlDelete, getdepartmentlist } from '@/api/cmdb2/asset_sql'
import { getDate } from '@/libs/tools'
import excel from '@/libs/excel'
import { getDictConfList } from '@/api/app'
import { getDBListForQry } from '@/api/cmdb2/db.js'
import { storage_getid } from '@/api/cmdb2/storage'

export default {
  data () {
    return {
      typelist: [{ 'k': 1, 'v': 'sql' }, { 'k': 2, 'v': '存储过程' }],
      btnText: '展开',
      isShow: false,
      isShow2: false,
      isShow3: false,
      isShow5: false,
      toflag: 0,
      router_list: [],
      tousername: '',
      isDisable: false,
      isDisable2: false,
      surl: '',
      temp_list: [{ 'k': 'time', 'v': '时间' }, { 'k': 'char', 'v': '字符串' }],
      temp_list2: [{ 'k': '%Y-%m', 'v': '年-月' }, { 'k': '%Y-%m-%d', 'v': '年-月-日' }, { 'k': '%Y-%m-%d|%H%M%S', 'v': '年-月-日 时分秒' }, { 'k': '%Y-%m-%d|%Y-%m-%d', 'v': '年-月-日至年-月-日' }],
      formValidate: {
        name: '',
        header: '',
        totype: '',
        dbname_id: '',
        dbname: '',
        sqlstr: '',
        remarks: '',
        username: '',
        department: '',
        obj: '',
        storage: '',
        storage2: '',
        mode: '',
        state: '',
        flag: '',
        authorized: '',
        fieldname: '',
        create_time: '',
        dictvalue: [
          {
            k: 1,
            v: '',
            d: '',
            m: ''
          }
        ],
        dictvalue2: [
          {
            k: 1,
            v: '',
            d: '',
            m: ''
          }
        ]
      },
      databaselist: [],
      formValidate2: {
        name: '',
        remarks: '',
        totype: ''
      },
      todate: [],
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入脚本名',
            trigger: 'blur'
          }
        ],
        dbname_id: [
          {
            required: true,
            message: '请选择',
            trigger: 'blur',
            type: 'number'
          }
        ],
        totype: [
          {
            required: true,
            message: '请选择执行类型',
            trigger: 'blur'
          }
        ],
        fieldname: [
          {
            required: true,
            message: '请填写表名',
            trigger: 'blur'
          }
        ],
        department: [
          {
            required: true,
            message: '请选部门',
            trigger: 'blur',
            type: 'array'
          }
        ],
        obj: [
          {
            required: true,
            message: '请填写报表名',
            trigger: 'blur'
          }
        ],
        authorized: [
          {
            required: true,
            message: '请授权用户',
            trigger: 'blur',
            type: 'array'
          }
        ]
      },
      columns: [
        {
          title: '脚本名称',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
            return h('div', [
              h('a', {
                on: {
                  click: () => {
                    this.handleDetail(params.row.name, params.row.sqlstr)
                  }
                }
              }, params.row.name)
            ])
          }
        },
        { title: '数据源', key: 'dbname', align: 'center' },
        { title: '类型', key: 'totype', align: 'center' },
        { title: '执行方式', key: 'mode', align: 'center' },
        { title: '状态', key: 'state', align: 'center' },
        { title: '创建人', key: 'username', align: 'center' },
        { title: '记录时间', key: 'create_time', align: 'center' },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                    icon: 'ios-create-outline'
                    // disabled: (params.row.username != this.tousername) && (this.toflag === 0),  //按钮禁用
                  },
                  style: {
                    marginRight: '2px',
                    color: '#409eff',
                    display: (params.row.username != this.tousername) && (this.toflag === 0) ? 'none' : 'inline-block' // 按钮隐藏
                  },
                  on: {
                    click: () => {
                      this.editModal(params.row, 'put', '编辑脚本')
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'text',
                    size: 'small',
                    icon: 'ios-trash-outline'
                    // disabled: (params.row.username != this.tousername) && (this.toflag === 0),
                  },
                  style: {
                    color: '#ed4014',
                    display: (params.row.username != this.tousername) && (this.toflag === 0) ? 'none' : 'inline-block' // 按钮隐藏
                  },
                  on: {
                    click: () => {
                      this.delData(params)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      file: null,
      loadingStatus: false,
      tableData: [],
      tableDataALL: [],
      tomsg: ' ',
      alldepartmentList: [],
      alldepartmentList2: [],
      alldepartmentList3: [],
      allobjList: [],
      uploadList: [],
      OSSRegion: '',
      OSSBucketName: '',
      modalMap: {
        modalVisible: false,
        modalTitle: '新建'
      },
      modalTable: {
        tableVisible: false,
        tableTitle: '报表'
      },
      modalMapShow: {
        modalVisible: false,
        modalTitle: 'SQL',
        user_key: ''
      },
      formList: [],
      editModalData: '',
      pageNum: 1, // 当前页码
      pageTotal: 0, // 数据总数
      pageSize: 15, // 每页条数
      tokey: '',
      tovalue: '',
      //
      searchKey: 'case_name',
      searchValue: '',
      UploadUrl: '',
      allNameList: [],
      allNameList2: [],
      storageList: [],
      storageList2: [],
      storageList3: [],
      storageList5: [],
      storageList6: []
    }
  },
  methods: {
    temp_storage_str (data) {
      for (var i = 0; i < this.storageList2.length; i++) {
        if (this.storageList2[i].name === data) {
          this.formValidate.dictvalue = this.storageList2[i].dictvalue
        }
      }
    },
    temp_storage_str2 (data) {
      for (var i = 0; i < this.storageList5.length; i++) {
        if (this.storageList5[i].name === data) {
          this.formValidate.dictvalue2 = this.storageList5[i].dictvalue
        }
      }
    },
    tempusername2 (data) {
      let temp_list = []
      let temp_str = String(data)
      for (var i = 0; i < this.storageList.length; i++) {
        if (this.storageList[i].name.indexOf(temp_str) != -1) {
          temp_list.push(this.storageList[i])
        }
      }
      this.storageList2 = temp_list
    },
    tempusername3 (data) {
      let temp_list5 = []
      let temp_str = String(data)
      for (var i = 0; i < this.storageList3.length; i++) {
        if (this.storageList3[i].name.indexOf(temp_str) != -1) {
          temp_list5.push(this.storageList3[i])
        }
      }
      this.storageList5 = temp_list5
    },
    storage_getid () {
      storage_getid().then(res => {
        if (res.data.code === 0) {
          this.storageList = res.data.data2
          this.storageList2 = res.data.data2
          this.storageList3 = res.data.data2
          this.storageList5 = res.data.data2 // 触发
          this.storageList6 = res.data.data // 定时
        } else {
          this.storageList = []
            this.storageList6 = []
              this.storageList2 = []
                this.storageList3 = []
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    tempusername (data) {
      let temp_list = []
      let temp_str = String(data)
      for (var i = 0; i < this.allNameList.length; i++) {
        if (this.allNameList[i].nickname.indexOf(temp_str) != -1) {
          temp_list.push(this.allNameList[i])
        }
      }
      this.allNameList2 = temp_list
    },
    handleAdd () {
      // this.index++;
      this.index = this.formValidate.dictvalue.length
      this.formValidate.dictvalue.push({
        d: '',
        v: '',
        k: this.index,
        m: ''
      })
    },
    handleAdd2 () {
      // this.index++;
      this.index = this.formValidate.dictvalue2.length
      this.formValidate.dictvalue2.push({
        d: '',
        v: '',
        k: this.index,
        m: ''
      })
    },
    handleRemove (index) {
      this.formValidate.dictvalue.splice(index, 1)// (下标index开始，删除1个)
    },
    handleRemove2 (index) {
      this.formValidate.dictvalue2.splice(index, 1)// (下标index开始，删除1个)
    },
    //   gettemplist(){
    //     this.router_list = eval(routerMap)
    //     for(var i = 0; i < this.router_list.length; i++) {
    //              if (this.router_list[i].name == 'statistics'){
    //                     for(var j = 0; j < eval(this.router_list[i].children).length; j++) {
    //                          // console.log("55555555555555")
    //                          // console.log(eval(this.router_list[i].children)[j].meta.title)
    //                          this.alldepartmentList.push({k: j , v: eval(this.router_list[i].children)[j].meta.title});
    //                          // console.log("55555555555555")
    //                     }
    //
    //                  }
    //         }
    // },
    // 获取用户列表
    getUserList () {
      getuserlist(1, 2000).then(res => {
        if (res.data.code === 0) {
          this.allNameList = res.data.data
          this.allNameList2 = res.data.data

        } else {
          this.allNameList = []
          this.allNameList2 = []
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    getdepartmentlist () {
      getdepartmentlist().then(res => {
        if (res.data.code === 0) {
          // this.alldepartmentList = res.data.data
          this.allobjList = res.data.objlist
        } else {
          // this.$Message.error(`${res.data.msg}`)
          // this.alldepartmentList = []
          this.allobjList = []
        }
      })
    },
    handleCreate2 (val) {
      this.alldepartmentList.push({
        k: val,
        v: val
      })
      this.formValidate.department = val
    },
    handleCreate5 (val) {
      this.allobjList.push({
        k: val,
        v: val
      })
      this.formValidate.obj = val
    },
    // 触发单选器
    change_totype () {
      if (this.formValidate.mode === '触发' && this.formValidate.totype === '存储过程') {
        this.isShow3 = true
      } else {
        this.isShow3 = false
      }
      if (this.formValidate.totype === '存储过程') {
        this.isShow = true
        this.alldepartmentList = this.alldepartmentList3
      } else {
        this.isShow = false
      }
      if (this.formValidate.totype === 'sql') {
        this.isShow2 = true
        this.alldepartmentList = this.alldepartmentList2
      } else {
        this.isShow2 = false
      }
      if (this.formValidate.mode === '定时' && this.formValidate.totype === '存储过程') {
        this.storageList3 = this.storageList6// 定时
        this.storageList5 = this.storageList6 // 定时
      } else {
        this.storageList3 = this.storageList// 触发
        this.storageList5 = this.storageList // 触发
      }
    },
    // 获取数据库源
    getDBListForQry (key, value) {
      getDBListForQry(key, value).then(res => {
        if (res.data.code === 0) {
          this.databaselist = res.data.data
        }
      })
    },
    // 导出数据、支持分页、过滤、搜索、排序后导出
    exportDateALL () {
      // 查询所有数据
      getSqlList(this.pageNum, this.pageSize, this.tokey, this.tovalue, true).then(res => {
        if (res.data.code === 0) {
          this.tableDataALL = res.data.data
          this.exportData()
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    exportData () {
      if (this.tableDataALL.length) {
        // this.exportLoading = true
        const params = {
          title: ['ID', '脚本名称', '数据源', '类型', '执行方式', '状态', '创建人', '记录时间'],
          key: ['id', 'name', 'dbname', 'totype', 'mode', 'state', 'username', 'create_time'],
          data: this.tableDataALL,
          autoWidth: true,
          filename: '脚本列表'
        }
        excel.export_array_to_excel(params)
        // this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    },

    getSqlList (page, limit, key, value) {
      getSqlList(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count
          this.tableData = res.data.data
          if (res.data.flag == '1') {
            this.toflag = 1
          } else {
            this.toflag = 0
          }
          let loginUser = JSON.parse(sessionStorage.vuex).user.nickName
          // console.log(loginUser)
          this.tousername = loginUser
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 查看Key详细信息
    handleDetail (name, sqlstr) {
      this.modalMapShow.modalVisible = true
      this.modalMapShow.modalTitle = name
      this.modalMapShow.user_key = sqlstr
    },
    // handleDetail(index) {
    //   this.$Modal.info({
    //     title: 'SQL语句',
    //     content: `模块名称：${this.tableData[index].name}<br>SQL语句：${this.tableData[index].sqlstr}<br>`
    //   })
    // },

    editModal (paramsRow, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      this.getDBListForQry()
      this.getdepartmentlist()
      if (paramsRow && paramsRow.id) {
        // put
        this.formValidate = {
          id: paramsRow.id,
          name: paramsRow.name,
          header: paramsRow.header,
          dbname_id: parseInt(paramsRow.dbname_id),
          dbname: paramsRow.dbname,
          totype: paramsRow.totype,
          sqlstr: paramsRow.sqlstr,
          remarks: paramsRow.remarks,
          username: paramsRow.username,
          mode: paramsRow.mode,
          state: paramsRow.state,
          obj: paramsRow.obj,
          department: eval('[' + paramsRow.department + ']'),
          authorized: eval(paramsRow.authorized),
          storage: paramsRow.storage,
          storage2: paramsRow.storage2,
          flag: paramsRow.flag,
          fieldname: paramsRow.fieldname,
          dictvalue: eval(paramsRow.dictvalue),
          dictvalue2: eval(paramsRow.dictvalue2),
          create_time: String(getDate(new Date().getTime() / 1000, 'year'))
        }
        if (this.formValidate.mode === '触发' || this.formValidate.totype === '存储过程')
        { this.isShow = true, this.isShow2 = false }
        if (this.formValidate.totype === 'sql') {
          this.isShow2 = true,
          this.isShow = false,
          this.isShow3 = false, this.alldepartmentList = this.alldepartmentList2
        } else
          { this.isShow = true, this.isShow2 = false, this.isShow3 = false, this.alldepartmentList = this.alldepartmentList3 }
        if (this.formValidate.mode === '触发' && this.formValidate.totype === '存储过程') { this.isShow3 = true }
        // if(this.formValidate.totype === "sql"){this.isShow2 = true,this.isShow = false}
        // else{this.isShow2 = false,this.isShow = false}
        if (this.formValidate.mode === '定时' && this.formValidate.totype === '存储过程') {
          this.storageList3 = this.storageList6// 定时
          this.storageList5 = this.storageList6 // 定时
        } else {
          this.storageList3 = this.storageList// 触发
          this.storageList5 = this.storageList // 触发
        }
      } else {
        // post
        this.formValidate = {
          name: '',
          header: '',
          dbname_id: 0,
          dbname: '',
          totype: 'sql',
          sqlstr: '',
          remarks: '',
          username: '',
          obj: '',
          mode: '定时',
          state: '运行',
          department: '',
          storage: '',
          storage2: '',
          flag: '否',
          authorized: '',
          fieldname: '',
          dictvalue: [
            {
              v: '',
              k: 1,
              d: '',
              m: ''
            }],
          dictvalue2: [
            {
              v: '',
              k: 1,
              d: '',
              m: ''
            }],
          create_time: String(getDate(new Date().getTime() / 1000, 'year'))
        }
        if (this.formValidate.totype === 'sql') { this.isShow2 = true, this.isShow = false, this.alldepartmentList = this.alldepartmentList2 } else { this.isShow2 = false, this.isShow = false, this.isShow3 = false, this.alldepartmentList = this.alldepartmentList3 }
        if (this.formValidate.mode === '触发' && this.formValidate.totype === '存储过程') { this.isShow3 = true } else { this.isShow3 = false }
      }
    },
    handleSubmit (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          this.isDisable = true
          let loginUser = JSON.parse(sessionStorage.vuex).user.nickName
          // console.log(loginUser)
          this.formValidate.username = loginUser
          // console.log(this.databaselist)
          for (let i = 0, len = this.databaselist.length; i < len; i++) {
            // console.log(this.databaselist[i]['id'])
            if (this.formValidate.dbname_id === this.databaselist[i]['id']) {
              this.formValidate.dbname = this.databaselist[i]['name']
            }
          }

          setTimeout(() => {
            SqlAdd(this.formValidate, this.editModalData).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getSqlList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
                this.modalMap.modalVisible = false
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
            this.isDisable = false
          }, 1000)
        } else {
          this.$Message.error('缺少必要参数')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.name}`)) {
        sqlDelete(
          {
            id: params.row.id
          }
        ).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData.splice(params.index, 1)
            this.getSqlList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },

    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.tovalue = this.formValidate2
      this.getSqlList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
    },
    changePage (value) {
      this.pageNum = value
      this.getCaseList(
        this.pageNum,
        this.pageSize,
        this.tokey,
        this.tovalue
      )
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getCaseList(1, this.pageSize, this.tokey, this.tovalue)
    },
    getDictConfList () {
      getDictConfList().then(res => {
        if (res.data.code === 0) {
          this.alldepartmentList3 = eval(res.data.data['statistics_department_list']) // 需求统计
          this.alldepartmentList2 = eval(res.data.data['sql_statistics_department_list']) // 报表统计
          this.alldepartmentList = this.alldepartmentList2
        } else {
          this.alldepartmentList3 = []
          this.alldepartmentList2 = []
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    }
  },

  mounted () {
    this.getSqlList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
    this.getdepartmentlist()
    this.getDictConfList()
    this.getUserList()
    // this.gettemplist()
    this.storage_getid()
  }
}
</script>

<style lang="less" scoped>
  .case-btn {
    margin-right: 5px
  }
</style>
