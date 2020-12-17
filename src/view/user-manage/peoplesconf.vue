<template>
  <div style="height:100%">
    <Card style="margin-top: 5px;">
      <div>
        <Row>
          <Select class="search-col" style="width:150px;margin-right:5px" v-model="searchKey">
            <Option :key="`search-col-${item.key}`" :value="item.key" v-for="item in columnslist">{{ item.title }}
            </Option>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" style="width:150px;margin-right:5px"
                 v-model="searchValue"/>
          <Button @click="handleSearch" class="search-btn" style="margin-right:5px" type="primary">搜索</Button>
          <Button @click="editModal('', 'post', '新增人员')" class="search-btn" style="margin-right:5px" type="info">新增人员
          </Button>
          <Button @click="editModal3" style="margin-right:5px" type="info">组织架构图</Button>
<!--          <Button @click="editModal5" style="margin-right:5px" type="info">在职频率</Button>-->
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
          <Page :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100] :total="pageTotal"
                @on-change="changePage" @on-page-size-change="handlePageSize" show-sizer show-total></Page>
        </div>
      </div>
    </Card>
    <Modal
      :footer-hide=true
      :loading=true
      :title="modalMap.modalTitle"
      v-model="modalMap.modalVisible"
      width="390px"
    >
      <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
      <Form :inline="true" :label-width="80" :model="formValidate" :rules="ruleValidate" ref="formValidate">
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem label="用户名" prop="username" style="width:350px;">
            <Input
              :maxlength="45"
              disabled
              placeholder="请输入用户名"
              v-model="formValidate.username"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem label="用户名" prop="username" style="width:350px;">
            <Input
              :maxlength="45"
              placeholder="请输入用户名"
              v-model="formValidate.username"
            ></Input>
          </FormItem>
        </div>
        <FormItem label="性别" prop="sex" style="width:350px;">
               <RadioGroup v-model="formValidate.sex">
              <Radio label="男"></Radio>
              <Radio label="女"></Radio>
              </RadioGroup>
        </FormItem>
        <FormItem label="部门" prop="department" style="width:350px;">
          <Select placeholder="部门" v-model="formValidate.department">
            <Option  :value="item.v" v-for="item in alldepartmentList">{{item.v}}</Option>
          </Select>
        </FormItem>
        <FormItem label="岗位" prop="jobpost" style="width:350px;">
          <Select placeholder="岗位" v-model="formValidate.jobpost">
            <Option :key="item.id" :value="item.postname" v-for="item in alljobpostList">{{item.postname}}</Option>
          </Select>
        </FormItem>
        <FormItem label="手机号" prop="tel" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="请输入联系手机号"
            v-model="formValidate.tel"
          ></Input>
        </FormItem>
        <FormItem label="上级部门" prop="supe_department" style="width:350px;">
          <Select placeholder="上级部门" v-model="formValidate.supe_department">
            <Option  :value="item.department" v-for="item in allsupe_departmentList">{{item.department}}</Option>
          </Select>
        </FormItem>
        <FormItem label="上级领导" prop="othername" style="width:350px;">
          <Select placeholder="请选择上级领导姓名" v-model="formValidate.othername">
            <Option :value="item.id" v-for="item in allusernameList">{{item.username}}</Option>
          </Select>
        </FormItem>
        <FormItem label="类型" prop="type" style="width:350px;">
               <RadioGroup v-model="formValidate.type">
              <Radio label="在职"></Radio>
              <Radio label="离职"></Radio>
              </RadioGroup>
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
            :disabled="isDisable"
            @click="handleSubmit('formValidate')"
            type="primary"
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
      :footer-hide=true
      :loading=true
      :title="modalMap2.modalTitle"
      v-model="modalMap2.modalVisible"
      width="30%"
    >
      <div slot="header">
        <Button @click="geturl()">下载模板文件</Button>
        <a :href=surl><span id="surl"></span></a>
      </div>
      <Upload
        :action=UploadUrl
        :on-error="handleError"
        :on-success="handleSuccess"
        type="drag"
      >
        <div style="padding: 20px 0">
          <Icon size="52" style="color: #3399ff" type="ios-cloud-upload"></Icon>
          <p>请选择或拖拽一个文件上传</p>
        </div>
      </Upload>
    </Modal>
    <Modal
      :footer-hide=true
      :loading=true
      :title="modalMap3.modalTitle"
      v-model="modalMap3.modalVisible"
      width="80%"
    >
      <div  class="oTree">
      <!--       <chart-tree ref="peopleTree" style="height: 500px;width: 1000px;" :value="treeData" text="组织架构图"/>-->
      <vue2-org-tree
        name="test"
        :data="treedata"
        :label-class-name="labelClassName"
        :render-content="renderContent"
        @on-expand="onExpand"
        collapsable
        width="100%"
      />
      </div>
    </Modal>
    <Modal
      :footer-hide=true
      :loading=true
      :title="modalMap5.modalTitle"
      v-model="modalMap5.modalVisible"
      width="50%"
    >
      <div style="padding: 10px; text-align:center;">
      <DatePicker  :value="todate" @on-change="todate=$event"
                      confirm placeholder="请选择开始与结束日期"
                      placement="bottom-end"
                      type="daterange">
          </DatePicker>
          <Button @click="handleSubmitTable()" style="marginRight: 2px; marginLeft: 50px" type="success">查询
          </Button>
      </div>
    <Table
        :columns="columns5"
        :data="tableData5"
        ref="selection"
        size="small"
      >
    </Table>
      <chart-bar2 ref="childBar" style="width: 900px;height: 340px;" :value="barData" :bar_data="bar_list" text="柱状图"/>
    </Modal>
