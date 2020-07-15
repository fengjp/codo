<template>
  <div>
    <Card>
      <div class="search-con search-con-top">
        <Select v-model="searchKey" class="search-col">
          <Option v-for="item in columns" v-if="item.key !== 'handle'" :value="item.key"
                  :key="`search-col-${item.key}`">
            {{ item.title }}
          </Option>
        </Select>
        <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
        <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
        <Button type="info" class="search-btn" @click="handlerDict('','post', '添加字典')">添加字典</Button>
      </div>
      <Table size="small" :columns="columns" :data="tableData"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>

    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true width="540"
           :mask-closable=false>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <!--<alert>温馨提示：xxx</alert>-->
        <FormItem label="字典名称" prop="dictname" style="margin-right:30px">
          <Input v-model="formValidate.dictname" :maxlength="50" placeholder='请输入字典名称'></Input>
        </FormItem>
        <FormItem label="字典KEY" prop="dictkey" style="margin-right:30px">
          <Input v-model="formValidate.dictkey" :maxlength="50" placeholder="请输入字典KEY"></Input>
        </FormItem>
        <FormItem label="字典值" prop="dictvalue" style="margin-right:30px">
          <i-input type="textarea" v-model="formValidate.dictvalue" placeholder="[{}]"
                   :rows="5">
          </i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitDict('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {
    getDictList,
    operationDict,
  } from '@/api/app'

  export default {
    data() {
      return {
        columns: [
          {
            title: '字典名称',
            key: 'dictname',
            align: 'center',
            minWidth: 120,
          },
          {
            title: '字典key',
            key: 'dictkey',
            align: 'center',
            minWidth: 100
          },
          {
            title: 'json数据',
            key: 'dictvalue',
            align: 'center',
            minWidth: 220
          },
          {
            title: '操作', key: 'handle', width: 185, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button',
                  {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px'
                    },
                    on: {
                      click: () => {
                        this.handlerDict(params.row, 'put', '编辑')
                      }
                    }
                  }, '编辑'
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
                        this.handlerDeleteDict(params)
                      }
                    }
                  }, '删除'
                )
              ])
            }
          }
        ],
        tableData: [],
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        //
        searchKey: 'dictkey',
        searchValue: '',
        //
        modalMap: {
          modalVisible: false,
          modalTitle: '添加字典',
        },
        formValidate: {
          id: null,
          dictname: '',
          dictkey: '',
          dictvalue: '',
        },
        ruleValidate: {
          dictname: [{required: true, message: "字典名称不能为空", trigger: "blur"}],
          dictkey: [{required: true, message: "字典KEY不能为空", trigger: "blur"}],
        },
      }
    },
    methods: {
      // 添加字典
      handlerDict(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        if (paramsRow && paramsRow.id) {
          this.formValidate = {
            id: paramsRow.id,
            dictname: paramsRow.dictname,
            dictkey: paramsRow.dictkey,
            dictvalue: paramsRow.dictvalue,
          }
        } else {
          this.formValidate = {
            id: null,
            dictname: '',
            dictkey: '',
            dictvalue: '',
          }
        }
      },
      handleSubmitDict(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              operationDict(this.formValidate, this.editModalData).then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`);
                    this.getDictList(this.pageNum, this.pageSize, this.searchKey, this.searchVal);
                    this.modalMap.modalVisible = false;
                  } else {
                    this.$Message.error(`${res.data.msg}`);
                  }
                }
              );
            }, 1000);
          } else {
            this.$Message.error('表单校验错误');
          }
        })
      },
      handlerDeleteDict(params) {
        if (confirm('确定要删除吗')) {
          operationDict({id: params.row.id}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
                this.getDictList(this.pageNum, this.pageSize, this.searchKey, this.searchVal);
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
        }
      },
      getDictList(page, limit, key, value, dateValue) {
        getDictList(page, limit, key, value, dateValue).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      changeDate(value) {
        this.dateValue = value
      },
      changePage(value) {
        this.pageNum = value
        this.getDictList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue,
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getDictList(
          1,
          this.pageSize,
          this.searchKey,
          this.searchValue,
        )
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      handleClear(e) {
        if (e.target.value === '') this.tableData = this.value
      },
      handleSearch() {
        this.getDictList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue,
        )
      }
    },
    watch: {
      value(val) {
        this.handleSearch()
      }
    },
    mounted() {
      this.getDictList(this.pageNum, this.pageSize)
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
