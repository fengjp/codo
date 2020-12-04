<template>
  <div style="height:100%">
    <Card style="margin-top: 5px;">
      <div>
        <Row>
          <Select v-model="searchKey" class="search-col" style="width:150px;margin-right:5px">
            <Option v-for="item in columnslist" :value="item.key" :key="`search-col-${item.key}`">{{ item.title }}
            </Option>
          </Select>
          <Input @on-change="handleClear" clearable placeholder="输入关键字搜索" v-model="searchValue"
                 style="width:150px;margin-right:5px"/>
          <Button @click="handleSearch" class="search-btn" type="primary" style="margin-right:5px">搜索</Button>
          <Button type="info" class="search-btn" @click="editModal('', 'post', '新建存储过程')" style="margin-right:5px">新建存储过程
          </Button>
          <!--          <Button type="info"  @click="editModal2" style="margin-right:5px">批量新建干系人</Button>-->
        </Row>
      </div>
      <Table
        :columns="columns"
        :data="tableData"
        ref="selection"
        size="small"
      ></Table>
      <div style="margin: 10px; overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" :page-size-opts=[10,15,25,35,50,100]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>
    <Modal
      v-model="modalMap.modalVisible"
      :title="modalMap.modalTitle"
      :loading=true
      :footer-hide=true
      width="630px"
    >
      <!--<Alert show-icon>记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.</Alert>-->
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="105" :inline="true">
        <Row>
          <Col span="12">
            <div v-if="editModalData && editModalData == 'put'">

              <FormItem label="存储过程名" prop="name" style="width:350px;">
                <Input
                  v-model="formValidate.name"
                  disabled
                  :maxlength="45"
                  placeholder="请输入存储过程名"
                ></Input>
              </FormItem>
            </div>
            <div v-else>
              <FormItem label="存储过程名" prop="name" style="width:350px;">
                <Input
                  v-model="formValidate.name"
                  :maxlength="45"
                  placeholder="请输入存储过程名"
                ></Input>
              </FormItem>
            </div>
          </Col>
          <FormItem label="执行方式" prop="mode" style="width:500px;">
              <RadioGroup v-model="formValidate.mode"   @on-change="change_totype">
                <Radio label="定时"></Radio>
                <Radio label="触发"></Radio>
              </RadioGroup>
            </FormItem>
          <FormItem label="存储过程入参" style="width: 100%" v-if="isShow">
                <Row v-for="(item, index) in formValidate.dictvalue">
                  <Col span="20">
                   <Input style="width: 30px" type="text" v-model="item.toindex" placeholder="请输入字段key"></Input>:
<!--                   <Input style="width: 100px" type="text" v-model="item.v" placeholder="字段类型"></Input>-->
                    <Select placeholder="字段类型" style="width: 100px"  v-model="item.type" >
                       <Option :value="item.v" v-for="item in temp_list">{{item.v}}
                       </Option>
                    </Select>:
                    <Select placeholder="数据格式" style="width: 120px"  v-model="item.format" v-if="item.type !='字符串'">
                       <Option :value="item.k" v-for="item in temp_list2">{{item.v}}
                       </Option>
                    </Select>
                    <Input style="width: 110px" type="text" v-model="item.remarks" placeholder="字段描述"></Input>
                  </Col>
                  <Col span="3" offset="1">
                  <Button @click="handleRemove(index)">删除</Button>
                  </Col>
                </Row>
        </FormItem>
        <FormItem  v-if="isShow">
              <Button style="width: 80px" long @click="handleAdd" icon="md-add">添加</Button>
        </FormItem>
        </Row>
        <FormItem label="授权用户" prop="authorized" style="width:500px;margin-right:500px" >
              <Select  allow-create filterable  multiple   placeholder="授权用户" v-model="formValidate.authorized" @on-query-change="tempusername">
            <Option  :value="item.nickname" v-for="item in allNameList2">{{ item.nickname }}</Option>
          </Select>
            </FormItem>
        <FormItem label="详细描述" prop="remarks" style="width:500px;margin-right:500px">
