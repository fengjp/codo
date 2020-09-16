<template>
  <div style="height:100%">
    <Card  style="margin-top: 5px;">
       <p slot="title" >干系人列表</p>
      <div  slot="extra">
        <Row>
        <Select v-model="searchKey" class="search-col"  style="width:150px;margin-right:5px">
          <Option v-for="item in columnslist"  :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
        </Select>
          <Input @on-change="handleClear"  clearable placeholder="输入关键字搜索"  v-model="searchValue" style="width:150px;margin-right:5px"/>
      <Button @click="handleSearch" class="search-btn" type="primary" style="margin-right:5px">搜索</Button>
       <Button type="info" class="search-btn" @click="editModal('', 'post', '新增干系人')" style="margin-right:5px">新建干系人</Button>
          <Button type="info"  @click="editModal2" style="margin-right:5px">批量新建干系人</Button>
        </Row>
    </div>
      <Table
        :columns="columns"
        :data="tableData"
        ref="selection"
        size="small"
        height="300"
      ></Table>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>
    <Card  style="margin-top: 5px;">
      <p slot="title" >个案列表</p>
      <Table
        :columns="columns2"
        :data="tableData2"
        ref="selection"
        size="small"
        height="320"
      ></Table>
    </Card>
<!--    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true>-->
<!--      <form-group :list="formList" @on-submit-success="handleSubmit"></form-group>-->
<!--    </Modal>-->
     <Modal
        v-model="modalMap.modalVisible"
        :title="modalMap.modalTitle"
        :loading=true
        :footer-hide=true
        width="385px"
        :styles="{top: '20px'}"
      >
        <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="69" :inline="true">
          <div v-if="editModalData && editModalData == 'put'">
              <FormItem label="用户名" prop="username" style="width:350px;">
                <Input
                  v-model="formValidate.username"
                  disabled
                  :maxlength="45"
                  placeholder="请输入用户名"
                ></Input>
              </FormItem>
            </div>
            <div v-else>
              <FormItem label="用户名" prop="username" style="width:350px;">
                <Input
                  v-model="formValidate.username"
                  :maxlength="45"
                  placeholder="请输入用户名"
                ></Input>
              </FormItem>
            </div>
          <FormItem label="单位" prop="company"  style="width:350px;">
              <Select v-model="formValidate.company" placeholder="单位">
                <Option v-for="item in alldemand_unit" :value="item.v" :key="item.k">{{item.v}}</Option>
              </Select>
            </FormItem>
          <FormItem label="部门" prop="department"  style="width:350px;">
              <Select v-model="formValidate.department" placeholder="部门">
                <Option v-for="item in alldepartmentList" :value="item.v" :key="item.k">{{item.v}}</Option>
              </Select>
            </FormItem>
          <FormItem label="职位" prop="position" style="width:350px;">
                <Input
                  v-model="formValidate.position"
                  :maxlength="45"
                  placeholder="请输入职位"
                ></Input>
              </FormItem>
          <FormItem label="职责范围" prop="duty" style="width:350px;">
                <Input
                  v-model="formValidate.duty"
                  :maxlength="45"
                  placeholder="请输入职责范围"
                ></Input>
              </FormItem>
            <FormItem label="电话" prop="tel" style="width:350px;">
                <Input
                  v-model="formValidate.tel"
                  :maxlength="45"
                  placeholder="请输入联系方式"
                ></Input>
              </FormItem>
            <FormItem label="地址" prop="addr" style="width:350px;">
                <Input
                  v-model="formValidate.addr"
                  :maxlength="45"
                  placeholder="请输入地址"
                ></Input>
              </FormItem>
            <FormItem label="邮箱" prop="email" style="width:350px;">
                <Input
                  v-model="formValidate.email"
                  :maxlength="45"
                  placeholder="请输入邮箱号"
                ></Input>
              </FormItem>
          <FormItem label="备注" prop="remarks" style="width:350px;">
                <Input
                  v-model="formValidate.remarks"
                  :maxlength="45"
                  placeholder="备注信息"
                ></Input>
              </FormItem>
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
        v-model="modalMap2.modalVisible"
        :loading=true
        :footer-hide=true
        width="30%"
      >
      <div slot="header">
        <Button @click="geturl()"  >下载模板文件</Button>
          <a :href=surl><span id="surl"></span></a>
      </div>
      <Upload
        type="drag"
        :action=UploadUrl
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>请选择或拖拽一个文件上传</p>
        </div>
    </Upload>
    </Modal>
  </div>
