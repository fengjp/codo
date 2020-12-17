<template>
  <div style="height:100%">
    <Card style="margin-top: 5px;">
      <div>
        <Row>
          <Select v-model="searchKey" class="search-col" style="width:150px;margin-right:5px">
            <Option v-for="item in columnslist" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}
            </Option>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" v-model="searchValue"
                 style="width:150px;margin-right:5px"/>
          <Button @click="handleSearch" class="search-btn" type="primary" style="margin-right:5px">搜索</Button>
          <Button type="info" class="search-btn" @click="editModal('', 'post', '新增岗位')" style="margin-right:5px">新增岗位
          </Button>
          <!--          <Button type="info"  @click="editModal2" style="margin-right:5px">批量新建干系人</Button>-->
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
      width="780px"
    >
      <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" :inline="true">
        <Row>
          <Col span="12">
            <div v-if="editModalData && editModalData == 'put'">

              <FormItem label="岗位名" prop="postname" style="width:350px;">
                <Input
                  v-model="formValidate.postname"
                  disabled
                  :maxlength="45"
                  placeholder="请输入岗位名"
                ></Input>
              </FormItem>
            </div>
            <div v-else>
              <FormItem label="岗位名" prop="postname" style="width:350px;">
                <Input
                  v-model="formValidate.postname"
                  :maxlength="45"
                  placeholder="请输入岗位名"
                ></Input>
              </FormItem>
            </div>
          </Col>
          <Col span="12">
            <FormItem label="职责概要" prop="outline" style="width:350px;">
              <Input
                v-model="formValidate.outline"
                :maxlength="45"
                placeholder="请输入职责概要"
              ></Input>
            </FormItem>
          </Col>
        </Row>

        <!--            <FormItem label="职责详情" prop="remarks" style="width:350px;">-->
        <!--                <Input-->
        <!--                  v-model="formValidate.remarks"-->
        <!--                  :maxlength="45"-->
        <!--                  placeholder="请输入职责详情"-->
        <!--                ></Input>-->
        <!--              </FormItem>-->
        <FormItem label="职责详情" style="width: 100%">
          <Row v-for="(item, index) in formValidate.remarks">
            <Col span="12">
              <Input style="width: 25px" type="text" v-model="item.k" placeholder="请输入序号"></Input>:
              <Input style="width: 300px" :rows="1" type="textarea" v-model="item.v" placeholder="请输入详情"></Input>
            </Col>
            <Col span="4" offset="1">
              <Button @click="handleRemove(index)">删除</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="12">
              <Button style="width: 80px" long @click="handleAdd" icon="md-add">添加</Button>
            </Col>
          </Row>
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
      :title="modalMap.modalTitle"
      :loading=true
      :footer-hide=true
      width="30%"
    >
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
      width="50"
    >
      <ul id="list">
        <li v-for="(item,index) in list_items">
        {{item.k}}:{{ item.v}}
        </li>
      </ul>
    </Modal>
  </div>
</template>

