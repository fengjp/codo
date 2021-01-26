<template>
  <div>
    <Row>
      <div v-if="versions === '1'">
        <Row :gutter="10" v-for="item in dataObjList">
          <Col>
            <Card :bordered="false" style="margin-bottom: 10px;">
              <div slot="title" @click="changeShow(item)">
                <row type="flex" justify="center" align="middle">
                  <Col span="6">
                    <p>
                      <Icon type="ios-arrow-down" size="18" v-if="item.isShow"></Icon>
                      <Icon type="ios-arrow-forward" size="18" v-else></Icon>
                      <Tooltip content="收起" transfer placement="top" v-if="item.isShow">
                        <span style="margin-left: 5px;">{{item.name}}</span>
                      </Tooltip>
                      <Tooltip content="展开" transfer placement="top" v-else>
                        <span style="margin-left: 5px;">{{item.name}}</span>
                      </Tooltip>
                      <Icon type="md-notifications" size="20" :style="{'margin-left': '10px', color:item.color}"/>
                    </p>
                  </Col>
                  <Col span="18" style="text-align:left">
                  </Col>
                </row>
              </div>
              <div v-if="item.isShow">
                <Card :bordered="false" dis-hover style="margin-bottom: 10px;" v-for="item2 in item.child">
                  <p slot="title" @click="changeShow(item2)">
                    <Icon type="ios-arrow-down" size="18" v-if="item2.isShow"></Icon>
                    <Icon type="ios-arrow-forward" size="18" v-else></Icon>
                    <Tooltip content="收起" transfer placement="top" v-if="item2.isShow">
                      <span style="margin-left: 5px">{{item2.name}}</span>
                    </Tooltip>
                    <Tooltip content="展开" transfer placement="top" v-else>
                      <span style="margin-left: 5px">{{item2.name}}</span>
                    </Tooltip>
                  </p>
                  <Row :gutter="10">
                    <div v-if="item2.isShow">
                      <Col span="12" v-for="item3 in item2.child">
                        <Card :bordered="false" dis-hover style="margin-bottom: 10px;">
                          <p slot="title">
                        <span @click="changeShow(item3)">
                          <Icon type="ios-arrow-down" size="18" v-if="item3.isShow"></Icon>
                          <Icon type="ios-arrow-forward" size="18" v-else></Icon>
                          <Tooltip content="收起" transfer placement="top" v-if="item3.isShow">
                            <span style="margin-left: 5px">{{item3.title}}</span>
                          </Tooltip>
                          <Tooltip content="展开" transfer placement="top" v-else>
                            <span style="margin-left: 5px">{{item3.title}}</span>
                          </Tooltip>
                        </span>
                            <Tooltip content="历史记录" transfer placement="top">
                              <Icon type="md-pulse" size="20" :style="{'margin-left': '10px', color:'#2d8cf0'}"
                                    @click="showLog(item3)"/>
                            </Tooltip>
                          </p>
                          <p slot="extra" style="font-size: 12px;">
                            <Badge status="processing"/>
                            <span v-text="item3.up_tip"></span>
                          </p>
                          <Table v-if="item3.isShow" class="customtable" :no-data-text="item3.errormsg"
                                 :columns="item3.columns"
                                 :data="item3.tableData"
                                 size="small" height="250">
                          </Table>
                          <div class="customspan" v-else>
                <span v-for="(val, k) in item3.count"
                      :style="{width:(100*val/item3.tableData.length) + '%',backgroundColor:getColor(k)}">{{k}}</span>
                          </div>
                        </Card>
                      </Col>
                    </div>
                    <div v-else>
            <span v-for="showObj2 in item2.showList" style="margin-left: 10px;margin-right: 10px">
              <Button :type="showObj2.ty" size="small" style="margin-bottom: 10px"
                      @click="changeSubShow(showObj2.name,item2)">{{showObj2.name}}</Button>
            </span>
                    </div>
                  </Row>
                </Card>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div v-if="versions === '2'">
        <Row :gutter="10" v-for="(item,key) in dataObjList[0]">
          <div v-if="key === 'child'">
            <Card :bordered="false" dis-hover style="margin-bottom: 10px;" v-for="item2 in item">
              <p slot="title" @click="changeShow(item2)">
                <Icon type="ios-arrow-down" size="18" v-if="item2.isShow"></Icon>
                <Icon type="ios-arrow-forward" size="18" v-else></Icon>
                <Tooltip content="收起" transfer placement="top" v-if="item2.isShow">
                  <span style="margin-left: 5px">{{item2.name}}</span>
                </Tooltip>
                <Tooltip content="展开" transfer placement="top" v-else>
                  <span style="margin-left: 5px">{{item2.name}}</span>
                </Tooltip>
              </p>
              <Row :gutter="10">
                <div v-if="item2.isShow">
                  <Col span="12" v-for="item3 in item2.child">
                    <Card :bordered="false" dis-hover style="margin-bottom: 10px;">
                      <p slot="title" @click="changeShow(item3)">
                        <Icon type="ios-arrow-down" size="18" v-if="item3.isShow"></Icon>
                        <Icon type="ios-arrow-forward" size="18" v-else></Icon>
                        <Tooltip content="收起" transfer placement="top" v-if="item3.isShow">
                          <span style="margin-left: 5px">{{item3.title}}</span>
                        </Tooltip>
                        <Tooltip content="展开" transfer placement="top" v-else>
                          <span style="margin-left: 5px">{{item3.title}}</span>
                        </Tooltip>
                      </p>
                      <p slot="extra" style="font-size: 12px;">
                        <Badge status="processing"/>
                        <span v-text="item3.up_tip"></span>
                      </p>
                      <Table v-if="item3.isShow" class="customtable" :no-data-text="item3.errormsg"
                             :columns="item3.columns"
                             :data="item3.tableData"
                             size="small" height="250">
                      </Table>
                      <div class="customspan" v-else>
                <span v-for="(val, k) in item3.count"
                      :style="{width:(100*val/item3.tableData.length) + '%',backgroundColor:getColor(k)}">{{k}}</span>
                      </div>
                    </Card>
                  </Col>
                </div>
                <div v-else>
            <span v-for="showObj2 in item2.showList" style="margin-left: 10px;margin-right: 10px">
              <Button :type="showObj2.ty" size="small" style="margin-bottom: 10px"
                      @click="changeSubShow(showObj2.name,item2)">{{showObj2.name}}</Button>
            </span>
                </div>
              </Row>
            </Card>
          </div>
        </Row>
      </div>
    </Row>
    <div>
      <Modal v-model="modalChart.modalVisible" :title="modalChart.modalTitle" :footer-hide=true width="800">
        <chart-line ref="chartLine" style="height: 340px;" :value="chartData"></chart-line>
      </Modal>
    </div>
  </div>
