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
        <Button type="info" class="search-btn" @click="handlerQuery('','post', '添加配置')">添加配置</Button>
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
           :mask-closable=false :styles="{top: '20px'}">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <!--<alert>温馨提示：xxx</alert>-->
        <FormItem label="标题" prop="title">
          <Input v-model="formValidate.title" :maxlength="50" placeholder='请输入标题'></Input>
        </FormItem>
        <FormItem label="数据库源" prop="dblinkId">
          <!--<Input v-model="formValidate.dblinkId" :maxlength="50" placeholder="数据库源"></Input>-->
          <Select v-model="formValidate.dblinkId" placeholder='请选择数据库源'>
            <Option v-for="item in dbList" :value="item.id" :key="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="数据库名" prop="database">
          <Input v-model="formValidate.database" :maxlength="50" placeholder="请输入数据库名"></Input>
        </FormItem>
        <FormItem label="SQL语句" prop="sql">
          <editor v-model="formValidate.sql" @init="editorInit" :mode_type="mode_type" :read="editor.read"
                  :editorHeight=200 :key="`${_uid}`"></editor>
        </FormItem>
        <FormItem
          v-for="(item, index) in formValidate.colnames"
          :key="index"
          label="设置列名"
          :prop="'colnames.' + index + '.col'"
        >
          <Row>
            <Col span="14">
              <Input style="width: 80px" v-model="item.col" :maxlength="20" placeholder="字段名"></Input> ：
              <Input style="width: 120px" v-model="item.name" :maxlength="20" placeholder="字段名称"></Input>
            </Col>
            <Col span="4">
              <Button type="text" shape="circle" icon="md-close" @click="handleColRemove(index)"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="12">
              <Button type="dashed" long @click="handleColAdd" icon="md-add">增加列名</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="轮询频率" prop="times">
          <RadioGroup v-model="formValidate.timesTy" vertical>
            <Radio label="timesTy1">
              <span style="margin-right: 15px;">每分钟</span>
              <InputNumber :max="60" :min="1" v-if="formValidate.timesTy==='timesTy1'"
                           v-model="formValidate.timesTy1Val" size="small"></InputNumber>
            </Radio>
            <Radio label="timesTy2">
              <span style="margin-right: 15px;">每天固定时间</span>
              <TimePicker size="small" format="HH:mm" v-if="formValidate.timesTy==='timesTy2'"
                          v-model="formValidate.timesTy2Val" style="width: 100px;" placeholder="选择时分"></TimePicker>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitQuery('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import editor from '@/components/public/editor'
  import {
    getQueryList,
    operationQuery,
    patchquery,
  } from '@/api/customquery/query'
  import {getDBListForQry} from '@/api/cmdb2/db.js'

  export default {
    components: {editor},
    data() {
      return {
        mode_type: 'mysql',
        editor: {
          title: '编辑',
          read: false,
          color: "primary"
        },
        columns: [
          {
            title: '标题',
            key: 'title',
            align: 'center',
            minWidth: 120,
          },
          {
            title: '数据库源',
            key: 'dblinkIdNa',
            align: 'center',
            minWidth: 100
          },
          {
            title: '数据库名',
            key: 'database',
            align: 'center',
            minWidth: 100
          },
          {
            title: '轮询频率',
            key: 'timesTy',
            align: 'center',
            minWidth: 100,
            render: (h, params, vm) => {
              if (params.row.timesTy === 'timesTy1'){
                var tt = '每'+ params.row.timesTy1Val + '分钟'
              } else {
                var tt = '每天'+ params.row.timesTy2Val
              }
              return h('div', [
                h('span', {}, tt)
              ])
            }
          },
          {
            title: '状态',
            key: 'status',
            width: 80,
            align: 'center',
            render: (h, params, vm) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    // type: "primary",
                    value: params.row.status === '1' // 控制开关的打开或关闭状态，官网文档属性是value
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
                        this.handlerQuery(params.row, 'put', '编辑')
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
                        this.handlerDeleteQuery(params)
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
        searchKey: 'title',
        searchValue: '',
        //
        modalMap: {
          modalVisible: false,
          modalTitle: '添加配置',
        },
        index: 0,
        formValidate: {
          id: null,
          title: '',
          dblinkId: '',
          database: '',
          sql: '',
          colnames: [{
            col: '',
            name: '',
          }],
          timesTy: '',
          timesTy1Val: 1,
          timesTy2Val: '',
          status: '',

        },
        ruleValidate: {
          title: [{required: true, message: "标题不能为空", trigger: "blur"}],
          // timesTy1Val: [{required: true, message: "数据库源不能为空", trigger: "blur"}],
          database: [{required: true, message: "数据库名不能为空", trigger: "blur"}],
        },
        dbList: [],
      }
    },
    methods: {
      // 获取数据库源
      getDBListForQry(key, value) {
        getDBListForQry(key, value).then(res => {
          if (res.data.code === 0) {
            this.dbList = res.data.data
          }
        })
      },
      onSwitch(editData) {
        const EditData = {
          query_id: editData.row.id,
          key: editData.column.key
        }
        patchquery(EditData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 添加查询配置
      handlerQuery(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        this.getDBListForQry()
        if (paramsRow && paramsRow.id) {
          this.formValidate = {
            id: paramsRow.id,
            title: paramsRow.title,
            dblinkId: paramsRow.dblinkId,
            database: paramsRow.database,
            sql: paramsRow.sql,
            colnames: paramsRow.colnames,
            timesTy: paramsRow.timesTy,
            timesTy1Val: parseInt(paramsRow.timesTy1Val),
            timesTy2Val: paramsRow.timesTy2Val,
          }
        } else {
          this.formValidate = {
            id: null,
            title: '',
            dblinkId: '',
            database: '',
            sql: '',
            colnames: [{
              col: '',
              name: '',
            }],
            timesTy: 'timesTy1',
            timesTy1Val: 1,
            timesTy2Val: '',
          }
        }
      },
      handleColAdd() {
        this.formValidate.colnames.push({
          col: '',
          name: '',
        });
      },
      handleColRemove(index) {
        // console.log(index)
        this.formValidate.colnames.splice(index, 1)
      },
      handleSubmitQuery(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              console.log(this.formValidate)
              operationQuery(this.formValidate, this.editModalData).then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`);
                    this.getQueryList(this.pageNum, this.pageSize, this.searchKey, this.searchVal);
                    this.modalMap.modalVisible = false;
                  } else {
                    this.$Message.error(`${res.data.msg}`);
                  }
                }
              );
            }, 500);
          } else {
            this.$Message.error('表单校验错误');
          }
        })
      },
      handlerDeleteQuery(params) {
        if (confirm('确定要删除吗')) {
          operationQuery({id: params.row.id}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
                this.getQueryList(this.pageNum, this.pageSize, this.searchKey, this.searchVal);
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
        }
      },
      getQueryList(page, limit, key, value, dateValue) {
        getQueryList(page, limit, key, value, dateValue).then(res => {
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
        this.getQueryList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue,
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getQueryList(
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
        this.getQueryList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue,
        )
      },
      editorInit: function () {
        require(`brace/mode/${this.mode_type}`)    //language
        require('brace/theme/terminal')
        require('brace/theme/xcode')
      },
    },
    watch: {
      value(val) {
        this.handleSearch()
      }
    },
    mounted() {
      this.getQueryList(this.pageNum, this.pageSize)
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
