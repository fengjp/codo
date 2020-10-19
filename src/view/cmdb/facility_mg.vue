<template>
  <Card :bordered="false" dis-hover>
    <div class="search-con search-con-top">
      <Select
        v-model="searchKey"
        class="search-col"
      >
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle' && item.key !== 'status' && item.key !== ''"
          :value="item.key"
          :key="`search-col-${item.key}`"
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
        <Button type="info" @click="editModal('', 'post', '添加设备')" class="search-btn">添加设备</Button>
      </slot>
    </div>
    <Table
      size="small"
      ref="selection"
      :columns="columns"
      :data="tableData"
    ></Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left;">
        <Page
          :total="pageTotal"
          :current="pageNum"
          :page-size="pageSize"
          :page-size-opts="[15,35,50,100,200,500,1000]"
          show-sizer
          show-total
          @on-change="changePage"
          @on-page-size-change="handlePageSize"
        ></Page>
      </div>
    </div>
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading="true"
      :footer-hide="true"
      :mask-closable="false"
      :styles="{top:'0px'}"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="85">
        <FormItem label="名称" prop="facility_na">
          <Input v-model="formValidate.facility_na" :maxlength="100" placeholder=""></Input>
        </FormItem>
        <FormItem label="品牌">
          <Select v-model="formValidate.facility_brand" placeholder="类型">
            <Option v-for="item in brandList" :value="item.val">{{item.val}}</Option>
          </Select>
        </FormItem>
        <FormItem label="型号">
          <Input v-model="formValidate.facility_version" :maxlength="50" placeholder=""></Input>
        </FormItem>
        <FormItem label="分类">
          <Select v-model="formValidate.facility_type" placeholder="类型">
            <Option v-for="item in facilityTypeList" :value="item.val">{{item.val}}</Option>
          </Select>
        </FormItem>
        <FormItem label="设备编号">
          <Input v-model="formValidate.facility_id" :maxlength="50" placeholder="资产编号"></Input>
        </FormItem>
        <FormItem label="设备SN">
          <Input v-model="formValidate.facility_sn" :maxlength="50" placeholder="设备序列号"></Input>
        </FormItem>
        <FormItem label="购买日期">
          <DatePicker type="datetime" :value="formValidate.buy_date" @on-change="formValidate.buy_date=$event"
                      placeholder=""></DatePicker>
        </FormItem>
        <FormItem label="保修日期">
          <Select v-model="formValidate.warranty_date" placeholder="类型">
            <Option v-for="item in warranty_List" :value="item.val">{{item.val}}</Option>
          </Select>
        </FormItem>
        <FormItem label="安装日期">
          <DatePicker type="datetime" :value="formValidate.installation_date"
                      @on-change="formValidate.installation_date=$event"
                      placeholder=""></DatePicker>
        </FormItem>
        <FormItem label="IP地址">
          <Input v-model="formValidate.facility_ip" :maxlength="50" placeholder=""></Input>
        </FormItem>
        <FormItem label="描述">
          <Input
            v-model="formValidate.remarks"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 10}"
            :maxlength="50"
            placeholder="描述"
          ></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>

