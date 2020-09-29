<template>
  <div style="height:100%">
    <Card  style="margin-top: 5px;">
      <div >
        <Row>
        <Select v-model="searchKey" class="search-col"  style="width:150px;margin-right:5px">
          <Option v-for="item in columnslist"  :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}</Option>
        </Select>
          <Input @on-change="handleClear"  clearable placeholder="输入关键字搜索"  v-model="searchValue" style="width:150px;margin-right:5px"/>
      <Button @click="handleSearch" class="search-btn" type="primary" style="margin-right:5px">搜索</Button>
       <Button type="info" class="search-btn" @click="editModal('', 'post', '新增人员')" style="margin-right:5px">新增人员</Button>
          <Button type="info"  @click="editModal3" style="margin-right:5px">组织架构图</Button>
        </Row>
    </div>
      <Table
        :columns="columns"
        :data="tableData"
        ref="selection"
        size="small"
      ></Table>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>
     <Modal
        v-model="modalMap.modalVisible"
        :title="modalMap.modalTitle"
        :loading=true
        :footer-hide=true
        width="385px"
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

          <FormItem label="岗位" prop="jobpost" style="width:350px;">
            <Select v-model="formValidate.jobpost" placeholder="岗位">
                <Option v-for="item in alljobpostList" :value="item.postname" :key="item.id">{{item.postname}}</Option>
              </Select>
              </FormItem>
            <FormItem label="手机号" prop="tel" style="width:350px;">
                <Input
                  v-model="formValidate.tel"
                  :maxlength="45"
                  placeholder="请输入联系手机号"
                ></Input>
              </FormItem>
          <FormItem label="上级领导" prop="othername" style="width:350px;">
                <Select v-model="formValidate.othername" placeholder="请选择上级领导姓名">
                <Option v-for="item in allusernameList" :value="item.id" >{{item.username}}</Option>
              </Select>
              </FormItem>
          <FormItem label="入岗日期" prop="startdate" style="width:350px;">
                <DatePicker :clearable="false"
                              :value="formValidate.startdate" @on-change="changestime"
                              format="yyyy-MM-dd"
                              placeholder="记录开始日期"
                              type="date">

                  </DatePicker>
              </FormItem>
          <FormItem label="离岗日期" prop="enddate" style="width:350px;">
                <DatePicker :clearable="false"
                              :value="formValidate.enddate" @on-change="changeetime"
                              format="yyyy-MM-dd"
                              placeholder="记录结束日期"
                              type="date">

                  </DatePicker>
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
        :title="modalMap2.modalTitle"
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
    <Modal
        v-model="modalMap3.modalVisible"
        :title="modalMap3.modalTitle"
        :loading=true
        :footer-hide=true
        width="50%"
      >
       <Card shadow>
       <chart-tree ref="peopleTree" style="height: 340px;" :value="treeData" text="组织架构图"/>
         </Card>
    </Modal>
  </div>
</template>

<script>

