<template>
  <div>
    <Row :gutter="20">
      <!-- <i-col :md="24" :lg="5" style="margin-bottom: 20px;">
        <Card>
          <Tree ref="tree" :data="tagTreeData"  @on-select-change="handlerTreeChange" getSelectedNodes></Tree>
        </Card>
      </i-col>
      <i-col :md="24" :lg="19" style="margin-bottom: 20px;"> -->
      <Card shadow>
        <div class="search-con search-con-top">
          <Select
            v-model="searchKey"
            class="search-col"
          >
            <Option
              v-for="item in columns"
              v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
              :value="item.key"
            >{{ item.title }}
            </Option>
          </Select>
          <Input
            @on-change="handleClear"
            clearable
            placeholder="输入关键字搜索"
            class="search-input"
            v-model="searchValue"
          />
          <Button
            @click="handleSearch"
            class="search-btn"
            type="primary"
          >搜索
          </Button>
          <slot name="new_btn">
            <Button
              type="primary"
              @click="handlerDevice('', 'post', '添加设备')"
              class="search-btn"
            >添加设备
            </Button>
          </slot>
          <!--<Button type="error" class="search-btn" @click="handlerDelete">批量删除</Button>-->
          <!--<Button type="info" class="search-btn"  @click="handleTagRule">标签规则管理</Button>-->
        </div>

        <Table
          size="small"
          ref="selection"
          border
          :columns="columns"
          :data="tableData"
          @on-selection-change="handleSelectChange"
        ></Table>

        <div style="margin: 10px; overflow: hidden">
          <div style="float: left;">
            <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[15,35,50,100] show-sizer
                  show-total @on-change="changePage" @on-page-size-change="handlePageSize">
            </Page>
          </div>
        </div>
      </Card>
      <!-- </i-col> -->
    </Row>

    <Modal v-model="modalMap.modalVisible" :title="modalMap.modalTitle" :loading=true :footer-hide=true width="540"
           :mask-closable=false>
      <Form ref="formValidate" :model="formValidate" :label-width="85">
        <!--<alert>温馨提示：xxx</alert>-->
        <FormItem label="资产编号" prop="device_id">
          <div v-if="formValidate.id">
            <Input v-model="formValidate.device_id" :maxlength="50" disabled placeholder='请输入资产编号'></Input>
          </div>
          <div v-else>
            <Input v-model="formValidate.device_id" :maxlength="50" placeholder='请输入资产编号'></Input>
          </div>
        </FormItem>
        <FormItem label="设备SN" prop="device_sn">
          <Input v-model="formValidate.device_sn" :maxlength="50" placeholder="请输入SN"></Input>
        </FormItem>
        <FormItem label="类型" prop="device_type">
          <Select v-model="formValidate.device_type" filterable placeholder="请选择类型">
            <Option v-for="item in allTypeList" :value="item.type_name" :key="item.id">{{item.type_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="品牌" prop="device_brand">
          <Select v-model="formValidate.device_brand" filterable placeholder="请输入品牌">
            <Option v-for="item in allBrandList" :value="item.brand_name" :key="item.id">{{item.brand_name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="购买时间" prop="buy_time">
          <Date-picker type="date" placeholder="选择购买日期" v-model="formValidate.buy_time"></Date-picker>
        </FormItem>
        <FormItem label="维保公司" prop="maintenance_company">
          <Input v-model="formValidate.maintenance_company" :maxlength="50" placeholder="请输入维保公司"></Input>
        </FormItem>
        <FormItem label="维保开始" prop="maintenance_st">
          <Date-picker type="date" placeholder="选择维保开始日期" v-model="formValidate.maintenance_st"></Date-picker>
        </FormItem>
        <FormItem label="维保结束" prop="maintenance_et">
          <Date-picker type="date" placeholder="选择维保结束日期" v-model="formValidate.maintenance_et"></Date-picker>
        </FormItem>
        <FormItem label="存放位置" prop="device_place">
          <Input v-model="formValidate.device_place" :maxlength="50" placeholder="请输入存放位置"></Input>
        </FormItem>
        <FormItem label="关联软件" prop="device_softs">
          <Select class="search-input-long" v-model="formValidate.device_softs" filterable multiple
                  placeholder="请选择关联的软件">
            <Option v-for="item in allSoft" :value="item.soft_name" :key="item.id">{{ item.soft_name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="IP" prop="device_ip">
          <i-input type="textarea" :autosize="true" v-model="formValidate.device_ip" placeholder="请输入IP地址:127.0.0.1,192.168.0.1"></i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmitDev('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>
<script>
  import {
    getDevList,
    operationDev,
  } from '@/api/cmdb2/device.js'
  import {getSoftList} from '@/api/cmdb2/software.js'

  export default {
    data() {
      return {
        // 分页
        ruleLoading: false,
        ruleModal: false,
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        selectTwo: 'dev',
        searchVal: '',
        modalMap: {
          modalVisible: false,
          modalTitle: '添加设备',
        },
        editModalData: null,
        tableData: [],
        tableSelectIdList: [],
        searchKey: "device_id",
        searchValue: "",
        formValidate: {
          id: '',
          device_id: '',
          device_sn: '',
          device_brand: '',
          device_type: '',
          buy_time: '',
          maintenance_company: '',
          maintenance_st: '',
          maintenance_et: '',
          device_place: '',
          device_softs: '',
          device_ip: [],
        },

        allTypeList: [
          {'id': 0, 'type_name': '服务器'},
          {'id': 1, 'type_name': '交换机'},
          {'id': 2, 'type_name': '路由器'},
        ],
        allBrandList: [
          {'id': 0, 'brand_name': '联想'},
          {'id': 1, 'brand_name': '戴尔'},
          {'id': 2, 'brand_name': '华为'},
        ],
        allSoft: [],

        ruleValidate: {
          device_id: [{required: true, message: "设备ID不能为空", trigger: "blur"}],
        },

        columns: [
          {type: 'selection', key: 'id', width: 80, align: 'center'},
          {title: '资产编号', key: 'device_id', align: 'center',},
          {title: '设备SN', key: 'device_sn', align: 'center',},
          {title: '类型', key: 'device_type', align: 'center'},
          {title: '品牌', key: 'device_brand', align: 'center'},
          {title: '购买时间', key: 'buy_time', align: 'center'},
          {title: '维保公司', key: 'maintenance_company', align: 'center'},
          {title: '维保开始', key: 'maintenance_st', align: 'center'},
          {title: '维保结束', key: 'maintenance_et', align: 'center'},
          {title: '存放位置', key: 'device_place', align: 'center'},
          {title: '关联软件', key: 'device_softs', align: 'center'},
          {
            title: '操作', key: 'handle', width: 140, align: 'center',
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
                        this.handlerDevice(params.row, 'put', '更新')
                      }
                    }
                  }, '更新'
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
                        this.handlerDeleteDev(params)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ],

      }
    },
    methods: {
      // 获取软件列表
      getSoftList() {
        getSoftList(1, 2000).then(res => {
          if (res.data.code === 0) {
            this.allSoft = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取设备列表
      getDevList(key, value) {
        getDevList(this.pageNum, this.pageSize, key, value).then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data
            this.pageTotal = res.data.count
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },

      // 添加设备
      handlerDevice(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        this.getSoftList()
        if (paramsRow && paramsRow.id) {
          this.formValidate = {
            id: paramsRow.id,
            device_id: paramsRow.device_id,
            device_sn: paramsRow.device_sn,
            device_brand: paramsRow.device_brand,
            device_type: paramsRow.device_type,
            buy_time: paramsRow.buy_time,
            maintenance_company: paramsRow.maintenance_company,
            maintenance_st: paramsRow.maintenance_st,
            maintenance_et: paramsRow.maintenance_et,
            device_place: paramsRow.device_place,
            device_softs: paramsRow.device_softs,
            device_ip: paramsRow.device_ip,
          }
        } else {
          this.formValidate = {
            id: '',
            device_id: '',
            device_sn: '',
            device_brand: '',
            device_type: '',
            buy_time: '',
            maintenance_company: '',
            maintenance_st: '',
            maintenance_et: '',
            device_place: '',
            device_softs: '',
            device_ip: '',
          }
        }
      },

      handlerDelete() {
        // console.log('长度',this.tableSelectIdList.length)
        if (this.tableSelectIdList.length > 3) {
          this.$Message.error(`批量删除最多三个`)
          return
        }
        if (this.tableSelectIdList.length > 0) {
          if (this.selectTwo === 'dev') {
            if (confirm(`确定要批量删除选中的设备`)) {
              operationDev({'id_list': this.tableSelectIdList}, 'delete').then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`)
                    this.getDevList("id", this.searchVal)
                  } else {
                    this.$Message.error(`${res.data.msg}`)
                  }
                })
            }
          }
        } else {
          this.$Message.info(`你总要选中点什么吧`)
        }
      },
      //
      handleSubmitDev(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            setTimeout(() => {
              operationDev(this.formValidate, this.editModalData).then(
                res => {
                  if (res.data.code === 0) {
                    this.$Message.success(`${res.data.msg}`);
                    this.getDevList('id', this.searchVal);
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

      handlerDeleteDev(params) {
        if (confirm(`确定要删除设备 ${params.row.device_id}`)) {
          operationDev({device_id: params.row.device_id}, 'delete').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                this.getDevList('id', this.searchVal);
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
      // 翻页
      changePage(value) {
        this.pageNum = value
        if (this.selectTwo === 'dev') {
          if (this.searchValue) {
            this.getDevList('id', this.searchValue);
          } else {
            this.getDevList()
          }
        }
      },
      // 切换分页
      handlePageSize(value) {
        this.pageSize = value
        this.pageNum = 1
        if (this.selectTwo === 'dev') {
          if (this.searchValue) {
            this.getDevList('id', this.searchValue);
          } else {
            this.getDevList()
          }
        }
      },
      handleClear(e) {
        if (e.target.value === "") this.tableData = this.value;
      },
      handleSearch() {
        this.getDevList(this.searchKey, this.searchValue);
      },
      // table 选中的ID
      handleSelectChange(val) {
        let SelectIdList = []
        val.forEach(item => {
          SelectIdList.push(item.id)
        })
        this.tableSelectIdList = SelectIdList
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
      this.getDevList()
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
