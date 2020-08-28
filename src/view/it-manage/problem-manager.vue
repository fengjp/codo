<template>
  <div>
    <Card>
      <Form :model="formValidate2" autocomplete="off" class="case-form" label-colon=":" ref="formValidate2">
        <!--<a @click="changeShow()" v-text="btnText"></a>-->
<!--        <a @click="changeShow()" class="ivu-ml-8" style="font-size: 14px;" v-if="isShow">-->
<!--          收起-->
<!--          <Icon type="ios-arrow-up"/>-->
<!--        </a>-->
<!--        <a @click="changeShow()" class="ivu-ml-8" style="font-size: 14px;" v-else>-->
<!--          展开-->
<!--          <Icon type="ios-arrow-down"/>-->
<!--        </a>-->
        <Row :gutter="1" justify="start" style="margin-top: -10px;margin-bottom: -25px"
             type="flex">
          <Col span="6">
            <FormItem :label-width="100" label="个案" prop="case_name">
              <Input
                placeholder="请输入个案名称"
                v-model="formValidate2.case_name"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem :label-width="100" label="类型" prop="case_type">
              <Select v-model="formValidate2.case_type">
                <Option :key="item.k" :value="item.v" v-for="item in allTypeList">{{item.v}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem :label-width="100" label="状态" prop="case_status">
              <Select v-model="formValidate2.case_status">
                <Option :key="item.k" :value="item.v" v-for="item in allstatusList">{{item.v}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" v-show="isShow">
            <FormItem :label-width="100" label="项目" prop="case_obj">
              <Select placeholder="项目" v-model="formValidate2.case_obj">
                <Option :key="item.k" :value="item.v" v-for="item in allobjecList">{{item.v}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" style="text-align: right; margin-bottom: 5px" v-show ="!isShow">
            <a @click="changeShow()" class="ivu-ml-8" style="font-size: 14px;" v-if="isShow">
              收起
              <Icon type="ios-arrow-up"/>
            </a>
            <a @click="changeShow()" class="ivu-ml-8" style="font-size: 14px;" v-else>
              展开
              <Icon type="ios-arrow-down"/>
            </a>&nbsp;&nbsp;&nbsp;
            <Button
              @click="handleSearch" class="case-btn"
              type="info"
            >搜索
            </Button>
            <Button
              @click="handleReset('formValidate2')" class="case-btn"
            >重置
            </Button>
          </Col>
        </Row>
        <Row :gutter="1" style="margin-top: 23px" v-show="isShow">
          <Col span="6">
            <FormItem :label-width="100" label="优先级" prop="case_priority">
              <Select placeholder="优先级" v-model="formValidate2.case_priority">
                <Option :key="item.k" :value="item.v" v-for="item in allpriorityList">{{item.v}}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem :label-width="100" label="来源" prop="case_source">
              <Select placeholder="来源" v-model="formValidate2.case_source">
                <Option :key="item.k" :value="item.v" v-for="item in allsourceList">{{item.v}}</Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="6">
            <FormItem :label-width="100" label="需求单位" prop="demand_unit">
              <Input
                placeholder="需求单位"
                v-model="formValidate2.demand_unit"
              ></Input>
            </FormItem>
          </Col>

          <Col span="6">
            <FormItem :label-width="100" label="需求人" prop="demander">
              <Input
                placeholder="需求人"
                v-model="formValidate2.demander"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="1" style="margin-bottom: -25px" v-show="isShow">
          <Col span="6">
            <FormItem :label-width="100" label="详情描述" prop="case_details">
              <Input
                placeholder="详细描述"
                v-model="formValidate2.case_details"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem :label-width="100" label="处理人" prop="case_executor">
              <Input
                :disabled="isDisable2"
                placeholder="处理人"
                v-model="formValidate2.case_executor"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem :label-width="100" label="开始结束时间" prop="case_stime" style="width: 100%">
              <Row>
<!--                <DatePicker-->
<!--                  :options="optionsDate"-->
<!--                  :value="formValidate2.case_stime" @on-change="formValidate2.case_stime=$event"-->
<!--                  format="yyyy-MM-dd" placeholder="创建开始时间"-->
<!--                  style="width: 46%"-->
<!--                  type="datetime">-->
<!--                </DatePicker>&nbsp;-&nbsp;-->
<!--                <DatePicker-->
<!--                  :options="optionsDate"-->
<!--                  :value="formValidate2.case_etime" @on-change="formValidate2.case_etime=$event"-->
<!--                  format="yyyy-MM-dd" placeholder="创建结束时间"-->
<!--                  style="width: 46%"-->
<!--                  type="datetime">-->

<!--                </DatePicker>-->
                <DatePicker :options="options2" :value="todate2" @on-change="todate2=$event"
                      confirm placeholder="请选择开始与结束日期"
                      placement="bottom-end"
                      type="daterange">
                </DatePicker>
              </Row>
            </FormItem>
          </Col>
          <Col span="6" style="text-align: right; margin-bottom: 5px">
            <a @click="changeShow()" class="ivu-ml-8" style="font-size: 14px;" v-if="isShow">
              收起
              <Icon type="ios-arrow-up"/>
            </a>
            <a @click="changeShow()" class="ivu-ml-8" style="font-size: 14px;" v-else>
              展开
              <Icon type="ios-arrow-down"/>
            </a>&nbsp;&nbsp;&nbsp;
            <Button
              @click="handleSearch" class="case-btn"
              type="info"
            >搜索
            </Button>
            <Button
              @click="handleReset('formValidate2')" class="case-btn"
            >重置
            </Button>
          </Col>
          <!--          <Col span="6" style = "">-->
          <!--            <FormItem label="创建结束时间" prop="case_etime" :label-width="100">-->
          <!--              <DatePicker type="datetime" format="yyyy-MM-dd"-->
          <!--                          :value="formValidate2.case_etime" @on-change="formValidate2.case_etime=$event"-->
          <!--                          placeholder="创建结束时间"-->
          <!--                          :options="optionsDate">-->

          <!--              </DatePicker>-->
          <!--            </FormItem>-->
          <!--          </Col>-->
        </Row>
      </Form>
    </Card>
    <Card style="margin-top: 5px">
      <div style="width: 100%">
        <Row>
          <Col style="text-align: right; margin-bottom: 5px">
<!--            <Button-->
<!--              @click="handleSearch" class="case-btn"-->
<!--              type="info"-->
<!--            >搜索-->
<!--            </Button>-->
<!--            <Button-->
<!--              @click="handleReset('formValidate2')" class="case-btn"-->
<!--            >重置-->
<!--            </Button>-->
            <slot name="new_btn">
              <Button
                @click="editModal('', 'post', '新建个案')"
                class="case-btn" type="primary"
              >新建个案
              </Button>
            </slot>
            <Button @click="exportDateALL()" class="case-btn" type="success">
              <Icon type="ios-download-outline"></Icon>
              导出数据
            </Button>
            <Button
              @click="editModaltable()"
              type="primary"
            >生成报表
            </Button>
          </Col>
        </Row>
      </div>
      <Table
        :columns="columns"
        :data="tableData"
        id="table"
        ref="selection"
        size="small"
      ></Table>
      <Modal :footer-hide=true :loading=true :title="modalTable.tablelTitle" v-model="modalTable.tableVisible">
        <div style="padding: 10px; text-align:center;">
          <!--<DatePicker type="datetime" :value="valueDate" @on-change="handleChange"-->
          <!--:options="optionsDate" placeholder="选择执行时间" show-week-numbers confirm style="width: 220px">-->
          <!--</DatePicker>-->
          <DatePicker :options="options2" :value="todate" @on-change="todate=$event"
                      confirm placeholder="请选择开始与结束日期"
                      placement="bottom-end"
                      type="daterange">
          </DatePicker>
          <Button @click="handleSubmitTable()" style="marginRight: 2px; marginLeft: 50px" type="success">生成报表
          </Button>
          <a :href=surl><span id="surl"></span></a>
        </div>
      </Modal>

      <Modal
        :footer-hide=true
        :loading=true
        :title="modalMap.modalTitle"
        v-model="modalMap.modalVisible"
        width="680"
      >
        <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
        <Form :inline="true" :label-width="69" :model="formValidate" :rules="ruleValidate" ref="formValidate">
          <Card style="width:100%">
            <div v-if="editModalData && editModalData == 'put'">
              <FormItem label="个案" prop="case_name" style="width:350px;margin-right:20px">
                <Input
                  :maxlength="45"
                  disabled
                  placeholder="请输入个案名称"
                  v-model="formValidate.case_name"
                ></Input>
              </FormItem>
            </div>
            <div v-else>
              <FormItem label="个案" prop="case_name" style="width:350px;margin-right:20px">
                <Input
                  :maxlength="45"
                  placeholder="请输入个案名称"
                  v-model="formValidate.case_name"
                ></Input>
              </FormItem>
            </div>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="6">
                <FormItem label="类型" prop="case_type" style="width:150px;margin-right:30px">
                  <Select placeholder="类型" v-model="formValidate.case_type">
                    <Option :key="item.k" :value="item.v" v-for="item in allTypeList">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="状态" prop="case_status" style="width:150px;margin-right:30px">
                  <Select placeholder="状态" v-model="formValidate.case_status">
                    <Option :key="item.k" :value="item.v" v-for="item in allstatusList">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="项目" prop="case_obj" style="width:220px;margin-right:30px">
                  <Select placeholder="项目" v-model="formValidate.case_obj">
                    <Option :key="item.k" :value="item.v" v-for="item in allobjecList">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="6">
                <FormItem label="优先级" prop="case_priority" style="width:150px;margin-right:30px">
                  <Select placeholder="优先级" v-model="formValidate.case_priority">
                    <Option :key="item.k" :value="item.v" v-for="item in allpriorityList">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="来源" prop="case_source" style="width:150px;margin-right:30px">
                  <Select placeholder="来源" v-model="formValidate.case_source">
                    <Option :key="item.k" :value="item.v" v-for="item in allsourceList">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="新建人"
                  prop="case_creator" style="width:220px;margin-right:30px"
                >
                  <Input
                    disabled
                    placeholder="新建人"
                    v-model="formValidate.case_creator"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="6">
                <FormItem label="处理人" prop="case_executor" style="width:150px;margin-right:30px">
                  <Select placeholder="处理人，接手人，参与人" v-model="formValidate.case_executor">
                    <Option :key="item.user_id" :value="item.nickname" v-for="item in allNameList">{{ item.nickname }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="需求单位"
                  prop="demand_unit" style="width:220px;margin-left:15px"
                >
                  <Input
                    :autosize="{minRows: 2,maxRows: 5}"
                    :maxlength="200"
                    placeholder="需求单位"
                    v-model="formValidate.demand_unit"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="需求人"
                  prop="demander" style="width:140px;margin-left:80px"
                >
                  <Input
                    :maxlength="200"
                    placeholder="需求人"
                    v-model="formValidate.demander"
                  ></Input>
                </FormItem>
              </Col>

            </Row>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="10">
                <FormItem
                  label="开始时间"
                  prop="case_stime" style="width:240px;margin-right:50px"
                >
                  <DatePicker :clearable="false" :options="optionsDate"
                              :value="formValidate.case_stime" @on-change="changestime"
                              format="yyyy-MM-dd HH:mm:ss"
                              placeholder="记录开始时间"
                              type="datetime">

                  </DatePicker>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="结束时间"
                  prop="case_etime" style="width:240px;margin-right:50px"
                >
                  <DatePicker :options="optionsDate" :value="formValidate.case_etime"
                              @on-change="changeetime" format="yyyy-MM-dd HH:mm:ss"
                              placeholder="记录结束时间"
                              type="datetime">

                  </DatePicker>
                </FormItem>
              </Col>
            </Row>
            <!--            <Row :gutter="10" style="margin-bottom: 5px">-->
            <!--              <Col span="8">-->
            <!--                <FormItem-->
            <!--                  label="时长"-->
            <!--                  prop="case_ltime" style="width:230px;margin-right:30px"-->
            <!--                >-->
            <!--                  <Input-->
            <!--                    v-model="formValidate.case_ltime"-->
            <!--                    :maxlength="200"-->
            <!--                    placeholder="请输入数字(单位:分钟)"-->
            <!--                    @on-change="changeltime"-->
            <!--                  ></Input>-->
            <!--                </FormItem>-->

            <!--              </Col>-->
            <!--              <Col span="8">-->
            <!--                <FormItem label="分钟">-->
            <!--                </FormItem>-->
            <!--              </Col>-->
            <!--            </Row>-->
            <div>
              <FormItem
                label="详情描述"
                prop="case_details" style="width:500px;margin-right:500px"
              >
                <Input
                  :rows="4"
                  placeholder="详细描述"
                  type="textarea"
                  v-model="formValidate.case_details"
                ></Input>
              </FormItem>
            </div>
            <FormItem>
              <Button
                :disabled="isDisable"
                @click="handleSubmit('formValidate')"
                type="primary"
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
      <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :current="pageNum" :page-size="pageSize"
                :page-size-opts=[10,15,25,35,50,100,150,200,300,500,800,1000,1500]
                :total="pageTotal"
                @on-change="changePage" @on-page-size-change="handlePageSize" show-sizer show-total></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import XLSX from 'xlsx'
  import FileSaver from 'file-saver'

  import {CaseAdd, getCase, getCaseList, getname, caseDelete, getCaseFile} from '@/api/problem'
  import {getuserlist} from '@/api/user'
  import {getDate} from '@/libs/tools'
  import excel from '@/libs/excel'
  import {getDictConfList} from '@/api/app'

  export default {
    data() {
      return {
        options2: {
          shortcuts: [
            {
              text: '上周',
              value() {
                const end = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                const day = new Date().getDay()
                const start = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (7 + day - 1))
                end.setTime(end.getTime() - 3600 * 1000 * 24 * day)
                return [start, end]
              }
            },
            {
              text: '本周',
              value() {
                const end = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                const day = new Date().getDay()
                const start = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (day - 1))
                end.setTime(end.getTime() + 3600 * 1000 * 24 * (7 - day))
                return [start, end]
              }
            },
            {
              text: '上个月',
              value() {
                const nowDate = new Date()
                let year = nowDate.getFullYear()
                let month = nowDate.getMonth()
                let days = new Date(year, month, 0).getDate()
                const day = new Date().getDate()
                const end = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                const start = new Date(new Date().setHours(0, 0, 0, 0))// 获取当天 0 点的时间;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (days + day - 1))
                end.setTime(end.getTime() - 3600 * 1000 * 24 * day)
                return [start, end]
              }
            }
          ]
        },
        btnText: '展开',
        isShow: false,
        isDisable: false,
        isDisable2: true,
        surl: '',
        optionsDate: {
          shortcuts: [
            {
              text: '当前时间',
              value() {
                return new Date()
              }
            }]
        },

        formValidate: {
          case_name: '',
          case_priority: '',
          case_type: '',
          case_status: '',
          case_executor: '',
          fault_report: '',
          case_stime: '',
          case_etime: '',
          case_ltime: '',
          case_details: '',
          fault_summary: '',
          case_obj: '',
          case_source: '',
          demand_unit: '',
          demander: '',
          case_id: 0,
          case_creator: ''
        },
        formValidate2: {
          case_name: '',
          case_priority: '',
          case_type: '',
          case_status: '',
          case_executor: '',
          fault_report: '',
          case_stime: '',
          case_etime: '',
          case_ltime: '',
          case_details: '',
          fault_summary: '',
          case_obj: '',
          case_source: '',
          demand_unit: '',
          demander: '',
          case_id: 0,
          case_creator: ''
        },
        todate: [],
        todate2: [],
        ruleValidate: {
          case_name: [
            {
              required: true,
              message: '请输入个案名称',
              trigger: 'blur'
            }
          ],
          case_priority: [
            {
              required: true,
              message: '请选择一个级别',
              trigger: 'blur'
            }
          ],
          case_type: [
            {
              message: '请选择一个类型',
              trigger: 'blur'
            }
          ],
          case_source: [
            {
              message: '请选择一个来源',
              trigger: 'blur'
            }
          ],
          case_executor: [
            {
              message: '处理人',
              trigger: 'blur'
            }
          ],
          case_obj: [
            {
              required: true,
              message: '请选择一个项目',
              trigger: 'blur'
            }
          ],
          demand_unit: [
            {
              message: '单位名称',
              trigger: 'blur'
            }
          ],
          case_status: [
            {
              message: '请选择一个状态',
              trigger: 'blur'
            }
          ],
          case_stime: [
            {
              required: true,
              message: '请选择开始时间',
              trigger: 'blur'
            }
          ],
          case_ltime: [
            {
              required: true,
              message: '时长:请输入整数',
              trigger: 'blur'
            }
          ],
          case_creator: [
            {
              message: '新建人',
              trigger: 'blur'
            }
          ]
        },
        ruleValidate3: {
          todate: [
            {
              required: true,
              message: '请选择日期范围',
              trigger: 'blur'
            }
          ]
        },
        columns2: [{
          title: '个案',
          key: 'case_name',
          align: 'center'
        }],
        columns: [
          {
            title: '个案',
            key: 'case_name',
            align: 'center',
            width: 200,
            fixed: 'left',
            render: (h, params) => {
              // return h('router-link', {props:{to:'/project/publish/'+params.row.id+ '/'}}, params.row.name)
              return h('a', {
                  on: {
                    click: () => {
                      this.handleDetail(params.index)
                    }
                  }
                }, params.row.case_name
              )
            }
          },
          {title: '类型', key: 'case_type', align: 'center', width: 100,fixed: 'left'},
          {title: '状态', key: 'case_status', align: 'center', width: 100,},
          {title: '项目', key: 'case_obj', align: 'center', width: 150,},
          {title: '开始时间', key: 'case_stime', width: 100, align: 'center', width: 150,},
          {title: '结束时间', key: 'case_etime', width: 100, align: 'center', width: 150,},
          {title: '处理人', key: 'case_executor', align: 'center', width: 100,},
          {title: '优先级', key: 'case_priority', align: 'center', width: 100,},
          {title: '新建人', key: 'case_creator', align: 'center', width: 100,},
          {title: '需求人', key: 'demander', align: 'center', width: 100,},

          {
            title: '描述',
            key: 'case_details',
            width: 150,
            align: 'center',
            render: (h, params) => {
              let roleTitle = params.row.case_details
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

          {
            title: '操作',
            key: 'handle',
            align: 'center',
            fixed: 'right',
            width: 150,
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
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editModal(params.row, 'put', '编辑个案')
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
        allNameList: [],
        allTypeList: [
          {'k': 0, 'v': '协作'},
          {'k': 1, 'v': '故障'},
          {'k': 2, 'v': '咨询'},
          {'k': 3, 'v': '统计'},
          {'k': 4, 'v': '优化'},
          {'k': 5, 'v': '监控巡检'},
          {'k': 6, 'v': '会议'},
          {'k': 7, 'v': '报备审批'},
          {'k': 8, 'v': '编写文档'},
          {'k': 9, 'v': '应用升级'},
          {'k': 10, 'v': '应用部署'}
        ],
        allobjecList: [
          {'k': 0, 'v': '综合应用平台'},
          {'k': 1, 'v': '互联网服务平台'},
          {'k': 2, 'v': '集成指挥平台'},
          {'k': 3, 'v': '其他'}
        ],
        allsourceList: [
          {'k': 0, 'v': 'OA'},
          {'k': 1, 'v': '运维'},
          {'k': 2, 'v': '来文'},
          {'k': 3, 'v': '微信'},
          {'k': 4, 'v': '电话'},
          {'k': 5, 'v': '面对面'}
        ],
        allstatusList: [
          {'k': 0, 'v': '已完成'},
          {'k': 1, 'v': '处理中'}
        ],
        allpriorityList: [
          {'k': 0, 'v': '特急'},
          {'k': 1, 'v': '紧急'},
          {'k': 2, 'v': '一般'}
        ]
      }
    },
    methods: {
      changestime(data) {
        this.formValidate.case_stime = data
      },
      changeetime(data) {
        this.formValidate.case_etime = data
      },
      changeShow() {
        this.isShow = !this.isShow
        // if (this.isShow) {
        //   this.btnText = "收起"
        // } else {
        //   this.btnText = "展开"
        // }
      },
      // 导出数据、支持分页、过滤、搜索、排序后导出
      exportDateALL() {
        // 查询所有数据
        getCaseList(this.pageNum, this.pageSize, this.tokey, this.tovalue, true).then(res => {
          if (res.data.code === 0) {
            this.tableDataALL = res.data.data
            this.exportData()
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      exportData() {
        if (this.tableDataALL.length) {
          // this.exportLoading = true
          const params = {
            title: ['个案', '类型', '状态', '项目', '优先级', '来源', '需求人', '处理人', '描述', '开始时间', '结束时间'],
            key: ['case_name', 'case_type', 'case_status', 'case_obj', 'case_priority', 'case_source', 'demander', 'case_executor', 'case_details', 'case_stime', 'case_etime'],
            data: this.tableDataALL,
            autoWidth: true,
            filename: '个案列表'
          }
          excel.export_array_to_excel(params)
          // this.exportLoading = false
        } else {
          this.$Message.info('表格数据不能为空！')
        }
      },
      // //输入触发事件方法
      // inputfunction() {
      //   if (!this.formValidate.case_executor) {
      //     return true
      //   }
      //   //this.$Message.error(this.formValidate.case_executor);
      //   getCase(this.formValidate.case_executor).then(res => {
      //     if (res.data.code === 0) {
      //       this.tomsg = res.data.msg
      //       this.$Message.success(`${res.data.msg}`)
      //     } else {
      //       this.tomsg = "联系人未登记。"
      //       this.$Message.error(`${res.data.msg}`)
      //     }
      //   })
      // },
      // 获取用户列表
      getUserList() {
        getuserlist(1, 2000).then(res => {
          if (res.data.code === 0) {
            this.allNameList = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      getCaseFile(startdate, enddate) {
        getCaseFile(startdate, enddate).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.surl = res.data.data
            console.log(res.data.data)
            setTimeout(() => {
              document.getElementById('surl').click()
            }, 1000)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      getCaseList(page, limit, key, value) {
        getCaseList(page, limit, key, value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
            if (res.data.flag == '1') {
              this.isDisable2 = false
            }
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleDetail(index) {
        this.$Modal.info({
          title: '个案信息',
          content: `个案名称：${this.tableData[index].case_name}<br>类型：${this.tableData[index].case_type}<br>状态：${this.tableData[index].case_status}<br>项目：${this.tableData[index].case_obj}<br>优先等级：${this.tableData[index].case_priority}<br>来源：${this.tableData[index].case_source}<br>新建人：${this.tableData[index].case_creator}<br>需求单位：${this.tableData[index].demand_unit}<br>需求人：${this.tableData[index].demander}<br>处理人：${this.tableData[index].case_executor}<br>开始时间：${this.tableData[index].case_stime}<br>结束时间：${this.tableData[index].case_etime}<br>时长：${this.tableData[index].case_ltime}<br>详情描述：${this.tableData[index].case_details}`
        })
      },
      // 选择类型
      handlerSelectType(val) {
        this.formValidate.publish_type = val
      },

      // 选择类型
      handlerSelectType1(val) {
        this.formValidate.publish_type1 = val
      },
      handlerSelectType2(val) {
        this.formValidate.bucket_type = val
      },
      editModaltable() {
        this.modalTable.tableVisible = true
        this.modalTable.tableTitle = '生成报表'
      },
      editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        this.getUserList()
        let loginUser = JSON.parse(sessionStorage.vuex).user.nickName
        console.log(loginUser)
        if (paramsRow && paramsRow.id) {
          // put
          this.formValidate = {
            case_num: paramsRow.case_num,
            case_id: paramsRow.id,
            case_name: paramsRow.case_name,
            case_priority: paramsRow.case_priority,
            case_status: paramsRow.case_status,
            case_executor: paramsRow.case_executor,
            case_stime: paramsRow.case_stime,
            case_etime: paramsRow.case_etime,
            case_details: paramsRow.case_details,
            case_type: paramsRow.case_type,
            case_creator: paramsRow.case_creator,
            case_obj: paramsRow.case_obj,
            case_source: paramsRow.case_source,
            demand_unit: paramsRow.demand_unit,
            demander: paramsRow.demander,
            case_ltime: paramsRow.case_ltime
          }
        } else {
          // post
          this.formValidate = {
            case_name: '',
            case_priority: '一般',
            case_status: '已完成',
            case_type: '协作',
            case_source: '微信',
            case_obj: '综合应用平台',
            case_executor: loginUser,
            case_creator: loginUser,
            case_stime: getDate(new Date().getTime() / 1000, 'year'),
            case_etime: getDate(new Date().getTime() / 1000, 'year'),
            case_details: '',
            case_ltime: 0,
            demander: ''
          }
        }
      },
      handleSubmitTable() {
        if (this.todate.length) {
          if (this.todate[0].length) {
            console.log(this.todate)
            this.getCaseFile(this.todate[0], this.todate[1])
            this.modalTable.tableVisible = false
          } else {
            this.$Message.error('缺少必要参数')
          }
        } else {
          this.$Message.error('缺少必要参数')
        }
      },
      handleSubmit(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            this.isDisable = true
            setTimeout(() => {
              CaseAdd(this.formValidate, this.editModalData).then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getCaseList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
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
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      // 删除
      delData(params) {
        if (confirm(`确定要删除 ${params.row.case_name}`)) {
          caseDelete(
            {
              id: params.row.id
            }
          ).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.tableData.splice(params.index, 1)
              this.getCaseList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      },

      handleClear(e) {
        if (e.target.value === '') this.tableData = this.value
      },
      handleSearch() {
        if (this.todate2.length) {
          if (this.todate2[0].length) {
            this.formValidate2.case_stime = this.todate2[0]
            this.formValidate2.case_etime = this.todate2[1]
          }
        }
        this.tovalue = this.formValidate2
        this.getCaseList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
      },
      changePage(value) {
        this.pageNum = value
        this.getCaseList(
          this.pageNum,
          this.pageSize,
          this.tokey,
          this.tovalue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getCaseList(1, this.pageSize, this.tokey, this.tovalue)
      },
      getDictConfList() {
        getDictConfList().then(res => {
          if (res.data.code === 0) {
            let case_type_list = JSON.parse(res.data.data['case_type_list'])
            let case_obj_list = JSON.parse(res.data.data['case_obj_list'])
            let case_source_list = JSON.parse(res.data.data['case_source_list'])
            let case_status_list = JSON.parse(res.data.data['case_status_list'])
            let case_priority_list = JSON.parse(res.data.data['case_priority_list'])

            if (case_type_list) {
              this.allTypeList = case_type_list
            }
            if (case_obj_list) {
              this.allobjecList = case_obj_list
            }
            if (case_source_list) {
              this.allsourceList = case_source_list
            }
            if (case_status_list) {
              this.allstatusList = case_status_list
            }
            if (case_priority_list) {
              this.allpriorityList = case_priority_list
            }
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },

    mounted() {
      this.getCaseList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
      this.getDictConfList()
    }
  }
</script>

<style lang="less" scoped>
  .case-btn {
    margin-right: 5px
  }
</style>
