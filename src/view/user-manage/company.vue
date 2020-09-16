<template>
  <div style="height:100%">
    <Card>
      <p slot="title">单位列表</p>
      <div slot="extra">
        <Row>
          <Select class="search-col" style="width:150px;margin-right:5px" v-model="searchKey">
            <Option :key="`search-col-${item.key}`" :value="item.key" v-for="item in columnslist">{{ item.title }}</Option>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" style="width:150px;margin-right:5px"
                 v-model="searchValue"/>
          <Button @click="handleSearch" class="search-btn" style="margin-right:5px" type="primary">搜索</Button>
          <Button @click="editModal('', 'post', '新增单位')" class="search-btn" style="margin-right:5px" type="info">新建单位
          </Button>
        </Row>
      </div>
      <Table
        :columns="columns"
        :data="tableData"
        :load-data="handleLoadData"
        max-height="300"
        row-key="id"
      ></Table>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :current="pageNum" :page-size="pageSize" :page-size-opts=[5,10,15,25,35,50,100] :total="pageTotal"
                @on-change="changePage" @on-page-size-change="handlePageSize" show-sizer show-total></Page>
        </div>
      </div>
    </Card>
    <Card style="margin-top: 5px;">
      <Tabs value="name1">
        <TabPane icon="ios-apps" label="干系人列表" name="name1">
          <Table
            :columns="columns2"
            :data="tableData2"
            height="320"
            id="table"
            ref="selection"
            size="small"
          ></Table>
        </TabPane>
        <TabPane icon="md-list" label="个案列表" name="name2">
          <Table
            :columns="columns3"
            :data="tableData3"
            height="320"
            ref="selection"
            size="small"
          ></Table>
        </TabPane>
      </Tabs>
    </Card>
    <Modal
      :footer-hide=true
      :loading=true
      :title="modalMap.modalTitle"
      v-model="modalMap.modalVisible"
      width="385px"
    >
      <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
      <Form :inline="true" :label-width="80" :model="formValidate" :rules="ruleValidate" ref="formValidate">

        <FormItem label="上级部门" prop="company" style="width:350px;">
<!--          <Select @on-create="handleCreate" allow-create  filterable placeholder="上级部门" v-model="formValidate.company">-->
<!--            <Option :key="item.k" :value="item.v" v-for="item in allcompanyList">{{item.v}}</Option>-->
<!--          </Select>-->
          <Input
            :maxlength="45"
            placeholder="请输入上级部门姓名"
            v-model="formValidate.company"
          ></Input>
        </FormItem>
        <FormItem label="部门名称" prop="department" style="width:350px;">
          <Select @on-create="handleCreate2" allow-create  filterable placeholder="部门名称" v-model="formValidate.department">
            <Option :key="item.k" :value="item.v" v-for="item in alldepartmentList">{{item.v}}</Option>
          </Select>
        </FormItem>
