<template>
  <div>
    <Card :bordered="false" dis-hover>
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
        <Button type="success" class="search-btn" @click="handlerZdLink('','post', '添加支队连接')">添加支队连接</Button>
        <Button type="warning" class="search-btn" @click="handlerPushConf('','post', '下发配置')">下发配置</Button>
        <Button type="error" class="search-btn" @click="handlerPullConf('','post', '拉取配置')">拉取配置</Button>
      </div>
      <Table stripe size="small" :columns="columns" :data="tableData" :loading="loading"
             @on-selection-change="handleSelectChange"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>

    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true width="600"
           :mask-closable=false :styles="{top: '0px'}">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" inline>
        <!--<alert>温馨提示：xxx</alert>-->
        <FormItem label="标题" prop="title" style="width: 100%">
          <Input v-model="formValidate.title" style="width: 70%" :maxlength="50" placeholder='请输入标题'></Input>
          <span style="margin-left: 20px;margin-right: 10px">排序</span>
          <InputNumber v-model="formValidate.seq" style="width: 15%;" placeholder="升序"></InputNumber>
        </FormItem>
        <FormItem label="支队连接" prop="linkId" style="width: 98%">
          <Select v-model="formValidate.linkId" placeholder='请选择支队连接' @on-change="linkchange">
            <Option v-for="item in linkList" :value="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="数据库源" prop="dblinkId" style="width: 48%">
          <!--<Input v-model="formValidate.dblinkId" :maxlength="50" placeholder="数据库源"></Input>-->
          <Select v-model="formValidate.dblinkId" placeholder='请选择数据库源'>
            <Option v-for="item in dbList" :value="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="数据库名" prop="database" style="width: 48%">
          <Input v-model="formValidate.database" :maxlength="50" placeholder="请输入数据库名"></Input>
        </FormItem>
        <FormItem label="用户名" prop="user" style="width: 48%">
          <Input v-model="formValidate.user" placeholder="连接数据库用户名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password" style="width: 48%">
          <Input v-model="formValidate.password" type="password" password placeholder="连接数据库密码"></Input>
        </FormItem>
        <FormItem label="一级分组" prop="group1stID" style="width: 100%" v-if="versions === '1'">
          <Select v-model="formValidate.group1stID" placeholder='一级分组' style="width: 48%">
            <Option v-for="item in group1stList" :value="item.id">{{ item.name }}
            </Option>
          </Select>
          <span style="margin-left: 20px;margin-right: 10px">排序</span>
          <InputNumber v-model="formValidate.group1stSeq" style="width: 12%;margin-right: 10px;"
                       :maxlength="50" placeholder="升序"></InputNumber>
          <Button type="primary" @click="handlerAddGroup('1','post','添加一级分组')">添加分组</Button>
        </FormItem>
        <FormItem label="二级分组" prop="group2ndID" style="width: 100%">
          <Select v-model="formValidate.group2ndID" placeholder='二级分组' style="width: 48%">
            <Option v-for="item in group2ndList" :value="item.id">{{ item.name }}
            </Option>
          </Select>
          <span style="margin-left: 20px;margin-right: 10px">排序</span>
          <InputNumber v-model="formValidate.group2ndSeq" style="width: 12%;margin-right: 10px;"
                       :maxlength="50" placeholder="升序"></InputNumber>
          <Button type="primary" @click="handlerAddGroup('2','post','添加二级分组')">添加分组</Button>
        </FormItem>
        <FormItem label="SQL语句" prop="sql" style="display: block">
          <editor v-model="formValidate.sql" @init="editorInit" :mode_type="mode_type" :read="editor.read"
                  :editorHeight=200 :key="`${_uid}`"></editor>
        </FormItem>
        <FormItem label="设置列名" style="width: 100%">
          <Row style="margin-bottom: 5px" v-for="(item, index) in formValidate.colnames">
            <Col span="14">
              <Input style="width: 120px" v-model="item.col" :maxlength="20" placeholder="字段名"></Input> ：
              <Input style="width: 120px" v-model="item.name" :maxlength="20" placeholder="字段名称"></Input>
            </Col>
            <Col span="3">
              <Button type="text" shape="circle" icon="md-close" @click="handleColRemove('colnames',index)"></Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem style="display: block">
          <Row>
            <Col span="12">
              <Button type="dashed" long @click="handleColAdd('colnames')" icon="md-add">增加列名</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="是否配置告警" style="display: block">
          <Checkbox v-model="isAlarm"></Checkbox>
        </FormItem>
        <FormItem label="" v-if="isAlarm" style="display: block; margin-top: -30px;">
          <Row style="margin-bottom: 5px" v-for="(item, index) in formValidate.colalarms">
            <Select id="alarmCol" size="small" style="width:120px" v-model="item.selCol">
              <Option v-for="i in formValidate.colnames" :value="i.col">{{ i.col }}</Option>
            </Select>
            <p style="display: initial;color: red;margin-left: 10px;" v-text="message"></p>
            <!--<Button type="text" shape="circle" icon="md-close" @click="handleColRemove('colalarms',index)"></Button>-->
            <div v-for="(subCol, subColIndex) in item.subColList">
              <Col span="14" offset="5">
                <Select style="width:60px" v-model="subCol.sign">
                  <Option v-for="s in signList" :value="s.name" :key="`sign-${s.id}`">{{ s.name }}</Option>
                </Select>
                <InputNumber style="width: 110px; margin-left: 5px; margin-right: 5px" v-model="subCol.alarmVal"
                             placeholder="指标值"></InputNumber>
                <Select style="width:80px" v-model="subCol.alarmType">
                  <Option v-for="t in typeList" :value="t.name" :key="`type-${t.id}`">{{ t.name }}</Option>
                </Select>
              </Col>
              <Col span="4">
                <Button type="text" shape="circle" icon="md-add" @click="handleColAdd('subColList',index)"></Button>
                <Button type="text" shape="circle" icon="md-close"
                        @click="handleColRemove('subColList',index,subColIndex)"></Button>
              </Col>
            </div>
          </Row>
        </FormItem>
        <FormItem label="轮询频率" prop="times">
          <RadioGroup v-model="formValidate.timesTy" vertical>
            <Radio label="timesTy1">
              <span style="margin-right: 15px;">每隔分钟数</span>
              <InputNumber :max="360" :min="1" v-if="formValidate.timesTy==='timesTy1'"
                           v-model="formValidate.timesTy1Val" size="small"></InputNumber>
            </Radio>
            <Radio label="timesTy2">
              <span style="margin-right: 15px;">每天固定时间</span>
              <TimePicker size="small" format="HH:mm" v-if="formValidate.timesTy==='timesTy2'"
                          v-model="formValidate.timesTy2Val" style="width: 100px;" placeholder="选择时分"></TimePicker>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="描述" style="width: 100%">
          <Input v-model="formValidate.description" type="textarea" :rows="5" placeholder="描述"></Input>
        </FormItem>
        <FormItem style="display: block">
          <Button type="primary" @click="handleSubmitQuery('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modalGroup.modalVisible" :title="modalGroup.modalTitle" :footer-hide=true :mask-closable="false">
      <Form ref="groupFormValidate" :model="groupFormValidate" :rules="groupRuleValidate" :label-width="80"
            v-if="modalGroup.modalTitle === '添加一级分组'">
        <FormItem label="已有分组" prop="groupTable">
          <Table ref="groupSelection" size="small" max-height="500" :show-header="false"
                 :columns="groupColumns" :data="group1TableDate">
          </Table>
        </FormItem>
        <FormItem label="组名" prop="groupName">
          <Input v-model="groupFormValidate.groupName" :maxlength="50" placeholder='组名'></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitGroup('groupFormValidate')">新增分组</Button>
        </FormItem>
      </Form>
      <Form ref="groupFormValidate" :model="groupFormValidate" :rules="groupRuleValidate" :label-width="80"
            v-else>
        <FormItem label="已有分组" prop="groupTable">
          <Table ref="groupSelection" size="small" max-height="500" :show-header="false"
                 :columns="groupColumns" :data="group2TableDate">
          </Table>
        </FormItem>
        <FormItem label="组名" prop="groupName">
          <Input v-model="groupFormValidate.groupName" :maxlength="50" placeholder='组名'></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitZdGroup('groupFormValidate')">新增分组</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modalZd.modalVisible" :title="modalZd.modalTitle" :footer-hide=true :mask-closable="false"
           width="625">
      <Card :bordered="false">
        <p slot="title">连接表</p>
        <Table size="small" max-height="500" :show-header="false"
               :columns="zdColumns" :data="zdTableDate">
        </Table>
      </Card>
      <Card :bordered="false" style="margin-top: 5px">
        <p slot="title">添加连接</p>
        <Form ref="zdFormValidate" :model="zdFormValidate" :rules="zdRuleValidate" :label-width="80" inline>
          <FormItem label="名称" prop="name">
            <Input v-model="zdFormValidate.name" :maxlength="50" placeholder='名称'></Input>
          </FormItem>
          <FormItem label="连接" prop="link">
            <Input v-model="zdFormValidate.link">
              <span slot="prepend">http://</span>
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmitZD('zdFormValidate')">新增连接</Button>
          </FormItem>
        </Form>
      </Card>
    </Modal>
    <Modal v-model="modalPull.modalVisible" :title="modalPull.modalTitle" :footer-hide=true :mask-closable="false">
      <Form :model="pillFormValidate" :label-width="80">
        <FormItem label="支队连接" prop="linkId">
          <Select v-model="pillFormValidate.linkId" placeholder='请选择支队连接'>
            <Option v-for="item in linkList" :value="item.id">{{ item.name }}
            </Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handlePull()">确定</Button>
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
    operationZd,
    getZdLinkList,
    queryPushConf,
    queryPullConf,
    getZdInfo,
    operationZdGroup,
  } from '@/api/customquery/subquery'
  import {
    operationGroup,
    getGroupList,
  } from '@/api/customquery/query'

  export default {
    components: {editor},
    data() {
      return {
        versions: this.$config.versions,
        loading: false,
        message: '',
        signList: [
          {'id': 0, 'name': '>'},
          {'id': 1, 'name': '<'},
          {'id': 2, 'name': '>='},
          {'id': 3, 'name': '<='},
          {'id': 4, 'name': '='}
        ],
        typeList: [
          {'id': 0, 'name': '正常'},
          {'id': 1, 'name': '一般'},
          {'id': 2, 'name': '严重'},
          {'id': 3, 'name': '致命'}
        ],
        linkList: [],
        group1stList: [],
        group2ndList: [],
        groupTableDate: [],
        group1TableDate: [],
        group2TableDate: [],
        groupColumns: [
          {
            title: '组名',
            key: 'groupName',
            align: 'center'
          },
          {
            title: '层级',
            key: 'grouptype',
            align: 'center',
            Width: 70,
            render: (h, params, vm) => {
              var tt = params.row.grouptype + '级分组'
              return h('div', [
                h('span', {}, tt)
              ])
            }
          },
          {
            title: '操作',
            key: 'handle',
            width: 90,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'ios-trash-outline'
                    },
                    style: {
                      color: '#ed4014'
                    },
                    on: {
                      click: () => {
                        this.handlerDeleteGroup(params)
                      }
                    }
                  }, '删除'
                )
              ])
            }
          }
        ],
        tableSelectList: [],
        isAlarm: false,
        mode_type: 'mysql',
        editor: {
          title: '编辑',
          read: false,
          color: 'primary'
        },
        columns: [
          {type: 'selection', key: 'id', width: 60, align: 'center', fixed: 'left'},
          {title: '标题', key: 'title', align: 'center', minWidth: 120},
          {title: '更新时间', key: 'update_time', align: 'center', width: 150, sortable: true},
          {title: '二级组名', key: 'groupName', align: 'center', width: 150,},
          {title: '排序', key: 'group2ndSeq', align: 'center', width: 80, sortable: true},
          // {title: '数据库源', key: 'dblinkIdNa', align: 'center', minWidth: 100},
          {title: '支队连接', key: 'zdlink', align: 'center', minWidth: 150},
          {
            title: '轮询频率', key: 'timesTy', align: 'center', minWidth: 100,
            render: (h, params, vm) => {
              if (params.row.timesTy === 'timesTy1') {
                var tt = '每' + params.row.timesTy1Val + '分钟'
              } else {
                var tt = '每天' + params.row.timesTy2Val
              }
              return h('div', [
                h('span', {}, tt)
              ])
            }
          },
          {
            title: '状态', key: 'status', width: 80, align: 'center',
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
                      type: 'text',
                      size: 'small',
                      icon: 'ios-create-outline'
                    },
                    style: {
                      marginRight: '2px',
                      color: '#409eff'
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
                      type: 'text',
                      size: 'small',
                      icon: 'ios-trash-outline'
                    },
                    style: {
                      color: '#ed4014'
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
        modalZd: {
          modalVisible: false,
          modalTitle: '添加连接'
        },
        modalMap: {
          modalVisible: false,
          modalTitle: '添加配置'
        },
        modalGroup: {
          modalVisible: false,
          modalTitle: '添加分组'
        },
        modalPull: {
          modalVisible: false,
          modalTitle: '拉取配置'
        },
        index: 0,
        formValidate: {
          id: null,
          title: '',
          dblinkId: '',
          linkId: '',
          user: '',
          password: '',
          database: '',
          sql: '',
          colnames: [{
            col: '',
            name: '',
            alarm: {}
          }],
          colalarms: [
            {
              selCol: '',
              subColList: [
                {
                  sign: '',
                  alarmVal: 0,
                  alarmType: ''
                }
              ]
            }
          ],
          timesTy: '',
          timesTy1Val: 1,
          timesTy2Val: '',
          status: '',
          description: '',
          seq: 0,
          group1stID: 0,
          group1stSeq: 0,
          group2ndID: 0,
          group2ndSeq: 0
        },
        ruleValidate: {
          title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
          // dblinkId: [{required: true, message: '数据库源不能为空', trigger: 'blur', type: 'number'}],
          linkId: [{required: true, message: '支队连接不能为空', trigger: 'blur', type: 'number'}],
        },
        dbList: [],
        groupFormValidate: {
          id: null,
          groupName: '',
          grouptype: ''
        },
        groupRuleValidate: {
          groupName: [{required: true, message: '名称不能空', trigger: 'blur'}]
        },
        pillFormValidate: {
          linkId: ''
        },
        zdFormValidate: {
          id: null,
          name: '',
          link: ''
        },
        zdRuleValidate: {
          name: [{required: true, message: '名称不能空', trigger: 'blur'}],
          link: [{required: true, message: '连接不能空', trigger: 'blur'}],
        },
        zdTableDate: [],
        zdColumns: [
          {
            title: '名称',
            key: 'name',
            align: 'center',
            width: 150,
          },
          {
            title: '连接',
            key: 'link',
            align: 'center',
          },
          {
            title: '操作',
            key: 'handle',
            width: 90,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'ios-trash-outline'
                    },
                    style: {
                      color: '#ed4014'
                    },
                    on: {
                      click: () => {
                        this.handlerDeleteLink(params)
                      }
                    }
                  }, '删除'
                )
              ])
            }
          }
        ],
      }
    },
    methods: {
      // // 获取数据库源
      // getDBListForQry(key, value) {
      //   getDBListForQry(key, value).then(res => {
      //     if (res.data.code === 0) {
      //       this.dbList = res.data.data
      //     }
      //   })
      // },
      onSwitch(editData) {
        const EditData = {
          query_id: editData.row.id,
          key: editData.column.key
        }
        patchquery(EditData).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getQueryList(this.pageNum, this.pageSize)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      //
      handlerAddGroup(val, meth, mtitle) {
        this.modalGroup.modalVisible = true
        this.modalGroup.modalTitle = mtitle
        this.groupFormValidate = {
          id: null,
          groupName: '',
          grouptype: val
        }
      },
      // 添加支队连接
      handlerZdLink(val, meth, mtitle) {
        this.modalZd.modalVisible = true
        this.modalZd.modalTitle = mtitle
        this.editModalData = meth
        this.getZdLinkList()
      },
      // 拉取配置
      handlerPullConf(val, meth, mtitle) {
        this.modalPull.modalVisible = true
        this.modalPull.modalTitle = mtitle
        this.editModalData = meth
      },
      // 添加查询配置
      handlerQuery(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        // this.getDBListForQry()
        this.getGroupList()
        if (paramsRow && paramsRow.id) {
          this.formValidate = {
            id: paramsRow.id,
            title: paramsRow.title,
            dblinkId: paramsRow.dblinkId,
            database: paramsRow.database,
            sql: paramsRow.sql,
            colnames: paramsRow.colnames,
            colalarms: paramsRow.colalarms,
            timesTy: paramsRow.timesTy,
            timesTy1Val: parseInt(paramsRow.timesTy1Val),
            timesTy2Val: paramsRow.timesTy2Val,
            user: paramsRow.user,
            password: paramsRow.password,
            description: paramsRow.description,
            seq: paramsRow.seq,
            group1stID: paramsRow.group1stID,
            group1stSeq: paramsRow.group1stSeq,
            group2ndID: paramsRow.group2ndID,
            group2ndSeq: paramsRow.group2ndSeq,
            linkId: paramsRow.zdlinkID,
            groupName: paramsRow.groupName,
          }
          if (paramsRow.colalarms.length > 0) {
            this.isAlarm = true
          } else {
            this.isAlarm = false
          }
          this.linkchange(paramsRow.zdlinkID)
        } else {
          this.formValidate = {
            id: null,
            title: '',
            dblinkId: '',
            database: '',
            user: '',
            password: '',
            sql: '',
            colnames: [{
              col: '',
              name: ''
            }],
            colalarms: [
              {
                selCol: '',
                subColList: [
                  {
                    sign: '>',
                    alarmVal: 0,
                    alarmType: '正常'
                  }
                ]
              }
            ],
            timesTy: 'timesTy1',
            timesTy1Val: 1,
            timesTy2Val: '',
            description: '',
            seq: 0,
            group1stID: 0,
            group1stSeq: 0,
            group2ndID: 0,
            group2ndSeq: 0,
            groupName: '',
          }
        }
      },
      handleColAdd(val, index) {
        if (val === 'subColList') {
          this.formValidate.colalarms[index].subColList.push({
              sign: '>',
              alarmVal: 0,
              alarmType: '正常'
            }
          )
        }
        if (val === 'colalarms') {
          this.formValidate.colalarms.push({
            selCol: '',
            subColList: [
              {
                sign: '>',
                alarmVal: 0,
                alarmType: '正常'
              }
            ]
          })
        }
        if (val === 'colnames') {
          this.formValidate.colnames.push({
            col: '',
            name: ''
          })
        }
      },
      handleColRemove(val, index, subColIndex) {
        // console.log(index)
        if (val === 'subColList') {
          if (this.formValidate.colalarms[index].subColList.length === 1) {
            return
          }
          this.formValidate.colalarms[index].subColList.splice(subColIndex, 1)
        }
        if (val === 'colalarms') {
          this.formValidate.colalarms.splice(index, 1)
        }
        if (val === 'colnames') {
          this.formValidate.colnames.splice(index, 1)
        }
      },
      handlePull() {
        if (this.pillFormValidate.linkId > 0) {
          queryPullConf(this.pillFormValidate).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.modalPull.modalVisible = false
              this.getQueryList(this.pageNum, this.pageSize)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        } else {
          this.$Message.error('没有选择支队连接')
        }
      },
      handleSubmitZD(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              // console.log(this.zdFormValidate)
              operationZd(this.zdFormValidate, 'post').then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.modalZd.modalVisible = false
                  this.getZdLinkList()
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
            }, 500)
          } else {
            this.$Message.error('表单校验错误')
          }
        })
      },
      handleSubmitGroup(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              // console.log(this.formValidate)
              operationGroup(this.groupFormValidate, 'post').then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getGroupList()
                  this.modalGroup.modalVisible = false
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
            }, 500)
          } else {
            this.$Message.error('表单校验错误')
          }
        })
      },
      handleSubmitZdGroup(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              var linkId = this.formValidate.linkId
              this.groupFormValidate.linkId = linkId
              operationZdGroup(this.groupFormValidate, 'post').then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.modalGroup.modalVisible = false
                  this.linkchange(linkId)
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
            }, 500)
          } else {
            this.$Message.error('表单校验错误')
          }
        })
      },
      handleSubmitQuery(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            // console.log(this.formValidate)
            let groupName = ''
            for (let i in this.group2ndList) {
              if (this.group2ndList[i].id === this.formValidate.group2ndID) {
                groupName = this.group2ndList[i].name
                break
              }
            }
            this.formValidate.groupName = groupName
            if (this.isAlarm && this.formValidate.colalarms[0].selCol === '') {
              this.message = '请选择告警字段'
              this.$Message.error('表单校验错误')
              return
            } else {
              this.message = ''
            }
            if (!this.isAlarm) {
              this.formValidate.colalarms = []
            }
            setTimeout(() => {
              // console.log(this.formValidate)
              operationQuery(this.formValidate, this.editModalData).then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getQueryList(this.pageNum, this.pageSize, this.searchKey, this.searchVal)
                  this.modalMap.modalVisible = false
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
            }, 500)
          } else {
            this.$Message.error('表单校验错误')
          }
        })
      },
      handlerDeleteQuery(params) {
        if (confirm('确定要删除吗')) {
          operationQuery({id: params.row.id}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getQueryList(this.pageNum, this.pageSize, this.searchKey, this.searchVal)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
        }
      },
      handlerDeleteGroup(params) {
        if (confirm('确定要删除吗')) {
          if (params.row.grouptype === 1) {
            operationGroup({id: params.row.id}, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getGroupList()
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
          }

          if (params.row.grouptype === 2) {
            var payload = {}
            payload['id'] = params.row.id
            payload['linkId'] = this.formValidate.linkId
            operationZdGroup(payload, 'delete').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.linkchange(payload['linkId'])
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              })
          }

        }
      },
      getQueryList(page, limit, key, value, dateValue) {
        getQueryList(page, limit, key, value, dateValue).then(res => {
          if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
          } else {
            // this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      getGroupList(key, value) {
        getGroupList(key, value).then(res => {
          if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.groupTableDate = res.data.data
            this.group1stList = res.data.groupObj[1]
            // this.group2ndList = res.data.groupObj[2]
            let group1TableDate = []
            for (let i in this.groupTableDate) {
              if (this.groupTableDate[i].grouptype === 1) {
                group1TableDate.push(this.groupTableDate[i])
              }
            }
            this.group1TableDate = group1TableDate
          } else {
            // this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handlerDeleteLink(params) {
        if (confirm('确定要删除吗')) {
          operationZd({id: params.row.id}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getZdLinkList()
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
        }
      },
      getZdLinkList() {
        getZdLinkList().then(res => {
          if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.zdTableDate = res.data.data
            this.linkList = res.data.linkList
          } else {
            // this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleSelectChange(val) {
        this.tableSelectList = val
      },
      handlerPushConf() {
        if (this.tableSelectList.length > 0) {
          this.loading = true
          let selectList = this.tableSelectList
          queryPushConf(selectList).then(res => {
            this.loading = false
            if (res.data.code === 0) {
              this.tableSelectList = []
              this.$Message.success('下发完毕');
              this.getQueryList(this.pageNum, this.pageSize)
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          })
        } else {
          this.$Message.info(`没有选择`)
        }
      },
      linkchange(value) {
        if (value) {
          getZdInfo(value).then(res => {
            this.group2ndList = res.data.groupObj
            this.dbList = res.data.db_list
            let group2TableDate = []
            for (let i in this.group2ndList) {
              let _d = {}
              _d['id'] = this.group2ndList[i].id
              _d['groupName'] = this.group2ndList[i].name
              _d['grouptype'] = 2
              group2TableDate.push(_d)
            }
            this.group2TableDate = group2TableDate
          })
        }
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
          this.searchValue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getQueryList(
          1,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      handleClear(e) {
        if (e.target.value === '') this.tableData = this.value
      },
      handleSearch() {
        this.getQueryList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      editorInit: function () {
        require(`brace/mode/${this.mode_type}`) // language
        require('brace/theme/terminal')
        require('brace/theme/xcode')
      }
    },
    watch: {
      isAlarm: function () {
        if (this.isAlarm) {
          // console.log(this.formValidate)
          if (this.formValidate.colalarms.length === 0) {
            this.formValidate.colalarms = [
              {
                selCol: '',
                subColList: [
                  {
                    sign: '>',
                    alarmVal: 0,
                    alarmType: '正常'
                  }
                ]
              }
            ]
          }
        }
      }
    },
    mounted() {
      this.getQueryList(this.pageNum, this.pageSize)
      this.getZdLinkList()
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
