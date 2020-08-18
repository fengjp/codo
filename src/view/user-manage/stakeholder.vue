<template>
  <div style="height:100%">
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns"
              @on-delete="handleDelete" @on-save-edit="handleInput"
              @on-search-table="handleSearchTable"
              @on-selection-change="handleSelectChange">
        <div slot="new_btn" class="search-con search-col">
          <Button type="info" class="search-btn" @click="showModal">新建干系人</Button>
        </div>
      </tables>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true>
      <form-group :list="formList" @on-submit-success="handleSubmit"></form-group>
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
    updateStakeholder,
  } from '@/api/stakeholder'

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
          modalTitle: '创建干系人'
        },
        // 渲染form数据
        formList: [
          {
            name: 'username',
            type: 'i-input',
            value: '',
            label: '用户名',
            placeholder: '英文字母',
            rule: [
              {required: true, message: '用户名不能为空', trigger: 'blur'}
            ]
          },
          {
            name: 'nickname',
            type: 'i-input',
            value: '',
            label: '昵称',
            placeholder: '中文',
            rule: [
              {required: true, message: '昵称不能为空', trigger: 'blur'}
            ]
          },
          {
            name: 'department',
            type: 'i-input',
            value: '',
            label: '部门',
          },
          {
            name: 'wechat',
            type: 'i-input',
            value: '',
            label: '微信号码',
          },
          {
            name: 'tel',
            type: 'i-input',
            value: '',
            label: '手机号码',
          },
          {
            name: 'email',
            type: 'i-input',
            value: '',
            label: '邮箱',
          }
        ],
        columns: [
          {type: 'selection', title: '', key: '', width: 60, align: 'center'},
          {title: '用户名', key: 'username', sortable: true},
          {title: '昵称', key: 'nickname', sortable: true},
          {title: '部门', key: 'department', editable: true},
          {title: '手机', key: 'tel', editable: true},
          {title: '微信', key: 'weixin', editable: true},
          {title: '邮箱', key: 'email', editable: true},
          {
            title: '操作',
            align: 'center',
            width: 80,
            key: 'handle',
            // options: ["delete"],
            button: [
              (h, params, vm) => {
                return h(
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
                )
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
      handleDelete(params) {
        delstakeholder({user_id: params.row.user_id}).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      changePage(value) {
        this.pageNum = value
        this.getStakeholderList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getStakeholderList(1, this.pageSize, this.searchKey, this.searchValue)
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
        this.getStakeholderList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      // 获取用户列表
      getStakeholderList(page, limit, key, value) {
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
      handleSubmit(value) {
        setTimeout(() => {
          newStakeholder(value.data).then(res => {
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
          this.modalMap.modalVisible = false
        }, 1000)
      },
      handleInput(editData) {
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
      // 弹出对话框
      showModal() {
        this.modalMap.modalVisible = true
      },
      handleSelectChange(val) {
        let userList = []
        val.forEach(item => {
          userList.push(item.user_id)
        })
        this.selectionList = userList
      },
    },
    mounted() {
      this.getStakeholderList(this.pageNum, this.pageSize)
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
