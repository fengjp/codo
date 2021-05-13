<template>
  <div>
    <Row :gutter="10" style="margin-top: 10px;">
      <Card :bordered="false" dis-hover style="margin-bottom: 10px;" v-for="item in topObjList">
        <p slot="title" @click="changeShow(item)">
          <Icon type="ios-arrow-down" size="18" v-if="item.isShow"></Icon>
          <Icon type="ios-arrow-forward" size="18" v-else></Icon>
          <Tooltip content="收起" transfer placement="top" v-if="item.isShow">
            <span style="margin-left: 5px">{{item.name}}</span>
          </Tooltip>
          <Tooltip content="展开" transfer placement="top" v-else>
            <span style="margin-left: 5px">{{item.name}}</span>
          </Tooltip>
        </p>
        <Row :gutter="10">
          <Col span="12" v-for="item2 in item.child">
            <Card :bordered="false" dis-hover style="margin-bottom: 10px;">
              <p slot="title">
              <span @click="changeShow(item2)">
                <Icon type="ios-arrow-down" size="18" v-if="item2.isShow"></Icon>
                <Icon type="ios-arrow-forward" size="18" v-else></Icon>
                <Tooltip content="收起" transfer placement="top" v-if="item2.isShow">
                  <span style="margin-left: 5px">{{item2.title}}</span>
                </Tooltip>
                <Tooltip content="展开" transfer placement="top" v-else>
                  <span style="margin-left: 5px">{{item2.title}}</span>
                </Tooltip>
              </span>
              </p>
              <p slot="extra" style="font-size: 12px;">
                <Badge status="processing"/>
                <span v-text="item2.up_tip"></span>
              </p>
              <Table v-if="item2.isShow" class="customtable" :no-data-text="item2.errormsg"
                     :columns="item2.columns"
                     :data="item2.tableData"
                     size="small" height="100">
              </Table>
              <div class="customspan" v-else>
              <span v-for="(val, k) in item2.count"
                    :style="{width:(100*val/item2.tableData.length) + '%',backgroundColor:getColor(k)}">{{k}}
              </span>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
import { getQueryLog } from '@/api/customquery/query'

export default {
  name: 'CustomInfo',
  props: {
    topObjList: Array
  },
  components: {
  },
  data () {
    return {
      versions: this.$config.versions,
      chartData: {}
    }
  },
  methods: {
    changeShow (item) {
      item.isShow = !item.isShow
    },
    changeSubShow (na, item) {
      item.isShow = true
      for (let i in item.child) {
        if (item.child[i].title === na) {
          item.child[i].isShow = true
        }
      }
    },
    getColor (k) {
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
  }
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
