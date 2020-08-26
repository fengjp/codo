<template>
  <div style="height:100%">
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns"
              @on-delete="handleDelete" @on-save-edit="handleInput"
              @on-search-table="handleSearchTable"
              @on-selection-change="handleSelectChange">
        <div slot="new_btn" class="search-con search-col">
          <Button type="info" class="search-btn" @click="editModal('', 'post', '新增干系人')">新建干系人</Button>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>
<!--    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true>-->
<!--      <form-group :list="formList" @on-submit-success="handleSubmit"></form-group>-->
<!--    </Modal>-->
     <Modal
        v-model="modalMap.modalVisible"
        :title="modalMap.modalTitle"
        :loading=true
        :footer-hide=true
        width="450"
      >
        <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="69" :inline="true">
          <div v-if="editModalData && editModalData == 'put'">
              <FormItem label="用户名" prop="username" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.username"
                  disabled
                  :maxlength="45"
                  placeholder="请输入用户名"
                ></Input>
              </FormItem>
            </div>
            <div v-else>
              <FormItem label="用户名" prop="username" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.username"
                  :maxlength="45"
                  placeholder="请输入用户名"
                ></Input>
              </FormItem>
            </div>
          <FormItem label="单位" prop="company"  style="width:350px;">
              <Select v-model="formValidate.company" placeholder="单位">
                <Option v-for="item in allcompanyList" :value="item.type_name" :key="item.id">{{item.type_name}}</Option>
              </Select>
            </FormItem>
          <FormItem label="部门" prop="department"  style="width:350px;">
              <Select v-model="formValidate.department" placeholder="部门">
                <Option v-for="item in alldepartmentList" :value="item.type_name" :key="item.id">{{item.type_name}}</Option>
              </Select>
            </FormItem>
          <FormItem label="职位" prop="position" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.position"
                  :maxlength="45"
                  placeholder="请输入职位"
                ></Input>
              </FormItem>
          <FormItem label="职责范围" prop="range" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.range"
                  :maxlength="45"
                  placeholder="请输入职责范围"
                ></Input>
              </FormItem>
            <FormItem label="电话" prop="tel" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.tel"
                  :maxlength="45"
                  placeholder="请输入联系方式"
                ></Input>
              </FormItem>
            <FormItem label="地址" prop="addr" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.addr"
                  :maxlength="45"
                  placeholder="请输入地址"
                ></Input>
              </FormItem>
            <FormItem label="邮箱" prop="email" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.email"
                  :maxlength="45"
                  placeholder="请输入邮箱号"
                ></Input>
              </FormItem>
          <FormItem label="备注" prop="remarks" style="width:350px;margin-right:20px">
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
  </div>
</template>

<script>
import Tables from '_c/tables'
import FormGroup from '_c/form-group'
import {
  getStakeholderList,
  newStakeholder,
  delStakeholder,
  updateStakeholder
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
      isDisable: false,
      editModalData: '',
      formValidate: {
        id: 0,
        username: '',
        company: "",
        department: '',
        position: '',
        tel: '',
        range: '',
        addr:'',
        remarks:'',
        email: ''
      },
      allcompanyList: [],
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
      columns: [
        { type: 'selection', title: '', key: '', width: 60, align: 'center' },
        { title: '用户名', key: 'username', sortable: true },
        { title: '单位', key: 'company', sortable: true },
        { title: '部门', key: 'department', editable: true },
        { title: '职位', key: 'position', editable: true },
        { title: '职责范围', key: 'range', editable: true },
        { title: '电话', key: 'tel', editable: true },
        { title: '地址', key: 'addr', editable: true },
        { title: '邮箱', key: 'email', editable: true },
         { title: '备注', key: 'remarks', sortable: true },
        {
          title: '操作',
          align: 'center',
          width: 150,
          key: 'handle',
          // options: ["delete"],
          button: [
            (h, params, vm) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editModal(params.row, 'put', '编辑干系人')
                      }
                    }
                  },
                  '编辑'
                ), h(
                  'Poptip',
                  {
                    props: {
                      confirm: true,
                      title: '你确定要删除吗?'
                    },
                    on: {
                      'on-ok': () => {
                        vm.$emit('on-delete', params)
                        vm.$emit(
                          'input',
                          params.tableData.filter(
                            (item, index) => index !== params.row.initRowIndex
                          )
                        )
                      }
                    }
                  },
                  [
                    // h('Button', '自定义删除'),
                    h(
                      'Button',
                      {
                        props: {
                          size: 'small'
                        }
                      },
                      '删除'
                    )
                  ]
                )])
            }
          ]
        }
      ],
      // 搜索数据
      searchKey: '',
      searchValue: '',
      // 分页数据
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      // select
      selectionList: []
    }
  },
  methods: {
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
          range:paramsRow.range,
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
          range:"",
          tel: "",
          addr: "",
          email: "",
          remarks:""
        }
      }
    },
    handleDelete (params) {
      delStakeholder({ id: params.row.id }).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
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
    handleSelectChange (val) {
      let userList = []
      val.forEach(item => {
        userList.push(item.user_id)
      })
      this.selectionList = userList
    }
  },
  mounted () {
    this.getStakeholderList(this.pageNum, this.pageSize)
    this.getDictConfList()
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