</template>

<script>

import Tables from '_c/tables'
import {companylist} from '@/api/problem'
import FormGroup from '_c/form-group'
import {
  getStakeholderList,
  getList,
  newStakeholder,
  delStakeholder,
  updateStakeholder,
  UploadUrl,
  geturl
} from '@/api/stakeholder'
import { getDictConfList } from '@/api/app'

export default {
  components: {
    Tables,
    FormGroup
  },
  data () {
    return {
      // 弹出框
      modalMap: {
        modalVisible: false,
        modalTitle: '创建干系人'
      },
      modalMap2: {
        modalVisible: false,
        modalTitle: '批量创建干系人'
      },
      isDisable: false,
      editModalData: '',
      tokey: '',
      tovalue: '',
      searchValue: '',
      searchKey: '用户名',
      UploadUrl: '',
      surl:'',
      formValidate: {
        id: 0,
        username: '',
        company: "",
        department: '',
        position: '',
        tel: '',
        duty: '',
        addr:'',
        remarks:'',
        email: ''
      },
      allcompanyList: [],
      alldemand_unit: [],
      alldepartmentList: [],
      ruleValidate: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        company: [
          {
            required: true,
            message: '请输入单位名',
            trigger: 'blur'
          }
        ]
      },
      // // 渲染form数据
      // formList: [
      //   {
      //     name: 'username',
      //     type: 'i-input',
      //     value: '',
      //     label: '用户名',
      //     placeholder: '英文字母',
      //     rule: [
      //       { required: true, message: '用户名不能为空', trigger: 'blur' }
      //     ]
      //   },
      //   {
      //     name: 'nickname',
      //     type: 'i-input',
      //     value: '',
      //     label: '昵称',
      //     placeholder: '中文',
      //     rule: [
      //       { required: true, message: '昵称不能为空', trigger: 'blur' }
      //     ]
      //   },
      //   {
      //     name: 'company',
      //     type: 'i-input',
      //     value: '',
      //     label: '单位',
      //     rule: [
      //       { required: true, message: '单位名称不能为空', trigger: 'blur' }
      //     ]
      //   },
      //   {
      //     name: 'department',
      //     type: 'i-input',
      //     value: '',
      //     label: '部门'
      //   },
      //   {
      //     name: 'wechat',
      //     type: 'i-input',
      //     value: '',
      //     label: '微信号码'
      //   },
      //   {
      //     name: 'tel',
      //     type: 'i-input',
      //     value: '',
      //     label: '手机号码'
      //   },
      //   {
      //     name: 'email',
      //     type: 'i-input',
      //     value: '',
      //     label: '邮箱'
      //   }
      // ],
      columnslist: [
        { title: '用户名', key: 'username',editable: true },
        { title: '单位', key: 'company', editable: true },
        { title: '部门', key: 'department', editable: true },
        { title: '职位', key: 'position', editable: true },
        { title: '职责范围', key: 'duty', editable: true },
        { title: '电话', key: 'tel', editable: true },
        { title: '地址', key: 'addr', editable: true },
        { title: '邮箱', key: 'email', editable: true },
         { title: '备注', key: 'remarks', sortable: true },
            ],
      columns: [
        // { type: 'selection', title: '', key: '', width: 60, align: 'center' },
        { title: '用户名', key: 'username', sortable: true,render: (h, params) => {
              // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
              return h('a', {
                  on: {
                    click: () => {
                      this.handleDetail(params)
                    }
                  }
                }, params.row.username
              )
            } },
        { title: '单位', key: 'company', sortable: true },
        { title: '部门', key: 'department', editable: true },
        { title: '职位', key: 'position', editable: true },
        { title: '职责范围', key: 'duty', editable: true },
        { title: '电话', key: 'tel', editable: true },
        { title: '地址', key: 'addr', editable: true },
        { title: '邮箱', key: 'email', editable: true },
         { title: '备注', key: 'remarks', sortable: true },
        {
          title: '操作',
          align: 'center',
          width: 180,
          key: 'handle',
          // options: ["delete"],
         render:
            (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'ios-create-outline',
                    },
                    style: {
                      marginRight: '1px',
                      color: '#409eff'
                    },
                    on: {
                      click: () => {
                        this.editModal(params.row, 'put', '编辑干系人')
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
                    },
                    style: {
                        marginRight: '1px',
                         color: '#ed4014'
                      },
                    on: {
                      click: () => {
                        this.handleDelete(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }

        }
      ],
      columns2: [
          {title: '个案', key: 'case_name', align: 'center', width: 200,},
          {title: '类型', key: 'case_type', align: 'center', width: 100,},
          {title: '状态', key: 'case_status', align: 'center', width: 100,},
          {title: '项目', key: 'case_obj', align: 'center', width: 150,},
          {title: '开始时间', key: 'case_stime',  align: 'center', width: 150,},
          {title: '结束时间', key: 'case_etime',  align: 'center', width: 150,},
          {title: '处理人', key: 'case_executor', align: 'center', width: 100,},
          {title: '优先级', key: 'case_priority', align: 'center', width: 100,},
          {title: '新建人', key: 'case_creator', align: 'center', width: 100,},
          {title: '需求人', key: 'demander', align: 'center', width: 100,},
         {title: '需求单位', key: 'demand_unit', align: 'center', width: 100,},
           {
            title: '描述',
            key: 'case_details',
            width: 205,
            align: 'center',
            render: (h, params) => {
              let roleTitle = params.row.case_details
              return h('div', [
                h('span', {
                  style: {
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  domProps: {
                    title: roleTitle
                  }
                }, roleTitle)
              ])
            }
          },
        ],
      // 搜索数据
      searchKey: '',
      searchValue: '',
      // 分页数据
      tableData: [],
      tableData2: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      // select
      selectionList: []
    }
  },
  methods: {
    handleSuccess (res, file) {
          console.log(file)
          this.getStakeholderList(this.pageNum, this.pageSize)
          this.modalMap2.modalVisible = false
          this.$Message.success("文件上传成功")
             },
    handleError (error) {
                console.log(error)
                this.modalMap2.modalVisible = false
                this.$Message.success("文件上传失败")
             },
      geturl () {
        geturl().then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.surl = res.data.data
          setTimeout(() => {
              document.getElementById('surl').click()
            }, 1000)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取个案列表
    getList (key,value) {
      getList(key,value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          // this.pageTotal = res.data.count
          this.tableData2 = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
     getDictConfList () {
      getDictConfList().then(res => {
        if (res.data.code === 0) {
          // let stakeholder_company_list = JSON.parse(res.data.data['stakeholder_company_list'])
          // let stakeholder_department_list = JSON.parse(res.data.data['stakeholder_department_list'])
          let stakeholder_company_list = eval(res.data.data['stakeholder_company_list'])
          let stakeholder_department_list = eval(res.data.data['stakeholder_department_list'])
          if (stakeholder_company_list) {
            this.allcompanyList = stakeholder_company_list
            console.log(this.allcompanyList)
          }
          if (stakeholder_department_list) {
            this.alldepartmentList = stakeholder_department_list
          }

        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    editModal2 () {
      this.modalMap2.modalVisible = true
      this.modalMap2.modalTitle = '上传文件'
    },
    editModal (paramsRow, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      if (paramsRow && paramsRow.id) {
        // put
        this.formValidate = {
          id: paramsRow.id,
          username: paramsRow.username,
          department: paramsRow.department,
          company: paramsRow.company,
          position:paramsRow.position,
          duty:paramsRow.duty,
          tel: paramsRow.tel,
          addr: paramsRow.addr,
          email: paramsRow.email,
          remarks:paramsRow.remarks
        }
      }else {
        // post
        this.formValidate = {
          username: "",
          department: "",
          company: "",
          position:"",
          duty:"",
          tel: "",
          addr: "",
          email: "",
          remarks:""
        }
      }
    },
    handleDelete (params) {
      if (confirm(`确定要删除 ${params.row.username}`)) {
        delStakeholder({id: params.row.id}).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getStakeholderList(this.pageNum, this.pageSize,this.tokey,this.tovalue)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    changePage (value) {
      this.pageNum = value
      this.getStakeholderList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    handleSearch() {
        this.getStakeholderList(1, this.pageSize, this.searchKey, this.searchValue)
      },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getStakeholderList(1, this.pageSize, this.searchKey, this.searchValue)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    handleSearchTable (key, val) {
      this.pageNum = 1
      this.searchKey = key
      this.searchValue = val
      this.getStakeholderList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    // 获取用户列表
    getStakeholderList (page, limit, key, value) {
      getStakeholderList(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count
          this.tableData = res.data.data

        } else {
          this.tableData = []
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
     handleSubmit (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          this.isDisable = true
          if(this.formValidate.tel.length > 11)
          {this.$Message.error("请输入正确的手机号")}
          setTimeout(() => {
            if(this.editModalData == "post"){
                  newStakeholder(this.formValidate).then(res => {
                       const data = res.data
                       if (res.data.code === 0) {
                               this.$Message.info(`${data.msg}`)
                               // 重新获取数据
                               this.getStakeholderList(this.pageNum, this.pageSize)
                       } else {
                            this.$Message.error(`${data.msg}`)
                       }
                  }).catch(err => {
                        this.$Message.error(err)
                  })
            }
            if (this.editModalData == "put"){
                  updateStakeholder(this.formValidate).then(res => {
                            const data = res.data
                            if (res.data.code === 0) {
                                    this.$Message.info(`${data.msg}`)
                                    // 重新获取数据
                                    this.getStakeholderList(this.pageNum, this.pageSize)
                            } else {
                                    this.$Message.error(`${data.msg}`)
                            }
                  }).catch(err => {
                          this.$Message.error(err)
                  })
            }
            this.modalMap.modalVisible = false
            this.isDisable = false
          }, 1000)
        } else {
          this.$Message.error('缺少必要参数')
        }
      })
    },
    handleInput (editData) {
      // 行内编辑
      const EditData = {
        user_id: editData.row.user_id,
        key: editData.column.key,
        value: editData.value
      }
      updateStakeholder(EditData).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    companylist(key,value) {
        companylist(key,value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            console.log(res.data.data)
            this.alldemand_unit  = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
    handleClear (e) {
      // if (e.target.value === '') this.tableData = this.value
    },
    handleDetail(params) {

        console.log(params.row.company)
        console.log(params.row.username)
        this.getList(params.row.company,params.row.username)
      },
    handleSelectChange (val) {
      let userList = []
      val.forEach(item => {
        userList.push(item.user_id)
      })
      this.selectionList = userList
    }
  },
  mounted () {
    this.UploadUrl = UploadUrl
    this.getStakeholderList(this.pageNum, this.pageSize)
    this.getDictConfList()
    this.companylist("company","")
  }
}
</script>

<style lang="less" scoped>
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
</style>
