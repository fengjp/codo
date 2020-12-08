<template>
  <div>
    <Card :bordered="false" dis-hover>
      <Row style="margin-top: 15px;margin-bottom: 15px">
        <Col span="6">
          <Button type="primary" icon="ios-cloud-upload" style="margin-right: 10px" @click="editModaltable()">上传
          </Button>
          <Button icon="md-folder" style="margin-right: 10px" @click="addFolder()">新建文件夹
          </Button>
        </Col>
        <Col span="6" offset="12">
          <Input search enter-button style="display: inline-table" v-model="searchValue"
                 placeholder="搜索你的文件" @on-search="handleSearch"/>
        </Col>
      </Row>
      <Row>
        <div class="ivu-breadcrumb">
          <span v-for="(item,index) in breadcrumbList">
            <a href="javascript:void(0)" @click="toFolder(item.id,index)">{{item.folderName}}</a>
            <span class="ivu-breadcrumb-item-separator">&gt;</span>
          </span>
        </div>
      </Row>
    </Card>
    <Row :gutter="30">
      <Col span="3" v-for="(fileObj,index) in fileObjList">
        <Card :bordered="false" class="fileCard">
          <div @click="openFolder(index)">
            <Tooltip transfer>
              <img :src="folderJPG" style="width: 100%">
              <div style="text-align: center">
                <h4>{{fileObj.folderName}}</h4>
              </div>
              <div slot="content">
                <p>创建人：{{fileObj.nickName}}</p>
                <p>创建时间：{{fileObj.ctime}}</p>
                <p v-show="fileObj.ftype === '1' ">公开文件夹权限：{{fileObj.authority}}</p>
              </div>
            </Tooltip>
          </div>
        </Card>
      </Col>
    </Row>
    <Modal v-model="modalTable.tableVisible" :loading=true :footer-hide=true :title="modalTable.tableTitle">
      <Form ref="formValidate" :model="formValidate" :label-width="50">
        <!--<FormItem label="上传文档" prop="sysID" style="margin-right:30px">-->
        <!--<Select v-model="formValidate.sysID" placeholder="">-->
        <!--<Option v-for="item in allSysList" :value="item.id" :key="item.id">{{item.type_name}}-->
        <!--</Option>-->
        <!--</Select>-->
        <!--</FormItem>-->
        <FormItem label="" prop="upfile" style="margin-right:30px">
          <Upload
            type="drag"
            :action=UploadUrl
            :on-exceeded-size="handleMaxSize"
            :format="['xls','docx','pdf']"
            :on-format-error="handleFormatError"
            :on-success="handleSuccess"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖动文件到这里上传</p>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="标签">
          <Tag checkable color="success" style="margin-right: 20px" @on-change="handleChange"
               v-for="tag in allSysTag" v-bind:name="tag.id" :checked="tagChecked[tag.id]"
          >{{ tag.name }}
          </Tag>
        </FormItem>
        <!--<FormItem label="上传文档" prop="sysDocx" style="margin-right:30px">-->
        <!--<div class="upload-list" v-for="item in formValidate.uploadList">-->
        <!--<template v-if="item.status === 'finished'">-->
        <!--<img :src="item.url" v-if="item.isShow">-->
        <!--<span v-else>{{item.name}}</span>-->
        <!--<div class="upload-list-cover">-->
        <!--<Icon type="ios-eye-outline" @click.native="handleView(item.url)" v-if="item.isShow"></Icon>-->
        <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
        <!--</div>-->
        <!--</template>-->
        <!--<template v-else>-->
        <!--<Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>-->
        <!--</template>-->
        <!--</div>-->
        <!--<Upload-->
        <!--ref="upload"-->
        <!--:show-upload-list="false"-->
        <!--:default-file-list="formValidate.uploadList"-->
        <!--type="drag"-->
        <!--:action=UploadUrl-->
        <!--:max-size="20 * 1024"-->
        <!--:on-exceeded-size="handleMaxSize"-->
        <!--:format="['docx']"-->
        <!--:on-format-error="handleFormatError"-->
        <!--:on-success="handleSuccess"-->
        <!--style="display: inline-block;width:60px;"-->
        <!--&gt;-->
        <!--<div style="width: 60px;height:60px;line-height: 60px;">-->
        <!--<Icon type="ios-camera" size="20"></Icon>-->
        <!--</div>-->
        <!--</Upload>-->
        <!--</FormItem>-->
        <FormItem>
          <Button type="primary" @click="handleSave('formValidate')" :disabled="isDisable">提交</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="folderModalTable.tableVisible" :loading=true :footer-hide=true :title="folderModalTable.tableTitle"
           width="350">
      <Form ref="folder_date" :model="folder_date" :label-width="80" :rules="folderRuleValidate">
        <FormItem label="名称" prop="folderName">
          <Input v-model="folder_date.folderName" placeholder="文件夹名称"></Input>
        </FormItem>
        <FormItem label="类型" prop="ftype" v-show="folder_date.id === 0 || folder_date.ftype === '1' ">
          <RadioGroup v-model="folder_date.ftype">
            <Radio label="0" v-show="folder_date.id === 0">私密</Radio>
            <Radio label="1" v-show="folder_date.id === 0 || folder_date.ftype === '1' ">公开</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="权限" prop="authority" v-show="folder_date.ftype === '1' ">
          <CheckboxGroup v-model="folder_date.authority">
            <Checkbox label="读"></Checkbox>
            <Checkbox label="写"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSaveFolder('folder_date')" :disabled="isDisable">提交</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  UploadUrl,
  getDocList,
  operationDoc,
  getFolderList,
  operationFolder
} from '@/api/doc'

