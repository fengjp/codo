<template>
  <div>
    <Row :gutter="10">
      <Col span="5" style="margin-bottom: 5px;">
        <Card :bordered="false" dis-hover>
          <Tree
            ref="tree"
            :data="tagTreeData"
            @on-select-change="handlerTreeChange"
            getSelectedNodes
          ></Tree>
        </Card>
      </Col>
      <Col span="19">
        <Card :bordered="false" dis-hover>
          <p slot="title">基本信息</p>
          <p slot="extra" style="font-size: 12px;">
            <Button type="info" class="search-btn" @click="handlerSys('','post', '添加系统')" size="small">添加系统
            </Button>
          </p>
          <Form label-position="right" :label-width="130" inline label-colon=":">
            <FormItem label="系统名称" style="margin-bottom: 1px;width: 30%">
              <span style="font-size: 12px;">{{tableData[0].sys_name}}</span>
            </FormItem>
            <FormItem label="版本号" style="margin-bottom: 1px;width: 30%">
              <span style="font-size: 12px;">{{tableData[0].sys_version}}</span>
            </FormItem>
            <FormItem label="上线时间" style="margin-bottom: 1px;width: 30%">
              <span style="font-size: 12px;">{{tableData[0].online_time}}</span>
            </FormItem>
            <FormItem label="开发单位" style="margin-bottom: 1px;width: 30%">
              <span style="font-size: 12px;">{{tableData[0].development}}</span>
            </FormItem>
            <FormItem label="开发单位联系人" style="margin-bottom: 1px;width: 30%">
              <span style="font-size: 12px;">{{tableData[0].development_contact}}</span>
            </FormItem>
            <FormItem label="开发单位联系电话" style="margin-bottom: 1px;width: 30%">
              <span style="font-size: 12px;">{{tableData[0].development_phone}}</span>
            </FormItem>
            <FormItem label="系统负责人" style="margin-bottom: 1px;width: 30%">
              <a style="font-size: 12px" @click="handleDetail(tableData[0].sys_manager_list)">查看负责人</a>
            </FormItem>
            <FormItem label="文档" style="margin-bottom: 1px;width: 30%">
              <a style="font-size: 12px" @click="handleDocxDetail(tableData[0].sys_docx_list)">查看文档</a>
            </FormItem>
            <FormItem label="附件" style="margin-bottom: 1px;width: 30%">
              <a style="font-size: 12px" @click="handleUpDetail(tableData[0].uploadList)">查看附件</a>
            </FormItem>
            <FormItem label="操作" style="margin-bottom: 1px;width: 30%">
              <div style="width: 240px;" v-show="tableData[0].id">
                <Button type="text" size="small" style="marginRight: 2px; color: #409eff;" icon="ios-hammer-outline"
                        @click="handlerSysUpdate(tableData[0],'post', '升级记录')">升级记录
                </Button>
                <Button type="text" size="small" style="marginRight: 2px; color: #409eff;" icon="ios-create-outline"
                        @click="handlerSys(tableData[0],'put', '编辑')">编辑
                </Button>
                <Button type="text" size="small" style="marginRight: 2px; color: #ed4014;" icon="ios-trash-outline"
                        @click="handlerDeleteSys(tableData[0])"> 删除
                </Button>
              </div>
            </FormItem>
          </Form>
        </Card>
        <Card :bordered="false" dis-hover style="margin-top: 5px">
          <Tabs>
            <TabPane label="系统组件列表" icon="md-apps">
              <!--<p slot="title">系统组件列表</p>-->
              <tables ref="selection1"
                      v-model="tableData1"
                      :columns="columns1"
                      height="400"
              >
              </tables>
            </TabPane>
            <TabPane label="系统URL地址" icon="ios-list">
              <tables ref="selection2"
                      v-model="tableData5"
                      :columns="columns6"
                      height="400"
              >
              </tables>
            </TabPane>
            <TabPane label="系统升级历史" icon="md-list">
              <!--<p slot="title">系统升级历史</p>-->
              <!--<p slot="extra" style="font-size: 12px;">-->
              <!--<span class="search-con search-con-top">-->
              <!--<Select v-model="searchSysValue" class="search-col" size="small" clearable placeholder="系统名称">-->
              <!--<Option v-for="item in sysNameList" :value="item.id" :key="item.id">{{ item.sys_name }}</Option>-->
              <!--</Select>-->
              <!--<Button @click="handleSearchSysUpgrade" type="primary" size="small">搜索</Button>-->
              <!--</span>-->
              <!--</p>-->
              <tables ref="selection2"
                      v-model="tableData2"
                      :columns="columns2"
                      height="400"
              >
              </tables>
            </TabPane>
          </Tabs>
        </Card>
        <!--<Card :bordered="false" style="margin-top: 5px">-->
        <!--<p slot="title">系统组件列表</p>-->
        <!--<tables ref="selection1"-->
        <!--v-model="tableData1"-->
        <!--:columns="columns1"-->
        <!--height="300"-->
        <!--&gt;-->
        <!--</tables>-->
        <!--</Card>-->
        <!--<Card :bordered="false" style="margin-top: 5px">-->
        <!--<p slot="title">系统升级历史</p>-->
        <!--<p slot="extra" style="font-size: 12px;">-->
        <!--<span class="search-con search-con-top">-->
        <!--<Select v-model="searchSysValue" class="search-col" size="small" clearable placeholder="系统名称">-->
        <!--<Option v-for="item in sysNameList" :value="item.id" :key="item.id">{{ item.sys_name }}</Option>-->
        <!--</Select>-->
        <!--<Button @click="handleSearchSysUpgrade" type="primary" size="small">搜索</Button>-->
        <!--</span>-->
        <!--</p>-->
        <!--<tables ref="selection2"-->
        <!--v-model="tableData2"-->
        <!--:columns="columns2"-->
        <!--height="400"-->
        <!--&gt;-->
        <!--</tables>-->
        <!--</Card>-->
      </Col>
    </Row>

    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true width="1000"
           :mask-closable=false :styles="{top: '0px'}">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" inline label-colon=":">
        <FormItem style="width: 970px;">
          <Card>
            <p slot="title">基本信息</p>
            <FormItem label="系统名称" prop="sys_name" style="width: 48%; margin-right: 20px; margin-bottom: 10px;">
              <Input v-model="formValidate.sys_name" :maxlength="50" placeholder="请填写系统名称"></Input>
            </FormItem>
            <FormItem label="版本号" prop="sys_version" style="width: 210px; margin-right: 20px; margin-bottom: 10px;">
              <Input v-model="formValidate.sys_version" :maxlength="50" placeholder="请填写版本号"></Input>
            </FormItem>
            <FormItem label="上线时间" prop="online_time" style="width: 210px; margin-bottom: 10px;">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                          :value="formValidate.online_time" @on-change="formValidate.online_time=$event"
                          placeholder="请填写上线时间"></DatePicker>
            </FormItem>
            <FormItem label="开发单位" prop="development" style="width: 48%; margin-right: 20px;margin-bottom: 10px;">
              <Input v-model="formValidate.development" :maxlength="50" placeholder="请填写开发单位"></Input>
            </FormItem>
            <FormItem label="开发单位联系人" prop="development_contact"
                      style="width: 210px; margin-right: 20px; margin-bottom: 10px;">
              <Input v-model="formValidate.development_contact" :maxlength="50" placeholder="请填写开发单位联系人"></Input>
            </FormItem>
            <FormItem label="开发单位联系电话" prop="development_phone" style="width: 210px; margin-bottom: 10px;">
              <Input v-model="formValidate.development_phone" :maxlength="50" placeholder="请填写开发单位联系电话"></Input>
            </FormItem>
            <FormItem label="系统简介" prop="sys_info" style="width: 930px;height: 150px;margin-right: 20px;">
              <i-input type="textarea" v-model="formValidate.sys_info" placeholder="请填写系统简介"
                       :rows="5">
              </i-input>
            </FormItem>
            <FormItem label="上传附件" prop="sys_report" style="width:100%; margin-top: 20px;margin-bottom: -10px">
              <div class="upload-list" v-for="item in formValidate.uploadList">
                <template v-if="item.status === 'finished'">
                  <img :src="item.response.url" v-if="item.isShow">
                  <span v-else>{{item.name}}</span>
                  <div class="upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.response.url)"
                          v-if="item.isShow"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="upload"
                v-model="formValidate.sys_report"
                :show-upload-list="false"
                :default-file-list="formValidate.uploadList"
                :before-upload="handleBeforeUpload"
                type="drag"
                :action=UploadUrl
                :max-size="5 * 1024"
                :on-exceeded-size="handleMaxSize"
                :format="['jpg','jpeg','png','md','pptx','ppt','docx','doc','pdf']"
                :on-format-error="handleFormatError"
                :on-success="handleSuccess"
                style="display: inline-block;width:60px;"
              >
                <div style="width: 60px;height:60px;line-height: 60px;">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </FormItem>
          </Card>
          <Card style="margin-top: 10px">
            <p slot="title">负责人列表</p>
            <tables ref="selection4"
                    v-model="formValidate.sys_manager_list"
                    :columns="columns4"
            >
            </tables>
            <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed ivu-btn-long"
                    @click="addSysMgTr()">
              <i class="ivu-icon ivu-icon-md-add"></i> <span>新增</span>
            </button>
          </Card>
          <Card style="margin-top: 10px">
            <p slot="title">组件列表</p>
            <tables ref="selection3"
                    v-model="formValidate.soft_list"
                    :columns="columns3"
            >
            </tables>
            <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed ivu-btn-long"
                    @click="addSoftTr()">
              <i class="ivu-icon ivu-icon-md-add"></i> <span>新增</span>
            </button>
          </Card>
          <Card style="margin-top: 10px">
            <p slot="title">系统URL列表</p>
            <tables ref="selection5"
                    v-model="formValidate.sys_url_list"
                    :columns="columns5"
            >
            </tables>
            <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed ivu-btn-long"
                    @click="addURLTr()">
              <i class="ivu-icon ivu-icon-md-add"></i> <span>新增</span>
            </button>
          </Card>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitSys('formValidate')" :disabled="isDisable">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="modalMap2.modalVisible" :title="modalMap2.modalTitle" :loading=true :footer-hide=true width="540"
           :mask-closable=false>
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="140">
        <!--<alert>温馨提示：xxx</alert>-->
        <FormItem label="系统名称" prop="sys_name" style="margin-right:30px">
          <div v-if="formValidate2.id">
            <Input v-model="formValidate2.sys_name" :maxlength="50" disabled placeholder='请输入系统名称'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate2.sys_name" :maxlength="50" placeholder='请输入系统名称'></Input>
          </div>
        </FormItem>
        <FormItem label="版本号" prop="sys_version" style="margin-right:30px">
          <Input v-model="formValidate2.sys_version" :maxlength="50" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="升级内容" prop="up_content" style="margin-right:30px">
          <i-input type="textarea" v-model="formValidate2.up_content" placeholder="请输入升级内容"
                   :rows="4">
          </i-input>
        </FormItem>
        <FormItem label="升级开始时间" prop="up_stime">
          <DatePicker type="datetime" :value="formValidate2.up_stime" @on-change="formValidate2.up_stime=$event"
                      placeholder="请输入升级开始时间"></DatePicker>
        </FormItem>
        <FormItem label="升级结束时间" prop="up_etime">
          <DatePicker type="datetime" :value="formValidate2.up_etime" @on-change="formValidate2.up_etime=$event"
                      placeholder="请输入升级开始时间"></DatePicker>
        </FormItem>
        <FormItem label="下发时间" prop="issued_time">
          <DatePicker type="datetime" :value="formValidate2.issued_time" @on-change="formValidate2.issued_time=$event"
                      placeholder="请输入升级开始时间"></DatePicker>
        </FormItem>
        <FormItem label="升级实际完成时间" prop="up_real_time">
          <DatePicker type="datetime" :value="formValidate2.up_real_time" @on-change="formValidate2.up_real_time=$event"
                      placeholder="请输入升级开始时间"></DatePicker>
        </FormItem>
        <FormItem label="是否试点" prop="isPilot">
          <RadioGroup v-model="formValidate2.isPilot">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="试点单位" prop="pilot_unit" v-if="formValidate2.isPilot === '是'">
          <Input v-model="formValidate2.pilot_unit" :maxlength="50" placeholder="请输入试点单位"></Input>
        </FormItem>
        <FormItem label="是否影响业务" prop="isAffect">
          <RadioGroup v-model="formValidate2.isAffect">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitSysUpdate('formValidate2')" :disabled="isDisable">提交</Button>
          <Button @click="handleReset('formValidate2')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>

    <Modal title="View Image" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%">
    </Modal>

    <Modal v-model="modalTable.tableVisible" :loading=true :footer-hide=true :title="modalTable.tableTitle">
      <div style="padding: 10px; text-align:center;">
        <tables ref="tables1"
                v-model="tableDetail"
                :columns="columnsUpDetail"
                :show-header="false"
                v-if="isUpDetail"
        >
        </tables>
        <tables ref="tables1"
                v-model="tableDetail"
                :columns="columnsDetail"
                :show-header="false"
                v-else
        >
        </tables>
      </div>
    </Modal>

  </div>
