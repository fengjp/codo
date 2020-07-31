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
               <Col span="24" style="margin: 10px;" v-if="item.flag == '7'">
                <Card :bordered="false" shadow>
                  <p slot="title" v-text="item.title"></p>
                  <Table :columns="columns3" :data="item.tableData" size="small"></Table>
                </Card>
              </Col>
              <Col span="24" style="margin: 10px;" v-if="item.flag == '6'">
                <Card>
<!--                  <p slot="title">数据库基础信息</p>-->
                  <p slot="title" v-text="item.title"></p>
                  <Form label-position="right" :label-width="120" inline label-colon=":" >
                    <FormItem :label= tokey style="width: 30%" v-for=" (value,tokey) in item.tableData[0]">
                      <span style="font-size: 12px;">{{value}}</span>
                    </FormItem>
                  </Form>
                </Card>
              </Col>
              <Col span="11" style="margin: 10px; margin-left: 30px;" v-if="item.flag == '5'">
                <Card :bordered="false">
                  <chart-line :keylist="item.tableData[0]" :text="item.title" :value="item.tableData[1]" flag="1"
                              ref="childCaseLine" style="height: 340px;"/>
                </Card>
              </Col>
              <Col span="11" style="margin: 10px; margin-left: 30px;" v-if="item.flag == '4'">
                <Card :bordered="false">
<!--                  <p slot="title">系统url返回状态码</p>-->
                  <p slot="title" v-text="item.title"></p>
                  <Form label-position="right" :label-width="90" inline label-colon=":" >
                    <FormItem :label= tokey style="width: 45%" v-for=" (value,tokey) in item.tableData[0]">
                      <span style="font-size: 12px;">{{value}}</span>
                    </FormItem>
                  </Form>
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
                <Card>
<!--                  <p slot="title">主机信息</p>-->
                  <p slot="title" v-text="item.title"></p>
                  <Form label-position="right" :label-width="120" inline label-colon=":" >
                    <FormItem :label= tokey style="width: 30%" v-for=" (value,tokey) in item.tableData[0]">
                      <span style="font-size: 12px;">{{value}}</span>
                    </FormItem>
                  </Form>
                </Card>
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
  import {getTree,getCard} from "@/api/monitor"

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
          {title: "分区已使用大小(自发现)", key: "usedsize", align: "center",},
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
        columns3: [
          {title: "名称", key: "name", align: "center",},
          {title: "oracle表空间空闲大小", key: "space_size", align: "center",},
          {title: "oracle表空间使用率", key: "space_rate", align: "center",},
          {title: "oracle表空间总大小", key: "space_sumsize", align: "center",},
          {title: "oracle表空间使用大小", key: "space_usesize", align: "center",},
          {title: "oracle表空间类型", key: "space_type", align: "center",},
        ],
        // keys: ["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
        // lineCaseData: [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]],
        barCaseData: {}, // {来文: 1,应用升级: 1,故障: 1,重要工作: 2,其他: 2},
        cardlist: [],
        cardlist2: [{"title": "主机基本信息", "flag": "0", "tableData": [{"系统IP":"10.40.30.53","主机":"app03(10.40.30.53)","CPU频率":"1596MHz","物理内存总大小":"7.74","CPU核数":"16","操作系统版本":"Red Hat Linux","系统位数":"x86_64","维护人":"10.40.30.53","维护人联系电话":"10.40.30."}]},
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
        tagTreeData: [],
      }
    },
    methods: {
      getTree(){
        getTree().then(res => {
          if (res.data.code === 0) {
            this.tagTreeData = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }

        })
      },
      getCard(key,value){
        getCard(key,value).then(res => {
          setTimeout(() => {
            if (res.data.code === 0) {
              this.cardlist.push(res.data.data[0])
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          }, 1000)
        })
      },
      handlerTreeChange(obj) {
        if (obj.length !== 0) {
          const data = obj[0];
          // console.log(data)
          if (data["title"].indexOf('http:') >= 0) {
            //传卡片类型

            this.cardlist = [{"title": "系统url返回状态码", "flag": "4", "tableData": [{"名称":"new_http://10.40.30.246/trffw","是否关键URL":"是","管理ip":"10.40.34.102","系统URL返回状态码":"200"}]}, {
              "title": "系统url响应时间",
              "flag": "5",
              "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
                [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]
            },]
          }
          else if(data["type"] == "3"){
            var key  = data["title"]
            var value = "6,7,3"
            this.getCard(key,value)
            this.cardlist = []
            this.cardlist = [{"title": "数据库基本信息", "flag": "6", "tableData": [{"系统IP":"10.40.30.53","使用状态":"在线","端口号(监听端口)":"1521","锁总数":"0","进程总数":"106","数据库繁忙度(ACS)":"0.04","缓冲池命中率":"93.55","维护人":"","维护人联系电话":"88886666"}]},{
            "title": "数据库表空间使用情况", "flag": "7", "tableData": [
              {
                "name": "DZPW",
                "space_size": "69.79GB",
                "space_rate": "21.03%",
                "space_sumsize": "129.15GB",
                "space_usesize": "25.79GB",
                "space_type": "25.79GB"
              },
              {
                "name": "FSSF",
                "space_size": "69.79GB",
                "space_rate": "21.03%",
                "space_sumsize": "129.15GB",
                "space_usesize": "25.79GB",
                "space_type": "25.79GB"
              },
              {
                "name": "USERS",
                "space_size": "69.79GB",
                "space_rate": "21.03%",
                "space_sumsize": "129.15GB",
                "space_usesize": "25.79GB",
                "space_type": "25.79GB"
              }
            ]
          },
            {"title": "缓冲池命中率", "flag": "3","tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"], [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]},
            {"title": "数据库事件等待率", "flag": "3","tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"], [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]},
            {"title": "行锁数量", "flag": "3","tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"], [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]},
            {"title": "每秒执行sql", "flag": "3","tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"], [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]},
            ]
          }
          else {
            var key  = data["title"]
            var value = "0"
            this.getCard(key,value)
            value = "1"
            this.getCard(key,value)
            // var value = "2"
            // getCard(key,value)
            // var value = "3"
            // getCard(key,value)
          }
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
    },
    mounted() {
      this.getTree();

    }
  }
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
