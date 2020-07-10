<template>
  <div>
    <Row :gutter="20">
      <Col span="6">
        <Card :bordered="false">
          <p slot="title" v-text="pt1"></p>
          <tables ref="tables1"
                  v-model="tableData1"
                  :columns="columns1"
                  height="200"
                  :show-header="false"
                  editable
          >
          </tables>
          <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed" style="width: 50%"
                  @click="addSoftTr('tables1')">
            <Icon type="md-add"/>
            <span>新增</span>
          </button>
          <button type="success" class="ivu-mt ivu-btn btn-dashed-success" style="width: 50%"
                  @click="soft_save('tableData1')" v-if="tableData1.isEditing">
            <Icon type="ios-checkmark"/>
            <span>保存</span>
          </button>
        </Card>
        <Card style="margin-top: 10px" :bordered="false">
          <p slot="title" v-text="pt2"></p>
          <tables ref="tables2"
                  v-model="tableData2"
                  :columns="columns2"
                  height="200"
                  :show-header="false"
                  editable
          >
          </tables>
          <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed" style="width: 50%"
                  @click="addSoftTr('tables2')">
            <Icon type="md-add"/>
            <span>新增</span>
          </button>
          <button type="success" class="ivu-mt ivu-btn btn-dashed-success" style="width: 50%"
                  @click="soft_save('tableData2')" v-if="tableData2.isEditing">
            <Icon type="ios-checkmark"/>
            <span>保存</span>
          </button>
        </Card>
      </Col>
      <Col span="6">
        <Card :bordered="false">
          <p slot="title" v-text="pt3"></p>
          <tables ref="tables3"
                  v-model="tableData3"
                  :columns="columns3"
                  height="200"
                  :show-header="false"
                  editable
          >
          </tables>
          <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed" style="width: 50%"
                  @click="addSoftTr('tables3')">
            <Icon type="md-add"/>
            <span>新增</span>
          </button>
          <button type="success" class="ivu-mt ivu-btn btn-dashed-success" style="width: 50%"
                  @click="soft_save('tableData3')" v-if="tableData3.isEditing">
            <Icon type="ios-checkmark"/>
            <span>保存</span>
          </button>
        </Card>
        <Card style="margin-top: 10px" :bordered="false">
          <p slot="title" v-text="pt4"></p>
          <tables ref="tables4"
                  v-model="tableData4"
                  :columns="columns4"
                  height="200"
                  :show-header="false"
                  editable
          >
          </tables>
          <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed" style="width: 50%"
                  @click="addSoftTr('tables4')">
            <Icon type="md-add"/>
            <span>新增</span>
          </button>
          <button type="success" class="ivu-mt ivu-btn btn-dashed-success" style="width: 50%"
                  @click="soft_save('tableData4')" v-if="tableData4.isEditing">
            <Icon type="ios-checkmark"/>
            <span>保存</span>
          </button>
        </Card>
      </Col>
      <Col span="6">
        <Card :bordered="false">
          <p slot="title" v-text="pt5"></p>
          <tables ref="tables5"
                  v-model="tableData5"
                  :columns="columns5"
                  height="200"
                  :show-header="false"
                  editable
          >
          </tables>
          <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed" style="width: 50%"
                  @click="addSoftTr('tables5')">
            <Icon type="md-add"/>
            <span>新增</span>
          </button>
          <button type="success" class="ivu-mt ivu-btn btn-dashed-success" style="width: 50%"
                  @click="soft_save('tableData5')" v-if="tableData5.isEditing">
            <Icon type="ios-checkmark"/>
            <span>保存</span>
          </button>
        </Card>
        <Card style="margin-top: 10px" :bordered="false">
          <p slot="title" v-text="pt6"></p>
          <tables ref="tables6"
                  v-model="tableData6"
                  :columns="columns6"
                  height="200"
                  :show-header="false"
                  editable
          >
          </tables>
          <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed" style="width: 50%"
                  @click="addSoftTr('tables6')">
            <Icon type="md-add"/>
            <span>新增</span>
          </button>
          <button type="success" class="ivu-mt ivu-btn btn-dashed-success" style="width: 50%"
                  @click="soft_save('tableData6')" v-if="tableData6.isEditing">
            <Icon type="ios-checkmark"/>
            <span>保存</span>
          </button>
        </Card>
      </Col>
      <Col span="6">
        <Card :bordered="false">
          <p slot="title" v-text="pt7"></p>
          <tables ref="tables7"
                  v-model="tableData7"
                  :columns="columns7"
                  height="200"
                  :show-header="false"
                  editable
          >
          </tables>
          <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed" style="width: 50%"
                  @click="addSoftTr('tables7')">
            <Icon type="md-add"/>
            <span>新增</span>
          </button>
          <button type="success" class="ivu-mt ivu-btn btn-dashed-success" style="width: 50%"
                  @click="soft_save('tableData7')" v-if="tableData7.isEditing">
            <Icon type="ios-checkmark"/>
            <span>保存</span>
          </button>
        </Card>
        <Card style="margin-top: 10px" :bordered="false">
          <p slot="title" v-text="pt8"></p>
          <tables ref="tables8"
                  v-model="tableData8"
                  :columns="columns8"
                  height="200"
                  :show-header="false"
                  editable
          >
          </tables>
          <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed" style="width: 50%"
                  @click="addSoftTr('tables8')">
            <Icon type="md-add"/>
            <span>新增</span>
          </button>
          <button type="success" class="ivu-mt ivu-btn btn-dashed-success" style="width: 50%"
                  @click="soft_save('tableData8')" v-if="tableData8.isEditing">
            <Icon type="ios-checkmark"/>
            <span>保存</span>
          </button>
        </Card>
      </Col>

    </Row>

  </div>