<!--              <Input-->
<!--                v-model="formValidate.remarks"-->
<!--                type="textarea"-->
<!--                :rows="5"-->
<!--                placeholder="详细描述"-->
<!--              ></Input>-->
<!--                <Editor v-model="formValidate.remarks"  class="Editor_html"   />-->
                      <quill-editor
                        class="editor"
                        v-model="formValidate.remarks"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                       @change="onEditorChange($event)"
                      ></quill-editor>
        </FormItem>
        <FormItem   style="margin-top:130px">
          <Button
            type="primary"
            @click="handleSubmit('formValidate')"
            :disabled="isDisable"
          >提交
          </Button>
          <Button
            @click="handleReset('formValidate')"
            style="margin-left: 8px"
          >重置
          </Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="modalMap2.modalVisible"
      :title="modalMap.modalTitle"
      :loading=true
      :footer-hide=true
      width="30%"
    >
      <Upload
        type="drag"
        :action=UploadUrl
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>请选择或拖拽一个文件上传</p>
        </div>
      </Upload>
    </Modal>
    <Modal
      v-model="modalMap3.modalVisible"
      :title="modalMap3.modalTitle"
      :loading=true
      :footer-hide=true
      width="50"
    >
<!--      <ul id="list">-->
<!--        <li v-for="(item,index) in list_items">-->
<!--        {{item.k}}:{{ item.v}}-->
<!--        </li>-->
<!--      </ul>-->
      <div >
          <p   class="remarks_html"   v-html="list_items" ></p>
      </div>
    </Modal>
  </div>
</template>

