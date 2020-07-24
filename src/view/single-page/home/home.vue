<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" key="infor-1" style="height: 90px;padding-bottom: 10px;">
        <infor-card shadow color="#E46CBB" icon="md-person-add" :icon-size="36">
          <h3>
            <router-link :to="{name:'user'}" class="nav-link">用户管理</router-link>
          </h3>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="4" key="infor-2" style="height: 90px;padding-bottom: 10px;">
        <infor-card shadow color="#2d8cf0" icon="md-cube" :icon-size="36">
          <h3>
            <router-link :to="{name: 'appsys_mg'}" class="nav-link">资产管理</router-link>
          </h3>
        </infor-card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="4" key="infor-3" style="height: 90px;padding-bottom: 10px;">
        <infor-card shadow color="#19be6b" icon="md-apps" :icon-size="36">
          <h3>
            <router-link :to="{name: 'case_mg'}" class="nav-link">个案管理</router-link>
          </h3>
        </infor-card>
      </i-col>
    </Row>

    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="14" style="margin-bottom: 10px;">
        <Card shadow>
          <Row style="text-align:right">
            <Col span="24">
              <DatePicker :value="value2" format="yyyy-MM-dd" type="daterange" placement="bottom-end"
                          placeholder="请选择日期范围"
                          @on-change="initBarCase"
                          style="width: 200px">

              </DatePicker>
            </Col>
          </Row>
          <!-- <IssuesInfo :data="IssuesInfoData"></IssuesInfo> -->
          <chart-bar ref="childCaseBar" style="height: 340px;" :value="barCaseData" text="个案柱状图"/>
          <!--          <Col span="24" v-show="isShow2" style="margin-left:390px;margin-top:-222px;" >暂无数据</Col>-->
        </Card>
      </i-col>

      <i-col :md="24" :lg="10" style="margin-bottom: 10px;">
        <Card shadow style="height:405px">
          <Row>
            <Col span="24">
            </Col>
          </Row>
          <chart-pie ref="childCasePie" style="height: 339px;" :value="pieCaseData" text="个案比例图"></chart-pie>
          <!--          <Col span="24" v-show="isShow2" style="margin-left:260px;margin-top:-110px;" >暂无数据</Col>-->
        </Card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="14" style="margin-bottom: 1px;">
        <Card shadow>
          <chart-line ref="childCaseLine" style="height: 340px;" :value="lineCaseData" :keylist="keys" flag="0" text="趋势图"/>
        </Card>
      </i-col>
      </Row>
  </div>
</template>

<script>
  import InforCard from '_c/info-card'
  import CountTo from '_c/count-to'
  import {ChartPie, ChartBar,ChartLine} from '_c/charts'
  import Example from './example.vue'
  import {getCaseBarList, getTaskOrderlist, getTaskStatementlist} from '@/api/dashboard/home.js'
  import {getZabbixLastissues} from "@/api/devops-tools";

  import TaskInfo from './taskinfo'
  import IssuesInfo from './issuesinfo'

  // import { getTaskCheckHistorylist } from '@/api/task'

  export default {
    name: 'home',
    components: {
      InforCard,
      ChartPie,
      ChartBar,
      ChartLine,
      Example,
      TaskInfo,
      IssuesInfo,
    },
    data() {
      return {
        value2: [new Date(), new Date()],
        pieCaseData: [],//[{"name":"来文", "value": 1},{"name":"应用升级","value": 1},{"name":"故障","value": 1},{"name":"重要工作","value": 2},{"name":"其他","value": 2}],
        pieTaskData: [],
        taskInfoData: [],
        IssuesInfoData: [{"name":"来文", "value": 1},{"name":"应用升级","value": 1},{"name":"故障","value": 1}],
        keys : [], //["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
        lineCaseData: [], // [[15,21,30,35,58,25],[11,20,30,33,50,23,96,25,20,23,65,16],[10,15,30,42,53,0,0,0,0,0,0,0],[15,21,32,35,58], [18,20,30,35,55]],
        barCaseData: {}, // {来文: 1,应用升级: 1,故障: 1,重要工作: 2,其他: 2},
        isShow: false,
        isShow2: true,//false,
      }
    },
    methods: {
      // 获取zabbix last issues
      GetZabbixLastissues() {
        getZabbixLastissues().then(res => {
          if (res.data.code === 0) {
            const data = res.data.data
            // const slice_data = data.slice(0,10)
            this.IssuesInfoData = data
          }
        })
      },

      //初始化 历史任务类型饼图数据
      initPieTask() {
        // this.pieTaskData.push({name: '服务器发布', value:20},{name: '资源申请', value:20},{name: 'MySQL审核', value:20},{name: '自定义任务', value:50},)
        getTaskStatementlist().then(res => {
          if (res.data.code === 0) {
            const data = res.data.data
            // 切割下列表，历史任务可能有很多，限制
            const slice_data = data.slice(0, 36)
            for (var item in slice_data) {
              this.pieTaskData.push({
                value: data[item].task_len,
                name: data[item].task_type
              })
            }
          } else {
            // this.$Message.error(`${res.data.msg}`)
          }
        })
      },

      // 初始化个案饼图数据
      initBarCase(date) {
        getCaseBarList(date[0], date[1]).then(res => {
          if (res.data.code === 0) {
            this.isShow = true
            this.isShow2 = false
            this.barCaseData = res.data.data[0]
            this.pieCaseData = res.data.list[0]
            this.keys = res.data.keylist
            this.lineCaseData = res.data.linelist
          } else {
            this.barCaseData = {}
            this.pieCaseData = []
            this.keys = res.data.keylist
            this.lineCaseData = res.data.linelist
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },

      // 初始化 [待处理任务订单]
      initTaskInfo() {
        getTaskOrderlist().then(res => {
          const data = res.data.data
          for (var item in data) {
            this.taskInfoData.push({
              id: data[item].list_id,
              name: data[item].task_name + '-' + data[item].task_type,
              creator: data[item].creator,
              status: data[item].status
            })
          }
        })
      },

    },
    mounted() {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth() + 1;//得到月份
      var date = now.getDate();//得到日期
      var todate = year + '-' + month + '-' + date;
      // starttime = todate + " 00:00:00";
      // endtime = todate + " 23:59:59";
      this.initBarCase([todate, todate])
      // this.initTaskInfo()
      // this.initPieTask()
      // this.GetZabbixLastissues()
    },
    watch: {
      barCaseData: function () {
        this.$refs.childCaseBar.initBar()
      },
      pieCaseData: function () {
        this.$refs.childCasePie.initPie()
      },
      lineCaseData: function () {
        this.$refs.childCaseLine.initLine()
      },
    }
  }
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
