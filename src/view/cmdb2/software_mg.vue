<template>
  <div>
    <Row :gutter="20">
      <Col span="12">
        <Card>
          <div class="search-con search-con-top">
            <Select v-model="searchKey" class="search-col">
              <Option v-for="item in columns" v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
                      :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}
              </Option>
            </Select>
            <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
            <Button @click="handleSearch" type="primary">搜索</Button>
            <Button
              type="info"
              class="search-btn"
              @click="handlerSoft('','post', '添加软件')"
            >添加软件
            </Button>
          </div>

          <Table size="small" ref="selection" :columns="columns" :data="tableData"
                 @on-row-click="showSoftUpdate"
          >
          </Table>
        </Card>
      </Col>
      <Col span="12">
        <Card>
          <p slot="title">软件升级历史</p>
          <tables ref="tables"
                  v-model="tableData1"
                  :columns="columns1"
                  height="315"
          >
          </tables>
        </Card>
        <Card style="margin-top: 10px">
          <p slot="title">关联的设备</p>
          <tables ref="tables"
                  v-model="tableData2"
                  :columns="columns2"
                  height="200"
          >
          </tables>
        </Card>
      </Col>
    </Row>

    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true width="1000"
           :mask-closable=false>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" inline label-colon=":">
        <FormItem style="width: 970px;">
          <Card>
            <p slot="title">基本信息</p>
            <FormItem label="系统名称" prop="system_name" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.system_name" :maxlength="50" placeholder="请填写系统名称"></Input>
            </FormItem>
            <FormItem label="版本号" prop="system_version" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.system_version" :maxlength="50" placeholder="请填写版本号"></Input>
            </FormItem>
            <FormItem label="上线时间" prop="online_time" style="width: 210px;margin-right: 20px">
              <DatePicker type="datetime" v-model="formValidate.online_time" placeholder="请填写上线时间"></DatePicker>
            </FormItem>
            <FormItem label="开发单位" prop="development" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.development" :maxlength="50" placeholder="请填写开发单位"></Input>
            </FormItem>
            <FormItem label="开发单位联系人" prop="development_contact" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.development_contact" :maxlength="50" placeholder="请填写开发单位联系人"></Input>
            </FormItem>
            <FormItem label="开发单位联系电话" prop="development_phone" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.development_phone" :maxlength="50" placeholder="请填写开发单位联系电话"></Input>
            </FormItem>
            <FormItem label="系统负责人" prop="system_manager" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.system_manager" :maxlength="50" placeholder="请填写系统负责人"></Input>
            </FormItem>
            <FormItem label="系统负责人电话" prop="system_manager_phone" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.system_manager_phone" :maxlength="50" placeholder="请填写系统负责人电话"></Input>
            </FormItem>
            <FormItem label="系统简介" prop="system_info" style="width: 700px;height: 120px;margin-right: 20px">
              <i-input type="textarea" v-model="formValidate.system_info" placeholder="请填写系统简介"
                       :rows="4">
              </i-input>
            </FormItem>
          </Card>
          <Card>
            <p slot="title">基本信息</p>

          </Card>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitSoft('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="modalMap1.modalVisible" :title="modalMap1.modalTitle" :loading=true :footer-hide=true width="540"
           :mask-closable=false>
      <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="85">
        <!--<alert>温馨提示：xxx</alert>-->
        <FormItem label="软件名称" prop="soft_name">
          <div v-if="formValidate1.id">
            <Input v-model="formValidate1.soft_name" :maxlength="50" disabled placeholder='请输入软件名称'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate1.soft_name" :maxlength="50" placeholder='请输入软件名称'></Input>
          </div>
        </FormItem>
        <FormItem label="版本号" prop="version">
          <Input v-model="formValidate1.version" :maxlength="50" placeholder="请输入版本"></Input>
        </FormItem>
        <FormItem label="安装位置" prop="soft_place">
          <Input v-model="formValidate1.soft_place" :maxlength="50" placeholder="请输入安装位置"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitSoftUpdate('formValidate1')">提交</Button>
          <!--<Button @click="handleReset('formValidate1')" style="margin-left: 8px">重置</Button>-->
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>
<script>
  import Icons from "_c/icons";
  import Tables from "_c/tables";
  import FormGroup from "_c/form-group";
  import {
    getSoftList,
    operationSoft,
    operationSoftUpdate,
    getSoftUpdateList,
    getDevSoft,
  } from '@/api/cmdb2/software.js'

  export default {
    components: {
      Icons,
      Tables,
      FormGroup
    },
    data() {
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
          modalTitle: '添加应用',
        },
        modalMap1: {
          modalVisible: false,
          modalTitle: '添加升级记录',
        },
        editModalData: null,
        tableData: [],
        tableSelectIdList: [],
        searchKey: "id",
        searchValue: "",
        formValidate: {
          id: null,
          soft_name: '',
          version: '',
          up_history: 0,
        },

        ruleValidate: {
          soft_name: [{required: true, message: "软件名称不能为空", trigger: "blur"}],
        },

        columns: [
          // {type: 'selection', key: 'id', width: 80, align: 'center'},
          {title: '编号', key: 'id', align: 'center',},
          {title: '软件名称', key: 'soft_name', width: 100, align: 'center'},
          {title: '当前版本', key: 'version', width: 85, align: 'center'},
          {title: '升级记录', key: 'up_history', width: 85, align: 'center'},
          {
            title: '操作', key: 'handle', width: 185, align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button',
                  {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px'
                    },
                    on: {
                      click: () => {
                        this.handlerSoftUpdate(params.row, 'post', '输入升级记录')
                      }
                    }
                  }, '输入升级记录'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.handlerDeleteSoft(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ],

        tableData1: [],
        formValidate1: {
          id: null,
          soft_name: '',
          version: '',
          soft_place: '',
        },

        ruleValidate1: {
          soft_name: [{required: true, message: "软件名称不能为空", trigger: "blur"}],
        },

        columns1: [
          {title: '时间', key: 'create_time', width: 185, align: 'center', sortable: true},
          {title: '软件名称', key: 'soft_name', align: 'center'},
          {title: '版本号', key: 'version', align: 'center'},
          {title: '安装位置', key: 'soft_place', align: 'center'},
        ],

        tableData2: [],
        columns2: [
          {title: 'ID', key: 'id', align: 'center',},
          {title: '设备名称', key: 'device_name', align: 'center',},
          {title: '类型', key: 'device_type', align: 'center',},
          {title: 'ip', key: 'device_ip', align: 'center'},
        ],

        allDevSoft: [],
        allTypeList: [
          {'id': 0, 'type_name': '数据库'},
          {'id': 1, 'type_name': '操作系统'},
          {'id': 2, 'type_name': '中间件'},
          {'id': 3, 'type_name': '应用'},
          {'id': 3, 'type_name': '备份'},
        ],
      }
    },
    methods: {
      // 获取应用列表
      getSoftList(key, value) {
        getSoftList(this.pageNum, 999, key, value).then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data
            this.pageTotal = res.data.count
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取软件升级历史列表
      getSoftUpdateList(key, value) {
        getSoftUpdateList(this.pageNum, 999, key, value).then(res => {
          if (res.data.code === 0) {
            this.tableData1 = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取软件关联的设备
      getDevSoft(key, value) {
        getDevSoft(this.pageNum, 999, key, value).then(res => {
          if (res.data.code === 0) {
            this.tableData2 = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 添加
      handlerSoft(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        if (paramsRow && paramsRow.id) {
          this.formValidate = {
            id: paramsRow.id,
            soft_name: paramsRow.soft_name,
            version: paramsRow.version,
          }
        } else {
          this.formValidate = {
            id: null,
            soft_name: '',
            version: '',
          }
        }
      },
      // 添加软件升级记录
      handlerSoftUpdate(paramsRow, meth, mtitle) {
        this.modalMap1.modalVisible = true
        this.modalMap1.modalTitle = mtitle
        this.editModalData = meth
        if (paramsRow && paramsRow.id) {
          this.formValidate1 = {
            id: paramsRow.id,
            soft_name: paramsRow.soft_name,
            version: paramsRow.version,
            soft_place: paramsRow.soft_place,
          }
        } else {
          this.formValidate1 = {
            id: null,
            soft_name: '',
            version: '',
            soft_place: '',
          }
        }
      },
      showSoftUpdate(data) {
        // console.log(data)
        this.getSoftUpdateList('soft_id', data.id);
      },
      //
      handleSubmitSoft(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              operationSoft(this.formValidate, this.editModalData).then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`);
                    this.getSoftList('id', this.searchVal);
                    this.modalMap.modalVisible = false;
                  } else {
                    this.$Message.error(`${res.data.msg}`);
                  }
                }
              );
            }, 1000);
          } else {
            this.$Message.error('表单校验错误');
          }
        })
      },

      handleSubmitSoftUpdate(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              operationSoftUpdate(this.formValidate1, this.editModalData).then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`);
                    this.getSoftUpdateList('soft_id', this.formValidate1.id);
                    this.getSoftList('id', this.formValidate1.id);
                    this.modalMap1.modalVisible = false;
                  } else {
                    this.$Message.error(`${res.data.msg}`);
                  }
                }
              );
            }, 1000);
          } else {
            this.$Message.error('表单校验错误');
          }
        })
      },

      handlerDeleteSoft(params) {
        if (confirm(`确定要删除应用 ${params.row.soft_name} ？ PS：升级历史记录也会一并删除！！！`)) {
          operationSoft({id: params.row.id}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getSoftList('id', this.searchVal);
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })
        }
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      handlerCheck() {
        this.$Message.error(`待完善`)
      },
      handleClear(e) {
        if (e.target.value === "") this.tableData = this.value;
      },
      handleSearch() {
        this.getSoftList(this.searchKey, this.searchValue);
      },
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
    mounted() {
      this.getSoftList()
    }
  }
</script>
<style lang="less" scoped>
  .search-con {
    padding: 10px 0;

    .search {
      &-col {
        display: inline-block;
        width: 160px;
      }

      &-input {
        display: inline-block;
        width: 250px;
        margin-left: 1px;
      }

      &-input-long {
        display: inline-block;
        width: 480px;
        margin-left: 1px;
      }

      &-btn {
        margin-left: 2px;
        margin-top: 5px;
      }
    }
  }
</style>
