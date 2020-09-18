<template>
  <div>
    <Col span="12">
      <Card :bordered="false" style="margin-bottom: 10px" v-for="(item, index) in data" v-if="index % 2 === 0">
        <p slot="title" @click="changeShow(item)">
          <Icon type="md-arrow-dropdown" v-if="item.isShow"></Icon>
          <Icon type="md-arrow-dropright" v-else></Icon>
          {{item.title}}
        </p>
        <p slot="extra" style="font-size: 12px;">
          <Badge status="processing"/>
          <span v-text="item.up_tip"></span>
        </p>
        <Table v-if="item.isShow" class="customtable" :no-data-text="item.errormsg" :columns="item.columns"
               :data="item.tableData"
               size="small" height="300">
        </Table>
        <div class="customspan" v-else>
          <span v-for="(val, k) in item.count"
                :style="{width:(100*val/item.tableData.length) + '%',backgroundColor:getColor(k)}">{{k}}</span>
        </div>
      </Card>
    </Col>
    <Col span="12">
      <Card :bordered="false" style="margin-bottom: 10px" v-for="(item, index) in data" v-if="index % 2 === 1">
        <p slot="title" @click="changeShow(item)">
          <Icon type="md-arrow-dropdown" v-if="item.isShow"></Icon>
          <Icon type="md-arrow-dropright" v-else></Icon>
          {{item.title}}
        </p>
        <p slot="extra" style="font-size: 12px;">
          <Badge status="processing"/>
          <span v-text="item.up_tip"></span>
        </p>
        <Table v-if="item.isShow" class="customtable" :no-data-text="item.errormsg" :columns="item.columns"
               :data="item.tableData"
               size="small" height="300">
        </Table>
        <div class="customspan" v-else>
          <span v-for="(val, k) in item.count"
                :style="{width:(100*val/item.tableData.length) + '%',backgroundColor:getColor(k)}">{{k}}</span>
        </div>
      </Card>
    </Col>
  </div>
</template>

<script>
  export default {
    name: 'CustomInfo',
    props: {
      data: Array,
    },
    methods: {
      changeShow(item) {
        item.isShow = !item.isShow
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
