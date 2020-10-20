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
          <Button type="info" class="search-btn" @click="editModal('', 'post', '新增类型')" style="margin-right:5px">新增类型
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
      width="450px"
      :styles="{top: '20px'}"
    >
      <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" :inline="true">
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem label="类型名" prop="typename" style="width:350px;">
            <Input
              v-model="formValidate.typename"
              disabled
              :maxlength="45"
              placeholder="请输入类型名"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem label="类型名" prop="typename" style="width:350px;">
            <Input
              v-model="formValidate.typename"
              :maxlength="45"
              placeholder="请输入类型名"
            ></Input>
          </FormItem>
        </div>

        <FormItem label="流程描述" prop="remarks" style="width:350px;">
          <Input
            v-model="formValidate.remarks"
            :rows="5"
            type="textarea"
            placeholder="请输入操作流程描述"
          ></Input>
        </FormItem>
        <FormItem label="流程图" prop="chart" style="width:430px;">
          <div class="demo-upload-list" v-for="item in formValidate.defaultList">
            <template v-if="item.status === 'finished'">
              <img :src="item.response.data.url" style="width:50px;height:50px">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            v-model="formValidate.chart"
            ref="upload"
            type="drag"
            :show-upload-list="false"
            :default-file-list="formValidate.defaultList"
            :on-success="handleSuccess"
            multiple
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            :on-error="handleError"
            :action=UploadUrl
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
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
    <Modal title="View Image" v-model="visible" width="650px">
        <img :src=imgeurl v-if="visible" style="width: 100%">
    </Modal>
    <Modal
        v-model="modalMapShow.modalVisible"
        :title="modalMapShow.modalTitle"
        :loading=true
        :footer-hide=true
        :styles="{top: '5px'}"
        scrollable
        width="1000px"
      >
            <img :src=surl2  style="width: 100%">

      </Modal>
  </div>
</template>

<script>
import FormGroup from '_c/form-group'
import {
  gettypeList,
  addtypeList,
  deltypeList,
  updatetypeList,
  UploadUrl
} from '@/api/typeconf'
import { getDictConfList } from '@/api/app'

export default {
  components: {
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
      uploadList: [],
      modalMapShow: {
        modalVisible: false,
        modalTitle: '流程图'
      },
      tovalue: '',
      visible: false,
      searchValue: '',
      searchKey: '',
      imgeurl: '',
      UploadUrl: '',
      surl2: '',
      surl: '',
      formValidate: {
        id: 0,
        typename: '',
        remarks: '',
        chart: '',
        defaultList: [
          // {
          //     'name': 'a42bdcc1178e62b4694c830f028db5c0',
          //     'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          // },
        ]
      },
      allcompanyList: [],
      alldemand_unit: [],
      alldepartmentList: [],
      ruleValidate: {
        typename: [
          {
            required: true,
            message: '请输入类型名',
            trigger: 'blur'
          }
        ],
        remarks: [
          {
            required: true,
            message: '请输入操作流程描述',
            trigger: 'blur'
          }
        ]
        // chart: [
        //   {
        //     required: true,
        //     message: '请输上传流程图',
        //     trigger: 'blur'
        //   }
        // ]
      },
      columnslist: [
        { title: '类型', key: 'typename', editable: true, width: 100 }
      ],
      columns: [
        { title: '类型', key: 'typename', editable: true, width: 200 },
        { title: '操作流程描述',
          key: 'remarks',
          editable: true,
          render: (h, params) => {
            let roleTitle = params.row.remarks
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
        { title: '流程图',
          key: 'chart',
          editable: true,
          render: (h, params) => {
            return h('a', {
              // attrs:{
              //      href: params.row.chart,
              // },
              on: {
                click: () => {
                  this.handleDetail3('流程图', params.row.chart)
                }
              }
            }, params.row.chart
            )
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
                        icon: 'ios-create-outline'
                      },
                      style: {
                        marginRight: '1px',
                        color: '#409eff'
                      },
                      on: {
                        click: () => {
                          this.editModal(params.row, 'put', '编辑类型')
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
    handleDetail3 (name, chart) {
      this.modalMapShow.modalVisible = true
      this.modalMapShow.modalTitle = name
      this.surl2 = chart
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: '图片只能上传一张'
        })
      }
      return check
    },
    handleView (item) {
      console.log(item.response.data.url)
      this.imgeurl = item.response.data.url
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.formValidate.defaultList.splice(fileList.indexOf(file), 1)
      this.uploadList = this.$refs.upload.fileList
    },
    handleSuccess (res, file) {
      console.log(res.data.url) // 上传图片成功,返回的url
      this.formValidate.chart = res.data.url
      this.formValidate.defaultList = this.$refs.upload.fileList
      this.uploadList = this.$refs.upload.fileList
      console.log(this.formValidate.defaultList) // 记录了上传和返回的数据
      this.$Message.success('图片上传成功')
    },
    handleError (error) {
      this.$Message.error('图片上传失败')
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
          typename: paramsRow.typename,
          remarks: paramsRow.remarks,
          chart: paramsRow.chart,
          defaultList: [{ 'status': 'finished', 'response': { 'data': { 'url': paramsRow.chart } } }]
        }
      } else {
        this.$refs.upload.fileList = [{
          'status': 'finished',
          'response': { 'data': { 'url': '' } }
        }]
        this.uploadList = []
        // post
        this.formValidate = {
          typename: '',
          remarks: '',
          chart: '',
          defaultList: []
        }
      }
    },
    handleDelete (params) {
      if (confirm(`确定要删除 ${params.row.username}`)) {
        deltypeList({ id: params.row.id }).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.gettypeList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
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
      this.gettypeList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    handleSearch () {
      this.gettypeList(1, this.pageSize, this.searchKey, this.searchValue)
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.gettypeList(1, this.pageSize, this.searchKey, this.searchValue)
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
      this.gettypeList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    // 获取用户列表
    gettypeList (page, limit, key, value) {
      gettypeList(page, limit, key, value).then(res => {
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
          setTimeout(() => {
            if (this.editModalData == 'post') {
              addtypeList(this.formValidate).then(res => {
                const data = res.data
                if (res.data.code === 0) {
                  this.$Message.info(`${data.msg}`)
                  // 重新获取数据
                  this.gettypeList(this.pageNum, this.pageSize)
                  this.modalMap.modalVisible = false
                } else {
                  this.$Message.error(`${data.msg}`)
                }
              }).catch(err => {
                this.$Message.error(err)
              })
            }
            if (this.editModalData == 'put') {
              updatetypeList(this.formValidate).then(res => {
                const data = res.data
                if (res.data.code === 0) {
                  this.$Message.info(`${data.msg}`)
                  // 重新获取数据
                  this.gettypeList(this.pageNum, this.pageSize)
                  this.modalMap.modalVisible = false
                } else {
                  this.$Message.error(`${data.msg}`)
                }
              }).catch(err => {
                this.$Message.error(err)
              })
            }

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
      updatetypeList(EditData).then(res => {
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
          console.log(res.data.data)
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
  mounted () {
    this.uploadList = this.$refs.upload.fileList
    this.UploadUrl = UploadUrl
    this.gettypeList(this.pageNum, this.pageSize)
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