<script>
  import FormGroup from "_c/form-group";
  import {getFacilityList, operationFacility} from "@/api/cmdb/facility";

  export default {
    components: {
      FormGroup
    },
    data() {
      return {
        columns: [
          // {
          //   title: "ID",
          //   key: "id",
          //   align: "center",
          //   width: 100,
          //   sortable: true
          // },
          {
            title: "名称",
            key: "facility_na",
            align: "center",
            minWidth: 100,
            fixed: 'left'
          },
          {
            title: "品牌",
            key: "facility_brand",
            align: "center",
            minWidth: 100,
          },
          {
            title: "型号",
            key: "facility_version",
            align: "center",
            minWidth: 100,
          },
          {
            title: "分类",
            key: "facility_type",
            align: "center",
            minWidth: 100,
          },
          {
            title: "设备编号",
            key: "facility_id",
            align: "center",
            minWidth: 100,
          },
          {
            title: "设备SN",
            key: "facility_sn",
            align: "center",
            minWidth: 200,
          },
          {
            title: "IP地址",
            key: "facility_ip",
            align: "center",
            minWidth: 180,
            render: (h, params) => {
              return h('a',
                {
                  props: {},
                  on: {
                    click: () => {
                      this.$router.push({
                        name: 'asset_server',
                        params: {key: params.row.facility_ip}
                      })
                    }
                  }
                }, params.row.facility_ip)
            }
          },
          {
            title: "描述",
            key: "remarks",
            align: "center",
            minWidth: 120,
          },
          {
            title: "操作",
            key: "handle",
            width: 180,
            align: "center",
            fixed: 'right',
            render: (h, params) => {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'ios-create-outline',
                    },
                    style: {
                      marginRight: '2px',
                      color: '#409eff'
                    },
                    on: {
                      click: () => {
                        this.editModal(params.row, "put", "编辑设备");
                      }
                    }
                  },
                  "编辑"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'ios-trash-outline',
                    },
                    style: {
                      color: '#ed4014'
                    },
                    on: {
                      click: () => {
                        this.delData(params);
                      }
                    }
                  },
                  "删除"
                )
              ]);
            }
          }
        ],
        tableData: [],
        modalMap: {
          modalVisible: false,
          modalTitle: "新建"
        },
        pageNum: 1, // 当前页码
        pageTotal: 0, // 数据总数
        pageSize: 15, // 每页条数
        editModalData: "",
        //
        searchKey: "",
        searchValue: "",
        //
        warranty_List: [
          {id: 0, val: '1年'},
          {id: 1, val: '2年'},
          {id: 2, val: '3年'},
          {id: 3, val: '4年'},
          {id: 4, val: '5年'},
        ],
        brandList: [
          {id: 0, val: '华为'},
          {id: 1, val: '联想'},
          {id: 2, val: '戴尔'},
        ],
        facilityTypeList: [
          {id: 0, val: '笔记本'},
          {id: 1, val: '服务器'},
          {id: 2, val: '交换机'},
          {id: 3, val: '路由器'},
        ],
        formValidate: {
          id: '',
          facility_na: '',
          facility_id: '',
          facility_sn: '',
          facility_brand: '',
          facility_version: '',
          facility_type: '',
          buy_date: '',
          warranty_date: '',
          installation_date: '',
          facility_ip: '',
          remarks: ''
        },
        ruleValidate: {
          facility_na: [{required: true, message: '请输入名称', trigger: 'blur'}],
        },
      };
    },
    methods: {
      getFacilityList(key, value) {
        getFacilityList(this.pageNum, this.pageSize, key, value).then(res => {
          if (res.data.code === 0) {
            //this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true;
        this.modalMap.modalTitle = mtitle;
        this.editModalData = meth;
        this.getTypeList()
        if (paramsRow && paramsRow.id) {
          // put
          this.formValidate = {
            id: paramsRow.id,
            facility_na: paramsRow.facility_na,
            facility_id: paramsRow.facility_id,
            facility_sn: paramsRow.facility_sn,
            facility_brand: paramsRow.facility_brand,
            facility_version: paramsRow.facility_version,
            facility_type: paramsRow.facility_type,
            buy_date: paramsRow.buy_date,
            warranty_date: paramsRow.warranty_date,
            installation_date: paramsRow.installation_date,
            facility_ip: paramsRow.facility_ip,
            remarks: paramsRow.remarks
          }
        } else {
          // post
          this.formValidate = {
            id: '',
            facility_na: '',
            facility_id: '',
            facility_sn: '',
            facility_brand: '',
            facility_version: '',
            facility_type: '',
            buy_date: '',
            warranty_date: '',
            installation_date: '',
            facility_ip: '',
            remarks: ''
          }
        }
      },
      // 获取分类
      getTypeList() {
      },
      handleSubmit(value) {
        this.$refs[value].validate(valid => {
          if (valid) {
            setTimeout(() => {
              operationFacility(this.formValidate, this.editModalData).then(res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`);
                  this.getFacilityList(this.searchKey, this.searchValue);
                  this.modalMap.modalVisible = false;
                } else {
                  this.$Message.error(`${res.data.msg}`);
                }
              });
            }, 500)
            // this.$Message.success('Success!');
          } else {
            this.$Message.error('缺少必要参数')
          }
        });
      },
      // 删除
      delData(params) {
        if (confirm(`确定要删除 ${params.row.admin_user}`)) {
          operationFacility({id: params.row.id}, "delete").then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`);
              this.tableData.splice(params.index, 1);
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          });
        }
      },
      setDefaultSearchKey() {
        this.searchKey =
          this.columns[0].key && this.columns[0].key !== "handle"
            ? this.columns[0].key
            : this.columns.length > 1
            ? this.columns[1].key
            : "";
      },
      handleClear(e) {
        if (e.target.value === "") this.tableData = this.value;
      },
      handleSearch() {
        this.getFacilityList(this.searchKey, this.searchValue);
      },
      // 翻页
      changePage(value) {
        this.pageNum = value
        if (this.searchValue) {
          this.getFacilityList(this.searchKey, this.searchValue)
        } else {
          this.getFacilityList()
        }
      },
      // 切换分页
      handlePageSize(value) {
        this.pageSize = value
        this.pageNum = 1
        if (this.searchValue) {
          this.getFacilityList(this.searchKey, this.searchValue)
        } else {
          this.getFacilityList()
        }
      }
    },
//   watch: {
//     searchValue(val) {
//       this.getFacilityList(this.searchKey, val);
//     }
//   },
    mounted() {
      this.getFacilityList()
      this.setDefaultSearchKey()
    }
  };
</script>

<style lang="less" scoped>
  .search-con {
    padding: 10px 0;

    .search {
      &-col {
        display: inline-block;
        width: 200px;
      }

      &-input {
        display: inline-block;
        width: 200px;
        margin-left: 2px;
      }

      &-btn {
        margin-left: 2px;
      }
    }
  }
</style>
