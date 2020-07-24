<template>
  <div>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :lg="5" :md="24" style="margin-bottom: 20px;">
        <Card>
          <Tree
            :data="tagTreeData"
            @on-select-change="handlerTreeChange"
            getSelectedNodes
            ref="tree"
          ></Tree>
        </Card>
      </i-col>
      <div>
        <Tabs value="name1">
          <TabPane label="监控详情" name="name1">
            <div v-for="(item, index) in cardlist">
              <Col span="11" style="margin: 10px; margin-left: 30px;" v-if="item.flag == '5'">
                <Card :bordered="false">
                  <chart-line :keylist="item.tableData[0]" :text="item.title" :value="item.tableData[1]" flag="1"
                              ref="childCaseLine" style="height: 340px;"/>
                </Card>
              </Col>
              <Col span="11" style="margin: 10px; margin-left: 30px;" v-if="item.flag == '4'">
                <Card :bordered="false">
                  <p style="font-size:20px">系统url返回状态码</p>
                  <Row :gutter="1" style="margin-top: 23px">
                    <Col span="12">
                      <span>名称：</span>
                      <span>new_http://10.40.30.246/trffweb</span>
                    </Col>
                    <Col span="12">
                      <span>是否为关键URL：</span>
                      <span>是</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span="12">
                      <span>管理ip：</span>
                      <span>10.40.34.102</span>
                    </Col>
                    <Col span="12">
                      <span>系统URL返回状态码：</span>
                      <span>200.00</span>
                    </Col>
                  </Row>
              </Card>
              </Col>
              <Col span="11" style="margin: 10px; margin-left: 30px;" v-if="item.flag == '3'">
                <Card :bordered="false">
                  <chart-line :keylist="item.tableData[0]" :text="item.title" :value="item.tableData[1]" flag="1"
                              ref="childCaseLine" style="height: 340px;"/>
                </Card>
              </Col>
              <Col span="24" style="margin: 10px;" v-if="item.flag == '2'">
                <Card :bordered="false" shadow>
                  <p slot="title" v-text="item.title"></p>
                  <Table :columns="columns2" :data="item.tableData" size="small"></Table>
                </Card>
              </Col>
              <Col span="24" style="margin: 10px;" v-if="item.flag == '1'">
                <Card :bordered="false" shadow>
                  <p slot="title" v-text="item.title"></p>
                  <Table :columns="columns" :data="item.tableData" size="small"></Table>
                </Card>
              </Col>
              <Col span="24" style="margin: 10px;" v-if="item.flag == '0'">
                <i-col :lg="25" :md="24" style="margin-bottom: 10px;">
                  <Card shadow>
                    <p style="font-size:20px">主机基本信息</p>
                    <Col span="8">
                      <span>系统IP：</span>
                      <span>10.40.30.87</span>
                    </Col>
                    <Col span="8">
                      <span>主机：</span>
                      <span>app08(10.40.30.87)</span>
                    </Col>
                    <Col span="8">
                      <span>CPU频率：</span>
                      <span>processor 0:159MHz pro</span>
                    </Col>
                    <Col span="8">
                      <span>物理内存总大小：</span>
                      <span>x86_64</span>
                    </Col>
                    <Col span="8">
                      <span>CPU核数：</span>
                      <span>16</span>
                    </Col>
                    <Col span="8">
                      <span>操作系统版本：</span>
                      <span>Red Hat Enterprise Linx 9</span>
                    </Col>

                    <Row :gutter="1" style="margin-top: 23px">
                      <Col span="8">
                        <span>系统位数：</span>
                        <span>x86_64</span>
                      </Col>
                      <Col span="8">
                        <span>维护人：</span>
                        <span></span>
                      </Col>
                      <Col span="8">
                        <span>维护人联系电话：</span>
                        <span></span>
                      </Col>
                    </Row>
                  </Card>
                </i-col>
              </Col>
            </div>
          </TabPane>
          <TabPane label="历史监控" name="name2">标签二的内容</TabPane>
          <TabPane label="标签三" name="name3">标签三的内容</TabPane>
        </Tabs>
      </div>
    </Row>
  </div>
</template>