<script>
  // 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
  ["blockquote", "code-block"], // 引用  代码块
  [{ header: 1 }, { header: 2 }], // 1、2 级标题
  [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
  [{ script: "sub" }, { script: "super" }], // 上标/下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  // [{'direction': 'rtl'}],                         // 文本方向
  [{ size: ["small", false, "large", "huge"] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  ["clean"], // 清除文本格式
  ["link", "image", "video"] // 链接、图片、视频
];

import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

  import FormGroup from '_c/form-group'
  import { getuserlist } from '@/api/user'
  import {
    getstoragelist,
    addstoragelist,
    delstoragelist,
    updatestoragelist,
    UploadUrl,
  } from '@/api/cmdb2/storage'
  // import {getDictConfList} from '@/api/app'
  // import  Editor from '_c/common/Editor'

  export default {
    components: {
      FormGroup,
      // Editor,
      quillEditor
    },
  //   props: {
  //   /*编辑器的内容*/
  //   value: {
  //     type: String
  //   },
  //   /*图片大小*/
  //   maxSize: {
  //     type: Number,
  //     default: 4000 //kb
  //   }
  // },
    data() {
      return {
        /////////////////////
        content: "",
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        placeholder: "您想说点什么？",
        modules: {
          toolbar: {
            container: toolbarOptions,
            // container: "#toolbar",
            handlers: {
              image: function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      },
      serverUrl: "/v1/blog/imgUpload", // 这里写你要上传的图片服务器地址
      header: {
        // token: sessionStorage.token
      }, // 有的图片服务器要求请求头需要有token
        /////////////////////
        // article:{content:null},
        temp_list:[{"k":"time","v":"时间"},{"k":"char","v":"字符串"}],
        temp_list2:[{"k":"yyyy-mm","v":"年-月"},
                    {"k":"yyyy-mm-dd","v":"年-月-日"},
                    {"k":"yyyy-mm-dd|HHMM","v":"年-月-日 时分"},
                    {"k":"yyyy-mm-dd|HHMMSS","v":"年-月-日 时分秒"},
                    // {"k":"yyyy-mm-dd|yyyy-mm-dd","v":"年-月-日至年-月-日"},
                    // {"k":"yyyy-mm-dd|HHMM-yyyy-mm-dd|HHMM","v":"年-月-日 时分至年-月-日 时分"},
                    // {"k":"yyyy-mm-dd|HHMMSS-yyyy-mm-dd|HHMMSS","v":"年-月-日 时分秒至年-月-日 时分秒"},
                    ],
        isShow:false,
        // 弹出框
        modalMap: {
          modalVisible: false,
          modalTitle: '创建岗位'
        },
        modalMap2: {
          modalVisible: false,
          modalTitle: '批量创建干系人'
        },
        modalMap3: {
          modalVisible: false,
          modalTitle: '职责详情'
        },
        isDisable: false,
        editModalData: '',
        list_items: '',
        tokey: '',
        tovalue: '',
        allNameList: [],
        allNameList2: [],
        searchValue: '',
        searchKey: '用户名',
        UploadUrl: '',
        surl: '',
        formValidate: {
          name: '',
          mode:'',
          dictvalue: [
            {
              toindex:0,
              type: '',
              format:'',
              remarks:'',
              msg:''
            }
          ],
          authorized:'',
          remarks: '',
        },
        allcompanyList: [],
        alldemand_unit: [],
        alldepartmentList: [],
        ruleValidate: {
          name: [
            {
              required: true,
              message: '请输入存储过程名',
              trigger: 'blur'
            }
          ],
          mode: [
            {
              required: true,
              message: '请选择执行方式',
              trigger: 'blur'
            }
          ],
        },
        columnslist: [
          {title: '存储过程名', key: 'name', editable: true},
          {title: '执行方式', key: 'mode', editable: true},
        ],
        columns: [
          {title: '存储过程名', key: 'name', editable: true},
          {title: '执行方式', key: 'mode', editable: true},
          {title: '执行时长', key: 'consume',width: 260, editable: true},
          {
            title: '详细描述', key: 'remarks', editable: true,
            render:
              (h, params) => {
                return h('div', [
                  h(
                    'a',
                    {
                      props: {
                        type: 'text',
                        size: 'small',
                        icon: '',
                      },
                      style: {
                        marginRight: '1px',
                        color: '#409eff'
                      },
                      on: {
                        click: () => {
                          this.editModal3(params.row.remarks)
                        }
                      }
                    },
                    '查看'
                  ),

                ])
              }
          },
          {title: '创建人', key: 'username', editable: true},
          {title: '创建时间', key: 'create_time', editable: true},
          {
            title: '操作',
            align: 'center',
            width: 180,
            key: 'handle',
            render:
              (h, params) => {
                let flag_num = 0
                let temp_authorized_list =  eval(params.row.authorized)
                for (var i = 0; i < temp_authorized_list.length; i++) {
                     if (temp_authorized_list[i] ===  this.tousername){
                           flag_num = 0   //当前用户有授权
                     }else{
                           flag_num = 1   //当前用户没有授权
                     }
                }
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'text',
                        size: 'small',
                        icon: 'ios-create-outline',
                      },
                      style: {
                        marginRight: '1px',
                        color: '#409eff',
                        display: (params.row.username != this.tousername)&& (flag_num === 1)  && (this.toflag === 0)?'none':'inline-block',  //按钮隐藏
                      },
                      on: {
                        click: () => {
                          this.editModal(params.row, 'put', '编辑存储过程')
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
                    'Button',
                    {
                      props: {
                        type: 'text',
                        size: 'small',
                        icon: 'ios-trash-outline',
                      },
                      style: {
                        marginRight: '1px',
                        color: '#ed4014',
                        display:(params.row.username != this.tousername)&& (flag_num === 1) && (this.toflag === 0)?'none':'inline-block',  //按钮隐藏
                      },
                      on: {
                        click: () => {
                          this.handleDelete(params)
                        }
                      }
                    },
                    "删除"
                  )
                ])
              }

          }
        ],
        // 搜索数据
        searchKey: '',
        searchValue: '',
          toflag: 0,
        // 分页数据
        tableData: [],
        tousername:'',
        tableData2: [],
        pageTotal: 0, // 数据总数
        pageNum: 1, // 当前页码
        pageSize: 15, // 每页条数
        // select
        selectionList: []
      }
    },
    methods: {
      tempusername(data){
          let temp_list = []
          let  temp_str = String(data)
          for (var i = 0; i < this.allNameList.length; i++) {
                 if (this.allNameList[i].nickname.indexOf(temp_str) != -1){
                         temp_list.push(this.allNameList[i])
                     }
            }
          this.allNameList2 = temp_list
      },
      //触发单选器
      change_totype(){
         if(this.formValidate.mode === "触发" ){
          this.isShow = true
        }else{
          this.isShow = false
           this.formValidate.dictvalue = []
        }
      },
      handleSuccess(res, file) {
        this.getpostlist(this.pageNum, this.pageSize)
        this.modalMap2.modalVisible = false
        this.$Message.success("文件上传成功")
      },
      handleError(error) {
        this.modalMap2.modalVisible = false
        this.$Message.success("文件上传失败")
      },
      // getDictConfList() {
      //   getDictConfList().then(res => {
      //     if (res.data.code === 0) {
      //       // let stakeholder_company_list = JSON.parse(res.data.data['stakeholder_company_list'])
      //       // let stakeholder_department_list = JSON.parse(res.data.data['stakeholder_department_list'])
      //       let stakeholder_company_list = eval(res.data.data['stakeholder_company_list'])
      //       let stakeholder_department_list = eval(res.data.data['stakeholder_department_list'])
      //       if (stakeholder_company_list) {
      //         this.allcompanyList = stakeholder_company_list
      //         console.log(this.allcompanyList)
      //       }
      //       if (stakeholder_department_list) {
      //         this.alldepartmentList = stakeholder_department_list
      //       }
      //
      //     } else {
      //       this.$Message.error(`${res.data.msg}`)
      //     }
      //   })
      // },
      // editModal2() {
      //   this.modalMap2.modalVisible = true
      //   this.modalMap2.modalTitle = '上传文件'
      // },
      editModal3(remarks) {
        this.modalMap3.modalVisible = true
        this.modalMap3.modalTitle = "详情描述"
        this.list_items = String(remarks)
      },
      editModal(paramsRow, meth, mtitle) {
        this.modalMap.modalVisible = true
        this.modalMap.modalTitle = mtitle
        this.editModalData = meth
        if (paramsRow && paramsRow.id) {
          // put
          this.formValidate = {
            id: paramsRow.id,
            name: paramsRow.name,
            mode: paramsRow.mode,
            remarks:String(paramsRow.remarks),
            authorized:eval(paramsRow.authorized),
            dictvalue: eval(paramsRow.dictvalue)
          }
          if(this.formValidate.mode === "触发" ){this.isShow = true}else{this.isShow = false}
        } else {
          // post
          this.formValidate = {
            name: '',
            mode: '触发',
            remarks: "",
            authorized:[],
            dictvalue: [
                   {
                      toindex: 0,
                      type: '',
                      format:'',
                      remarks:'',
                      msg:''
                   }],
          }
          if(this.formValidate.mode === "触发" ){this.isShow = true}else{this.isShow = false}
        }
      },
      handleDelete(params) {
        if (confirm(`确定要删除 ${params.row.name}`)) {
          delstoragelist({id: params.row.id}).then(res => {
            if (res.data.code === 0) {
              this.$Message.success(`${res.data.msg}`)
              this.getstoragelist(this.pageNum, this.pageSize, this.tokey, this.tovalue)
            } else {
              this.$Message.error(`${res.data.msg}`)
            }
          })
        }
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
      changePage(value) {
        this.pageNum = value
        this.getstoragelist(
          this.pageNum,
          this.pageSize,
          this.searchKey,
          this.searchValue
        )
      },
      handleSearch() {
        this.getstoragelist(1, this.pageSize, this.searchKey, this.searchValue)
      },
      // 每页条数
      handlePageSize(value) {
        this.pageSize = value
        this.getstoragelist(1, this.pageSize, this.searchKey, this.searchValue)
      },
      exportExcel() {
        this.$refs.tables.exportCsv({
          filename: `table-${new Date().valueOf()}.csv`
        })
      },
      // handleSearchTable(key, val) {
      //   this.pageNum = 1
      //   this.searchKey = key
      //   this.searchValue = val
      //   this.getstoragelist(
      //     this.pageNum,
      //     this.pageSize,
      //     this.searchKey,
      //     this.searchValue
      //   )
      // },
      // 获取列表
      getstoragelist(page, limit, key, value) {
        getstoragelist(page, limit, key, value).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.pageTotal = res.data.count
            this.tableData = res.data.data
            if (res.data.flag == '1') {
              this.toflag = 1
            } else {
              this.toflag = 0
            }
            let loginUser = JSON.parse(sessionStorage.vuex).user.nickName
            this.tousername = loginUser
          } else {
            this.tableData = []
            this.$Message.error(`${res.data.msg}`)
          }
        })
      },
      handleSubmit(value) {
        this.$refs[value].validate((valid) => {
          if (valid) {
            this.isDisable = true
            setTimeout(() => {
              if (this.editModalData == "post") {
                addstoragelist(this.formValidate).then(res => {
                  const data = res.data
                  if (res.data.code === 0) {
                    this.$Message.info(`${data.msg}`)
                    // 重新获取数据
                    this.getstoragelist(this.pageNum, this.pageSize)
                  } else {
                    this.$Message.error(`${data.msg}`)
                  }
                }).catch(err => {
                  this.$Message.error(err)
                })
              }
              if (this.editModalData == "put") {
                updatestoragelist(this.formValidate).then(res => {
                  const data = res.data
                  if (res.data.code === 0) {
                    this.$Message.info(`${data.msg}`)
                    // 重新获取数据
                    this.getstoragelist(this.pageNum, this.pageSize)
                  } else {
                    this.$Message.error(`${data.msg}`)
                  }
                }).catch(err => {
                  this.$Message.error(err)
                })
              }
              this.modalMap.modalVisible = false
              this.isDisable = false
            }, 1000)
          } else {
            this.$Message.error('缺少必要参数')
          }
        })
      },
      // handleInput(editData) {
      //   // 行内编辑
      //   const EditData = {
      //     user_id: editData.row.user_id,
      //     key: editData.column.key,
      //     value: editData.value
      //   }
      //   updatepostlist(EditData).then(res => {
      //     if (res.data.code === 0) {
      //       this.$Message.success(`${res.data.msg}`)
      //     } else {
      //       this.$Message.error(`${res.data.msg}`)
      //     }
      //   })
      // },
      handleClear(e) {
        // if (e.target.value === '') this.tableData = this.value
      },
      // handleSelectChange(val) {
      //   let userList = []
      //   val.forEach(item => {
      //     userList.push(item.user_id)
      //   })
      //   this.selectionList = userList
      // },
      // 获取用户列表
    getUserList () {
      getuserlist(1, 2000).then(res => {
        if (res.data.code === 0) {
          this.allNameList = res.data.data
          this.allNameList2 = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
      handleAdd() {
        // this.index++;
        this.index = this.formValidate.dictvalue.length
        this.formValidate.dictvalue.push({
          toindex: this.index,
          type: '',
          format:'',
          remarks:'',
          msg:''
        });
      },
      handleRemove(index) {
        this.formValidate.dictvalue.splice(index, 1);//(下标index开始，删除1个)
      },
      /////
          onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
      this.$emit("input", this.content);
    },

    // 富文本图片上传前
    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true;
    },

    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code == 200) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.url);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },
    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    },
      /////
    },
    mounted() {
      // this.UploadUrl = UploadUrl
      this.getUserList()
      this.getstoragelist(this.pageNum, this.pageSize)
      // this.getDictConfList()
    }
  }
</script>

<style lang="less" scoped>
  .search-con {
    padding: 10px 0;

    .search {
      &-col {
        display: inline-block;
        width: 400px;
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
<style lang="less" >
  .remarks_html p{
    /*color: "";*/
  }
  .Editor_html  Editor{
    /*color: "";*/
  }
  .editor {
  line-height: normal !important;
  height: 200px;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
</style>
