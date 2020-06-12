<template>
  <div>
    <Row :gutter="20">
      <Col>
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
              @click="handlerSys('','post', '添加系统')"
            >添加系统
            </Button>
          </div>

          <Table size="small" ref="selection" :columns="columns" :data="tableData" height="300"
                 @on-row-click="showSoftUpdate"
          >
          </Table>
        </Card>
      </Col>
      <Col style="margin-top: 10px">
        <Card>
          <p slot="title">涉及的软件</p>
          <tables ref="selection1"
                  v-model="tableData1"
                  :columns="columns1"
                  height="200"
          >
          </tables>
        </Card>
      </Col>
      <Col style="margin-top: 10px">
        <Card>
          <p slot="title">系统升级历史</p>
          <tables ref="selection2"
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
            <FormItem label="系统名称" prop="sys_name" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.sys_name" :maxlength="50" placeholder="请填写系统名称"></Input>
            </FormItem>
            <FormItem label="版本号" prop="sys_version" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.sys_version" :maxlength="50" placeholder="请填写版本号"></Input>
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
            <FormItem label="系统负责人" prop="sys_manager" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.sys_manager" :maxlength="50" placeholder="请填写系统负责人"></Input>
            </FormItem>
            <FormItem label="系统负责人电话" prop="sys_manager_phone" style="width: 210px;margin-right: 20px">
              <Input v-model="formValidate.sys_manager_phone" :maxlength="50" placeholder="请填写系统负责人电话"></Input>
            </FormItem>
            <FormItem label="系统简介" prop="sys_info" style="width: 700px;height: 120px;margin-right: 20px">
              <i-input type="textarea" v-model="formValidate.sys_info" placeholder="请填写系统简介"
                       :rows="4">
              </i-input>
            </FormItem>
          </Card>
          <Card style="margin-top: 10px">
            <p slot="title">应用软件列表</p>
            <tables ref="selection3"
                    v-model="formValidate.tableData"
                    :columns="columns1"
            >
            </tables>
            <button type="button" class="ivu-mt ivu-btn ivu-btn-dashed ivu-btn-long"
                    @click="addSoftTr()">
              <i class="ivu-icon ivu-icon-md-add"></i> <span>新增</span>
            </button>
          </Card>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitSys('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="modalMap2.modalVisible" :title="modalMap2.modalTitle" :loading=true :footer-hide=true width="540"
           :mask-closable=false>
      <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="140">
        <!--<alert>温馨提示：xxx</alert>-->
        <FormItem label="系统名称" prop="sys_name">
          <div v-if="formValidate2.id">
            <Input v-model="formValidate2.sys_name" :maxlength="50" disabled placeholder='请输入系统名称'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate2.sys_name" :maxlength="50" placeholder='请输入系统名称'></Input>
          </div>
        </FormItem>
        <FormItem label="版本号" prop="version">
          <Input v-model="formValidate2.version" :maxlength="50" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="升级内容" prop="up_content">
          <Input v-model="formValidate2.up_content" :maxlength="50" placeholder="请输入升级内容"></Input>
        </FormItem>
        <FormItem label="升级开始时间" prop="up_stime">
          <DatePicker type="datetime" v-model="formValidate2.up_stime" placeholder="请输入升级开始时间"></DatePicker>
        </FormItem>
        <FormItem label="升级结束时间" prop="up_etime">
          <DatePicker type="datetime" v-model="formValidate2.up_etime" placeholder="请输入升级结束时间"></DatePicker>
        </FormItem>
        <FormItem label="下发时间" prop="issued_time">
          <DatePicker type="datetime" v-model="formValidate2.issued_time" placeholder="请输入下发时间"></DatePicker>
        </FormItem>
        <FormItem label="是否试点" prop="isPilot">
          <RadioGroup v-model="formValidate2.isPilot">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="试点单位" prop="pilot_unit">
          <Input v-model="formValidate2.pilot_unit" :maxlength="50" placeholder="请输入试点单位"></Input>
        </FormItem>
        <FormItem label="升级实际完成时间" prop="up_real_time">
          <DatePicker type="datetime" v-model="formValidate2.up_real_time" placeholder="请输入升级实际完成时间"></DatePicker>
        </FormItem>
        <FormItem label="是否影响业务" prop="isAffect">
          <RadioGroup v-model="formValidate2.isAffect">
            <Radio label="是"></Radio>
            <Radio label="否"></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitSoftUpdate('formValidate2')">提交</Button>
          <Button @click="handleReset('formValidate2')" style="margin-left: 8px">重置</Button>
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
    operationSys,
  } from '@/api/cmdb2/sys.js'

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
          modalTitle: '添加系统',
        },
        modalMap2: {
          modalVisible: false,
          modalTitle: '添加升级记录',
        },
        editModalData: null,
        searchKey: "id",
        searchValue: "",

        tableData: [],
        tableSelectIdList: [],
        formValidate: {
          id: null,
          sys_name: '',
          sys_version: '',
          online_time: '',
          development: '',
          development_contact: '',
          development_phone: '',
          sys_manager: '',
          sys_manager_phone: '',
          sys_info: '',
          tableData: [],
        },

        ruleValidate: {
          sys_name: [{required: true, message: "系统名称不能为空", trigger: "blur"}],
        },

        columns: [
          // {type: 'selection', key: 'id', width: 80, align: 'center'},
          {title: '编号', key: 'id', align: 'center',},
          {title: '系统名称', key: 'sys_name', align: 'center'},
          {title: '版本号', key: 'sys_version', align: 'center'},
          {title: '上线时间', key: 'online_time', align: 'center'},
          {title: '开发单位', key: 'development', align: 'center'},
          {title: '开发单位联系人', key: 'development_contact', align: 'center'},
          {title: '开发单位联系电话', key: 'development_phone', align: 'center'},
          {title: '系统负责人', key: 'sys_manager', align: 'center'},
          {title: '系统负责人电话', key: 'sys_manager_phone', align: 'center'},
          {title: '系统简介', key: 'sys_info', align: 'center'},
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

        //涉及的应用列表
        tableData1: [],
        tableData3: [],
        columns1: [
          {
            title: '软件名称', key: 'soft_name', align: 'center',
            render: (h, params) => {
              if (params.row.soft_name == '') {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '软件名称',
                      value: params.row.soft_name,
                      clearable: true,
                    },
                    style: {
                      width: '140px',
                    },
                    on: {
                      'change': (event) => {
                        params.row.soft_name = event.target.value
                        this.tableData3[params.index] = params.row
                      }
                    },
                  })
              } else {
                return h('span', params.row.soft_name)
              }
            }
          },
          {
            title: '版本号', key: 'soft_version', align: 'center',
            render: (h, params) => {
              if (params.row.soft_version == '') {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '版本号',
                      value: params.row.soft_version,
                      clearable: true,
                    },
                    style: {
                      width: '100px',
                    },
                    on: {
                      'change': (event) => {
                        params.row.soft_version = event.target.value
                        this.tableData3[params.index] = params.row
                      }
                    },
                  })
              } else {
                return h('span', params.row.soft_version)
              }
            }
          },
          {
            title: 'IP', key: 'soft_ip', align: 'center',
            render: (h, params) => {
              if (params.row.soft_ip == '') {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: 'IP',
                      value: params.row.soft_ip,
                      clearable: true,
                    },
                    style: {
                      width: '100px',
                    },
                    on: {
                      'change': (event) => {
                        params.row.soft_ip = event.target.value
                        this.tableData3[params.index] = params.row
                      }
                    },
                  })
              } else {
                return h('span', params.row.soft_ip)
              }
            }
          },
          {
            title: '用途', key: 'soft_usage', align: 'center',
            render: (h, params) => {
              if (params.row.soft_usage == '') {
                return h('Input',
                  {
                    props: {
                      type: 'text',
                      placeholder: '用途',
                      value: params.row.soft_usage,
                      clearable: true,
                    },
                    style: {
                      width: '150px',
                    },
                    on: {
                      'change': (event) => {
                        params.row.soft_usage = event.target.value
                        this.tableData3[params.index] = params.row
                      }
                    },
                  })
              } else {
                return h('span', params.row.soft_usage)
              }
            }
          },
          // {
          //   title: '操作', key: 'handle1', width: 140, align: 'center',
          //   render: (h, params) => {
          //     return h('div', [
          //       h(
          //         'Button',
          //         {
          //           props: {
          //             type: 'error',
          //             size: 'small'
          //           },
          //           on: {
          //             click: () => {
          //               this.handlerDeleteTr(params)
          //             }
          //           }
          //         },
          //         '删除'
          //       )
          //     ])
          //   }
          // }
        ],

        //升级记录
        formValidate2: {
          id: null,
          sys_name: '',
          version: '',
          up_content: '',
          up_stime: '',
          up_etime: '',
          issued_time: '',
          isPilot: '',
          pilot_unit: '',
          up_real_time: '',
          isAffect: '',
        },

        ruleValidate2: {
          soft_name: [{required: true, message: "软件名称不能为空", trigger: "blur"}],
        },

        tableData2: [],
        columns2: [
          {title: '时间', key: 'create_time', width: 185, align: 'center', sortable: true},
          {title: '软件名称', key: 'soft_name', align: 'center'},
          {title: '版本号', key: 'version', align: 'center'},
          {title: '安装位置', key: 'soft_place', align: 'center'},
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
      // 增加一行应用软件
      addSoftTr() {
        var add_obj = {
          soft_name: '',
          soft_version: '',
          soft_ip: '',
          soft_usage: '',
        }
        this.tableData3.push(add_obj)
      },

      // 添加系统
      handlerSys(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        if (paramsRow && paramsRow.id) {
          this.formValidate = {
            id: paramsRow.id,
            sys_name: paramsRow.sys_name,
            sys_version: paramsRow.sys_version,
            online_time: paramsRow.online_time,
            development: paramsRow.development,
            development_contact: paramsRow.development_contact,
            development_phone: paramsRow.development_phone,
            sys_manager: paramsRow.sys_manager,
            sys_manager_phone: paramsRow.sys_manager_phone,
            sys_info: paramsRow.sys_info,
            tableData: paramsRow.tableData,
          }
        } else {
          this.formValidate = {
            id: null,
            sys_name: '',
            sys_version: '',
            online_time: '',
            development: '',
            development_contact: '',
            development_phone: '',
            sys_manager: '',
            sys_manager_phone: '',
            sys_info: '',
            tableData: [],
          }
        }
      },
      // 添加软件升级记录
      handlerSoftUpdate(paramsRow, meth, mtitle) {
        this.modalMap2.modalVisible = true
        this.modalMap2.modalTitle = mtitle
        this.editModalData = meth
        if (paramsRow && paramsRow.id) {
          this.formValidate2 = {
            id: paramsRow.id,
            sys_name: paramsRow.sys_name,
            version: paramsRow.version,
            up_content: paramsRow.up_content,
            up_stime: paramsRow.up_stime,
            up_etime: paramsRow.up_etime,
            issued_time: paramsRow.issued_time,
            isPilot: paramsRow.isPilot,
            pilot_unit: paramsRow.pilot_unit,
            up_real_time: paramsRow.up_real_time,
            isAffect: paramsRow.isAffect,
          }
        } else {
          this.formValidate2 = {
            id: null,
            sys_name: '',
            version: '',
            up_content: '',
            up_stime: '',
            up_etime: '',
            issued_time: '',
            isPilot: '',
            pilot_unit: '',
            up_real_time: '',
            isAffect: '',
          }
        }
      },
      showSoftUpdate(data) {
        // console.log(data)
        this.getSoftUpdateList('soft_id', data.id);
      },
      //
      handleSubmitSys(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              console.log(this.formValidate)
              operationSys(this.formValidate, this.editModalData).then(
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

      handlerDeleteTr(params) {
        if (confirm('确定要删除吗')) {
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
      }
    }
  }
</style>
