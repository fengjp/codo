<template>
  <div>
    <Card>
      <Form autocomplete="off" label-colon=":" class="plan-form" ref="formValidate2" :model="formValidate2">
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
            <FormItem label="计划" prop="plan_name" :label-width="100">
              <Input
                v-model="formValidate2.plan_name"
                placeholder="请输入计划名称"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="类型" prop="plan_type" :label-width="100">
              <Select v-model="formValidate2.plan_type">
                <Option v-for="item in allTypeList" :value="item.v" :key="item.k">{{item.v}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="状态" prop="plan_status" :label-width="100">
              <Select v-model="formValidate2.plan_status">
                <Option v-for="item in allstatusList" :value="item.v" :key="item.k">{{item.v}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="项目" prop="plan_obj" :label-width="100">
              <Select v-model="formValidate2.plan_obj" placeholder="项目">
                <Option v-for="item in allobjecList" :value="item.v" :key="item.k">{{item.v}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="1" style="margin-top: 23px" v-show="isShow">
          <Col span="6">
            <FormItem label="优先级" prop="plan_priority" :label-width="100">
              <Select v-model="formValidate2.plan_priority" placeholder="优先级">
                <Option v-for="item in allpriorityList" :value="item.v" :key="item.k">{{item.v}}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="来源" prop="plan_source" :label-width="100">
              <Select v-model="formValidate2.plan_source" placeholder="来源">
                <Option v-for="item in allsourceList" :value="item.v" :key="item.k">{{item.v}}</Option>
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
            <FormItem label="详情描述" prop="plan_details" :label-width="100">
              <Input
                v-model="formValidate2.plan_details"
                placeholder="详细描述"
              ></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="处理人" prop="plan_executor" :label-width="100">
              <Input
                v-model="formValidate2.plan_executor"
                placeholder="处理人"
                :disabled="isDisable2"
              ></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="开始时间" prop="plan_stime" :label-width="100"  style="width: 100%">
              <Row>
              <DatePicker type="datetime" format="yyyy-MM-dd"
                          style="width: 48%"
                          :value="formValidate2.plan_stime" @on-change="formValidate2.plan_stime=$event"
                          placeholder="记录开始时间" :options="optionsDate">

              </DatePicker>&nbsp;-&nbsp;
              <DatePicker type="datetime" format="yyyy-MM-dd"
                          style="width: 48%"
                          :value="formValidate2.plan_etime" @on-change="formValidate2.plan_etime=$event"
                          placeholder="记录结束时间"
                          :options="optionsDate">

              </DatePicker>
                </Row>
            </FormItem>
          </Col>
<!--          <Col span="6">-->
<!--            <FormItem label="结束时间" prop="plan_etime" :label-width="100">-->
<!--              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"-->
<!--                          style="width: 100%"-->
<!--                          :value="formValidate2.plan_etime" @on-change="formValidate2.plan_etime=$event"-->
<!--                          placeholder="记录结束时间"-->
<!--                          :options="optionsDate">-->

<!--              </DatePicker>-->
<!--            </FormItem>-->
<!--          </Col>-->
        </Row>
      </Form>
    </Card>
    <Card style="margin-top: 5px">
      <Row>
        <Col span="24"  style="text-align: right; margin-bottom: 5px">
          <Button
            @click="handleSearch" class="plan-btn"
            type="info"
            style=""
          >搜索
          </Button>
          <Button
            @click="handleReset('formValidate2')" class="plan-btn"
            style=""
          >重置
          </Button>
          <slot name="new_btn">
            <Button
              type="primary"
              @click="editModal('', 'post', '新建计划')" class="plan-btn"
              style=""
            >新建计划
            </Button>
          </slot>
          <Button type="success" @click="exportDateALL()" class="plan-btn"
                  style="">
            <Icon type="ios-download-outline"></Icon>
            导出数据
          </Button>
<!--          <Button-->
<!--            type="primary"-->
<!--            @click="editModaltable()"-->
<!--            style=""-->
<!--          >生成报表-->
<!--          </Button>-->
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
              <FormItem label="计划" prop="plan_name" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.plan_name"
                  disabled
                  :maxlength="45"
                  placeholder="请输入计划名称"
                ></Input>
              </FormItem>
            </div>
            <div v-else>
              <FormItem label="计划" prop="plan_name" style="width:350px;margin-right:20px">
                <Input
                  v-model="formValidate.plan_name"
                  :maxlength="45"
                  placeholder="请输入计划名称"
                ></Input>
              </FormItem>
            </div>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="6">
                <FormItem label="类型" prop="plan_type" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.plan_type" placeholder="类型">
                    <Option v-for="item in allTypeList" :value="item.v" :key="item.k">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="状态" prop="plan_status" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.plan_status" placeholder="状态">
                    <Option v-for="item in allstatusList" :value="item.v" :key="item.k">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="项目" prop="plan_obj" style="width:220px;margin-right:30px">
                  <Select v-model="formValidate.plan_obj" placeholder="项目">
                    <Option v-for="item in allobjecList" :value="item.v" :key="item.k">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="6">
                <FormItem label="优先级" prop="plan_priority" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.plan_priority" placeholder="优先级">
                    <Option v-for="item in allpriorityList" :value="item.v" :key="item.id">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="来源" prop="plan_source" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.plan_source" placeholder="来源">
                    <Option v-for="item in allsourceList" :value="item.v" :key="item.k">{{item.v}}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="新建人"
                  prop="plan_creator" style="width:220px;margin-right:30px"
                >
                  <Input
                    v-model="formValidate.plan_creator"
                    disabled
                    placeholder="新建人"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="6">
                <FormItem label="处理人" prop="plan_executor" style="width:150px;margin-right:30px">
                  <Select v-model="formValidate.plan_executor" placeholder="处理人，接手人，参与人">
                    <Option v-for="item in allNameList" :value="item.nickname" :key="item.user_id">{{ item.nickname }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="需求人"
                  prop="demander" style="width:150px;margin-right:30px"
                >
                  <Input
                    v-model="formValidate.demander"
                    :autosize="{minRows: 2,maxRows: 5}"
                    :maxlength="200"
                    placeholder="需求人"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="需求单位"
                  prop="demand_unit" style="width:220px;margin-right:30px"
                >
                  <Input
                    v-model="formValidate.demand_unit"
                    :autosize="{minRows: 2,maxRows: 5}"
                    :maxlength="200"
                    placeholder="需求单位"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="10" style="margin-bottom: 5px">
              <Col span="10">
                <FormItem
                  label="开始时间"
                  prop="plan_stime" style="width:240px;margin-right:50px"
                >
                  <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                              :value="formValidate.plan_stime" @on-change="formValidate.plan_stime=$event"
                              placeholder="记录开始时间"
                              :options="optionsDate">

                  </DatePicker>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem
                  label="结束时间"
                  prop="plan_etime" style="width:240px;margin-right:50px"
                >
                  <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss"
                              :value="formValidate.plan_etime" @on-change="formValidate.plan_etime=$event"
                              placeholder="记录结束时间"
                              :options="optionsDate">

                  </DatePicker>
                </FormItem>
              </Col>
            </Row>
<!--            <Row :gutter="10" style="margin-bottom: 5px">-->
<!--              <Col span="8">-->
<!--                <FormItem-->
<!--                  label="时长"-->
<!--                  prop="plan_ltime" style="width:240px;margin-right:30px"-->
<!--                >-->
<!--                  <Input-->
<!--                    v-model="formValidate.plan_ltime"-->
<!--                    :autosize="{minRows: 2,maxRows: 10}"-->
<!--                    :maxlength="200"-->
<!--                    placeholder="时长(单位:分钟)"-->
<!--                  ></Input>-->
<!--                </FormItem>-->
<!--              </Col>-->
<!--            </Row>-->
            <div>
              <FormItem
                label="详情描述"
                prop="plan_details" style="width:500px;margin-right:500px"
              >
                <Input
                  v-model="formValidate.plan_details"
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

  import {PlanAdd, getPlan, getPlanList, getname, planDelete, getPlanFile} from "@/api/plan"
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
        isDisable2: true,
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
          plan_name: '',
          plan_priority: "",
          plan_type: '',
          plan_status: "",
          plan_executor: '',
          fault_report: '',
          plan_stime: '',
          plan_etime: '',
          plan_ltime: '',
          plan_details: '',
          fault_summary: '',
          plan_obj: '',
          plan_source: '',
          demand_unit: '',
          demander: '',
          plan_id: 0,
          plan_creator: '',
        },
        formValidate2: {
          plan_name: '',
          plan_priority: "",
          plan_type: '',
          plan_status: "",
          plan_executor: '',
          fault_report: '',
          plan_stime: '',
          plan_etime: '',
          plan_ltime: '',
          plan_details: '',
          fault_summary: '',
          plan_obj: '',
          plan_source: '',
          demand_unit: '',
          demander: '',
          plan_id: 0,
          plan_creator: '',
        },
        todate: [],
        ruleValidate: {
          plan_name: [
            {
              required: true,
              message: "请输入计划名称",
              trigger: "blur"
            }
          ],
          plan_priority: [
            {
              required: true,
              message: "请选择一个级别",
              trigger: "blur"
            }
          ],
          plan_type: [
            {
              message: "请选择一个类型",
              trigger: "blur"
            }
          ],
          plan_source: [
            {
              message: "请选择一个来源",
              trigger: "blur"
            }
          ],
          plan_executor: [
            {
              message: "处理人",
              trigger: "blur"
            },
          ],
          plan_obj: [
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
          plan_status: [
            {
              message: "请选择一个状态",
              trigger: "blur"
            }
          ],
          plan_stime: [
            {
              required: true,
              message: "请选择开始时间",
              trigger: "blur"
            }
          ],
          plan_ltime: [
            {
              message: "时长",
              trigger: "blur"
            }
          ],
          plan_creator: [
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
          title: "计划",
          key: "plan_name",
          align: "center",
        },],
        columns: [
          {
            title: "计划工作",
            key: "plan_name",
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
                }, params.row.plan_name
              )
            }
          },
          {title: "类型", key: "plan_type", align: "center",},
          {title: "状态", key: "plan_status", align: "center",},
          {title: "项目", key: "plan_obj", align: "center",},
          {title: "优先级", key: "plan_priority", align: "center",},
          {title: "新建人", key: "plan_creator", align: "center",},
          {title: "需求人", key: "demander", align: "center",},
          {title: "处理人", key: "plan_executor", align: "center",},
          {
            title: "描述", key: "plan_details", width: 150, align: "center",
            render: (h, params) => {
              let roleTitle = params.row.plan_details
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
          {title: "开始时间", key: "plan_stime", width: 100, align: "center",},
          {title: "结束时间", key: "plan_etime", width: 100, align: "center",},
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
                        this.editModal(params.row, "put", "编辑计划工作");
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
        searchKey: "plan_name",
        searchValue: "",
        UploadUrl: "",
        allNameList: [],
        allTypeList: [
          {'k': 0, 'v': '咨询'},
          {'k': 1, 'v': '故障'},
          {'k': 2, 'v': '统计'},
          {'k': 3, 'v': '优化'},
          {'k': 4, 'v': '协作'},
          {'k': 5, 'v': '监控巡检'},
          {'k': 6, 'v': '会议'},
          {'k': 7, 'v': '报备审批'},
          {'k': 8, 'v': '编写文档'},
          {'k': 9, 'v': '应用升级'},
          {'k': 10, 'v': '应用部署'},
        ],
        allobjecList: [
          {'k': 0, 'v': '综合应用平台'},
          {'k': 1, 'v': '互联网服务平台'},
          {'k': 2, 'v': '集成指挥平台'},
          {'k': 3, 'v': '其他'},
        ],
        allsourceList: [
          {'k': 0, 'v': 'OA'},
          {'k': 1, 'v': '运维'},
          {'k': 2, 'v': '来文'},
          {'k': 3, 'v': '微信'},
          {'k': 4, 'v': '电话'},
          {'k': 5, 'v': '面对面'},
        ],
        allstatusList: [
          {'k': 0, 'v': '已完成'},
          {'k': 1, 'v': '处理中'},
        ],
        allpriorityList: [
          {'k': 0, 'v': '特急'},
          {'k': 1, 'v': '紧急'},
          {'k': 2, 'v': '一般'},
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
        getPlanList(this.pageNum, this.pageSize, this.tokey, this.tovalue, true).then(res => {
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
            title: ['计划工作', '类型', '状态', '项目', '优先级', '来源', '需求人', '处理人', '描述', '开始时间', '结束时间'],
            key: ['plan_name', 'plan_type', 'plan_status', 'plan_obj', 'plan_priority', 'plan_source', 'demander', 'plan_executor', 'plan_details', 'plan_stime', 'plan_etime'],
            data: this.tableDataALL,
            autoWidth: true,
            filename: '计划工作列表'
          }
          excel.export_array_to_excel(params)
          // this.exportLoading = false
        } else {
          this.$Message.info('表格数据不能为空！')
        }
      },
      // //输入触发事件方法
      // inputfunction() {
      //   if (!this.formValidate.plan_executor) {
      //     return true
      //   }
      //   //this.$Message.error(this.formValidate.plan_executor);
      //   getCase(this.formValidate.plan_executor).then(res => {
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
      getPlanFile(startdate, enddate) {
        getPlanFile(startdate, enddate).then(res => {
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
      getPlanList(page, limit, key, value) {
        getPlanList(page, limit, key, value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
            if (res.data.flag == '1') {
              this.isDisable2 = false
            }
          } else {
            this.tableData =  []
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleDetail(index) {
        this.$Modal.info({
          title: '计划工作信息',
          content: `计划工作名称：${this.tableData[index].plan_name}<br>类型：${this.tableData[index].plan_type}<br>状态：${this.tableData[index].plan_status}<br>项目：${this.tableData[index].plan_obj}<br>优先等级：${this.tableData[index].plan_priority}<br>来源：${this.tableData[index].plan_source}<br>新建人：${this.tableData[index].plan_creator}<br>需求单位：${this.tableData[index].demand_unit}<br>需求人：${this.tableData[index].demander}<br>处理人：${this.tableData[index].plan_executor}<br>开始时间：${this.tableData[index].plan_stime}<br>结束时间：${this.tableData[index].plan_etime}<br>时长：${this.tableData[index].plan_ltime}<br>详情描述：${this.tableData[index].plan_details}`
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
            plan_num: paramsRow.plan_num,
            plan_id: paramsRow.id,
            plan_name: paramsRow.plan_name,
            plan_priority: paramsRow.plan_priority,
            plan_status: paramsRow.plan_status,
            plan_executor: paramsRow.plan_executor,
            plan_stime: paramsRow.plan_stime,
            plan_etime: paramsRow.plan_etime,
            plan_details: paramsRow.plan_details,
            plan_type: paramsRow.plan_type,
            plan_creator: paramsRow.plan_creator,
            plan_obj: paramsRow.plan_obj,
            plan_source: paramsRow.plan_source,
            demand_unit: paramsRow.demand_unit,
            demander: paramsRow.demander,
            plan_ltime: paramsRow.plan_ltime,
          }
        } else {
          // post
          this.formValidate = {
            plan_name: '',
            plan_priority: "一般",
            plan_status: "处理中",
            plan_type: '咨询',
            plan_source: '微信',
            plan_obj: '综合应用平台',
            plan_executor: loginUser,
            plan_creator: loginUser,
            plan_stime: getDate(new Date().getTime() / 1000, 'year'),
            plan_etime: getDate(new Date().getTime() / 1000, 'year'),
            plan_details: "",
            demander: '',
          }
        }

      },
      handleSubmitTable() {
        if (this.todate.length) {
          if (this.todate[0].length) {
            console.log(this.todate)
            this.getPlanFile(this.todate[0], this.todate[1])
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
              PlanAdd(this.formValidate, this.editModalData).then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.getPlanList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
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
        if (confirm(`确定要删除 ${params.row.plan_name}`)) {
          planDelete(
            {
              id: params.row.id
            }
          ).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.tableData.splice(params.index, 1)
              this.getPlanList(this.pageNum, this.pageSize, this.tokey, this.tovalue)
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
        this.getPlanList(this.pageNum, this.pageSize, this.tokey, this.tovalue);
      },
      changePage(value) {

        this.pageNum = value
        this.getPlanList(
          this.pageNum,
          this.pageSize,
          this.tokey,
          this.tovalue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getListPlan(1, this.pageSize, this.tokey, this.tovalue)
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
      this.getPlanList(this.pageNum, this.pageSize, this.tokey, this.tovalue);
      this.getDictConfList()
    }
  };
</script>

<style lang="less" scoped>
  .plan-btn {
    margin-right: 5px
  }
</style>
