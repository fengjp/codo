<template>
  <div style="height:100%">
    <Card :bordered="false" dis-hover>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns"
              @on-delete="handleDelete" @on-save-edit="handleInput"
              @on-search-table="handleSearchTable"
              @on-selection-change="handleSelectChange">
        <div slot="new_btn" class="search-con search-col">
          <Button v-if="rules.new_user_btn" type="info" class="search-btn" @click="showModal('','post','新建用户')">新建用户
          </Button>
          <Button v-if="rules.reset_pwd_btn" type="error" class="search-btn" @click="handleResetPWD">重置密码</Button>
          <!--<Button v-if="rules.reset_mfa_btn" type="error" class="search-btn"  @click="handleResetMFA">重置MFA</Button>-->
          <!--<Button v-if="rules.get_token_btn" type="error" class="search-btn"  @click="handleToken">长期Token</Button>-->
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>
    <!--<Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true>-->
    <!--<form-group :list="formList" @on-submit-success="handleSubmit"></form-group>-->
    <!--</Modal>-->
    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true
           :mask-closable=false>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="账户名称" prop="username">
          <div v-if="editModalData && editModalData ==='put'">
            <Input v-model="formValidate.username" :maxlength="50" disabled
                   placeholder='账户名(英文字母)'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.username" :maxlength="50" placeholder='账户名(英文字母)'></Input>
          </div>
        </FormItem>
        <FormItem label="昵称" prop="nickname">
          <Input v-model="formValidate.nickname" :maxlength="50" placeholder='昵称'></Input>
        </FormItem>
        <FormItem label="部门" prop="department">
          <Input v-model="formValidate.department" :maxlength="50" placeholder='部门'></Input>
        </FormItem>
        <FormItem label="手机号" prop="tel">
          <Input v-model="formValidate.tel" :maxlength="50" placeholder='手机号'></Input>
        </FormItem>
        <FormItem label="工号" prop="no">
          <Input v-model="formValidate.no" :maxlength="50" placeholder='工号'></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="formValidate.email" :maxlength="50" placeholder='邮箱'></Input>
        </FormItem>
        <FormItem label="登录时段" prop="">
          <RadioGroup v-model="chosenOrder" @on-change="radioChange()">
            <Radio label="全天">
              <span style="margin-right: 15px;">全天</span>
            </Radio>
            <Radio label="时段">
              <span style="margin-right: 15px;">时间段</span>
            </Radio>
          </RadioGroup>
          <TimePicker format="HH:mm" type="timerange" confirm placement="top" placeholder="时间段"
                      v-model="formValidate.timeInterval" v-if="chosenOrder==='时段'" style="width: 168px"></TimePicker>
        </FormItem>
        <FormItem label="IP限制" prop="limit_IP">
          <Row style="margin-bottom: 5px" v-for="(item, index) in formValidate.limit_IP">
            <Col span="14">
              <Input v-model="item.ip" placeholder="IP限制"></Input>
            </Col>
            <Col span="3">
              <Button type="text" shape="circle" icon="md-close" @click="handleRemove(index)"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem style="display: block">
          <Row>
            <Col span="12">
              <Button type="dashed" long @click="handleColAdd()" icon="md-add">增加IP</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import FormGroup from '_c/form-group'
  import {mapState} from 'vuex'
  import {
    getuserlist,
    newuser,
    deluser,
    updateuser,
    patchuser,
    resetMFA,
    resetPassword,
    getToken
  } from '@/api/user'

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
          modalTitle: '创建用户'
        },
        editModalData: '',
        ruleValidate: {
          username: [{required: true, message: '账户名称不能为空', trigger: 'blur'}],
          nickname: [{required: true, message: '昵称不能为空', trigger: 'blur'}],
          department: [{required: true, message: '部门不能为空', trigger: 'blur'}],
          tel: [{required: true, message: '手机号不能为空', trigger: 'blur'},
            {
              type: 'string',
              min: 11,
              max: 11,
              message: '必须为手机号码',
              trigger: 'blur'
            }
          ],
          no: [{required: true, message: '工号不能为空', trigger: 'blur'}],
          email: [{required: true, message: '邮箱不能为空', trigger: 'blur'},
            {
              type: 'email',
              message: '必须为邮箱格式',
              trigger: 'blur'
            }
          ],
        },
        formValidate: {
          user_id: '',
          username: '',
          nickname: '',
          department: '',
          tel: '',
          no: '',
          email: '',
          timeInterval: '',
          limit_IP: [{'ip':''}],
        },
        columns: [
          {type: 'selection', title: '', key: '', width: 60, align: 'center'},
          {title: '用户名', key: 'username', align: 'center', sortable: true},
          {title: '昵称', key: 'nickname', width: 100, align: 'center', sortable: true},
          {title: '部门', key: 'department', width: 80, align: 'center', editable: true},
          {title: '手机', width: 110, key: 'tel', align: 'center', editable: true},
          {title: '邮箱', key: 'email', align: 'center', editable: true},
          {title: '登录IP', width: 100, align: 'center', key: 'last_ip'},
          {
            title: '最后登录',
            width: 100,
            key: 'last_login',
            align: 'center',
            sortable: true
          },
          {
            title: '状态',
            key: 'status',
            width: 70,
            align: 'center',
            render: (h, params, vm) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    // type: "primary",
                    value: params.row.status === '0' // 控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': () => {
                      this.onSwitch(params)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 170,
            key: 'handle1',
            render: (h, params, vm) => {
              return h('div', [
                h('Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'ios-create-outline',
                    },
                    style: {
                      marginRight: '2px',
                      color: '#409eff'
                    },
                    on: {
                      click: () => {
                        this.showModal(params.row, 'put', '编辑')
                      }
                    }
                  }, '编辑'
                ),
                h('Poptip', {
                  props: {
                    placement: 'left-start',
                    confirm: true,
                    transfer: true,
                    title: '确定删除吗？',
                  },
                  on: {
                    'on-ok': () => {
                      this.$refs.tables.$emit('on-delete', params)
                      this.$refs.tables.$emit(
                        'input',
                        this.tableData.filter(
                          (item, index) => index !== params.row.initRowIndex
                        )
                      )
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'ios-trash-outline',
                    },
                    style: {
                      color: '#ed4014'
                    },
                  }, '删除'),
                ]),
              ])
            }
            // button: [
            //   (h, params, vm) => {
            //     return h(
            //       'Poptip',
            //       {
            //         props: {
            //           transfer: true,
            //           confirm: true,
            //           title: '你确定要删除吗?'
            //         },
            //         on: {
            //           'on-ok': () => {
            //             vm.$emit('on-delete', params)
            //             vm.$emit(
            //               'input',
            //               params.tableData.filter(
            //                 (item, index) => index !== params.row.initRowIndex
            //               )
            //             )
            //           }
            //         }
            //       },
            //       [
            //         // h('Button', '自定义删除'),
            //         h(
            //           'Button',
            //           {
            //             props: {
            //               type: 'text',
            //               size: 'small',
            //               icon: 'ios-trash-outline',
            //             },
            //             style: {
            //               color: '#ed4014'
            //             },
            //           },
            //           '删除'
            //         )
            //       ]
            //     )
            //   }
            // ]
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
        selectionList: [],
        chosenOrder: ''
      }
    },
    computed: {
      ...mapState({
        rules: state => state.user.rules
      })
    },
    methods: {
      handleColAdd() {
        this.formValidate.limit_IP.push({'ip':''});
      },
      handleRemove(index) {
        console.log(index)
        console.log(this.formValidate.limit_IP)
        this.formValidate.limit_IP.splice(index, 1)
      },
      radioChange() {
        // console.log(this.chosenOrder)
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      handleDelete(params) {
        deluser({user_id: params.row.user_id}).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      changePage(value) {
        this.pageNum = value
        this.getUserList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getUserList(1, this.pageSize, this.searchKey, this.searchValue)
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
        this.getUserList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      // 获取用户列表
      getUserList(page, limit, key, value) {
        getuserlist(page, limit, key, value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleSubmit(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            if (this.chosenOrder === '全天') {
              this.formValidate.timeInterval = ''
            }
            setTimeout(() => {
              if (this.editModalData === 'post') {
                newuser(this.formValidate).then(res => {
                  const data = res.data
                  if (res.data.code === 0) {
                    this.$Message.info(`${data.msg}`)
                    // 重新获取数据
                    this.getUserList(this.pageNum, this.pageSize)
                  } else {
                    this.$Message.error(`${data.msg}`)
                  }
                }).catch(err => {
                  this.$Message.error(err)
                })
              }
              if (this.editModalData === 'put') {
                updateuser(this.formValidate).then(res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`)
                    // 重新获取数据
                    this.getUserList(this.pageNum, this.pageSize)
                  } else {
                    this.$Message.error(`${res.data.msg}`)
                  }
                })
              }
              this.modalMap.modalVisible = false
            }, 500)
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
        updateuser(EditData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 弹出对话框
      showModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true;
        this.modalMap.modalTitle = mtitle;
        this.editModalData = meth;
        if (paramsRow && paramsRow.user_id) {
          this.formValidate = {
            user_id: paramsRow.user_id,
            username: paramsRow.username,
            nickname: paramsRow.nickname,
            department: paramsRow.department,
            tel: paramsRow.tel,
            no: paramsRow.no,
            email: paramsRow.email,
            timeInterval: paramsRow.timeInterval != '' ? JSON.parse(paramsRow.timeInterval) : '',
            limit_IP: paramsRow.limit_IP ? JSON.parse(paramsRow.limit_IP) : [{'ip':''}],
          }
          if (this.formValidate['timeInterval'].length > 0) {
            this.chosenOrder = '时段'
          } else {
            this.chosenOrder = '全天'
          }
        } else {
          this.formValidate = {
            user_id: '',
            username: '',
            nickname: '',
            department: '',
            tel: '',
            no: '',
            email: '',
            timeInterval: '',
            limit_IP: [{'ip':''}],
          }
          this.chosenOrder = '全天'
        }
      },
      // 调用开关
      onSwitch(editData) {
        const EditData = {
          user_id: editData.row.user_id,
          key: editData.column.key
        }
        patchuser(EditData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleSelectChange(val) {
        let userList = []
        val.forEach(item => {
          userList.push(item.user_id)
        })
        this.selectionList = userList
      },
      handleResetPWD() {
        if (!this.selectionList.length) {
          this.$Message.error('没有选中')
        } else {
          if (confirm(`确定要重置选用户的密码`)) {
            resetPassword({user_list: this.selectionList}).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
          }
        }
      },
      handleResetMFA() {
        if (!this.selectionList.length) {
          this.$Message.error('没有选中')
        } else {
          if (confirm(`确定要重置选中用户的MFA`)) {
            resetMFA({user_list: this.selectionList}).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
          }
        }
      },
      handleToken() {
        if (!this.selectionList.length) {
          this.$Message.error('必须也只能选择一个用户')
        } else {
          if (confirm(`选中用户的toekn会发送到你邮箱`)) {
            getToken({user_list: this.selectionList}).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
          }
        }
      }
    },
    mounted() {
      this.getUserList(this.pageNum, this.pageSize)
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