<!--        <FormItem label="部门级别" prop="level" style="width:350px;">-->
<!--          <InputNumber :max="9" :min="1" placeholder="请选择部门级别" v-model="formValidate.level"></InputNumber>-->
<!--        </FormItem>-->
        <FormItem label="负责人" prop="bossname" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="请输入负责人姓名"
            v-model="formValidate.bossname"
          ></Input>
        </FormItem>

        <FormItem label="电话" prop="tel" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="请输入联系方式"
            v-model="formValidate.tel"
          ></Input>
        </FormItem>

        <FormItem label="邮箱" prop="email" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="请输入邮箱号"
            v-model="formValidate.email"
          ></Input>
        </FormItem>
        <FormItem label="备注" prop="remarks" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="备注信息"
            v-model="formValidate.remarks"
          ></Input>
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
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import FormGroup from '_c/form-group'
  import {
    getCompany,
    getCompanyDepartment,
    getList,
    getcaseList,
    newCompany,
    delCompany,
    updateCompany
  } from '@/api/companylist'
  import {getDictConfList} from '@/api/app'

  export default {
    components: {
      Tables,
      FormGroup
    },
    data() {
      return {
        // 弹出框
        modalMap: {
          modalVisible: false,
          modalTitle: '创建单位'
        },
        isDisable: false,
        editModalData: '',
        tokey: '',
        tovalue: '',
        formValidate: {
          id: 0,
          company: "",
          company_id: "",
          addr: '',
          bossname: '',
          duty: '',
          department: '',
          level: 1,
          tel: '',
          website: '',
          email: '',
          remarks: '',
        },
        allcompanyList: [],
        alldepartmentList: [],
        ruleValidate: {
          company: [
            {
              required: true,
              message: '请输入单位名',
              trigger: 'blur'
            }
          ]
        },
        columnslist: [
          {title: '单位名', key: 'department',editable: true},
          {title: '负责人', key: 'bossname', editable: true},
          {title: '电话', key: 'tel', editable: true},
          {title: '邮箱', key: 'email', editable: true},
          {title: '备注', key: 'remarks', sortable: true},
        ],

        columns: [
          {
            title: '单位/部门', key: 'department', tree: true, sortable: true, render: (h, params) => {
              // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
              return h('a', {
                  on: {
                    click: () => {
                      this.handleDetail(params)
                    }
                  }
                }, params.row.department
              )
            }
          },
          {title: '负责人', key: 'bossname', editable: true},
          {title: '电话', key: 'tel', editable: true},
          {title: '邮箱', key: 'email', editable: true},
          {title: '备注', key: 'remarks', sortable: true},
          {
            title: '操作',
            align: 'center',
            width: 280,
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
                        size: 'small'
                      },
                      style: {
                        marginRight: '1px',
                        color: '#409eff'
                      },
                      //正常的html特性
                      attrs:{
                        icon: 'ios-create-outline',
                      },
                      on: {
                        click: () => {
                          this.editModal(params.row, 'put', '编辑单位')
                        }
                      }
                    },
                    '修改'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'text',
                        size: 'small'
                      },
                      style: {
                        marginRight: '1px',
                          color: '#409eff'
                      },
                      attrs:{
                        icon:"ios-add"
                      },
                      on: {
                        click: () => {
                          this.editModal(params.row, 'post', '新增部门')
                        }
                      }
                    },
                    '新增部门'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'text',
                        size: 'small'
                      },
                      style: {
                        marginRight: '1px',
                         color: '#ed4014'
                      },
                      attrs:{
                        icon: 'ios-trash-outline',
                      },
                      on: {
                        click: () => {
                          this.handleDelete(params)
                        }
                      }
                    },
                    '删除'
                  )])
              }
          }
        ],
        columns2: [
          {title: '用户名', key: 'username', sortable: true},
          {title: '单位', key: 'company', sortable: true},
          {title: '部门', key: 'department', editable: true},
          {title: '职位', key: 'position', editable: true},
          {title: '职责范围', key: 'duty', editable: true},
          {title: '电话', key: 'tel', editable: true},
          {title: '地址', key: 'addr', editable: true},
          {title: '邮箱', key: 'email', editable: true},
          {title: '备注', key: 'remarks', sortable: true},
        ],
        columns3: [
          {title: '个案', key: 'case_name', align: 'center', width: 200,},
          {title: '类型', key: 'case_type', align: 'center', width: 100,},
          {title: '状态', key: 'case_status', align: 'center', width: 100,},
          {title: '项目', key: 'case_obj', align: 'center', width: 150,},
          {title: '开始时间', key: 'case_stime', align: 'center', width: 150,},
          {title: '结束时间', key: 'case_etime', align: 'center', width: 150,},
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
        tableData3: [],
        departmentData: [],
        departmentData_flag: 0,
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 5, // 每页条数
        // select
        selectionList: []
      }
    },
    methods: {
      handleCreate (val) {
                this.allcompanyList.push({
                    k: 999,
                    v: val
                });
                this.formValidate.company = val
            },
      handleCreate2 (val) {
                this.alldepartmentList.push({
                    k: val,
                    v: val
                });
                this.formValidate.department = val
            },
      handleLoadData(item, callback) {
        this.tovalue = item["id"]
        this.tokey = "company_id"
        this.getCompanyDepartment(this.tokey,this.tovalue)
        setTimeout(() => {
          if(this.departmentData_flag == 1){
            callback(this.departmentData);
          }else{
            callback([]);
          }
        }, 2000);
      },
// 获取个案列表
      getcaseList(key, value) {
        getcaseList(key, value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            // this.pageTotal = res.data.count
            this.tableData3 = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      getDictConfList() {
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
      editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        if (paramsRow && paramsRow.id) {
          if (this.editModalData == "post") {
              // post
              // let to_company_id = ''
              // if(paramsRow.company_id == "/"){
              //    to_company_id = paramsRow.id
              // }else{
              //    to_company_id = paramsRow.company_id //限制在2级
              // }
              this.formValidate = {
                id: "",
                company_id: paramsRow.id,
                company: paramsRow.department,
                addr: '',
                bossname: '',
                duty: '',
                department: '',
                tel: '',
                website: '',
                level: parseInt(paramsRow.level) + 1,
                email: '',
                remarks: ''
              }

          }
          else {
            // put
              this.formValidate = {
                id: paramsRow.id,
                company_id: paramsRow.company_id,
                company: paramsRow.company,
                addr: paramsRow.addr,
                bossname: paramsRow.bossname,
                duty: paramsRow.duty,
                department:paramsRow.department,
                tel: paramsRow.tel,
                website: paramsRow.website,
                level:parseInt(paramsRow.level),
                email: paramsRow.email,
                remarks: paramsRow.remarks
              }
          }

        } else {
          // post
          this.formValidate = {
            id:"",
            company_id: "",
            company: "",
            addr: "",
            bossname: "",
            duty: "",
            department:'',
            level:1,
            tel: "",
            website: "",
            email: "",
            remarks: ""
          }
        }
      },
      handleDelete(params) {
        if (confirm(`确定要删除 ${params.row.department}`)) {
          delCompany({id: params.row.id}).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.getCompany(this.pageNum, this.pageSize, this.tokey, this.tovalue)
              this.tokey = "company_id"
              this.getCompanyDepartment(this.tokey,this.tovalue)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      },
      handleSearch() {
        this.getCompany(1, this.pageSize, this.searchKey, this.searchValue)
      },
      handleClear(e) {
        // if (e.target.value === '') this.tableData = this.value
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      changePage(value) {
        this.pageNum = value
        this.getCompany(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getCompany(1, this.pageSize, this.searchKey, this.searchValue)
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${new Date().valueOf()}.csv`
        })
      },
      handleSearchTable(key, val) {
        this.pageNum = 1
        this.searchKey = key
        this.searchValue = val
        this.getCompany(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      // 获取用户列表
      getCompany(page, limit, key, value) {
        getCompany(page, limit, key, value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
          } else {
            this.tableData =  []
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取部门列表
      getCompanyDepartment(value) {
        getCompanyDepartment(value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.departmentData = res.data.data
            this.departmentData_flag = 1
            for (let i = 0, len = this.departmentData.length; i < len; i++) {
              this.departmentData[i]["_loading"] = false
              this.departmentData[i]["children"] = []
            }
          } else {
            this.departmentData =  []
            this.departmentData_flag = 0
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取用户列表
      getList(key,value) {
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
      handleSubmit(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            this.isDisable = true
            if (this.formValidate.tel.length > 11) {
              this.$Message.error("请输入正确的手机号")
            }
            setTimeout(() => {
              if (this.editModalData == "post") {
                console.log(this.formValidate)
                newCompany(this.formValidate).then(res => {
                  const data = res.data
                  if (res.data.code === 0) {
                    this.$Message.info(`${data.msg}`)
                    // 重新获取数据
                    this.getCompany(this.pageNum, this.pageSize)
                    // this.getCompanyDepartment(this.tovalue)
                  } else {
                    this.$Message.error(`${data.msg}`)
                  }
                }).catch(err => {
                  this.$Message.error(err)
                })
              }
              if (this.editModalData == "put") {
                updateCompany(this.formValidate).then(res => {
                  const data = res.data
                  if (res.data.code === 0) {
                    this.$Message.info(`${data.msg}`)
                    // 重新获取数据
                    this.getCompany(this.pageNum, this.pageSize)
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
      handleInput(editData) {
        // 行内编辑
        const EditData = {
          user_id: editData.row.user_id,
          key: editData.column.key,
          value: editData.value
        }
        updateCompany(EditData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleDetail(params) {
        console.log(params.row.company)
        if(params.row.company_id === "/"){
        this.getList("company",params.row.company)
        this.getcaseList("company",params.row.company,)
        }else{
          this.$Message.info("目前只支持单位级别查询")
          // this.getList("department",params.row.department)
          // this.getcaseList("department",params.row.department,)
        }
      },
      handleSelectChange(val) {
        let userList = []
        val.forEach(item => {
          userList.push(item.user_id)
        })
        this.selectionList = userList
      }
    },
    mounted() {
      this.getCompany(this.pageNum, this.pageSize)
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
