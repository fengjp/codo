<template>
  <div style="height:100%">
    <Card>
      <p slot="title">单位列表</p>
      <!--      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns"-->
      <!--              @on-delete="handleDelete" @on-save-edit="handleInput"-->
      <!--              @on-search-table="handleSearchTable"-->
      <!--              @on-selection-change="handleSelectChange">-->
      <!--        <div slot="new_btn" class="search-con search-col">-->
      <!--          <Button type="info" class="search-btn" @click="editModal('', 'post', '新建单位')">新建单位</Button>-->
      <!--        </div>-->
      <!--      </tables>-->
      <div slot="extra">
        <Row>
          <Select class="search-col" style="width:150px;margin-right:5px" v-model="searchKey">
            <Option :key="`search-col-${item.key}`" :value="item.key" v-for="item in columns">{{ item.title }}</Option>
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
        height="300"
        ref="selection"
      ></Table>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100] :total="pageTotal"
                @on-change="changePage" @on-page-size-change="handlePageSize" show-sizer show-total></Page>
        </div>
      </div>
    </Card>
    <Card style="margin-top: 5px;">
    <Tabs value="name1">
      <TabPane label="干系人列表" icon="ios-apps" name="name1">
          <Table
            :columns="columns2"
            :data="tableData2"
            height="320"
            id="table"
            ref="selection"
            size="small"
          ></Table>
      </TabPane>
      <TabPane label="个案列表"  icon="md-list" name="name2">
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
      <Form :inline="true" :label-width="69" :model="formValidate" :rules="ruleValidate" ref="formValidate">
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem label="单位名" prop="company" style="width:350px;">
            <Input
              :maxlength="45"
              disabled
              placeholder="请输入单位名"
              v-model="formValidate.company"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem label="单位名" prop="company" style="width:350px;">
            <Input
              :maxlength="45"
              placeholder="请输入单位名"
              v-model="formValidate.company"
            ></Input>
          </FormItem>
        </div>
        <!--          <FormItem label="单位" prop="company"  style="width:350px;">-->
        <!--              <Select v-model="formValidate.company" placeholder="单位">-->
        <!--                <Option v-for="item in allcompanyList" :value="item.v" :key="item.k">{{item.v}}</Option>-->
        <!--              </Select>-->
        <!--            </FormItem>-->
        <FormItem label="单位地址" prop="addr" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="请输入单位地址"
            v-model="formValidate.addr"
          ></Input>
        </FormItem>
        <FormItem label="法人" prop="bossname" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="请输入法人姓名"
            v-model="formValidate.bossname"
          ></Input>
        </FormItem>
        <FormItem label="经营范围" prop="duty" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="请输入经营范围"
            v-model="formValidate.duty"
          ></Input>
        </FormItem>
        <FormItem label="电话" prop="tel" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="请输入联系方式"
            v-model="formValidate.tel"
          ></Input>
        </FormItem>
        <FormItem label="单位网址" prop="website" style="width:350px;">
          <Input
            :maxlength="45"
            placeholder="请输入网址"
            v-model="formValidate.website"
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
          addr: '',
          bossname: '',
          duty: '',
          tel: '',
          website: '',
          email: '',
          remarks: '',
        },
        allcompanyList: [],
        alldepartmentList: [],
        ruleValidate: {
          bossname: [
            {
              required: true,
              message: '请输入法人名',
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
        columns: [
          {type: 'selection', title: '', key: '', width: 60, align: 'center'},
          {
            title: '单位名', key: 'company', sortable: true, render: (h, params) => {
              // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
              return h('a', {
                  on: {
                    click: () => {
                      this.handleDetail(params)
                    }
                  }
                }, params.row.company
              )
            }
          },
          {title: '单位地址', key: 'addr', editable: true},
          {title: '法人', key: 'bossname', editable: true},
          {title: '经营范围', key: 'duty', editable: true},
          {title: '电话', key: 'tel', editable: true},
          {title: '单位网址', key: 'website', editable: true},
          {title: '邮箱', key: 'email', editable: true},
          {title: '备注', key: 'remarks', sortable: true},
          {
            title: '操作',
            align: 'center',
            width: 150,
            key: 'handle',
            // options: ["delete"],
            render:
              (h, params) => {
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
                          this.editModal(params.row, 'put', '编辑单位')
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
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
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        // select
        selectionList: []
      }
    },
    methods: {
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
          // put
          this.formValidate = {
            id: paramsRow.id,
            company: paramsRow.company,
            addr: paramsRow.addr,
            bossname: paramsRow.bossname,
            duty: paramsRow.duty,
            tel: paramsRow.tel,
            website: paramsRow.website,
            email: paramsRow.email,
            remarks: paramsRow.remarks
          }
        } else {
          // post
          this.formValidate = {
            company: "",
            addr: "",
            bossname: "",
            duty: "",
            tel: "",
            website: "",
            email: "",
            remarks: ""
          }
        }
      },
      handleDelete(params) {
        if (confirm(`确定要删除 ${params.row.company}`)) {
          delCompany({id: params.row.id}).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.getCompany(this.pageNum, this.pageSize, this.tokey, this.tovalue)
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
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取用户列表
      getList(data) {
        getList(data).then(res => {
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
                newCompany(this.formValidate).then(res => {
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
        this.getList(params.row.company)
        this.getcaseList(params.row.company, "")
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
