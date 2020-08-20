<template>
  <Card>
    <Alert>SQL管理是用来记录SQL语句</Alert>
    <div class="search-con search-con-top">
      <Select
        v-model="searchKey"
        class="search-col"
      >
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
          :value="item.key"
          :key="`search-col-${item.key}`"
        >{{ item.title }}</Option>
      </Select>
      <Input
        @on-change="handleClear"
        clearable
        placeholder="输入关键字搜索"
        class="search-input"
        v-model="searchValue"
      />
      <Button
        @click="handleSearch"
        class="search-btn"
        type="primary"
      >搜索</Button>
      <slot name="new_btn">
        <Button type="primary" @click="editModal('', 'post', '新建SQL')" class="search-btn" >新建SQL</Button>
        </slot>
    </div>
    <Table
      size="small"
      height="660"
      ref="selection"
      border
      :columns="columns"
      :data="tableData"
    ></Table>
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading=true
      :footer-hide=true
      width=760
    >
     <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="69" :inline="true">
          <Card style="width:100%">
              <FormItem
                label="模块名称"
                prop="name" style="width:500px;margin-right:20px"
              >
                <Input
                  v-model="formValidate.name"
                  placeholder="模块名称"
                ></Input>
              </FormItem>
              <FormItem label="SQL" prop="sqlstr" style="width:500px;margin-right:50px">
                <Input
                  v-model="formValidate.sqlstr"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入SQL语句"
                ></Input>
              </FormItem>
              <FormItem
                label="详情描述"
                prop="remarks" style="width:500px;margin-right:20px"
              >
                <Input
                  v-model="formValidate.remarks"
                  type="textarea"
                  placeholder="详细描述"
                ></Input>
              </FormItem>
            <FormItem>
              <Button
                type="primary"
                @click="handleSubmit('formValidate')"
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
      v-model="modalMapCorrelation.modalVisible"
      :title="modalMapCorrelation.modalTitle"
      :loading=true
      :footer-hide=true
    >

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
</template>

<script>
import FormGroup from '_c/form-group'
import { getSqlList, SqlAdd } from '@/api/cmdb2/asset_sql'

export default {
  components: {
    FormGroup
  },
  data () {
    return {
      formValidate: {
        'name': '',
        'sqlstr': '',
        'remarks': ''
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          align: 'center',
          width: 100,
          sortable: true
        },
        {
          title: '模块名称',
          key: 'name',
          align: 'center',
          width: 120
        },
        {
          title: 'SQL语句',
          key: 'sqlstr',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.handleDetail(params.row.sqlstr)
                }
              }
            }, params.row.sqlstr
            )
          }
        },
        {
          title: '描述',
          key: 'remarks',
          align: 'center',
          minWidth: 120
        //   width: 120,
        },
        {
          title: '记录时间',
          key: 'create_time',
          align: 'center',
          width: 200
        //   width: 120,
        },
        {
          title: '操作',
          key: 'handle',
          width: 180,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {
                      this.editModal(params.index, 'put', '编辑SQL')
                    }
                  }
                },
                '编辑SQL'
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
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请输SQL模块名称',
            trigger: 'blur'
          }
        ],
        sqlstr: [
          {
            required: true,
            message: '请输SQL语句',
            trigger: 'blur'
          }
        ]
      },
      tableData: [],
      modalMap: {
        modalVisible: false,
        modalTitle: '新建'
      },
      modalMapCorrelation: {
        modalVisible: false,
        modalTitle: '关联用户'
      },
      modalMapCopy: {
        modalVisible: false,
        modalTitle: 'COPY API'
      },
      modalMapShow: {
        modalVisible: false,
        modalTitle: 'SQL',
        user_key: ''
      },
      formList: [],
      editModalData: '',
      //
      searchKey: '',
      searchValue: '',
      //
      alert_id: '',
      config_api: '',
      allUser: [], // 所有用户
      existUser: [] // 已存在用户
    }
  },
  methods: {
    // 获取管理用户列表
    getSqlList (page, limit, key, value) {
      getSqlList(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          // this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count
          this.tableData = res.data.data
          console.log(res.data.data)
          this.tableData = [{ 'id': 1, 'name': '0125102131', 'sqlstr': 'admin', 'remarks': '1111111111', 'create_time': '20200818' }]
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },

    // 查看Key详细信息
    handleDetail (user_key) {
      this.modalMapShow.modalVisible = true
      this.modalMapShow.user_key = user_key
    },
    // handleDetail (index) {
    //     this.$Modal.info({
    //         title: '用户信息',
    //         content: `<strong>名称</strong>：${this.tableData[index].name}<br><strong>用户名</strong>：${this.tableData[index].admin_user}<br><strong>用户密钥</strong>：${this.tableData[index].user_key}<br><strong>备注</strong>：${this.tableData[index].remarks}<br><strong>更新时间</strong>：${this.tableData[index].create_time}`
    //     })
    // },
    editModal (index, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      this.formList = [
        {
          name: 'id',
          value: meth === 'put' ? this.tableData[index].id : ''
        },
        {
          name: 'sqlstr',
          type: 'i-input',
          type1: 'textarea',
          maxlength: 10000,
          value: meth === 'put' ? this.tableData[index].sqlstr : '',
          label: 'SQL语句',
          placeholder: '编辑SQL语句',
          rule: [{ required: true, message: 'SQL不能为空', trigger: 'blur' }]
        },

        {
          name: 'remarks',
          type: 'i-input',
          type1: 'textarea',
          maxlength: 1000,
          value: meth === 'put' ? this.tableData[index].remarks : '',
          label: '描述',
          placeholder: '描述'
        }

      ]
    },
    handleSubmit (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
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
          }, 1000)
        } else {
          this.$Message.error('缺少必要参数')
        }
      })
    },
    // 删除
    delData (params) {
      if (confirm(`确定要删除 ${params.row.sqlstr}`)) {
        operationAdminUser({ id: params.row.id }, 'delete').then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData.splice(params.index, 1)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    setDefaultSearchKey () {
      this.searchKey =
        this.columns[0].key && this.columns[0].key !== 'handle'
          ? this.columns[0].key
          : this.columns.length > 1
            ? this.columns[1].key
            : ''
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.getAdminUserList(this.searchKey, this.searchValue)
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  },
  //   watch: {
  //     searchValue(val) {
  //       this.getAdminUserList(this.searchKey, val);
  //     }
  //   },
  mounted () {
    this.getAdminUserList()
    this.setDefaultSearchKey()
  }
}
</script>

<style lang="less" scoped>
.search-con {
  padding: 10px 0;
  .search {
    &-col {
      display: inline-block;
      width: 200px;
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
