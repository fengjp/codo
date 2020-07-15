<template>
  <div>
    <Card style="height: 100%">
<!--      <Modal v-model="modalTable.tableVisible" :loading=true :footer-hide=true :title="modalTable.tablelTitle">-->
        <div style="padding: 10px; text-align:center;">
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
<!--      </Modal>-->
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
        todate: [],
        file: null,
        loadingStatus: false,
        tableData: [],
        tableDataALL: [],
        tomsg: ' ',
        uploadList: [],
        OSSRegion: '',
        OSSBucketName: '',
        modalTable: {
          tableVisible: false,
          tableTitle: "报表"
        },
        formList: [],
        editModalData: "",

        tokey: '',
        tovalue: '',
        //
        searchKey: "case_name",
        searchValue: "",
        UploadUrl: "",
      };
    },
    methods: {

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
            case_etime: '',
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
      // this.getCaseList(this.pageNum, this.pageSize, this.tokey, this.tovalue);
      // this.getDictConfList()
    }
  };
</script>

<style lang="less" scoped>
  .case-btn {
    margin-right: 5px
  }
</style>