import {companylist} from '@/api/problem'
import FormGroup from '_c/form-group'
import {
  getpeoplelist,
  addpeoplelist,
  delpeoplelist,
  updatepeoplelist,
  getlist,
} from '@/api/peoples'
import { getDictConfList } from '@/api/app'
import { post_getid } from '@/api/jobpost'
import {ChartTree} from '_c/charts'
export default {
  components: {
    FormGroup,
    ChartTree,
  },
  data () {
    return {
      treeData: [],
      // 弹出框
      modalMap: {
        modalVisible: false,
        modalTitle: '创建人员'
      },
      modalMap2: {
        modalVisible: false,
        modalTitle: '批量创建干系人'
      },
      modalMap3: {
        modalVisible: false,
        modalTitle: '组织架构'
      },
      isDisable: false,
      editModalData: '',
      tokey: '',
      allusernameList: [],
      alljobpostList: [],
      tovalue: '',
      searchValue: '',
      searchKey: '用户名',
      UploadUrl: '',
      surl:'',
      formValidate: {
        id: 0,
        username: '',
        othername: '',
        jobpost:'',
        tel: '',
        startdate: '',
        enddate: ''
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
        jobpost: [
          {
            required: true,
            message: '请输入岗位名',
            trigger: 'blur'
          }
        ],
        tel: [
          {
            required: true,
            message: '请输入联系方式',
            trigger: 'blur'
          }
        ]
      },
      columnslist: [
        { title: '用户名', key: 'username',editable: true },
            ],
      columns: [
        { title: '用户名', key: 'username',editable: true },
        { title: '岗位', key: 'jobpost', editable: true },
        { title: '联系方式', key: 'tel', editable: true },
        // { title: '上级领导', key: 'othername', editable: true },
        { title: '入岗日期', key: 'startdate', editable: true },
        { title: '离岗日期', key: 'enddate', editable: true },
        {
          title: '操作',
          align: 'center',
          width: 180,
          key: 'handle',
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
                        this.editModal(params.row, 'put', '编辑人员')
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
    changestime(data) {
        this.formValidate.startdate = data
      },
      changeetime(data) {
        this.formValidate.enddate = data
      },
    handleSuccess (res, file) {
          console.log(file)
          this.getpeoplelist(this.pageNum, this.pageSize)
          this.modalMap2.modalVisible = false
          this.$Message.success("文件上传成功")
             },
    handleError (error) {
                console.log(error)
                this.modalMap2.modalVisible = false
                this.$Message.success("文件上传失败")
             },
    post_getid () {
        post_getid().then(res => {
        if (res.data.code === 0) {
          this.alljobpostList = res.data.data
        } else {
          this.alljobpostList = []
        }
      })
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
    getlist () {
        getlist().then(res => {
        if (res.data.code === 0) {
          this.allusernameList = res.data.data
          this.treeData  = res.data.treelist
        } else {
          this.allusernameList =  []
          this.treeData = []
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
          this.alldepartmentList = []
          this.allcompanyList = []
          // this.$Message.error(`${res.data.msg}`)

        }
      })
    },
    editModal2 () {
      this.modalMap2.modalVisible = true
      this.modalMap2.modalTitle = '上传文件'
    },
    editModal3 () {
      this.getlist()
      setTimeout(() => {
              this.modalMap3.modalVisible = true
              this.modalMap3.modalTitle = '组织架构'
      }, 500)
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
          jobpost:paramsRow.jobpost,
          tel:paramsRow.tel,
          othername:paramsRow.othername,
          startdate:paramsRow.startdate,
          enddate:paramsRow.enddate,
        }
      }else {
        // post
        this.formValidate = {
          username: '',
          jobpost:'',
          tel:'',
          othername: '',
          startdate:'',
          enddate:'',
        }
      }
    },
    handleDelete (params) {
      if (confirm(`确定要删除 ${params.row.username}`)) {
        delpeoplelist({id: params.row.id}).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getpeoplelist(this.pageNum, this.pageSize,this.tokey,this.tovalue)
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
      this.getpeoplelist(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    handleSearch() {
        this.getpeoplelist(1, this.pageSize, this.searchKey, this.searchValue)
      },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getpeoplelist(1, this.pageSize, this.searchKey, this.searchValue)
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
      this.getpeoplelist(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    // 获取用户列表
    getpeoplelist (page, limit, key, value) {
      getpeoplelist(page, limit, key, value).then(res => {
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
                  addpeoplelist(this.formValidate).then(res => {
                       const data = res.data
                       if (res.data.code === 0) {
                               this.$Message.info(`${data.msg}`)
                               // 重新获取数据
                               this.getpeoplelist(this.pageNum, this.pageSize)
                               this.getlist()
                       } else {
                            this.$Message.error(`${data.msg}`)
                       }
                  }).catch(err => {
                        this.$Message.error(err)
                  })
            }
            if (this.editModalData == "put"){
                  updatepeoplelist(this.formValidate).then(res => {
                            const data = res.data
                            if (res.data.code === 0) {
                                    this.$Message.info(`${data.msg}`)
                                    // 重新获取数据
                                    this.getpeoplelist(this.pageNum, this.pageSize)
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
      updatepeoplelist(EditData).then(res => {
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
    handleSelectChange (val) {
      let userList = []
      val.forEach(item => {
        userList.push(item.user_id)
      })
      this.selectionList = userList
    }
  },
  mounted () {
    this.getpeoplelist(this.pageNum, this.pageSize)
    this.getDictConfList()
    this.post_getid()
    this.getlist()
  },
  watch: {
      treeData: function () {
        this.$refs.peopleTree.initTree()
      },
    },
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