<!--    <chart-bar ref="childBar" style="height: 340px;" :value="barData" text="柱状图"/>-->
  </div>
</template>

<script>
import { ChartBar2, ChartTree } from '_c/charts'
import { companylist } from '@/api/problem'
import FormGroup from '_c/form-group'
import {
  getpeoplelist,
  addpeoplelist,
  delpeoplelist,
  updatepeoplelist,
  getlist,
  getdatelist,
  getiddata
} from '@/api/peoples'
import { getDictConfList } from '@/api/app'
import { post_getid } from '@/api/jobpost'

export default {
  components: {
    FormGroup,
    ChartBar2,
    ChartTree
  },
  data () {
    return {
      bar_list: {},
      barData: {}, // {"在职":20,"离职":10,"总数":30},
      labelClassName: 'bg-color-orange',
      todate: [],
      treedata: {},
      treeData: [],
      treeData2: [],
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
      modalMap5: {
        modalVisible: false,
        modalTitle: '频率'
      },
      isDisable: false,
      editModalData: '',
      tokey: '',
      allusernameList: [],
      allsupe_departmentList: [],
      alljobpostList: [],
      tovalue: '',
      searchValue: '',
      searchKey: '用户名',
      UploadUrl: '',
      surl: '',
      formValidate: {
        id: 0,
        username: '',
        sex: '',
        type: '',
        othername: '',
        jobpost: '',
        tel: '',
        department: '',
        supe_department: '',
        temp_department: '',
        startdate: '',
        enddate: '',
        supe_name: ''
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
        sex: [
          {
            required: true,
            message: '选择性别',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '选择类型',
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
        department: [
          {
            required: true,
            message: '选择部门',
            trigger: 'blur'
          }
        ],
        startdate: [
          {
            required: true,
            message: '选择日期',
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
        { title: '用户名', key: 'username', editable: true }
      ],
      columns5: [
        { title: '在职', key: 'yessum', editable: true },
        { title: '离职', key: 'nosum', editable: true },
        { title: '总数', key: 'allsum', editable: true }
      ],
      columns: [
        { title: '用户名', key: 'username', editable: true, width: 100 },
        { title: '性别', key: 'sex', editable: true, width: 60 },
        { title: '岗位', key: 'jobpost', editable: true },
        { title: '联系方式', key: 'tel', editable: true },
        { title: '部门', key: 'department', editable: true },
        { title: '上级领导', key: 'supe_name', editable: true, width: 100 },
        { title: '上级部门', key: 'supe_department', editable: true },
        { title: '入岗日期', key: 'startdate', editable: true },
        { title: '离岗日期', key: 'enddate', editable: true },
        { title: '类型', key: 'type', editable: true, width: 60 },
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
                        icon: 'ios-create-outline'
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
                        icon: 'ios-trash-outline'
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
      iddata: [],
      tableData: [],
      tableData5: [], // [{"yessum":20,"nosum":10,"allsum":30}],
      tableData2: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      // select
      selectionList: []
    }
  },
  methods: {
    getiddata (id) {
      getiddata(id).then(res => {
        if (res.data.code === 0) {
          this.iddata = res.data.data
        } else {
          this.iddata = []
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    getiddata2 (data) {
      this.getiddata(data.id)
      // console.log(this.iddata)
      setTimeout(() => {
        this.editModal(this.iddata[0], 'put', '编辑')
      }, 500)
    },
    renderContent (h, data) {
      return h('div',
                // { style: { width: '60px', height: '120px' } },
        [
          // h('img', {
          //   attrs: {
          //     src: data.img,
          //     width: 50,
          //     height: 50
          //   }
          //
          // }),
          h('a', {
            domProps: {
              href: 'javascript:;'
            },
            style: {
              marginRight: '5px',
              color: '#fff'
            }
          }, data.label),
          h('a', {
            style: {
              color: '#fff'
            },
            domProps: {
              href: 'javascript:;'
            }
          }, data.position),
          h('Dropdown', {
            attrs: {
              trigger: 'click'
            }
          }, [
            h('a', {
              style: {
                marginLeft: '5px',
                color: '#409eff'
              },
              domProps: {
                href: 'javascript:;'
              },
              on: {
                click: () => {
                  this.showFlag = !!data.children
                }
              }
            }, data.name),
            h('DropdownMenu', {
              slot: 'list'
            }, [
              h('DropdownItem', {
                nativeOn: {
                  click: () => {
                    this.editModal8(data, 'post', '新增人员')
                  }
                }
              }, '新增'),
              h('DropdownItem', {
                nativeOn: {
                  click: () => {
                    this.getiddata2(data)
                  }
                }
              }, '编辑'),
              h('DropdownItem', {
                nativeOn: {
                  click: () => {
                    this.handleDelete2(data)
                  //  this.$Modal.confirm({
                  //   title: '确定要删除吗？',
                  //   onOk: () => {
                  //       this.$Message.info('删除成功');
                  //       //删除成功
                  //   },
                  // });
                  }
                }
              }, '删除')
            ]
            )
          ])
        ])
    },

    toggleExpand (data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
    },
    collapse (list) {
      var _this = this
      list.forEach(function (child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },
    onExpand (e, data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    changestime (data) {
      this.formValidate.startdate = data
    },
    changeetime (data) {
      this.formValidate.enddate = data
    },
    handleSuccess (res, file) {
      // console.log(file)
      this.getpeoplelist(this.pageNum, this.pageSize)
      this.modalMap2.modalVisible = false
      this.$Message.success('文件上传成功')
    },
    handleError (error) {
      // console.log(error)
      this.modalMap2.modalVisible = false
      this.$Message.success('文件上传失败')
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
    handleSubmitTable () {
      // console.log(JSON.stringify(this.todate))
      if (JSON.stringify(this.todate) == '[]') {
        alert('请选择日期范围')
      } else {
        this.getdatelist(this.todate[0], this.todate[1])
      }
    },
    getdatelist (start, end) {
      getdatelist(start, end).then(res => {
        if (res.data.code === 0) {
          this.tableData5 = res.data.data
          this.barData = res.data.dict[0]
          this.bar_list = res.data.bar_list
        } else {
          this.tableData5 = []
          this.barData = {}
        }
      })
    },
    getlist () {
      getlist().then(res => {
        if (res.data.code === 0) {
          this.allusernameList = res.data.data
          this.allsupe_departmentList = res.data.department
          this.treeData2 = res.data.treelist
          this.treedata = res.data.treelist
        } else {
          this.allusernameList = []
          this.treeData = []
          this.allsupe_departmentList = []
        }
      })
    },
    getterr () {
      // console.log(this.treeData2)
      this.treedata = this.treeData2
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
            // console.log(this.allcompanyList)
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
    editModal5 () {
      this.todate = []
      this.barData = {}
      this.tableData5 = []
      setTimeout(() => {
        this.modalMap5.modalVisible = true
        this.modalMap5.modalTitle = '频率'
      }, 500)
    },
    editModal3 () {
      this.getterr()
      this.toggleExpand(this.treedata, true)
      setTimeout(() => {
        this.modalMap3.modalVisible = true
        this.modalMap3.modalTitle = '组织架构'
      }, 1000)
    },
    editModal8 (data, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      this.formValidate = {
          username: '',
          sex: '',
          jobpost: '',
          tel: '',
          department: '',
          supe_department: data.label,
          othername: data.id,
          type: '',
          startdate: '',
          enddate: '',
          supe_name: data.name
        }
    },
    editModal (paramsRow, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      if (paramsRow && paramsRow.id) {
        // put
        this.formValidate = {
          id: paramsRow.id,
          type: paramsRow.type,
          username: paramsRow.username,
          sex: paramsRow.sex,
          jobpost: paramsRow.jobpost,
          tel: paramsRow.tel,
          department: paramsRow.department,
          supe_department: paramsRow.supe_department,
          othername: eval(paramsRow.othername),
          startdate: paramsRow.startdate,
          enddate: paramsRow.enddate,
          supe_name: paramsRow.supe_name
        }
      } else {
        // post
        this.formValidate = {
          username: '',
          sex: '',
          jobpost: '',
          tel: '',
          type: '',
          department: '',
          supe_department: '',
          othername: '',
          startdate: '',
          enddate: ''
        }
      }
    },
    handleDelete (params) {
      if (confirm(`确定要删除 ${params.row.username}`)) {
        delpeoplelist({ id: params.row.id }).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getpeoplelist(this.pageNum, this.pageSize, this.tokey, this.tovalue)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    handleDelete2 (data) {
      if (confirm(`确定要删除 ${data.name}`)) {
        delpeoplelist({ id: data.id }).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getpeoplelist(this.pageNum, this.pageSize, this.tokey, this.tovalue)
            this.getlist()
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
    handleSearch () {
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
          if (this.formValidate.tel.length > 11) {
            this.$Message.error('请输入正确的手机号')
          }
          setTimeout(() => {
            if (this.editModalData == 'post') {
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
            if (this.editModalData == 'put') {
              updatepeoplelist(this.formValidate).then(res => {
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
    companylist (key, value) {
      companylist(key, value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          // console.log(res.data.data)
          this.alldemand_unit = res.data.data
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
  watch: {
    barData: function () {
      this.$refs.childBar.initBar()
    }
    // treeData: function () {
    //   this.$refs.peopleTree.initTree()
    // },
  },
  mounted () {
    this.getpeoplelist(this.pageNum, this.pageSize)
    this.getDictConfList()
    this.post_getid()
    this.getlist()
    this.toggleExpand(this.treedata, true)
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
   .org-boxs{
      width:100%;
      height:100%;
      text-align: center;
      /*background: #030C24;*/
      background-image: -webkit-radial-gradient(ellipse farthest-corner at center 40%, #000d4d 0%, #000105 100%);
      background-image: radial-gradient(ellipse farthest-corner at center 40%, #000d4d 0%, #000105 100%);
     overflow-y: scroll;
   }
  .oTree {
    margin-top: 5px;
    text-align: center;
    width: 100%;
    height: 50%;
  }
</style>