</template>
<script>
  import Icons from '_c/icons'
  import Tables from '_c/tables'
  import FormGroup from '_c/form-group'
  import {
    operationSys,
    getSysList,
    operationSysUpdate,
    getSysUpdateList,
    UploadUrl,
    getTagtree,
    getHostIpList
  } from '@/api/cmdb/sys.js'

  import {getSoftList, getSoftTpye} from '@/api/cmdb/software.js'

  export default {
    components: {
      Icons,
      Tables,
      FormGroup
    },
    data() {
      return {
        tagTreeData: [],
        isDisable: false,
        UploadUrl: '',
        // 分页
        ruleLoading: false,
        ruleModal: false,
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        searchVal: '',
        modalMap: {
          modalVisible: false,
          modalTitle: '添加系统'
        },
        modalMap2: {
          modalVisible: false,
          modalTitle: '添加升级记录'
        },
        editModalData: null,
        searchKey: '',
        searchValue: '',

        tableData: [{
          id: null,
          sys_name: '',
          sys_version: '',
          online_time: '',
          development: '',
          development_contact: '',
          development_phone: '',
          sys_info: '',
          soft_list: [],
          sys_manager_list: [],
          sys_report: '',
          uploadList: [],
          sys_docx_list: [],
          sys_url_list: []
        }],
        tableSelectIdList: [],
        formValidate: {
          id: null,
          sys_name: '',
          sys_version: '',
          online_time: '',
          development: '',
          development_contact: '',
          development_phone: '',
          sys_info: '',
          soft_list: [],
          sys_manager_list: [],
          sys_report: '',
          uploadList: [],
          sys_docx_list: [],
          sys_url_list: []
        },

        ruleValidate: {
          sys_name: [{required: true, message: '系统名称不能为空', trigger: 'blur'}],
          online_time: [{required: true, message: '请填写上线时间', trigger: 'blur'}]
        },

        // columns: [
        //   // {type: 'selection', key: 'id', width: 80, align: 'center'},
        //   // {title: '编号', key: 'id', align: 'center',},
        //   {title: '系统名称', key: 'sys_name', align: 'center'},
        //   {title: '版本号', key: 'sys_version', align: 'center'},
        //   {title: '上线时间', key: 'online_time', width: 100, align: 'center'},
        //   {title: '开发单位', key: 'development', align: 'center'},
        //   {title: '开发单位联系人', key: 'development_contact', align: 'center'},
        //   {title: '开发单位联系电话', key: 'development_phone', align: 'center'},
        //   {
        //     title: '系统负责人',
        //     key: 'sys_manager_list',
        //     align: 'center',
        //     render: (h, params) => {
        //       return h('a', {
        //           on: {
        //             click: () => {
        //               this.handleDetail(params.row.sys_manager_list)
        //             }
        //           }
        //         }, '查看信息'
        //       )
        //     }
        //   },
        //   {
        //     title: '文档',
        //     key: 'sys_docx_list',
        //     align: 'center',
        //     render: (h, params) => {
        //       return h('a', {
        //           on: {
        //             click: () => {
        //               this.handleDocxDetail(params.row.sys_docx_list)
        //             }
        //           }
        //         }, '查看文档'
        //       )
        //     }
        //   },
        //   {
        //     title: '附件',
        //     key: 'uploadList',
        //     align: 'center',
        //     render: (h, params) => {
        //       return h('a', {
        //           on: {
        //             click: () => {
        //               this.handleUpDetail(params.row.uploadList)
        //             }
        //           }
        //         }, '查看附件'
        //       )
        //     }
        //   },
        //   {
        //     title: '操作',
        //     key: 'handle',
        //     width: 185,
        //     align: 'center',
        //     render: (h, params) => {
        //       return h('div', [
        //         h('Button',
        //           {
        //             props: {
        //               type: 'success',
        //               size: 'small'
        //             },
        //             style: {
        //               marginRight: '2px'
        //             },
        //             on: {
        //               click: () => {
        //                 this.handlerSysUpdate(params.row, 'post', '升级记录')
        //               }
        //             }
        //           }, '升级'
        //         ),
        //         h('Button',
        //           {
        //             props: {
        //               type: 'info',
        //               size: 'small'
        //             },
        //             style: {
        //               marginRight: '2px'
        //             },
        //             on: {
        //               click: () => {
        //                 this.handlerSys(params.row, 'put', '编辑')
        //               }
        //             }
        //           }, '编辑'
        //         ),
        //         h(
        //           'Button',
        //           {
        //             props: {
        //               type: 'error',
        //               size: 'small'
        //             },
        //             on: {
        //               click: () => {
        //                 this.handlerDeleteSys(params)
        //               }
        //             }
        //           }, '删除'
        //         )
        //       ])
        //     }
        //   }
        // ],

        // 涉及的应用列表
        tableData1: [],
        columns1: [
          {title: '类型', key: 'soft_type', align: 'center'},
          {title: '软件名称', key: 'soft_name', align: 'center'},
          {title: '版本号', key: 'soft_version', align: 'center'},
          {title: 'IP', key: 'soft_ip', align: 'center'},
          {title: '主机名', key: 'soft_hostname', align: 'center'},
          {title: '用途', key: 'soft_usage', align: 'center'}
          // {title: '操作', key: 'handle1', width: 80, align: 'center'}
        ],

        soft_type: {
          1: '操作系统',
          2: '虚拟化',
          3: '数据库',
          4: '服务',
          5: '中间件',
          6: '应用服务',
          7: 'Web服务',
          8: '其他'
        },
        soft_list: [],

        optionsList: [
          {id: '127.0.0.1', host: 'localhost'}
        ],
        autoComplete: [],
        columns3: [
          {
            title: '软件名称',
            key: 'soft_name',
            minwidth: 160,
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                // console.log(params.row.soft_type_name)
                return h('Cascader',
                  {
                    props: {
                      data: this.soft_list,
                      trigger: 'hover',
                      filterable: true,
                      transfer: true,
                      value: params.row.soft_type_name
                    },
                    style: {
                      width: '100%'
                    },
                    on: {
                      'on-change': val => {
                        this.formValidate.soft_list[params.index].soft_type_name = val
                      }
                    }
                  })
              } else {
                return h('span', params.row.soft_name)
              }
            }
          },
          {
            title: '版本号',
            key: 'soft_version',
            width: 80,
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '版本号',
                      value: params.row.soft_version,
                      clearable: true
                    },
                    style: {
                      width: '100%'
                    },
                    on: {
                      input: val => {
                        this.formValidate.soft_list[params.index].soft_version = val
                      }
                    }
                  })
              } else {
                return h('span', params.row.soft_version)
              }
            }
          },
          {
            title: 'IP',
            key: 'soft_ip',
            miniwidth: 130,
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('AutoComplete', {
                  props: {
                    data: this.autoComplete,
                    value: this.formValidate.soft_list[params.index].soft_ip,
                    clearable: true,
                    transfer: true,
                    placement: 'top-start'
                  },
                  style: {
                    width: '100%'
                  },
                  on: {
                    'on-search': val => {
                      this.autoComplete = []
                      let soft_hostname = ''
                      for (let i in this.optionsList) {
                        let obj = this.optionsList[i]
                        if (obj.ip.indexOf(val) > -1) {
                          this.autoComplete.push(obj.ip)
                          soft_hostname = obj.host
                        }
                      }
                      this.formValidate.soft_list[params.index].soft_ip = val
                      this.formValidate.soft_list[params.index].soft_hostname = soft_hostname
                    }
                  }
                })
              } else {
                return h('span', params.row.soft_ip)
              }
            }
          },
          {
            title: '主机名',
            key: 'soft_hostname',
            align: 'center',
            miniwidth: 120,
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '主机名',
                      value: params.row.soft_hostname,
                      clearable: true
                    },
                    style: {
                      width: '100%'
                    },
                    on: {
                      input: val => {
                        this.formValidate.soft_list[params.index].soft_hostname = val
                      }
                    }
                  })
              } else {
                return h('span', params.row.soft_hostname)
              }
            }
          },
          {
            title: '用途',
            key: 'soft_usage',
            align: 'center',
            miniwidth: 120,
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '用途',
                      value: params.row.soft_usage,
                      clearable: true
                    },
                    style: {
                      width: '100%'
                    },
                    on: {
                      input: val => {
                        this.formValidate.soft_list[params.index].soft_usage = val
                      }
                    }
                  })
              } else {
                return h('span', params.row.soft_usage)
              }
            }
          },
          {
            title: '操作',
            key: 'handle1',
            width: 100,
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'text',
                        size: 'small',
                        icon: 'ios-trash-outline',
                      },
                      style: {
                        color: '#ed4014'
                      },
                      on: {
                        click: () => {
                          this.formValidate.soft_list.splice(params.index, 1)
                        }
                      }
                    },
                    '删除'
                  )
                ])
              }
            }
          }
        ],

        columns4: [
          {
            title: '系统负责人',
            key: 'sys_manager_name',
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '系统负责人',
                      value: params.row.sys_manager_name,
                      clearable: true
                    },
                    style: {
                      width: '120px'
                    },
                    on: {
                      input: val => {
                        this.formValidate.sys_manager_list[params.index].sys_manager_name = val
                      }
                    }
                  })
              } else {
                return h('span', params.row.sys_manager_name)
              }
            }
          },
          {
            title: '角色',
            key: 'sys_manager_role',
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '角色',
                      value: params.row.sys_manager_role,
                      clearable: true
                    },
                    style: {
                      width: '120px'
                    },
                    on: {
                      input: val => {
                        this.formValidate.sys_manager_list[params.index].sys_manager_role = val
                      }
                    }
                  })
              } else {
                return h('span', params.row.sys_manager_role)
              }
            }
          },
          {
            title: '系统负责人电话',
            key: 'sys_manager_phone',
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '系统负责人电话',
                      value: params.row.sys_manager_phone,
                      clearable: true
                    },
                    style: {
                      width: '120px'
                    },
                    on: {
                      input: val => {
                        this.formValidate.sys_manager_list[params.index].sys_manager_phone = val
                      }
                    }
                  })
              } else {
                return h('span', params.row.sys_manager_phone)
              }
            }
          },
          {
            title: '操作',
            key: 'sysmg_handle',
            width: 100,
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'text',
                        size: 'small',
                        icon: 'ios-trash-outline',
                      },
                      style: {
                        color: '#ed4014'
                      },
                      on: {
                        click: () => {
                          this.formValidate.sys_manager_list.splice(params.index, 1)
                        }
                      }
                    },
                    '删除'
                  )
                ])
              }
            }
          }
        ],

        columns5: [
          {
            title: '名称',
            key: 'sys_url_na',
            align: 'center',
            width: 300,
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '名称',
                      value: params.row.sys_url_na,
                      clearable: true
                    },
                    style: {
                      width: '100%'
                    },
                    on: {
                      input: val => {
                        this.formValidate.sys_url_list[params.index].sys_url_na = val
                      }
                    }
                  })
              } else {
                return h('span', params.row.sys_url_na)
              }
            }
          },
          {
            title: '地址',
            key: 'sys_url',
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '地址',
                      value: params.row.sys_url,
                      clearable: true
                    },
                    style: {
                      width: '100%'
                    },
                    on: {
                      input: val => {
                        this.formValidate.sys_url_list[params.index].sys_url = val
                      }
                    }
                  })
              } else {
                return h('span', params.row.sys_url)
              }
            }
          },
          {
            title: '操作',
            key: 'sysmg_handle',
            width: 80,
            align: 'center',
            render: (h, params) => {
              if (this.formValidate._editing) {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.formValidate.sys_url_list.splice(params.index, 1)
                        }
                      }
                    },
                    '删除'
                  )
                ])
              }
            }
          }
        ],
        columns6: [
          {title: '名称', key: 'sys_url_na', align: 'center', width: 300},
          {title: '地址', key: 'sys_url', align: 'center'}
          // {title: '操作', key: 'handle1', width: 80, align: 'center'}
        ],
        tableData5: [],

        // 升级记录
        formValidate2: {
          id: null,
          sys_name: '',
          sys_version: '',
          up_content: '',
          up_stime: '',
          up_etime: '',
          issued_time: '',
          isPilot: '',
          pilot_unit: '',
          up_real_time: '',
          isAffect: ''
        },

        ruleValidate2: {
          sys_name: [{required: true, message: '系统名称不能为空', trigger: 'blur'}],
          sys_version: [{required: true, message: '版本号不能为空', trigger: 'blur'}],
          up_content: [{required: true, message: '升级内容不能为空', trigger: 'blur'}]
        },

        sysNameList: [],
        searchSysValue: '',
        tableData2: [],
        columns2: [
          {title: '系统名称', key: 'sys_name', minWidth: 100, align: 'center'},
          {title: '版本号', key: 'sys_version', width: 80, align: 'center'},
          {
            title: '升级内容',
            key: 'up_content',
            minWidth: 100,
            align: 'center',
            render: (h, params) => {
              const roleTitle = params.row.up_content
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
          {title: '开始时间', key: 'up_stime', width: 100, align: 'center'},
          {title: '结束时间', key: 'up_etime', width: 100, align: 'center'},
          {title: '下发时间', key: 'issued_time', width: 100, align: 'center'},
          {title: '实际完成时间', key: 'up_real_time', width: 110, align: 'center'},
          {title: '是否试点', key: 'isPilot', width: 60, align: 'center'},
          {title: '试点单位', key: 'pilot_unit', minWidth: 100, align: 'center'},
          {title: '是否影响业务', key: 'isAffect', width: 80, align: 'center'},
          {
            title: '操作',
            key: 'handle2',
            width: 80,
            align: 'center',
            render: (h, params) => {
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
                        this.handlerSysUpdate(params.row, 'put', '编辑')
                      }
                    }
                  }, '编辑'
                )
              ])
            }
          }
        ],
        imgUrl: '',
        visible: false,
        uploadList: [],
        modalTable: {
          tableVisible: false,
          tableTitle: ''
        },
        isUpDetail: true,
        tableDetail: [],
        columnsDetail: [
          {title: '负责人名称', key: 'sys_manager_name', align: 'center'},
          {title: '角色', key: 'sys_manager_role', align: 'center'},
          {title: '电话', key: 'sys_manager_phone', align: 'center'}
        ],
        columnsUpDetail: [
          {
            title: '名称',
            key: 'name',
            align: 'center',
            render: (h, params) => {
              return h('a', {
                  on: {
                    click: () => {
                      this.openUrl(params.row.url)
                    }
                  }
                }, params.row.name
              )
            }
          }
        ]
      }
    },
    methods: {
      // 获取TagTree
      getTagTree(key) {
        getTagtree(key).then(res => {
          if (res.data.code === 0) {
            this.tagTreeData = res.data.data
            this.sysNameList = []
            let tags = this.tagTreeData[0].children
            for (let i in tags) {
              let obj = {}
              obj.id = tags[i].sys_id
              obj.sys_name = tags[i].tag_name
              this.sysNameList.push(obj)
            }
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 点击节点
      handlerTreeChange(obj) {
        if (obj.length !== 0) {
          const data = obj[0]
          this.getSysList('id', data.sys_id)
          this.getSysUpdateList('sys_id', data.sys_id)
          this.searchSysValue = data.sys_id
        }
      },
      openUrl(url) {
        window.open(url)
      },
      handleUpDetail(upload_list) {
        this.isUpDetail = true
        this.modalTable.tableVisible = true
        this.modalTable.tableTitle = '查看附件'
        this.tableDetail = upload_list
      },
      handleDocxDetail(sys_docx_list) {
        this.isUpDetail = true
        this.modalTable.tableVisible = true
        this.modalTable.tableTitle = '查看文档'
        this.tableDetail = sys_docx_list
      },
      handleDetail(sys_mg_list) {
        this.isUpDetail = false
        this.modalTable.tableVisible = true
        this.modalTable.tableTitle = '查看系统负责人'
        this.tableDetail = sys_mg_list
      },
      handleView(url) {
        this.imgUrl = url
        this.visible = true
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
        this.formValidate.uploadList = this.$refs.upload.fileList
      },
      handleBeforeUpload(file) {
        this.file = file
        this.formValidate.sys_report = this.file.name
        const check = this.uploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: '最多上传5个'
          })
        }
        return check
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '文件大小超限',
          desc: '文件  ' + file.name + ' 太大，上传文件大小不能超过5M.'
        })
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件:' + file.name + ' 格式不正确，请选择：jpg,jpeg,png,md,pptx,ppt,docx,doc,pdf等格式类型 '
        })
      },
      handleSuccess(res, file) {
        if (res.code === 0) {
          file.url = file.response.url
          file.isShow = false
          const na_ty = file.name.split('.')
          const ty = na_ty[na_ty.length - 1]
          const ty_li = ['jpg', 'jpeg', 'png']
          for (var i = 0; i < ty_li.length; i++) {
            if (ty === ty_li[i]) {
              file.isShow = true
            }
          }
          this.formValidate.uploadList = this.$refs.upload.fileList
          this.$Message.success(`${res.msg}`)
        } else {
          this.$Message.error(`${res.msg}`)
        }
      },
      getSoftTpye() {
        getSoftTpye().then(res => {
          if (res.data.code === 0) {
            this.soft_type = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取软件列表
      getSoftList(key, value) {
        getSoftList(this.pageNum, 999, key, value).then(res => {
          if (res.data.code === 0) {
            const sl = []
            for (var ty = 1; ty <= 8; ty++) {
              const soft_obj = {
                value: ty,
                label: this.soft_type[ty],
                children: []
              }

              for (var i = 0; i < res.data.data[ty].length; i++) {
                const child = {
                  value: res.data.data[ty][i].soft_name,
                  label: res.data.data[ty][i].soft_name
                }
                soft_obj.children.push(child)
              }
              sl.push(soft_obj)
            }
            this.soft_list = sl
            // console.log(res.data.data)
            // console.log(sl)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取系统列表
      getSysList(key, value) {
        getSysList(this.pageNum, 999, key, value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.tableData = res.data.data
            // this.tableData1 = []
            // this.tableData2 = []
            if (!value) {
              this.sysNameList = []
              for (var i = 0; i < this.tableData.length; i++) {
                let obj = {}
                obj.id = this.tableData[i].id
                obj.sys_name = this.tableData[i].sys_name
                this.sysNameList.push(obj)
              }
            }
            if (key === 'id') {
              for (let i in this.tableData) {
                if (this.tableData[i].id === value) {
                  this.tableData1 = this.tableData[i].soft_list
                  this.tableData5 = this.tableData[i].sys_url_list
                  break
                } else {
                  this.tableData1 = []
                  this.tableData5 = []
                }
              }
            }
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取主机列表
      getHostIpList(key, value) {
        getHostIpList(this.pageNum, 999, key, value).then(res => {
          if (res.data.code === 0) {
            this.optionsList = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取升级历史列表
      getSysUpdateList(key, value) {
        getSysUpdateList(this.pageNum, 999, key, value).then(res => {
          if (res.data.code === 0) {
            this.tableData2 = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 增加一行应用软件
      addSoftTr() {
        const add_obj = {
          soft_type_name: [],
          soft_version: '',
          soft_ip: '',
          soft_hostname: '',
          soft_usage: ''
        }
        this.formValidate._editing = true
        this.formValidate.soft_list.push(add_obj)
      },
      // 增加一行系统URL
      addURLTr() {
        const add_obj = {
          sys_url: '',
          sys_url_na: ''
        }
        this.formValidate._editing = true
        this.formValidate.sys_url_list.push(add_obj)
      },
      // 增加一行系统联系人
      addSysMgTr() {
        const add_obj = {
          sys_manager_name: '',
          sys_manager_role: '',
          sys_manager_phone: ''
        }
        this.formValidate._editing = true
        this.formValidate.sys_manager_list.push(add_obj)
      },
      // 添加系统
      handlerSys(paramsRow, meth, mtitle) {
        this.$refs.upload.clearFiles()
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        this.getSoftList()
        if (paramsRow && paramsRow.id) {
          this.$refs.upload.fileList = paramsRow.uploadList
          this.formValidate = {
            id: paramsRow.id,
            sys_name: paramsRow.sys_name,
            sys_version: paramsRow.sys_version,
            online_time: paramsRow.online_time,
            development: paramsRow.development,
            development_contact: paramsRow.development_contact,
            development_phone: paramsRow.development_phone,
            sys_info: paramsRow.sys_info,
            soft_list: paramsRow.soft_list,
            sys_manager_list: paramsRow.sys_manager_list,
            sys_url_list: paramsRow.sys_url_list,
            uploadList: paramsRow.uploadList,
            _editing: true
          }
        } else {
          this.formValidate = {
            id: null,
            sys_name: '',
            sys_version: '',
            online_time: '',
            development: '',
            development_contact: '',
            development_phone: '',
            sys_info: '',
            soft_list: [],
            sys_manager_list: [],
            sys_url_list: [],
            uploadList: []
          }
        }
      },
      // 添加升级记录
      handlerSysUpdate(paramsRow, meth, mtitle) {
        this.modalMap2.modalVisible = true
        this.modalMap2.modalTitle = mtitle
        this.editModalData = meth
        if (paramsRow && paramsRow.id) {
          if (meth === 'post') {
            this.formValidate2 = {
              id: paramsRow.id,
              sys_name: paramsRow.sys_name,
              sys_version: paramsRow.sys_version,
              isPilot: '否',
              isAffect: '否'
            }
          } else {
            this.formValidate2 = {
              id: paramsRow.id,
              sys_name: paramsRow.sys_name,
              sys_version: paramsRow.sys_version,
              up_content: paramsRow.up_content,
              up_stime: paramsRow.up_stime,
              up_etime: paramsRow.up_etime,
              issued_time: paramsRow.issued_time,
              isPilot: paramsRow.isPilot,
              pilot_unit: paramsRow.pilot_unit,
              up_real_time: paramsRow.up_real_time,
              isAffect: paramsRow.isAffect
            }
          }
        } else {
          this.formValidate2 = {
            id: null,
            sys_name: '',
            sys_version: '',
            up_content: '',
            up_stime: '',
            up_etime: '',
            issued_time: '',
            isPilot: '',
            pilot_unit: '',
            up_real_time: '',
            isAffect: ''
          }
        }
      },
      // showList(data) {
      //   // console.log(data)
      //   this.tableData1 = data.soft_list
      //   this.getSysUpdateList('sys_id', data.id)
      //   this.searchSysValue = data.id
      // },
      //
      handleSubmitSys(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            this.isDisable = true
            setTimeout(() => {
              operationSys(this.formValidate, this.editModalData).then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`)
                    if (this.formValidate.id) {
                      this.getSysList('id', this.formValidate.id)
                    } else {
                      this.getTagTree()
                    }
                    this.tableData1 = this.formValidate.soft_list
                    this.modalMap.modalVisible = false
                  } else {
                    this.$Message.error(`${res.data.msg}`)
                  }
                }
              )
              this.isDisable = false
            }, 500)
          } else {
            this.$Message.error('表单校验错误')
          }
        })
      },

      handleSubmitSysUpdate(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            this.isDisable = true
            setTimeout(() => {
              operationSysUpdate(this.formValidate2, this.editModalData).then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`)
                    this.getSysList()
                    this.getSysUpdateList('sys_id', this.searchSysValue)
                    this.modalMap2.modalVisible = false
                  } else {
                    this.$Message.error(`${res.data.msg}`)
                  }
                }
              )
              this.isDisable = false
            }, 500)
          } else {
            this.$Message.error('表单校验错误')
          }
        })
      },

      handlerDeleteSys(params) {
        if (confirm('确定要删除吗')) {
          operationSys({id: params.id}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getTagTree()
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
        }
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      handlerCheck() {
        this.$Message.error('待完善')
      },
      handleClear(e) {
        if (e.target.value === '') this.tableData = this.value
      },
      handleSearch() {
        this.getSysList(this.searchKey, this.searchValue)
      }
      // handleSearchSysUpgrade() {
      //   this.getSysUpdateList('sys_id', this.searchSysValue)
      // }
    },
    watch: {},
    created() {
      // this.searchSysValue =
      // this.handleSelect(this.checkData.env)
    },
    mounted() {
      this.getTagTree()
      // this.getSysList();
      this.getSoftList()
      this.getHostIpList()
      this.UploadUrl = UploadUrl
      this.uploadList = this.$refs.upload.fileList
    }
  }
</script>
<style lang="less" scoped>
  .search-con {
    padding: 10px 0;

    .search {
      &-col {
        display: inline-block;
        width: 160px;
      }

      &-input {
        display: inline-block;
        width: 250px;
        margin-left: 1px;
      }

      &-input-long {
        display: inline-block;
        width: 480px;
        margin-left: 1px;
      }

      &-btn {
        margin-left: 2px;
      }
    }
  }

  .upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    /*border: 1px solid transparent;*/
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .upload-list img {
    width: 100%;
    height: 100%;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .upload-list:hover .upload-list-cover {
    display: block;
  }

  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