import {
  getSysList
} from '@/api/cmdb/sys.js'

import folder_jpg from '@/assets/images/folder.jpg'

export default {
  data () {
    return {
      openFolderObj: {},
      folderJPG: folder_jpg,
      fileObjList: [],
      keyword: '',
      UploadUrl: '',
      data: [
        {
          title: '',
          content: ''
        }
      ],
      allSysList: [{ 'id': -1, 'type_name': '不关联' }],
      modalTable: {
        tableVisible: false,
        tableTitle: '上传文档'
      },
      formValidate: {
        sysID: -1,
        uploadList: []
      },
      folderModalTable: {
        tableVisible: false,
        tableTitle: '新建文件夹'
      },
      folder_date: {
        folderName: '',
        ftype: '',
        authority: [],
        userID: 0,
        preID: 0
      },
      folderRuleValidate: {
        folderName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        ftype: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
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
      breadcrumbList: [{
        id: 0,
        folderName: '全部文件'
      }]
    }
  },
  methods: {
    handleSaveFolder (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          this.isDisable = true
          setTimeout(() => {
            operationFolder(this.folder_date, 'post').then(
              res => {
                if (res.data.code === 0) {
                  this.$Message.success(`${res.data.msg}`)
                  this.folderModalTable.tableVisible = false
                } else {
                  this.$Message.error(`${res.data.msg}`)
                }
              }
            )
            this.isDisable = false
            this.getFolderList(this.openFolderObj.id)
          }, 500)
        } else {
          this.$Message.error('表单校验错误')
        }
      })
    },
    toFolder (id, index) {
      this.openFolderObj = this.breadcrumbList[index]
      this.getFolderList(id)
      var res = this.breadcrumbList.length - index - 1
      if (res > 0) {
        this.breadcrumbList.splice(index + 1, res)
      }
      console.log(this.openFolderObj)
    },
    openFolder (index) {
      // console.log(this.fileObjList[index])
      if (this.fileObjList[index].userID !== parseInt(JSON.parse(sessionStorage.vuex).user.userId)) {
        if (this.fileObjList[index].ftype === '1' && this.fileObjList[index].authority[0] !== '读') {
          this.$Message.error('没有查看权限')
          return
        }
      }
      this.openFolderObj = this.fileObjList[index]
      this.getFolderList(this.fileObjList[index].id)
      this.breadcrumbList.push(this.fileObjList[index])
    },
    addFolder () {
      if (this.openFolderObj.userID !== parseInt(JSON.parse(sessionStorage.vuex).user.userId)) {
        var _index = this.openFolderObj.authority.indexOf('写')
        if (_index === -1 && this.openFolderObj.ftype === '1') {
          this.$Message.error('没有写入权限')
          return
        }
      }
      this.folderModalTable.tableVisible = true
      if (this.openFolderObj.id > 0) {
        this.folder_date = {
          id: this.openFolderObj.id,
          folderName: '',
          ftype: this.openFolderObj.ftype,
          authority: this.openFolderObj.authority.split(''),
          preID: this.openFolderObj.id
        }
      } else {
        this.folder_date = {
          id: 0,
          folderName: '',
          ftype: '',
          authority: [],
          preID: 0
        }
      }
    },
    handleChange (checked, name) {
      this.tagChecked[name] = checked
      this.tagChecked[0] = false
      this.$forceUpdate()
      // console.log(this.tagChecked)
    },
    // 获取系统分类
    getSysTag (key, value) {
      getSysList(this.pageNum, 999, key, value).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
          this.tagChecked[0] = true
          for (var i = 0; i < this.tableData.length; i++) {
            let obj = {}
            obj['id'] = this.tableData[i].id
            obj['name'] = this.tableData[i].sys_name
            this.allSysTag.push(obj)
            this.tagChecked[this.tableData[i].id] = true
          }
          this.tagChecked[-1] = true
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 获取系统列表
    getSysList (key, value) {
      getSysList(this.pageNum, 999, key, value).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.data
          this.allSysList = [{ 'id': -1, 'type_name': '不关联' }]
          for (var i = 0; i < this.tableData.length; i++) {
            let obj = {}
            obj['id'] = this.tableData[i].id
            obj['type_name'] = this.tableData[i].sys_name
            this.allSysList.push(obj)
          }
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleSave (value) {
      this.isDisable = true
      setTimeout(() => {
        operationDoc(this.formValidate, 'post').then(
          res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.modalTable.tableVisible = false
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          }
        )
        this.isDisable = false
      }, 500)
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.formValidate.uploadList = this.$refs.upload.fileList
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
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '文件大小超限',
        desc: '文件  ' + file.name + ' 太大，上传文件大小不能超过20M.'
      })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件:' + file.name + ' 格式不正确，请选择：docx 等格式类型 '
      })
    },
    handleSuccess (res, file) {
      if (res.code === 0) {
        file.url = file.response.url
        file.isShow = false
        this.formValidate.uploadList = this.$refs.upload.fileList
        this.$Message.success(`${res.msg}`)
      } else {
        this.$Message.error(`${res.msg}`)
      }
    },
    editModaltable () {
      this.modalTable.tableVisible = true
      this.getSysList()
      this.formValidate = {
        sysID: -1,
        uploadList: []
      }
    },
    openUrl (url) {
      window.open(url)
    },
    brightenKeyword (val, keyword) {
      if (keyword) {
        const Reg = new RegExp(keyword, 'gi')
        if (val) {
          const res = val.replace(Reg, `<span style="color: #f7d008;">${keyword}</span>`)
          // console.log(res);
          return res
        }
      } else {
        return val
      }
    },
    changePage (value) {
      this.pageNum = value
      this.getDocList(
        this.pageNum,
        this.pageSize,
        this.getTagList(),
        this.searchValue
      )
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getDocList(
        1,
        this.pageSize,
        this.getTagList(),
        this.searchValue
      )
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      let tagList = []
      for (let i in this.tagChecked) {
        if (this.tagChecked[i] === true) {
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
    getTagList () {
      let tagList = []
      for (let i in this.tagChecked) {
        if (this.tagChecked[i] === true) {
          tagList.push(i)
        }
      }
      return JSON.stringify(tagList)
    },
    getFolderList (preID) {
      getFolderList(preID).then(res => {
        if (res.data.code === 0) {
          // this.$Message.success(`${res.data.msg}`);
          this.fileObjList = res.data.data
        } else {
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    }
  },
  watch: {
    // value(val) {
    //   this.handleSearch()
    // }
  },
  mounted () {
    this.UploadUrl = UploadUrl
    this.getSysTag()
    // this.getDocList(this.pageNum, this.pageSize, '["0"]')
    this.getFolderList(0)
  }
}
</script>

<style lang="less" scoped>
  .fileCard {
    margin-top: 30px;
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