<script>
  import FormGroup from '_c/form-group'
  import {
    getpostlist,
    addpostlist,
    delpostlist,
    updatepostlist,
    UploadUrl,
  } from '@/api/jobpost'
  import {getDictConfList} from '@/api/app'

  export default {
    components: {
      FormGroup
    },
    data() {
      return {
        // 弹出框
        modalMap: {
          modalVisible: false,
          modalTitle: '创建岗位'
        },
        modalMap2: {
          modalVisible: false,
          modalTitle: '批量创建干系人'
        },
        modalMap3: {
          modalVisible: false,
          modalTitle: '职责详情'
        },
        isDisable: false,
        editModalData: '',
        list_items: [],
        tokey: '',
        tovalue: '',
        searchValue: '',
        searchKey: '用户名',
        UploadUrl: '',
        surl: '',
        formValidate: {
          id: 0,
          postname: '',
          remarks: [
            {
              k: 0,
              v: '',
            }
          ],
          outline: ''
        },
        allcompanyList: [],
        alldemand_unit: [],
        alldepartmentList: [],
        ruleValidate: {
          postname: [
            {
              required: true,
              message: '请输入岗位名',
              trigger: 'blur'
            }
          ],
        },
        columnslist: [
          {title: '岗位', key: 'postname', editable: true},
          {title: '职责概要', key: 'outline', editable: true},
          {title: '职责详情', key: 'remarks', editable: true},
        ],
        columns: [
          {title: '岗位', key: 'postname', editable: true},
          {title: '职责概要', key: 'outline', editable: true},
          {
            title: '职责详情', key: 'remarks', editable: true,
            render:
              (h, params) => {
                return h('div', [
                  h(
                    'a',
                    {
                      props: {
                        type: 'text',
                        size: 'small',
                        icon: '',
                      },
                      style: {
                        marginRight: '1px',
                        color: '#409eff'
                      },
                      on: {
                        click: () => {
                          this.editModal3(params.row.remarks)
                        }
                      }
                    },
                    '查看'
                  ),

                ])
              }
          },
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
                          this.editModal(params.row, 'put', '编辑岗位')
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
      handleAdd() {
        // this.index++;
        this.index = this.formValidate.remarks.length
        this.formValidate.remarks.push({
          v: '',
          k: this.index,
        });
      },
      handleRemove(index) {
        this.formValidate.remarks.splice(index, 1);//(下标index开始，删除1个)
      },
      handleSuccess(res, file) {
        // console.log(file)
        this.getpostlist(this.pageNum, this.pageSize)
        this.modalMap2.modalVisible = false
        this.$Message.success("文件上传成功")
      },
      handleError(error) {
        // console.log(error)
        this.modalMap2.modalVisible = false
        this.$Message.success("文件上传失败")
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
              // console.log(this.allcompanyList)
            }
            if (stakeholder_department_list) {
              this.alldepartmentList = stakeholder_department_list
            }

          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      editModal2() {
        this.modalMap2.modalVisible = true
        this.modalMap2.modalTitle = '上传文件'
      },
      editModal3(remarks) {
        this.modalMap3.modalVisible = true
        this.modalMap3.modalTitle = "职责详情"
        this.list_items = eval(remarks)
      },
      editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        if (paramsRow && paramsRow.id) {
          // put
          this.formValidate = {
            id: paramsRow.id,
            postname: paramsRow.postname,
            outline: paramsRow.outline,
            remarks: eval(paramsRow.remarks)
          }
        } else {
          // post
          this.formValidate = {
            postname: '',
            outline: '',
            remarks: [
              {
                k: 0,
                v: '',
              }
            ],
          }
        }
      },
      handleDelete(params) {
        if (confirm(`确定要删除 ${params.row.postname}`)) {
          delpostlist({id: params.row.id}).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.getpostlist(this.pageNum, this.pageSize, this.tokey, this.tovalue)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      changePage(value) {
        this.pageNum = value
        this.getpostlist(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      handleSearch() {
        this.getpostlist(1, this.pageSize, this.searchKey, this.searchValue)
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getpostlist(1, this.pageSize, this.searchKey, this.searchValue)
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
        this.getpostlist(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      // 获取用户列表
      getpostlist(page, limit, key, value) {
        getpostlist(page, limit, key, value).then(res => {
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
      handleSubmit(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            this.isDisable = true
            setTimeout(() => {
              if (this.editModalData == "post") {
                addpostlist(this.formValidate).then(res => {
                  const data = res.data
                  if (res.data.code === 0) {
                    this.$Message.info(`${data.msg}`)
                    // 重新获取数据
                    this.getpostlist(this.pageNum, this.pageSize)
                  } else {
                    this.$Message.error(`${data.msg}`)
                  }
                }).catch(err => {
                  this.$Message.error(err)
                })
              }
              if (this.editModalData == "put") {
                updatepostlist(this.formValidate).then(res => {
                  const data = res.data
                  if (res.data.code === 0) {
                    this.$Message.info(`${data.msg}`)
                    // 重新获取数据
                    this.getpostlist(this.pageNum, this.pageSize)
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
        updatepostlist(EditData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      companylist(key, value) {
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
      handleClear(e) {
        // if (e.target.value === '') this.tableData = this.value
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
      this.UploadUrl = UploadUrl
      this.getpostlist(this.pageNum, this.pageSize)
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