</template>

<script>
  import {ChartLine, ChartBar} from '_c/charts'
  import {getQueryLog} from '@/api/customquery/query'

  export default {
    name: 'CustomInfo',
    props: {
      dataObjList: Array
    },
    components: {
      ChartLine,
      ChartBar
    },
    data() {
      return {
        versions: this.$config.versions,
        chartData: {},
        modalChart: {
          modalVisible: false,
          modalTitle: '历史记录'
        },
      }
    },
    methods: {
      showLog(item) {
        this.modalChart.modalVisible = true
        getQueryLog(item.id, item.query_ty).then(res => {
          this.chartData = res.data.data
          this.$refs.chartLine.initLine(this.chartData)
          this.$refs.chartLine.resize()
        })
      },
      changeShow(item) {
        item.isShow = !item.isShow
      },
      changeSubShow(na, item) {
        // console.log(item.child)
        item.isShow = true
        for (let i in item.child) {
          if (item.child[i].title === na) {
            item.child[i].isShow = true
          }
        }
      },
      getColor(k) {
        if (k === '正常') {
          return '#19be6b'
        } else if (k === '一般') {
          return '#fadb14'
        } else if (k === '严重') {
          return '#ff9900'
        } else if (k === '致命') {
          return '#ed4014'
        } else if (k === '未知') {
          return '#c5c8ce'
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .customspan span {
    text-align: center;
    font-size: 12px;
    line-height: 25px;
    height: 25px;
    background-color: #19be6b;
    color: white;
    display: inline-block;
  }
</style>
