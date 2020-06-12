<template>
  <Card style="height:100%">
    <div class="search-con search-con-top">
      <Select
        v-model="searchKey"
        class="search-col"
      >
        <Option
          v-for="item in columns2"
          v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
          :value="item.key"
        >{{ item.title }}
        </Option>
      </Select>
      <Input
        @on-change="handleClear"
        clearable
        placeholder="输入个案名搜索"
        class="search-input"
        v-model="searchValue"
      />
      <Button
        @click="handleSearch"
        class="search-btn"
        type="primary"
      >搜索
      </Button>
      <slot name="new_btn">
        <Button
          type="primary"
          @click="editModal('', 'post', '新建个案')"
          class="search-btn"
        >新建个案
        </Button>
      </slot>
    </div>
    <Table
      size="small"
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
    >
      <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <div v-if="editModalData && editModalData == 'put'">
          <FormItem label="个案" prop="case_name">
            <Input
              v-model="formValidate.case_name"
              disabled
              :maxlength="45"
              placeholder="请输入个案名称"
            ></Input>
          </FormItem>
        </div>
        <div v-else>
          <FormItem label="个案" prop="case_name">
            <Input
              v-model="formValidate.case_name"
              :maxlength="45"
              placeholder="请输入个案名称"
            ></Input>
          </FormItem>
        </div>
        <FormItem label="类型" prop="case_type">
          <Select v-model="formValidate.case_type" filterable placeholder="类型">
            <Option v-for="item in allTypeList" :value="item.type_name" :key="item.id">{{item.type_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" prop="case_status">
          <Select v-model="formValidate.case_status" filterable placeholder="状态">
            <Option value="已完成">已完成</Option>
            <Option value="处理中">处理中</Option>
          </Select>
        </FormItem>
        <FormItem label="项目" prop="case_obj">
          <Select v-model="formValidate.case_obj" filterable placeholder="项目">
            <Option v-for="item in allobjecList" :value="item.type_name" :key="item.id">{{item.type_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="优先级" prop="case_priority">
          <Select v-model="formValidate.case_priority" filterable placeholder="优先级">
            <Option value="特急">特急</Option>
            <Option value="紧急">紧急</Option>
            <Option value="一般">一般</Option>
          </Select>
        </FormItem>
        <FormItem label="来源" prop="case_source">
          <Select v-model="formValidate.case_source" filterable placeholder="来源">
            <Option value="微信">微信</Option>
            <Option value="电话">电话</Option>
            <Option value="面对面">面对面</Option>
          </Select>
        </FormItem>
        <FormItem
          label="需求单位"
          prop="demand_unit"
        >
          <Input
            v-model="formValidate.demand_unit"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            placeholder="需求单位"
          ></Input>
        </FormItem>
        <FormItem
          label="需求人"
          prop="demander"
        >
          <Input
            v-model="formValidate.demander"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            placeholder="需求人"
          ></Input>
        </FormItem>
        <FormItem
          label="处理人"
          prop="case_executor"
        >
          <Input
            v-model="formValidate.case_executor"
            :autosize="{minRows: 2,maxRows: 5}"
            :maxlength="200"
            placeholder="处理人，接手人，参与人"
          ></Input>
        </FormItem>
        <FormItem
          label="开始时间"
          prop="case_stime"
        >
          <DatePicker
            v-model="formValidate.case_stime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            editable
            placeholder="记录开始时间"
            style="width: 403px"
          ></DatePicker>
        </FormItem>
        <FormItem
          label="结束时间"
          prop="case_etime"
        >
          <DatePicker
            v-model="formValidate.case_etime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            editable
            placeholder="记录结束时间"
            style="width: 403px"
          ></DatePicker>
        </FormItem>
        <FormItem
          label="时长"
          prop="case_ltime"
        >
          <Input
            v-model="formValidate.case_ltime"
            :autosize="{minRows: 2,maxRows: 10}"
            :maxlength="200"
            placeholder="时长"
          ></Input>
        </FormItem>

        <FormItem
          label="详情描述"
          prop="case_details"
        >
          <Input
            v-model="formValidate.case_details"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 10}"
            :maxlength="2000"
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
      </Form>
    </Modal>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: left;">
        <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100]
              show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
      </div>
    </div>
  </Card>
</template>

<script>
  import {CaseAdd, getCase, getCaseList, getname} from "@/api/problem"

  export default {

    data() {
      return {
        formValidate: {
          case_name: '',
          case_priority: "",
          case_type:'',
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
        },
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
          case_status: [
            {
              message: "请选择一个状态",
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
              message: "提问者",
              trigger: "blur"
            },
          ],
          case_obj: [
            {
              message: "请选择一个平台",
              trigger: "blur"
            }
          ],
          demand_unit: [
            {
              message: "单位名称",
              trigger: "blur"
            }
          ],
          case_type: [
            {
              message: "请选择一个状态",
              trigger: "blur"
            }
          ],
          case_ltime: [
            {
              message: "时长",
              trigger: "blur"
            }
          ],
        },
        columns2: [{
          title: "个案",
          key: "case_name",
          align: "center",
          sortable: true
        },],
        columns: [

          {
            title: "个案",
            key: "case_name",
            align: "center",
            //   width: 200,
            sortable: true,
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
          {
            title: "编号",
            key: "case_num",
            align: "center",
            sortable: true
          },
          {
            title: "状态",
            key: "case_status",
            //width: 130,
            align: "center",
            sortable: true
          },
          {
            title: "优先级",
            key: "case_priority",
            //width: 130,
            align: "center",
            sortable: true
          },
          {
            title: "联系人",
            key: "case_executor",
            //width: 130,
            align: "center",
            sortable: true
          },
          {
            title: "处理人",
            key: "demander",
            //width: 200,
            align: "center",
            sortable: true
          },
          //{
          // title: "来源",
          // key: "case_source",
          //width: 200,
          // align: "center",
          // sortable: true
          //},
          {
            title: "描述",
            key: "case_details",
            //width: 200,
            align: "center",
            sortable: true
          },
          {
            title: "开始时间",
            key: "case_stime",
            //   width: 200,
            align: "center",
            sortable: true
          },
          {
            title: "结束时间",
            key: "case_etime",
            //   width: 200,
            align: "center",
            sortable: true
          },
          {
            title: "操作",
            key: "handle",
            width: 150,
            align: "center",
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
                        this.editModal(params.row, "put", "编辑故障");
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
        tomsg: ' ',
        uploadList: [],
        OSSRegion: '',
        OSSBucketName: '',
        modalMap: {
          modalVisible: false,
          modalTitle: "新建"
        },
        formList: [],
        editModalData: "",
        pageNum: 1, // 当前页码
        pageTotal: 0, // 数据总数
        pageSize: 15, // 每页条数
        //
        searchKey: "case_name",
        searchValue: "",
        UploadUrl: "",

        allTypeList: [
          {'id': 0, 'type_name': '咨询'},
          {'id': 1, 'type_name': '故障'},
        ],
        allobjecList: [
          {'id': 0, 'type_name': '综合应用平台'},
          {'id': 1, 'type_name': '互联网服务平台'},
          {'id': 2, 'type_name': '集成指挥平台'},
          {'id': 3, 'type_name': '其他'},
        ],

      };
    },
    methods: {
      //输入触发事件方法
      inputfunction() {
        if (!this.formValidate.case_executor) {
          return true
        }
        //this.$Message.error(this.formValidate.case_executor);
        getCase(this.formValidate.case_executor).then(res => {
          if (res.data.code === 0) {
            this.tomsg = res.data.msg
            this.$Message.success(`${res.data.msg}`)
          } else {
            this.tomsg = "联系人未登记。"
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取故障管理信息
      getCaseList(page, limit, key, value) {
        getCaseList(page, limit, key, value).then(res => {
          if (res.data.code === 0) {
            this.pageTotal = res.data.count
            this.tableData = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取故障管理信息
      getFaultManagerList(page, limit, key, value) {
        getFaultManagerList(page, limit, key, value).then(res => {
          if (res.data.code === 0) {
            this.pageTotal = res.data.count
            this.tableData = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取故障管理所用OSS区域和Bucketname
      GetOSSBucketInfo() {
        GetOSSBucketInfo().then(res => {
          if (res.data.code === 0) {
            // this.$Message.success(`${res.data.msg}`)
            this.OSSRegion = res.data.data.STORAGE_REGION
            this.OSSBucketName = res.data.data.STORAGE_NAME
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '文件大小超限',
          desc: '文件  ' + file.name + ' 太大，上传文件大小不能超过5M.'
        });
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件:' + file.name + ' 格式不正确，请选择：jpg,jpeg,png,md,pptx,ppt,docx,doc,pdf等格式类型 '
        });
      },
      //上传完成后的钩子
      handleSuccess(res, file) {
        // console.log(res)
        if (res.code === 0) {
          this.$Message.success(`${res.msg}`)
        } else {
          this.$Message.error(`${res.msg}`)
        }
      },
      handleBeforeUpload(file) {
        this.file = file
        this.formValidate.fault_report = this.file.name
        const check = this.uploadList.length < 1;
        if (!check) {
          this.$Notice.warning({
            title: '附件只支持上传一个'
          });
        }
        return check;

      },
      handleDetail(index) {
        this.$Modal.info({
          title: '故障信息',
          content: `故障名称：${this.tableData[index].case_name}<br>故障状态：${this.tableData[index].case_status}<br>故障等级：${this.tableData[index].case_priority}<br>处理人员：${this.tableData[index].demander}<br>故障开始时间：${this.tableData[index].case_stime}<br>故障结束时间：${this.tableData[index].case_etime}<br>故障原因：${this.tableData[index].case_details}<br>故障总结：${this.tableData[index].fault_summary}`
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
      editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true;
        this.modalMap.modalTitle = mtitle;
        this.editModalData = meth;
        if (paramsRow && paramsRow.id) {
          // put
          this.formValidate = {
            case_name: paramsRow.case_name,
            case_priority: paramsRow.case_priority,
            case_status: paramsRow.case_status,
            case_executor: paramsRow.case_executor,
            fault_report: paramsRow.fault_report,
            case_stime: paramsRow.case_stime,
            case_etime: paramsRow.case_etime,
            case_details: paramsRow.case_details,
            fault_summary: paramsRow.fault_summary,
          }
        } else {
          // post
          this.formValidate = {
            case_name: '',
            case_priority: "",
            case_status: "",
            case_executor: '',
            fault_report: '',
            case_stime: '',
            case_etime: '',
            case_details: "",
            fault_summary: '',
            demander: '',
          }
        }
        getname().then(res => {
          if (res.data.code === 0) {
            this.formValidate.case_executor = res.data.data[0].name
          } else {
            this.formValidate.case_executor = "获取用户名失败"
          }
        })
      },
      handleSubmit(value) {
        //this.$refs[value].validate((valid) => {
        // if (valid) {
        setTimeout(() => {
          CaseAdd(this.formValidate, this.editModalData).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.getCaseList(this.pageNum, this.pageSize, this.searchKey, this.searchValue)
              this.modalMap.modalVisible = false
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }, 1000)
        // this.$Message.success('Success!');
        //} else {
        //  this.$Message.error('缺少必要参数');
        // }
        //})
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      // 删除
      delData(params) {
        if (confirm(`确定要删除 ${params.row.case_name}`)) {
          operationFaultManager(
            {
              id: params.row.id
            },
            'delete'
          ).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.tableData.splice(params.index, 1)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      },
      // setDefaultSearchKey() {
      //   this.searchKey =
      //     this.columns[0].key && this.columns[0].key !== "handle"
      //       ? this.columns[0].key
      //       : this.columns.length > 1
      //       ? this.columns[1].key
      //       : "";
      // },
      handleClear(e) {
        if (e.target.value === "") this.tableData = this.value;
      },
      handleSearch() {
        //this.getFaultManagerList
        this.getCaseList(this.pageNum, this.pageSize, this.searchKey, this.searchValue);
      },
      changePage(value) {

        this.pageNum = value
        this.getFaultManagerList(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getFaultManagerList(1, this.pageSize, this.searchKey, this.searchValue)
      }
//   },
//   watch: {
//     searchValue(val) {
//       this.getFaultManagerList(this.pageNum,this.pageSize,this.searchKey, val);
//     }
    },

    mounted() {
      this.getCaseList(this.pageNum, this.pageSize, this.searchKey, this.searchValue)
    }
  };
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
