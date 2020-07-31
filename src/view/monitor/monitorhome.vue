<template>
  <div>
    <Row :gutter="20" style="margin-top: 10px;">
      <div v-for="(item, index) in cardlist">
        <Col span="11" style="margin: 10px; margin-left: 10px;" v-if="item.flag == '3'">
          <Card :bordered="false">
            <chart-line :keylist="item.tableData[0]" :text="item.title" :value="item.tableData[1]" flag="1"
                        ref="childCaseLine" style="height: 340px;"/>
          </Card>
        </Col>
        <Col span="11" style="margin: 10px;" v-if="item.flag == '1'">
          <Card :bordered="false" shadow>
            <p slot="title" v-text="item.title"></p>
            <Table height="290"  border :columns="item.tableColumns" :data="item.tableData" size="small"></Table>
          </Card>
        </Col>
         <Col span="11" style="margin: 10px;" v-if="item.flag == '2'">
          <Card :bordered="false" shadow>
            <p slot="title" v-text="item.title"></p>
            <Table height="290"  border :columns="item.tableColumns" :data="item.tableData" size="small"></Table>
          </Card>
        </Col>
        <Col span="11" style="margin: 10px;" v-if="item.flag == '5'">
          <Card :bordered="false" shadow>
            <p slot="title" v-text="item.title"></p>
            <Table height="290"  border :columns="item.tableColumns" :data="item.tableData" size="small"></Table>
          </Card>
        </Col>
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
        columns: [],
        // {title: "名称", key: "name", align: "center",},
        // {title: "分区空闲大小", key: "size", align: "center",},
        // {title: "分区使用率", key: "utilization_rate", align: "center",},
        // {title: "分区总容量(自发现)", key: "capacity", align: "center",},
        // {title: "分区已使用大小在(自发现)", key: "usedsize", align: "center",},
        // ],
        barCaseData: {}, // {来文: 1,应用升级: 1,故障: 1,重要工作: 2,其他: 2},
        cardlist: [],
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
                    title: 'oracle_10.40.30.87'
                  },
                  {
                    title: 'mysql_10.40.30.87'
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
      getColumns2(data_table){
        var columns = []

        for (var totitle in  data_table) {
          console.log(totitle)
          console.log(data_table[totitle])
            if (totitle == "维度名称") {

              columns.push({title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  return h('div', [
                    h('a', {

                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params)
                        }
                      }
                    }, params.row.name)
                  ]);
                }
              })
            }
            else if (totitle == "致命") {
              columns.push({title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      style: {
                        backgroundColor: "#f56a6a",
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params)
                        }
                      }
                    }, params.row.zhiming)
                  ]);
                }
              })
            }
            else if (totitle == "严重") {
              columns.push({title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      style: {
                        backgroundColor: "#ff8e7a"
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params)
                        }
                      }
                    }, params.row.yanzhong)
                  ]);
                }
              })
            }
            else if (totitle == "警告") {
              columns.push({title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      style: {
                        backgroundColor: "#ffbe72",
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params)
                        }
                      }
                    }, params.row.jinggao)
                  ]);
                }
              })
            }
            else if (totitle == "预警") {
              columns.push({title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      style: {
                        backgroundColor: "#ffdd76",
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params)
                        }
                      }
                    }, params.row.yujing)
                  ]);
                }
              })
            }
            else if (totitle == "提示") {
              columns.push({title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      style: {
                        backgroundColor: "#7ed2ff",
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params)
                        }
                      }
                    }, params.row.tishi)
                  ]);
                }
              })
            }
            else if (totitle == "其他") {
              columns.push({title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      style: {
                        backgroundColor: "#6be3df",
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params)
                        }
                      }
                    }, params.row.qita)
                  ]);
                }
              })
            }
            else if (totitle == "总数") {
              columns.push({title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  return h('div', [
                    h('Button', {
                      style: {
                        backgroundColor: "ghostwhite",
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params)
                        }
                      }
                    }, params.row.zongshu)
                  ]);
                }
              })
            }
            else {
              columns.push({title: totitle, key: data_table[totitle], align: "center"})
            }

        }
        console.log(columns)
        return columns
      },
      getColumns1(data_table){
        var columns = []

        for (var totitle in  data_table) {
          console.log(totitle)
          console.log(data_table[totitle])
            if (totitle == "资源名称") {

              columns.push({title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  return h('div', [
                    h('a', {
                      attrs:{
                        href:'/monitor/monitor_mg',
                      },
                      on: {
                        click: () => {
                          console.log(params)
                        }
                      }
                    }, params.row.name)
                  ]);
                }
              })
            } else {
              columns.push({title: totitle, key: data_table[totitle], align: "center"})
            }

        }
        console.log(columns)
        return columns
      },
      getColumns(data_table){
        var columns = []

        for (var totitle in  data_table) {
          console.log(totitle)
          console.log(data_table[totitle])
            if (totitle == "可用性") {

              columns.push({
                title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  if (params["row"]["Health"][0] > 0){
                      var totype="md-close-circle"
                      var toyanse = "red"
                  }
                  else{
                      var totype = "ios-checkmark-circle"
                      var toyanse = "green"
                  }
                  return h('div', [
                    h('Icon', {
                      props: {
                        type: totype,
                        size: '30',
                        color: toyanse
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params)
                        }
                      }
                    }, '')
                  ]);
                }
              })
            } else if (totitle == "健康度") {
              columns.push({
                title: totitle, key: data_table[totitle], align: "center", render: (h, params) => {
                  var proportion = "0" + '%'
                  var proportion1 = "0" + '%'
                  var proportion2 = "0" + '%'
                  var allsum  =  parseInt(params["row"]["Health"][0]) + parseInt(params["row"]["Health"][1]) + parseInt(params["row"]["Health"][2])
                  proportion = parseInt(params["row"]["Health"][0]) / allsum  * 100 + '%'
                  proportion1 = parseInt(params["row"]["Health"][1]) / allsum  * 100 + '%'
                  proportion2 = parseInt(params["row"]["Health"][2]) / allsum  * 100 + '%'
                  return h('div', {
                    style: {
                      display: "flex",
                    },
                  }, [
                    h('span', {
                      class: {
                        pspan: "pspan"
                      },
                      style: {
                        backgroundColor: 'red',
                        width: proportion
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                          console.log(params["row"]["Health"][0])
                        }
                      }
                    }, params["row"]["Health"][0]),
                    h('span', {
                      class: {
                        prspan: "prspan"
                      },
                      style: {
                        backgroundColor: 'orange',
                        width: proportion1
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                        }
                      }
                    }, params["row"]["Health"][1]),
                    h('span', {
                      class: {
                        priorityspan: "priorityspan"
                      },
                      style: {
                        backgroundColor: "green",
                        width: proportion2,
                      },
                      on: {
                        click: () => {
                          // this.show(params.index)
                        }
                      }
                    }, params["row"]["Health"][2])
                  ]);
                }
              })
            } else {
              columns.push({title: totitle, key: data_table[totitle], align: "center"})
            }

        }
        console.log(columns)
        return columns
      },
      handlerChange() {
        this.columns = []
        var data_table = {"业务系统": "name", "可用性": "use", "健康度": "Health"}
        var data_table1 = {"资源名称":"name","IP地址":"ipAddr","磁盘Io繁忙的时间百分比":"timeProportion","物理内存使用率":"Physics","虚拟内存使用率":"fictitious","CPU使用率":"CPU",}
        var data_table2 =  {"维度名称": "name", "致命": "致命", "严重": "yanzhong","警告": "jinggao", "预警": "yujing", "提示": "tishi","其他":"qita","总数":"zongshu"}
        var tocolumns = this.getColumns(data_table)
        var tocolumns1 = this.getColumns1(data_table1)
        var tocolumns2 = this.getColumns2(data_table2)
        this.cardlist = [{
          "title": "业务系统总览",
          "flag": "1",
          "tableColumns":tocolumns,
          "tableData": [{"name": "new_http://10.30.30.246/trffw", "use": "123", "Health": [0,5,23]},{"name": "new_http://10.60.30.246/trffw", "use": "123", "Health": [1,35,23]},{"name": "new_http://10.10.30.246/trffw", "use": "123", "Health": [1,25,23]},]
        }, {
          "title": "交管系统--设备总览",
          "flag": "1",
          "tableColumns":tocolumns,
          "tableData": [{"name": "new_http://10.30.30.246/trffw", "use": "123", "Health": [1,5,23]},{"name": "new_http://10.60.30.246/trffw", "use": "123", "Health": [1,35,23]},{"name": "new_http://10.10.30.246/trffw", "use": "123", "Health": [0,25,23]},]
        },
          {
          "title": "业务告警视图",
          "flag": "5",
          "tableColumns":tocolumns2,
          "tableData": [{"name": "综合应用平台", "zhiming": "1", "yanzhong": "10","jinggao": "10", "yujing": "12", "tishi": "23","qita": "0", "zongshu": "13"},{"name": "综合应用平台大数据", "zhiming": "1", "yanzhong": "10","jinggao": "10", "yujing": "12", "tishi": "23","qita": "0", "zongshu": "13"},{"name": "综合应用平台", "zhiming": "1", "yanzhong": "10","jinggao": "10", "yujing": "12", "tishi": "23","qita": "0", "zongshu": "13"},{"name": "综合应用平台", "zhiming": "1", "yanzhong": "10","jinggao": "10", "yujing": "12", "tishi": "23","qita": "0", "zongshu": "13"},]
        },
          {
          "title": "交管系统--设备总览",
          "flag": "2",
          "tableColumns":tocolumns1,
          "tableData": [{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},
            {"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},{"name": "68.4.50.69", "ipAddr": "68.4.50.69", "timeProportion": "399%","Physics": "95%", "fictitious": "0.00%", "CPU": "0.97%"},
          ]
        },
          {
          "title": "系统url响应时间",
          "flag": "3",
          "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
            [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]
        },{
          "title": "系统url响应时间",
          "flag": "3",
          "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
            [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]
        },{
          "title": "系统url响应时间",
          "flag": "3",
          "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
            [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]
        },{
          "title": "系统url响应时间",
          "flag": "3",
          "tableData": [["06:00", "08:00", "10:00", "12:00", "15:30", "18:00", "20:00", "20:30", "21:00", "22:00", "23:00", "01:00"],
            [[11, 20, 30, 33, 50, 23, 96, 25, 20, 23, 65, 16], [51, 20, 30, 33, 50, 23, 96, 25, 50, 23, 65, 16], [9, 20, 30, 33, 30, 23, 96, 25, 20, 23, 65, 16], [31, 20, 30, 33, 50, 23, 96, 25, 20, 53, 65, 16]]]
        },{
          "title": "交管系统--设备总览",
          "flag": "5",
          "tableColumns":tocolumns2,
          "tableData": [{"name": "综合应用平台", "zhiming": "1", "yanzhong": "10","jinggao": "10", "yujing": "12", "tishi": "23","qita": "0", "zongshu": "13"},{"name": "综合应用平台大数据", "zhiming": "1", "yanzhong": "10","jinggao": "10", "yujing": "12", "tishi": "23","qita": "0", "zongshu": "13"},{"name": "综合应用平台", "zhiming": "1", "yanzhong": "10","jinggao": "10", "yujing": "12", "tishi": "23","qita": "0", "zongshu": "13"},{"name": "综合应用平台", "zhiming": "1", "yanzhong": "10","jinggao": "10", "yujing": "12", "tishi": "23","qita": "0", "zongshu": "13"},]
        },]

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
      this.handlerChange()
    }
  }
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }

  .priorityspan {
    display: block;
    color: #F0F0F0;
  }

  .pspan {
    display: block;
    color: #F0F0F0;
  }

  .prspan {
    display: block;
    color: #F0F0F0;
  }
</style>
