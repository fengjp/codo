<template>
  <div>
    <Card :bordered="false">
      <Row style="margin-top: 15px;margin-bottom: 15px">
        <Col span="6" offset="8">
          <Input search enter-button size="large" style="width: 400px;display: inline-table" v-model="searchValue"
                 placeholder="输入关键字搜索" @on-search="handleSearch"/>
        </Col>
        <Col span="6" offset="4" style="text-align: right;">
          <Button v-if="rules.add_faq_btn" @click="editModaltable('','post', '添加问题')">添加问题
          </Button>
        </Col>
      </Row>
      <template>
        <Form label-position="left" :label-width="50" label-colon=":" style="margin-bottom: -25px;">
          <FormItem label="分类">
            <Tag checkable color="primary" style="margin-right: 20px" @on-change="handleChange"
                 v-for="tag in allSysTag" v-bind:name="tag.id" :checked="tagChecked[tag.id]"
            >{{ tag.name }}
            </Tag>
          </FormItem>
        </Form>
      </template>
    </Card>

    <Card :bordered="false" style="margin-top: 16px">
      <List size="large" item-layout="vertical">
        <ListItem v-for="item in data" :key="item.question">
          <!--<ListItemMeta :title="item.question" :description="item.question"/>-->
          <div class="ivu-list-item-meta">
            <div class="ivu-list-item-meta-content">
              <div class="ivu-list-item-meta-title">{{item.question}}</div>
              <div class="ivu-list-item-meta-description">
                <div>
                  <Tag color="success">咨询</Tag>
                  <Tag color="success">咨询2</Tag>
                  <Tag color="success">咨询3</Tag>
                </div>
              </div>
            </div>
          </div>
          <template slot="action">
            <li>
              <Icon type="ios-time-outline" size="16"/>
              {{item.ctime}}
            </li>
            <li>
              <Icon type="ios-eye-outline" size="20"/>
              {{item.clicks}}
            </li>
          </template>
          <!--<a class="list-a">-->
          <span class="list-text" v-html="brightenKeyword(item.answer, searchValue)"></span>
          <!--</a>-->
          <!--{{ item.content }}-->
        </ListItem>
      </List>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize"
                :page-size-opts=[10,15,25,35,50,100,150,200,300,500,800,1000,1500]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>

    <Modal v-model="modalTable.tableVisible" :loading=true :footer-hide=true :title="modalTable.tableTitle">
      <Form ref="formValidate" :model="formValidate" :label-width="100">
        <FormItem label="分类" prop="sysID" style="margin-right:30px">
          <Select v-model="formValidate.sysID" placeholder="">
            <Option v-for="item in allSysList" :value="item.id" :key="item.id">{{item.type_name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="标签">
          <Tag checkable color="success" style="margin-right: 20px"
               v-for="tag in allFaqTag" v-bind:name="tag.id"
          >{{ tag.name }}
          </Tag>
        </FormItem>
        <FormItem label="问题标题" prop="question" style="margin-right:30px">
          <i-input type="textarea" v-model="formValidate.question" placeholder="问题标题"
                   :rows="4">
          </i-input>
        </FormItem>
        <FormItem label="回答" prop="answer" style="margin-right:30px">
          <i-input type="textarea" v-model="formValidate.answer" placeholder="回答"
                   :rows="7">
          </i-input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSave('formValidate')" :disabled="isDisable">提交</Button>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {
    operationFAQ,
    getFaqList,
  } from '@/api/faq'
  import {
    getSysList,
  } from '@/api/cmdb/sys.js'

  export default {
    data() {
      return {
        tmp: '<div><div class="ivu-tag ivu-tag-size-default ivu-tag-default ivu-tag-checked"><!----> <span class="ivu-tag-text">iView</span> <!----></div><div class="ivu-tag ivu-tag-size-default ivu-tag-default ivu-tag-checked"><!----> <span class="ivu-tag-text">Vue.js</span> <!----></div><div class="ivu-tag ivu-tag-size-default ivu-tag-default ivu-tag-checked"><!----> <span class="ivu-tag-text">Webpack</span> <!----></div></div>',
        keyword: '',
        UploadUrl: '',
        data: [
          {
            title: '',
            content: ''
          }
        ],
        allSysList: [{"id": -1, "type_name": "不关联"}],
        modalTable: {
          tableVisible: false,
          tableTitle: ''
        },
        formValidate: {
          sysID: -1,
          question: "",
          answer: ""
        },
        tableData: [],
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 10, // 每页条数
        //
        searchKey: '',
        searchValue: '',
        isDisable: false,
        allSysTag: [],
        tagChecked: {},
        allFaqTag: [
          {"id": 0, "name": "咨询"},
        ],
      }
    },
    computed: {
      ...mapState({
        rules: state => state.user.rules
      })
    },
    methods: {
      handleChange(checked, name) {
        this.tagChecked[name] = checked;
        if (name === 0) {
          for (let key in this.tagChecked) {
            this.tagChecked[key] = checked
          }
        } else {
          this.tagChecked[0] = false;
          let isAllTrue = 1;
          for (let key in this.tagChecked) {
            if (key != 0 && this.tagChecked[key] === false) {
              isAllTrue = 0
            }
          }
          if (isAllTrue === 1) {
            this.tagChecked[0] = true
          }
        }
        this.$forceUpdate()
        // console.log(this.tagChecked)
      },
      // 获取系统分类
      getSysTag(key, value) {
        getSysList(this.pageNum, 999, key, value).then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data;
            this.allSysTag = [{"id": 0, "name": "全部"}];
            this.tagChecked[0] = true;
            for (var i = 0; i < this.tableData.length; i++) {
              let obj = {};
              obj['id'] = this.tableData[i].id;
              obj['name'] = this.tableData[i].sys_name;
              this.allSysTag.push(obj);
              this.tagChecked[this.tableData[i].id] = true
            }
            this.allSysTag.push({"id": -1, "name": "其他"});
            this.tagChecked[-1] = true
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      // 获取系统列表
      getSysList(key, value) {
        getSysList(this.pageNum, 999, key, value).then(res => {
          if (res.data.code === 0) {
            this.tableData = res.data.data;
            this.allSysList = [{"id": -1, "type_name": "不关联"}];
            for (var i = 0; i < this.tableData.length; i++) {
              let obj = {};
              obj['id'] = this.tableData[i].id;
              obj['type_name'] = this.tableData[i].sys_name;
              this.allSysList.push(obj)
            }
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleSave(value) {
        this.isDisable = true;
        setTimeout(() => {
          operationFAQ(this.formValidate, 'post').then(
            res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`);
                this.modalTable.tableVisible = false;
              } else {
                this.$Message.error(`${res.data.msg}`);
              }
            }
          );
          this.isDisable = false
        }, 500)
      },
      editModaltable(paramsRow, meth, mtitle) {
        this.modalTable.tableVisible = true;
        this.modalTable.tableTitle = mtitle;
        this.getSysList();
        this.formValidate = {
          sysID: -1,
        }
      },

      brightenKeyword(val, keyword) {
        if (keyword) {
          const Reg = new RegExp(keyword, 'gi');
          if (val) {
            const res = val.replace(Reg, `<span style="color: #f7d008;">${keyword}</span>`);
            // console.log(res);
            return res
          }
        } else {
          return val
        }
      },
      getFaqList(page, limit, key, value, dateValue) {
        getFaqList(page, limit, key, value, dateValue).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`);
            this.data = res.data.data;
            this.pageTotal = res.data.count
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },

      changePage(value) {
        this.pageNum = value;
        this.getFaqList(
          this.pageNum,
          this.pageSize,
          this.getTagList(),
          this.searchValue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value;
        this.getFaqList(
          1,
          this.pageSize,
          this.getTagList(),
          this.searchValue
        )
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      handleClear(e) {
        if (e.target.value === '') this.tableData = this.value
      },
      handleSearch() {
        let tagList = [];
        for (let i in this.tagChecked) {
          if (this.tagChecked[i] === true) {
            tagList.push(i)
          }
        }
        this.getFaqList(
          this.pageNum,
          this.pageSize,
          this.getTagList(),
          this.searchValue
        )
      },
      getTagList() {
        let tagList = [];
        for (let i in this.tagChecked) {
          if (this.tagChecked[i] === true) {
            tagList.push(i)
          }
        }
        return JSON.stringify(tagList)
      }
    },
    watch: {
      // value(val) {
      //   this.handleSearch()
      // }
    },
    mounted() {
      this.getSysTag();
      this.getFaqList(this.pageNum, this.pageSize, '["0"]')
    }
  }
</script>

<style lang="less" scoped>
  a {
    color: #808080;
  }

  a:link {
    color: #000000
  }

  a:hover {
    color: #258cf9
  }

  .search-con {
    padding: 10px 0;
    text-align: center;

    .search {
      &-col {
        display: inline-block;
        width: 200px;
      }

      &-input {
        display: inline-block;
        width: 400px;
        margin-left: 2px;
      }

      &-btn {
        margin-left: 2px;
      }
    }
  }
</style>