</template>
<script>
import Icons from '_c/icons'
import Tables from '_c/tables'
import FormGroup from '_c/form-group'
import {
  getSoftList,
  operationSoft,
  getSoftTpye
} from '@/api/cmdb/software.js'

export default {
  components: {
    Icons,
    Tables,
    FormGroup
  },
  data () {
    return {
      // 分页
      ruleLoading: false,
      ruleModal: false,
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      searchVal: '',
      modalMap: {
        modalVisible: false,
        modalTitle: '添加应用'
      },
      editModalData: null,
      tableData: [],
      tableSelectIdList: [],
      searchKey: 'id',
      searchValue: '',
      formValidate: {
        id: null,
        soft_name: '',
        version: '',
        up_history: 0
      },

      tableData1: [],
      columns1: [
        { title: '名称', key: 'soft_name', align: 'center', editable: true }
      ],

      tableData2: [],
      columns2: [
        { title: '名称', key: 'soft_name', align: 'center', editable: true }
      ],

      tableData3: [],
      columns3: [
        { title: '名称', key: 'soft_name', align: 'center', editable: true }
      ],

      tableData4: [],
      columns4: [
        { title: '名称', key: 'soft_name', align: 'center', editable: true }
      ],

      tableData5: [],
      columns5: [
        { title: '名称', key: 'soft_name', align: 'center', editable: true }
      ],

      tableData6: [],
      columns6: [
        { title: '名称', key: 'soft_name', align: 'center', editable: true }
      ],

      tableData7: [],
      columns7: [
        { title: '名称', key: 'soft_name', align: 'center', editable: true }
      ],

      tableData8: [],
      columns8: [
        { title: '名称', key: 'soft_name', align: 'center', editable: true }
      ],

      soft_type: {},
      pt1: '操作系统',
      pt2: '虚拟化',
      pt3: '数据库',
      pt4: '服务',
      pt5: '中间件',
      pt6: '应用服务',
      pt7: 'Web服务',
      pt8: '其他'
    }
  },
  methods: {
    // 增加一行应用软件
    addSoftTr (value) {
      const add_obj = {
        soft_name: '',
        soft_type: 8
      };
      if (value === 'tables1') {
        add_obj.soft_type = 1;
        this.tableData1.push(add_obj);
        this.tableData1.isEditing = true
      }
      if (value === 'tables2') {
        add_obj.soft_type = 2;
        this.tableData2.push(add_obj);
        this.tableData2.isEditing = true
      }
      if (value === 'tables3') {
        add_obj.soft_type = 3;
        this.tableData3.push(add_obj);
        this.tableData3.isEditing = true
      }
      if (value === 'tables4') {
        add_obj.soft_type = 4;
        this.tableData4.push(add_obj);
        this.tableData4.isEditing = true
      }
      if (value === 'tables5') {
        add_obj.soft_type = 5;
        this.tableData5.push(add_obj);
        this.tableData5.isEditing = true
      }
      if (value === 'tables6') {
        add_obj.soft_type = 6;
        this.tableData6.push(add_obj);
        this.tableData6.isEditing = true
      }
      if (value === 'tables7') {
        add_obj.soft_type = 7;
        this.tableData7.push(add_obj);
        this.tableData7.isEditing = true
      }
      if (value === 'tables8') {
        add_obj.soft_type = 8;
        this.tableData8.push(add_obj);
        this.tableData8.isEditing = true
      }
    },

    soft_save (value) {
      let postdata = {};
      if (value === 'tableData1') {
        postdata = this.tableData1
      }
      if (value === 'tableData2') {
        postdata = this.tableData2
      }
      if (value === 'tableData3') {
        postdata = this.tableData3
      }
      if (value === 'tableData4') {
        postdata = this.tableData4
      }
      if (value === 'tableData5') {
        postdata = this.tableData5
      }
      if (value === 'tableData6') {
        postdata = this.tableData6
      }
      if (value === 'tableData7') {
        postdata = this.tableData7
      }
      if (value === 'tableData8') {
        postdata = this.tableData8
      }
      operationSoft(postdata, 'post').then(
        res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.$set(postdata, 'isEditing', false);
            this.getSoftList()
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        }
      )
    },

    getSoftList (key, value) {
      getSoftList(this.pageNum, 999, key, value).then(res => {
        if (res.data.code === 0) {
          this.tableData1 = res.data.data[1];
          this.tableData2 = res.data.data[2];
          this.tableData3 = res.data.data[3];
          this.tableData4 = res.data.data[4];
          this.tableData5 = res.data.data[5];
          this.tableData6 = res.data.data[6];
          this.tableData7 = res.data.data[7];
          this.tableData8 = res.data.data[8]
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },

    getSoftTpye () {
      getSoftTpye().then(res => {
        if (res.data.code === 0) {
          this.soft_type = res.data.data;
          this.pt1 = this.soft_type[1];
          this.pt2 = this.soft_type[2];
          this.pt3 = this.soft_type[3];
          this.pt4 = this.soft_type[4];
          this.pt5 = this.soft_type[5];
          this.pt6 = this.soft_type[6];
          this.pt7 = this.soft_type[7];
          this.pt8 = this.soft_type[8]
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },

    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handlerCheck () {
      this.$Message.error('待完善')
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      // this.getSoftList(this.searchKey, this.searchValue);
    }
  },
  watch: {
    // searchVal (val) {
    //   this.searchVal = val
    //   if(this.selectTwo === 'tag'){
    //     this.getTagList("tag_name", this.searchVal)
    //   }else if(this.selectTwo === 'DB'){
    //     this.getDBList(this.searchVal)
    //   }else if(this.selectTwo === 'server'){
    //     this.getServerList(this.searchVal)
    //   }
    // }
  },
  mounted () {
    this.getSoftTpye();
    this.getSoftList()
  }
}
</script>
<style lang="less" scoped>
  .btn-dashed-success {
    color: #19be6b;
    background-color: #fff;
    border-color: #19be6b;
    border-style: dashed;
  }

</style>
