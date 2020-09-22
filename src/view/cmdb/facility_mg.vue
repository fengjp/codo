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
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading=true
      :footer-hide=true
      width=760
    >
      <div style="marginRight: 35px;">
        <form-group :list="formList" @on-submit-success="handleSubmit"></form-group>
      </div>
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
          {
            title: "ID",
            key: "id",
            align: "center",
            width: 100,
            sortable: true
          },
          {
            title: "设备名称",
            key: "facility_na",
            align: "center",
            minWidth: 100,
            // render: (h, params) => {
            //   return h('a', {
            //       on: {
            //         click: () => {
            //           this.handleDetail(params.row.user_key)
            //         }
            //       }
            //     }, params.row.admin_user
            //   )
            // }
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
                        this.editModal(params.index, "put", "编辑设备");
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
        formList: [],
        editModalData: "",
        //
        searchKey: "",
        searchValue: "",
        //
        alert_id: "",
        config_api: "",
        allUser: [], // 所有用户
        existUser: [] // 已存在用户
      };
    },
    methods: {
      getFacilityList(page, limit, key, value) {
        getFacilityList(page, limit, key, value).then(res => {
          if (res.data.code === 0) {
            //this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      editModal(index, meth, mtitle) {
        this.modalMap.modalVisible = true;
        this.modalMap.modalTitle = mtitle;
        this.editModalData = meth;
        this.formList = [
          {
            name: "id",
            value: meth === "put" ? this.tableData[index].id : ""
          },
          {
            name: "facility_na",
            type: "i-input",
            value: meth === "put" ? this.tableData[index].facility_na : "",
            label: "设备名称",
            placeholder: "",
            rule: [{required: true, message: "名称不能为空", trigger: "blur"}]
          },
          {
            name: "facility_id",
            type: "i-input",
            value: meth === "put" ? this.tableData[index].facility_id : "",
            label: "设备编号",
            placeholder: "",
          },
          {
            name: "facility_sn",
            type: "i-input",
            value: meth === "put" ? this.tableData[index].facility_sn : "",
            label: "设备SN",
            placeholder: "",
          },
          {
            name: "facility_ip",
            type: "i-input",
            value: meth === "put" ? this.tableData[index].facility_ip : "",
            label: "IP地址",
            placeholder: "",
          },
          {
            name: "remarks",
            type: "i-input",
            type1: 'textarea',
            maxlength: 300,
            value: meth === "put" ? this.tableData[index].remarks : "",
            label: "描述",
            placeholder: "描述",
          },

        ];
      },
      handleSubmit(value) {
        setTimeout(() => {
          operationFacility(value.data, this.editModalData).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`);
              this.getFacilityList(this.searchKey, this.searchValue);
              this.modalMap.modalVisible = false;
            } else {
              this.$Message.error(`${res.data.msg}`);
            }
          });
        }, 500);
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
