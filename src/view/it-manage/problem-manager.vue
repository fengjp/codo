<template>
  <div>
    <Card>
      <Form autocomplete="off" label-colon=":" class="case-form" ref="formValidate2" :model="formValidate2">
        <!--<a @click="changeShow()" v-text="btnText"></a>-->
        <a class="ivu-ml-8" style="font-size: 14px;" @click="changeShow()" v-if="isShow">
          收起
          <Icon type="ios-arrow-up"/>
        </a>
        <a class="ivu-ml-8" style="font-size: 14px;" @click="changeShow()" v-else>
          展开
          <Icon type="ios-arrow-down"/>
        </a>
        <Row :gutter="1" type="flex" justify="start"
             style="margin-top: -10px;margin-bottom: -25px">
          <Col span="6">
            <FormItem label="个案" prop="case_name" :label-width="100">
              <Input
                v-model="formValidate2.case_name"
                placeholder="请输入个案名称"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="类型" prop="case_type" :label-width="100">
              <Select v-model="formValidate2.case_type">
                <Option v-for="item in allTypeList" :value="item.type_name" :key="item.id">{{item.type_name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="状态" prop="case_status" :label-width="100">
              <Select v-model="formValidate2.case_status">
                <Option v-for="item in allstatusList" :value="item.type_name" :key="item.id">{{item.type_name}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="项目" prop="case_obj" :label-width="100">
              <Select v-model="formValidate2.case_obj" placeholder="项目">
                <Option v-for="item in allobjecList" :value="item.type_name" :key="item.id">{{item.type_name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="1" style="margin-top: 23px" v-show="isShow">
          <Col span="6">
            <FormItem label="优先级" prop="case_priority" :label-width="100">
              <Select v-model="formValidate2.case_priority" placeholder="优先级">
                <Option v-for="item in allpriorityList" :value="item.type_name" :key="item.id">{{item.type_name}}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="来源" prop="case_source" :label-width="100">
              <Select v-model="formValidate2.case_source" placeholder="来源">
                <Option v-for="item in allsourceList" :value="item.type_name" :key="item.id">{{item.type_name}}</Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="6">
            <FormItem label="需求单位" prop="demand_unit" :label-width="100">
              <Input
                v-model="formValidate2.demand_unit"
                placeholder="需求单位"
              ></Input>
            </FormItem>
          </Col>

          <Col span="6">
            <FormItem label="需求人" prop="demander" :label-width="100">
              <Input
                v-model="formValidate2.demander"
                placeholder="需求人"
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="1" v-show="isShow" style="margin-bottom: -25px">
          <Col span="6">
            <FormItem label="详情描述" prop="case_details" :label-width="100">
              <Input
                v-model="formValidate2.case_details"
                placeholder="详细描述"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="时长" prop="case_ltime" :label-width="100">
              <Input
                v-model="formValidate2.case_ltime"
                placeholder="时长"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="开始时间" prop="case_stime" :label-width="100">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                          :value="formValidate2.case_stime" @on-change="formValidate2.case_stime=$event"
                          placeholder="记录开始时间" :options="optionsDate">

              </DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="结束时间" prop="case_etime" :label-width="100">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                          :value="formValidate2.case_etime" @on-change="formValidate2.case_etime=$event"
                          placeholder="记录结束时间"
                          :options="optionsDate">

              </DatePicker>
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
              @click="editModal('', 'post', '新建个案')" class="case-btn"
              style=""
            >新建个案
            </Button>
          </slot>
          <Button type="success" @click="exportDateALL()" class="case-btn"
                  style="">
            <Icon type="ios-download-outline"></Icon>
            导出数据
          </Button>
          <Button
            type="primary"
            @click="editModaltable()"
            style=""
          >生成报表
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
      <Modal v-model="modalTable.tableVisible" :loading=true :footer-hide=true :title="modalTable.tablelTitle">
        <div style="padding: 10px; text-align:center;">
          <!--<DatePicker type="datetime" :value="valueDate" @on-change="handleChange"-->
          <!--:options="optionsDate" placeholder="选择执行时间" show-week-numbers confirm style="width: 220px">-->
          <!--</DatePicker>-->
          <DatePicker type="daterange" :options="options2" confirm
                      placement="bottom-end" placeholder="请选择开始与结束日期"
                      :value="todate"
                      @on-change="todate=$event"
                      style="width: 230px">
          </DatePicker>
          <Button type="success" style="marginRight: 2px; marginLeft: 50px" @click="handleSubmitTable()">生成报表
          </Button>
          <a :href=surl><span id="surl"></span></a>
        </div>
      </Modal>

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
              <FormItem label="个案" prop="case_name" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.case_name"
                  disabled
                  :maxlength="45"
                  placeholder="请输入个案名称"
                ></Input>
              </FormItem>
            </div>
            <div v-else>
              <FormItem label="个案" prop="case_name" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.case_name"
                  :maxlength="45"
                  placeholder="请输入个案名称"
                ></Input>
              </FormItem>
            </div>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="6">
                <FormItem label="类型" prop="case_type" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.case_type" placeholder="类型">
                    <Option v-for="item in allTypeList" :value="item.type_name" :key="item.id">{{item.type_name}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="状态" prop="case_status" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.case_status" placeholder="状态">
                    <Option v-for="item in allstatusList" :value="item.type_name" :key="item.id">{{item.type_name}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="项目" prop="case_obj" style="width:220px;margin-right:30px">
                  <Select v-model="formValidate.case_obj" placeholder="项目">
                    <Option v-for="item in allobjecList" :value="item.type_name" :key="item.id">{{item.type_name}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="6">
                <FormItem label="优先级" prop="case_priority" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.case_priority" placeholder="优先级">
                    <Option v-for="item in allpriorityList" :value="item.type_name" :key="item.id">{{item.type_name}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="来源" prop="case_source" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.case_source" placeholder="来源">
                    <Option v-for="item in allsourceList" :value="item.type_name" :key="item.id">{{item.type_name}}
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
                    v-model="formValidate.case_creator"
                    disabled
                    placeholder="新建人"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="6">
                <FormItem label="处理人" prop="case_executor" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.case_executor" placeholder="处理人，接手人，参与人">
                    <Option v-for="item in allNameList" :value="item.nickname" :key="item.user_id">{{ item.nickname }}
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
                    v-model="formValidate.demand_unit"
                    :autosize="{minRows: 2,maxRows: 5}"
                    :maxlength="200"
                    placeholder="需求单位"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="需求人"
                  prop="demander" style="width:140px;margin-left:80px"
                >
                  <Input
                    v-model="formValidate.demander"
                    :autosize="{minRows: 2,maxRows: 5}"
                    :maxlength="200"
                    placeholder="需求人"
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
                  <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                              :value="formValidate.case_stime" @on-change="formValidate.case_stime=$event"
                              placeholder="记录开始时间"
                              :options="optionsDate">

                  </DatePicker>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="结束时间"
                  prop="case_etime" style="width:240px;margin-right:50px"
                >
                  <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                              :value="formValidate.case_etime" @on-change="formValidate.case_etime=$event"
                              placeholder="记录结束时间"
                              :options="optionsDate">

                  </DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="8">
                <FormItem
                  label="时长"
                  prop="case_ltime" style="width:240px;margin-right:30px"
                >
                  <Input
                    v-model="formValidate.case_ltime"
                    :autosize="{minRows: 2,maxRows: 10}"
                    :maxlength="200"
                    placeholder="时长(单位:分钟)"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <div>
              <FormItem
                label="详情描述"
                prop="case_details" style="width:500px;margin-right:500px"
              >
                <Input
                  v-model="formValidate.case_details"
                  type="textarea"
                  :rows="4"
                  placeholder="详细描述"
                ></Input>
              </FormItem>
            </div>
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

  import {CaseAdd, getCase, getCaseList, getname, caseDelete, getCaseFile} from "@/api/problem"
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
                const end = new Date(new Date().setHours(0, 0, 0, 0));// 获取当天 0 点的时间;
                const day = new Date().getDay()
                const start = new Date(new Date().setHours(0, 0, 0, 0));// 获取当天 0 点的时间;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (7 + day - 1));
                end.setTime(end.getTime() - 3600 * 1000 * 24 * day);
                return [start, end];
              }
            },
            {
              text: '本周',
              value() {
                const end = new Date(new Date().setHours(0, 0, 0, 0));// 获取当天 0 点的时间;
                const day = new Date().getDay()
                const start = new Date(new Date().setHours(0, 0, 0, 0));// 获取当天 0 点的时间;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (day - 1));
                end.setTime(end.getTime() + 3600 * 1000 * 24 * (7 - day));
                return [start, end];
              }
            },
            {
              text: '上个月',
              value() {
                const nowDate = new Date();
                let year = nowDate.getFullYear();
                let month = nowDate.getMonth();
                let days = new Date(year, month, 0).getDate();
                const day = new Date().getDate();
                const end = new Date(new Date().setHours(0, 0, 0, 0));// 获取当天 0 点的时间;
                const start = new Date(new Date().setHours(0, 0, 0, 0));// 获取当天 0 点的时间;
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (days + day - 1));
                end.setTime(end.getTime() - 3600 * 1000 * 24 * day);
                return [start, end];
              }
            },
          ]
        },
        btnText: "展开",
        isShow: false,
        isDisable: false,
        surl: "",
        optionsDate: {
          shortcuts: [
            {
              text: '当前时间',
              value() {
                return new Date();
              }
            }]
        },

        formValidate: {
          case_name: '',
          case_priority: "",
          case_type: '',
          case_status: "",
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
          case_creator: '',
        },
        formValidate2: {
          case_name: '',
          case_priority: "",
          case_type: '',
          case_status: "",
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
          case_creator: '',
        },
        todate: [],
        ruleValidate: {
          case_name: [
            {
              required: true,
              message: "请输入个案名称",
              trigger: "blur"
            }
          ],
          case_priority: [
            {
              required: true,
              message: "请选择一个级别",
              trigger: "blur"
            }
          ],
          case_type: [
            {
              message: "请选择一个类型",
              trigger: "blur"
            }
          ],
          case_source: [
            {
              message: "请选择一个来源",
              trigger: "blur"
            }
          ],
          case_executor: [
            {
              message: "处理人",
              trigger: "blur"
            },
          ],
          case_obj: [
            {
              required: true,
              message: "请选择一个项目",
              trigger: "blur"
            }
          ],
          demand_unit: [
            {
              message: "单位名称",
              trigger: "blur"
            }
          ],
          case_status: [
            {
              message: "请选择一个状态",
              trigger: "blur"
            }
          ],
          case_stime: [
            {
              required: true,
              message: "请选择开始时间",
              trigger: "blur"
            }
          ],
          case_ltime: [
            {
              message: "时长",
              trigger: "blur"
            }
          ],
          case_creator: [
            {
              message: "新建人",
              trigger: "blur"
            }
          ],
        },
        ruleValidate3: {
          todate: [
            {
              required: true,
              message: "请选择日期范围",
              trigger: "blur"
            }
          ],
        },
        columns2: [{
          title: "个案",
          key: "case_name",
          align: "center",
        },],
        columns: [
          {
            title: "个案",
            key: "case_name",
            align: "center",
            width: 150,
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
          {title: "类型", key: "case_type", align: "center",},
          {title: "状态", key: "case_status", align: "center",},
          {title: "项目", key: "case_obj", align: "center",},
          {title: "优先级", key: "case_priority", align: "center",},
          {title: "新建人", key: "case_creator", align: "center",},
          {title: "需求人", key: "demander", align: "center",},
          {title: "处理人", key: "case_executor", align: "center",},
          {
            title: "描述", key: "case_details", width: 150, align: "center",
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
          {title: "开始时间", key: "case_stime", width: 100, align: "center",},
          {title: "结束时间", key: "case_etime", width: 100, align: "center",},
          {
            title: "操作", key: "handle", align: "center",
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.editModal(params.row, "put", "编辑个案");
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      size: "small"
                    },
                    on: {
                      click: () => {
                        this.delData(params);
                      }
                    }
                  },
                  "删除"
                )
              ]);
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
          modalTitle: "新建"
        },
        modalTable: {
          tableVisible: false,
          tableTitle: "报表"
        },
        formList: [],
        editModalData: "",
        pageNum: 1, // 当前页码
        pageTotal: 0, // 数据总数
        pageSize: 15, // 每页条数
        tokey: '',
        tovalue: '',
        //
        searchKey: "case_name",
        searchValue: "",
        UploadUrl: "",
        allNameList: [],
        allTypeList: [
          {'id': 0, 'type_name': '咨询'},
          {'id': 1, 'type_name': '故障'},
          {'id': 2, 'type_name': '协作'},
          {'id': 3, 'type_name': '统计'},
          {'id': 4, 'type_name': '优化'},
          {'id': 5, 'type_name': '监控巡检'},
          {'id': 6, 'type_name': '会议'},
          {'id': 7, 'type_name': '报备审批'},
          {'id': 8, 'type_name': '编写文档'},
          {'id': 9, 'type_name': '应用升级'},
          {'id': 10, 'type_name': '应用部署'},
        ],
        allobjecList: [
          {'id': 0, 'type_name': '综合应用平台'},
          {'id': 1, 'type_name': '互联网服务平台'},
          {'id': 2, 'type_name': '集成指挥平台'},
          {'id': 3, 'type_name': '其他'},
        ],
        allsourceList: [
          {'id': 0, 'type_name': 'OA'},
          {'id': 1, 'type_name': '运维'},
          {'id': 2, 'type_name': '来文'},
          {'id': 3, 'type_name': '微信'},
          {'id': 4, 'type_name': '电话'},
          {'id': 5, 'type_name': '面对面'},
        ],
        allstatusList: [
          {'id': 0, 'type_name': '已完成'},
          {'id': 1, 'type_name': '处理中'},
        ],
        allpriorityList: [
          {'id': 0, 'type_name': '特急'},
          {'id': 1, 'type_name': '紧急'},
          {'id': 2, 'type_name': '一般'},
        ],
      };
    },
    methods: {
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
              document.getElementById("surl").click();
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
        this.formValidate.publish_type = val;
      },

      // 选择类型
      handlerSelectType1(val) {
        this.formValidate.publish_type1 = val;
      },
      handlerSelectType2(val) {
        this.formValidate.bucket_type = val;
      },
      editModaltable() {
        this.modalTable.tableVisible = true;
        this.modalTable.tableTitle = "生成报表";
      },
      editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true;
        this.modalMap.modalTitle = mtitle;
        this.editModalData = meth;
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
            case_ltime: paramsRow.case_ltime,
          }
        } else {
          // post
          this.formValidate = {
            case_name: '',
            case_priority: "一般",
            case_status: "已完成",
            case_type: '咨询',
            case_source: '微信',
            case_obj: '综合应用平台',
            case_executor: loginUser,
            case_creator: loginUser,
            case_stime: getDate(new Date().getTime() / 1000, 'year'),
            case_etime: getDate(new Date().getTime() / 1000, 'year'),
            case_details: "",
            demander: '',
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
            this.$Message.error('缺少必要参数');
          }
        } else {
          this.$Message.error('缺少必要参数');
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
            this.$Message.error('缺少必要参数');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
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
        if (e.target.value === "") this.tableData = this.value;
      },
      handleSearch() {
        this.tovalue = this.formValidate2
        this.getCaseList(this.pageNum, this.pageSize, this.tokey, this.tovalue);
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
            let case_type_list = JSON.parse(res.data.data['case_type_list']);
            let case_obj_list = JSON.parse(res.data.data['case_obj_list']);
            let case_source_list = JSON.parse(res.data.data['case_source_list']);
            let case_status_list = JSON.parse(res.data.data['case_status_list']);
            let case_priority_list = JSON.parse(res.data.data['case_priority_list']);

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
      this.getCaseList(this.pageNum, this.pageSize, this.tokey, this.tovalue);
      this.getDictConfList()
    }
  };
</script>

<style lang="less" scoped>
  .case-btn {
    margin-right: 5px
  }
</style>