<script>
  import {ChartPie, ChartBar, ChartLine} from '_c/charts'

  export default {
    name: 'ChartMonitor',
    components: {
      ChartPie,
      ChartBar,
      ChartLine
    },
    data() {
      return {
        columns: [
          {title: "名称", key: "name", align: "center",},
          {title: "分区空闲大小", key: "size", align: "center",},
          {title: "分区使用率", key: "utilization_rate", align: "center",},
          {title: "分区总容量(自发现)", key: "capacity", align: "center",},
          {title: "分区已使用大小在(自发现)", key: "usedsize", align: "center",},
        ],
        columns2: [
          {title: "名称", key: "name", align: "center",},
          {title: "网卡每秒输入流量", key: "Input_flow", align: "center",},
          {title: "网卡每秒输入错包数", key: "Input_package", align: "center",},
          {title: "网卡每秒输入总包数", key: "Input_sum_package", align: "center",},
          {title: "网卡每秒输出流量", key: "output_flow", align: "center",},
          {title: "网卡每秒输出错包数", key: "output_package", align: "center",},
          {title: "网卡每秒输出总包数", key: "output_sum_package", align: "center",},
          {title: "网卡每秒总流量", key: "sum_flow", align: "center",},
        ],
        // keys: ["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
        // lineCaseData: [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]],
        barCaseData: {}, // {来文: 1,应用升级: 1,故障: 1,重要工作: 2,其他: 2},
        cardlist: [],
        cardlist2: [{"title": "主机基本信息", "flag": "0", "tableData": [{}]},
          {
            "title": "文件分区使用情况", "flag": "1", "tableData": [
              {
                "name": "/",
                "size": "69.79GB",
                "utilization_rate": "21.03%",
                "capacity": "129.15GB",
                "usedsize": "25.79GB"
              },
              {
                "name": "/boot",
                "size": "0.25GB",
                "utilization_rate": "8.65%",
                "capacity": "0.59.15GB",
                "usedsize": "0.79GB"
              },
              {
                "name": "/dev/shm",
                "size": "69.79GB",
                "utilization_rate": "51.03%",
                "capacity": "129.15GB",
                "usedsize": "125.79GB"
              }
            ]
          },
          {
            "title": "网卡使用情况", "flag": "2", "tableData": [{
              "name": "eth0",
              "Input_flow": "26.93KB",
              "Input_package": "0个",
              "Input_sum_package": "226个",
              "output_flow": "7.55KB",
              "output_package": "0个",
              "output_sum_package": "38个",
              "sum_flow": "34.63"
            },
              {
                "name": "eth1",
                "Input_flow": "56.93KB",
                "Input_package": "3个",
                "Input_sum_package": "66个",
                "output_flow": "7.55KB",
                "output_package": "0个",
                "output_sum_package": "38个",
                "sum_flow": "34.63"
              },
              {
                "name": "eth2",
                "Input_flow": "6.93KB",
                "Input_package": "9个",
                "Input_sum_package": "26个",
                "output_flow": "7.55KB",
                "output_package": "0个",
                "output_sum_package": "38个",
                "sum_flow": "34.63"
              }]
          },
          {
            "title": "cpu使用率",
            "flag": "3",
            "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
              [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]
          },
          {
            "title": "内存使用率",
            "flag": "3",
            "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
              [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]
          },
          {
            "title": "磁盘io繁忙时间百分比",
            "flag": "3",
            "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
              [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]
          },
          {
            "title": "磁盘平均每次io等待时间",
            "flag": "3",
            "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
              [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]
          },
        ],
        tagTreeData: [
          {
            title: 'parent 1',
            expand: true,
            children: [
              {
                title: '综合平台车驾',
                expand: true,
                children: [
                  {
                    title: 'app08(10.40.30.87)'
                  },
                  {
                    title: 'app08(10.40.30.87)'
                  }
                ]
              },
              {
                title: '综合平台车驾业务',
                expand: true,
                children: [
                  {
                    title: 'new_http://10.40.34.53:88/FSSF/login/index.xhtml'
                  },
                  {
                    title: 'app08(10.40.30.87)'
                  },
                  {
                    title: 'app08(10.40.30.87)'
                  },
                  {
                    title: 'app08(10.40.30.87)'
                  },
                  {
                    title: 'app08(10.40.30.87)'
                  },
                  {
                    title: 'app08(10.40.30.87)'
                  },
                  {
                    title: 'app08(10.40.30.87)'
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    methods: {
      handlerTreeChange(obj) {
        if (obj.length !== 0) {
          const data = obj[0];
          console.log("111111111111111111111111111")
          console.log(obj)
          console.log("111111111111111111111111111")
          console.log(data["title"].indexOf('http:'))
          if (data["title"].indexOf('http:') >  0 ){

             this.cardlist=[{"title": "系统url返回状态码", "flag": "4", "tableData": [{}]},{
            "title": "系统url响应时间",
            "flag": "5",
            "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
              [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]},]
          }
          else{
            console.log("3333333333333333333333333333333333")
            this.cardlist=[]
            this.cardlist=this.cardlist2
          }
          console.log("111111111111111111111111111")
          console.log("111111111111111111111111111")
        }
      }
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
