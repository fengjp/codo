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
        width="530"
      >
        <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85" :inline="true">

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
          <FormItem label="excel表头" prop="header" style="display: block">
            <Input v-model="formValidate.header" type="textarea"
                   placeholder='请输入excel表头字段,用竖号分开。例：编号|用户名|手机号|地址'></Input>
          </FormItem>
          <FormItem label="数据库源" prop="dbname_id" style="width:60%;">
              <Select placeholder="数据库源" v-model="formValidate.dbname_id">
                <Option :value="item.id" v-for="item in databaselist">{{item.name}}
                </Option>
              </Select>
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
            </FormItem><FormItem label="状态" prop="state" style="width:500px;">
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
          <Row :gutter="10" style="margin-bottom: 5px">
            <FormItem
              label="存储过程"
              prop="storage" style="width:350px;"
              v-if="isShow"
            >
              <Input
                v-model="formValidate.storage"
                placeholder="存储过程"
              ></Input>
            </FormItem>
            <FormItem
              label="SQL语句"
              prop="sqlstr" style="width:500px;margin-right:500px"
            >
              <Input
                v-model="formValidate.sqlstr"
                type="textarea"
                :rows="5"
                placeholder="SQL语句"
              ></Input>
            </FormItem>
            <FormItem label="部门名称" prop="remarks" style="width:500px;margin-right:500px" v-if="isShow">
          <Select @on-create="handleCreate2" allow-create multiple filterable placeholder="部门名称" v-model="formValidate.department">
            <Option  :value="item.v" v-for="item in alldepartmentList">{{item.v}}</Option>
          </Select>
        </FormItem>
            <FormItem label="项目名" prop="remarks" style="width:500px;margin-right:500px"  v-if="isShow">
              <Select @on-create="handleCreate5" allow-create  filterable placeholder="项目名" v-model="formValidate.obj">
            <Option  :value="item.v" v-for="item in allobjList">{{item.v}}</Option>
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

  import {SqlAdd, getCase, getSqlList, getname, sqlDelete, getdepartmentlist} from '@/api/cmdb2/asset_sql'
  import {getuserlist} from '@/api/user'
  import {getDate} from '@/libs/tools'
  import excel from '@/libs/excel'
  import {getDictConfList} from '@/api/app'
  import {getDBListForQry} from '@/api/cmdb2/db.js'

  export default {
    data() {
      return {
        typelist:[{"k":1,"v":"sql"},{"k":2,"v":"存储过程"},{"k":3,"v":"触发"},{"k":4,"v":"屏蔽"}],
        btnText: '展开',
        isShow: false,
        isShow2: false,
        isShow3: false,
        toflag: 0,
        tousername: "",
        isDisable: false,
        isDisable2: false,
        surl: '',
        formValidate: {
          name: '',
          header: '',
          totype: '',
          dbname_id: "",
          dbname: "",
          sqlstr: '',
          remarks: '',
          username: '',
          department: '',
          obj:'',
          storage:'',
          mode:'',
          state:'',
          flag:'',
          create_time: ''
        },
        databaselist: [],
        formValidate2: {
          name: '',
          remarks: '',
          totype:'',
        },
        todate: [],
        ruleValidate: {
          name: [
            {
              required: true,
              message: '请输入脚本名',
              trigger: 'blur',
            }
          ],
          header: [
            {
              required: true,
              message: '请输入excel列名',
              trigger: 'blur'
            }
          ],
          dbname_id: [
            {
              required: true,
              message: '请选择',
              trigger: 'blur',
              type:"number",
            }
          ],
          totype: [
            {
              required: true,
              message: '请选择执行类型',
              trigger: 'blur'
            }
          ]
        },
        columns: [
          {
            title: '脚本名称', key: 'name',  align: 'center', render: (h, params) => {
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
          {title: '数据源', key: 'dbname',  align: 'center'},
          {title: '类型', key: 'totype',  align: 'center'},
          {title: '执行方式', key: 'mode', align: 'center'},
          {title: '状态', key: 'state', align: 'center'},
          {title: '创建人', key: 'username', align: 'center'},
          {title: '记录时间', key: 'create_time',  align: 'center'},
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
                      icon: 'ios-create-outline',
                      disabled: (params.row.username != this.tousername) && (this.toflag === 0),
                    },
                    style: {
                      marginRight: '2px',
                      color: '#409eff'
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
                      icon: 'ios-trash-outline',
                      disabled: (params.row.username != this.tousername) && (this.toflag === 0),
                    },
                    style: {
                      color: '#ed4014'
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
        alldepartmentList:[],
        allobjList:[],
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
        allNameList: []
      }
    },
    methods: {
       getdepartmentlist() {
        getdepartmentlist().then(res => {
          if (res.data.code === 0) {
            // this.alldepartmentList = res.data.data
            this.allobjList = res.data.objlist
          } else {
            this.$Message.error(`${res.data.msg}`)
            // this.alldepartmentList = []
            this.allobjList = []
          }
        })
      },
       handleCreate2 (val) {
                this.alldepartmentList.push({
                    k: val,
                    v: val
                });
                this.formValidate.department = val
            },
      handleCreate5 (val) {
                this.allobjList.push({
                    k: val,
                    v: val
                });
                this.formValidate.obj = val
            },
      //触发单选器
      change_totype(){
         if(this.formValidate.mode === "触发" && this.formValidate.totype === "存储过程" ){
          this.isShow3 = true
        }else{
          this.isShow3 = false
        }
        if(this.formValidate.totype === "存储过程" ){
          this.isShow = true
        }
        else{
          this.isShow = false
        }
        if(this.formValidate.totype === "sql"){
          this.isShow2 = true
        }
        else{
          this.isShow2 = false
        }

      },
      // 获取数据库源
      getDBListForQry(key, value) {
        getDBListForQry(key, value).then(res => {
          if (res.data.code === 0) {
            this.databaselist = res.data.data
          }
        })
      },
      // 导出数据、支持分页、过滤、搜索、排序后导出
      exportDateALL() {
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
      exportData() {
        if (this.tableDataALL.length) {
          // this.exportLoading = true
          const params = {
            title: ['ID', '脚本名称', '数据源', '类型', '执行方式', '状态',"创建人", '记录时间'],
            key: ['id', 'name', 'dbname', 'totype', "mode","state","username", 'create_time'],
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

      getSqlList(page, limit, key, value) {
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
            console.log(loginUser)
            this.tousername = loginUser
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 查看Key详细信息
      handleDetail(name, sqlstr) {
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

      editModal(paramsRow, meth, mtitle) {
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
            department: eval('[' +paramsRow.department + ']'),
            storage:paramsRow.storage,
            flag:paramsRow.flag,
            create_time: getDate(new Date().getTime() / 1000, 'year')
          }
          if(this.formValidate.totype === "触发" || this.formValidate.totype === "存储过程"){this.isShow = true,this.isShow2 = false}
          else{this.isShow = false,this.isShow2 = false}
          if(this.formValidate.mode === "触发" && this.formValidate.totype === "存储过程"){this.isShow3 = true}
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
            mode:'定时',
            state:'运行',
            department: '',
            storage:'',
            flag:'否',
            create_time: getDate(new Date().getTime() / 1000, 'year')
          }
          if(this.formValidate.totype === "sql"){this.isShow2 = true,this.isShow = false}
          else{this.isShow2 = false,this.isShow = false}
          if(this.formValidate.mode === "触发" && this.formValidate.totype === "存储过程"){this.isShow3 = true}
        }
      },
      handleSubmit(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            this.isDisable = true
            let loginUser = JSON.parse(sessionStorage.vuex).user.nickName
            // console.log(loginUser)
            this.formValidate.username = loginUser
            // console.log(this.databaselist)
            for (let i = 0, len = this.databaselist.length; i < len; i++) {
                console.log(this.databaselist[i]['id'])
                if( this.formValidate.dbname_id === this.databaselist[i]['id']){
                  this.formValidate.dbname =  this.databaselist[i]['name']
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
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      // 删除
      delData(params) {
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

      handleClear(e) {
        if (e.target.value === '') this.tableData = this.value
      },
      handleSearch() {
        this.tovalue = this.formValidate2
        this.getSqlList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
      },
      changePage(value) {
        this.pageNum = value
        this.getCaseList(
          this.pageNum,
          this.pageSize,
          this.tokey,
          this.tovalue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getCaseList(1, this.pageSize, this.tokey, this.tovalue)
      },
      getDictConfList () {
      getDictConfList().then(res => {
        if (res.data.code === 0) {
          this.alldepartmentList = eval(res.data.data['statistics_department_list'])
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    }
    },

    mounted() {
      this.getSqlList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
      this.getdepartmentlist()
      this.getDictConfList()
    }
  }
</script>

<style lang="less" scoped>
  .case-btn {
    margin-right: 5px
  }
</style>
