<template>
  <div>
    <Card>
      <Form autocomplete="off" label-colon=":" class="case-form" ref="formValidate2" :model="formValidate2">
        <Row :gutter="1"  style="margin-bottom: -25px">
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
        </Row>
      </Form>
    </Card>
    <Card style="margin-top: 5px">
      <Row>
        <Col span="10" offset="14" style="text-align: right; margin-bottom: 5px">
          <Button
            @click="handleSearch" class="case-btn"
            type="info"
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
              type="primary"
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
        width="680"
      >
        <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="69" :inline="true">
          <Card style="width:100%">
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
            <Row :gutter="10" style="margin-bottom: 5px">
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
          </Card>
        </Form>
      </Modal>
      <Modal
      v-model="modalMapShow.modalVisible"
      :title="modalMapShow.modalTitle"
      :loading=true
      :footer-hide=true
      width=600

    >
      <Input v-model="modalMapShow.user_key" type="textarea"  :autosize="{minRows: 30,maxRows: 300}" placeholder="Enter something..."></Input>
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

import { SqlAdd, getCase, getSqlList, getname, sqlDelete, getCaseFile } from '@/api/cmdb2/asset_sql'
import { getuserlist } from '@/api/user'
import { getDate } from '@/libs/tools'
import excel from '@/libs/excel'
import { getDictConfList } from '@/api/app'

export default {
  data () {
    return {
      btnText: '展开',
      isShow: false,
      toflag: 0,
      tousername: "",
      isDisable: false,
      isDisable2: false,
      surl: '',
      formValidate: {
        name: '',
        sqlstr: '',
        remarks: '',
        username:'',
        create_time: ''
      },
      formValidate2: {
        name: '',
        remarks: ''
      },
      todate: [],
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输入脚本名',
            trigger: 'blur'
          }
        ]
      },
      columns: [
        { title: '脚本名称', key: 'name', width: 150, align: 'center' , render: (h, params) => {
            // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
            return h('div', [
              h('a', {
              on: {
                click: () => {
                  this.handleDetail(params.row.name,params.row.sqlstr)
                }
              }
            }, params.row.name)
            ])
          }
        },
        {
          title: 'SQL',
          key: 'sqlstr',
          align: 'center',
          render: (h, params) => {
            // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
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
                  title: params.row.sqlstr
                }
              }, params.row.sqlstr)
            ])
          }
        },

        {
          title: '描述',
          key: 'remarks',
          align: 'center',
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
        { title: '创建人', key: 'username', width: 100, align: 'center' },
        { title: '记录时间', key: 'create_time', width: 100, align: 'center' },
        {
          title: '操作',
          key: 'handle',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: (params.row.username != this.tousername) && (this.toflag === 0),
                  },
                  style: {
                    marginRight: '5px'
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
                    type: 'error',
                    size: 'small',
                    disabled: (params.row.username != this.tousername) && (this.toflag === 0),
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
    // 导出数据、支持分页、过滤、搜索、排序后导出
    exportDateALL () {
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
    exportData () {
      if (this.tableDataALL.length) {
        // this.exportLoading = true
        const params = {
          title: ['ID', '脚本名称', 'SQL', '描述',"创建人", '记录时间'],
          key: ['id', 'name', 'sqlstr', 'remarks', "username",'create_time'],
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

    getSqlList (page, limit, key, value) {
      getSqlList(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count
          this.tableData = res.data.data
          if (res.data.flag == '1') {
            this.toflag = 1
          }else{ this.toflag = 0}
          let loginUser = JSON.parse(sessionStorage.vuex).user.nickName
          console.log(loginUser)
          this.tousername = loginUser
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 查看Key详细信息
    handleDetail (name ,sqlstr) {
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

    editModal (paramsRow, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      if (paramsRow && paramsRow.id) {
        // put
        this.formValidate = {
          id: paramsRow.id,
          name: paramsRow.name,
          sqlstr: paramsRow.sqlstr,
          remarks: paramsRow.remarks,
          username:paramsRow.username,
          create_time: getDate(new Date().getTime() / 1000, 'year')
        }
      } else {
        // post
        this.formValidate = {
          name: '',
          sqlstr: '',
          remarks: '',
          username:'',
          create_time: getDate(new Date().getTime() / 1000, 'year')
        }
      }
    },
    handleSubmit (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          this.isDisable = true
          let loginUser = JSON.parse(sessionStorage.vuex).user.nickName
          console.log(loginUser)
          this.formValidate.username = loginUser
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
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 删除
    delData (params) {
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

    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.tovalue = this.formValidate2
      this.getSqlList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
    },
    changePage (value) {
      this.pageNum = value
      this.getCaseList(
        this.pageNum,
        this.pageSize,
        this.tokey,
        this.tovalue
      )
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getCaseList(1, this.pageSize, this.tokey, this.tovalue)
    }
  },

  mounted () {
    this.getSqlList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
  }
}
</script>

<style lang="less" scoped>
  .case-btn {
    margin-right: 5px
  }
</style>
