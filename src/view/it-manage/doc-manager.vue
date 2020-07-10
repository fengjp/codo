<template>
  <div>
    <Card :bordered="false" style="margin-top: -10px;">
      <Row style="margin-top: 15px;margin-bottom: 15px">
        <Col span="6" offset="8">
          <Input search enter-button size="large" style="width: 400px;display: inline-table" v-model="searchValue"
                 placeholder="输入关键字搜索" @on-search="handleSearch"/>
        </Col>
        <Col span="6" offset="4" style="text-align: right;">
          <Button @click="editModaltable()">上传文档
          </Button>
        </Col>
      </Row>
      <template>
        <Form label-position="left" :label-width="50" label-colon=":" style="margin-bottom: -25px;">
            <FormItem label="分类">
              <Tag checkable color="primary" style="margin-right: 20px" @on-change="handleChange"
                v-for="tag in allSysTag" v-bind:name="tag.id" :checked="tagChecked[tag.id]"
              >{{ tag.name }}</Tag>
            </FormItem>
        </Form>
      </template>
    </Card>
    <Card :bordered="false" style="margin-top: 16px">
      <List item-layout="vertical">
        <ListItem v-for="item in data" :key="item.title">
          <ListItemMeta :title="item.title"/>
          <a @click="openUrl(item.url)">
            <span v-html="brightenKeyword(item.content, searchValue)"></span>
          </a>
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
        <FormItem label="上传文档" prop="sysID" style="margin-right:30px">
          <Select v-model="formValidate.sysID" placeholder="">
            <Option v-for="item in allSysList" :value="item.id" :key="item.id">{{item.type_name}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="上传文档" prop="sysDocx" style="margin-right:30px">
          <div class="upload-list" v-for="item in formValidate.uploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url" v-if="item.isShow">
              <span v-else>{{item.name}}</span>
              <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.url)" v-if="item.isShow"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="formValidate.uploadList"
            type="drag"
            :action=UploadUrl
            :max-size="20 * 1024"
            :on-exceeded-size="handleMaxSize"
            :format="['docx']"
            :on-format-error="handleFormatError"
            :on-success="handleSuccess"
            style="display: inline-block;width:60px;"
          >
            <div style="width: 60px;height:60px;line-height: 60px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSave('formValidate')" :disabled="isDisable">提交</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import {
    UploadUrl,
    getDocList,
    operationDoc
  } from '@/api/doc'

  import {
    getSysList,
  } from '@/api/cmdb/sys.js'

  export default {
    data() {
      return {
        keyword: '',
        UploadUrl: '',
        data: [
          {
            title: '',
            content: ''
          }
        ],
        allSysList: [{"id": 0, "type_name": "不关联"}],
        modalTable: {
          tableVisible: false,
          tableTitle: '上传文档'
        },
        formValidate: {
          sysID: 0,
          uploadList: []
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
      }
    },
    methods: {
      handleChange(checked, name){
        this.tagChecked[name] = checked;
        if (name === 0){
          for (let key in this.tagChecked){
            this.tagChecked[key] = checked
          }
        } else {
          this.tagChecked[0] = false;
          let isAllTrue = 1;
          for (let key in this.tagChecked){
            if (key != 0 && this.tagChecked[key] === false){
              isAllTrue = 0
            }
          }
          if (isAllTrue === 1){
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
            this.allSysList = [{"id": 0, "type_name": "不关联"}];
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
          operationDoc(this.formValidate, 'post').then(
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
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        this.formValidate.uploadList = this.$refs.upload.fileList;
      },
      // handleBeforeUpload(file) {
      //   this.file = file
      //   this.formValidate.sys_report = this.file.name
      //   const check = this.uploadList.length < 5;
      //   if (!check) {
      //     this.$Notice.warning({
      //       title: '最多上传5个'
      //     });
      //   }
      //   return check;
      // },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '文件大小超限',
          desc: '文件  ' + file.name + ' 太大，上传文件大小不能超过20M.'
        });
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件:' + file.name + ' 格式不正确，请选择：docx 等格式类型 '
        });
      },
      handleSuccess(res, file) {
        if (res.code === 0) {
          file.url = file.response.url;
          file.isShow = false;
          this.formValidate.uploadList = this.$refs.upload.fileList;
          this.$Message.success(`${res.msg}`)
        } else {
          this.$Message.error(`${res.msg}`)
        }
      },
      editModaltable() {
        this.modalTable.tableVisible = true;
        this.getSysList();
        this.formValidate = {
          sysID: 0,
          uploadList: []
        }
      },
      openUrl(url) {
        window.open(url)
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
      getDocList(page, limit, key, value, dateValue) {
        getDocList(page, limit, key, value, dateValue).then(res => {
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
        this.getDocList(
          this.pageNum,
          this.pageSize,
          this.getTagList(),
          this.searchValue
        )
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value;
        this.getDocList(
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
        for (let i in this.tagChecked){
          if (this.tagChecked[i] === true){
            tagList.push(i)
          }
        }
        this.getDocList(
          this.pageNum,
          this.pageSize,
          this.getTagList(),
          this.searchValue
        )
      },
      getTagList(){
        let tagList = [];
        for (let i in this.tagChecked){
          if (this.tagChecked[i] === true){
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
      this.UploadUrl = UploadUrl;
      this.getSysTag();
      this.getDocList(this.pageNum, this.pageSize, '["0"]')
    }
  }
</script>

<style lang="less" scoped>
  a {
    color: #17233d;
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

  .upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    /*border: 1px solid transparent;*/
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .upload-list img {
    width: 100%;
    height: 100%;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .upload-list:hover .upload-list-cover {
    display: block;
  }

  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

</style>
