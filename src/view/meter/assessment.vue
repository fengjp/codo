<template>
  <div>

    <Card style="height:785px;margin-top: 5px;">
      <div  class="background" style="height:750px">
<!--        <div   style="height:750px">-->
       <Row>
         <div   style="margin-top: 25px;">
         <Col span="14" style=" text-align:right;">
             <h1 style="color:#F0F0F0 ;">广东互联网平台运行概况</h1>
         </Col>
         <Col span="10">

           <div style=" text-align:right;">
             <Row>
               <Col span="12" >
           <h3 style="color:#F0F0F0 ;">监控范围:</h3>
                 </Col>
                   <Col span="3">
           <DatePicker  :value="todate" @on-change="todate=$event" placeholder="请选择日期" style="width:120px;" type="date"></DatePicker>
           </Col>
             </Row>
           </div>

         </Col>
         </div>
         </Row>
        <Row style="margin-top: 20px;">
          <Col span="6" style=" text-align:right;">
          <Button @click="handleSubmitTable()"  ghost  type="primary">服务稳定性</Button>
            </Col >
              <Col span="3" style=" text-align:right;">
          <Button @click="handleSubmitTable1()"  ghost type="success">系统运行效率</Button>
              </Col >
                <Col span="3" style=" text-align:right;">
          <Button @click="handleSubmitTable2()"  ghost type="warning">网上支付平台</Button>
                  </Col  >
                    <Col span="3" style=" text-align:right;">
          <Button @click="handleSubmitTable3()"  ghost type="info">内外网数据交换</Button>
                      </Col>
                        <Col span="3" style=" text-align:right;">
          <Button @click="handleSubmitTable5()"  ghost type="error">省际数据交换</Button>
                          </Col  >
        </Row>
<!--            <chart-bar2 :bar_data="bar_list" :value="barData" ref="childBar" style="width: 100%;height: 340px;" text=""/>-->
            <chart-line2 :keylist="line_list" :value="lineData" :legend="legend_list" ref="childLine" :setcolor="tocolor" :setname="to_setname" style="width: 100%;height: 340px;" text=""/>
        </div>
      </Card>
  </div>
</template>

<script>
import { ChartBar2, ChartTree ,ChartLine2} from '_c/charts'
import { companylist } from '@/api/problem'
import { meterList } from '@/api/task'
import FormGroup from '_c/form-group'
import {
  getpeoplelist,
  addpeoplelist,
  delpeoplelist,
  updatepeoplelist,
  getlist,
  getdatelist,
  getiddata
} from '@/api/peoples'
import { getDictConfList } from '@/api/app'
import { post_getid } from '@/api/jobpost'

export default {
  components: {
    FormGroup,
    ChartBar2,
    ChartTree,
    ChartLine2,
  },
  data () {
    return {
      to_setname:'',
      tocolor:'',
      bar_list: {},
      barData: {}, // {"在职":20,"离职":10,"总数":30},
      lineData:[{
          data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          type: 'line',
          smooth:true,
          areaStyle:{},
          }],
      line_list:["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00",
                  "11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00",
                  "21:00","22:00","23:00","24:00",
                ],
      labelClassName: 'bg-color-orange',
      todate: '',
      treedata: {},
      treeData: [],
      treeData2: [],
      // 弹出框
      modalMap: {
        modalVisible: false,
        modalTitle: '创建人员'
      },
      modalMap2: {
        modalVisible: false,
        modalTitle: '批量创建干系人'
      },
      modalMap3: {
        modalVisible: false,
        modalTitle: '组织架构'
      },
      modalMap5: {
        modalVisible: false,
        modalTitle: '频率'
      },
      isDisable: false,
      editModalData: '',
      tokey: '',
      allusernameList: [],
      allsupe_departmentList: [],
      alljobpostList: [],
      tovalue: '',
      searchValue: '',
      searchKey: '用户名',
      UploadUrl: '',
      surl: '',
      formValidate: {
        id: 0,
        username: '',
        sex: '',
        type: '',
        othername: '',
        jobpost: '',
        tel: '',
        department: '',
        supe_department: '',
        temp_department: '',
        startdate: '',
        enddate: '',
        supe_name: ''
      },
      allcompanyList: [],
      alldemand_unit: [],
      alldepartmentList: [],
      ruleValidate: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        sex: [
          {
            required: true,
            message: '选择性别',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '选择类型',
            trigger: 'blur'
          }
        ],
        jobpost: [
          {
            required: true,
            message: '请输入岗位名',
            trigger: 'blur'
          }
        ],
        department: [
          {
            required: true,
            message: '选择部门',
            trigger: 'blur'
          }
        ],
        startdate: [
          {
            required: true,
            message: '选择日期',
            trigger: 'blur'
          }
        ],

        tel: [
          {
            required: true,
            message: '请输入联系方式',
            trigger: 'blur'
          }
        ]
      },
      columnslist: [
        { title: '用户名', key: 'username', editable: true }
      ],
      columns5: [
        { title: '在职', key: 'yessum', editable: true },
        { title: '离职', key: 'nosum', editable: true },
        { title: '总数', key: 'allsum', editable: true }
      ],
      columns: [
        { title: '用户名', key: 'username', editable: true, width: 100 },
        { title: '性别', key: 'sex', editable: true, width: 60 },
        { title: '岗位', key: 'jobpost', editable: true },
        { title: '联系方式', key: 'tel', editable: true },
        { title: '部门', key: 'department', editable: true },
        { title: '上级领导', key: 'supe_name', editable: true, width: 100 },
        { title: '上级部门', key: 'supe_department', editable: true },
        { title: '入岗日期', key: 'startdate', editable: true },
        { title: '离岗日期', key: 'enddate', editable: true },
        { title: '类型', key: 'type', editable: true, width: 60 },
        {
          title: '操作',
          align: 'center',
          width: 180,
          key: 'handle',
          render:
              (h, params) => {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'text',
                        size: 'small',
                        icon: 'ios-create-outline'
                      },
                      style: {
                        marginRight: '1px',
                        color: '#409eff'
                      },
                      on: {
                        click: () => {
                          this.editModal(params.row, 'put', '编辑人员')
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
                        icon: 'ios-trash-outline'
                      },
                      style: {
                        marginRight: '1px',
                        color: '#ed4014'
                      },
                      on: {
                        click: () => {
                          this.handleDelete(params)
                        }
                      }
                    },
                    '删除'
                  )
                ])
              }

        }
      ],
      // 搜索数据
      searchKey: '',
      searchValue: '',
      iddata: [],
      tableData: [],
      tableData5: [], // [{"yessum":20,"nosum":10,"allsum":30}],
      tableData2: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      // select
      selectionList: [],
      weblist:[],
      applist:[],
      legend_list:[]
    }
  },
  methods: {
    meterList(value){
      meterList(value).then(res => {
        if (res.data.code === 0) {
          this.weblist = res.data.data
          this.applist = res.data.list
          this.legend_list = ["web","app"]
          this.lineData = []
          this.line_list = []
          let temp_list = []
          let temp_dict = {}
          for( let i=0;i < this.weblist.length;i++){
              temp_list.push(parseInt(this.weblist[i]["longtimes"]))
              this.line_list.push(this.weblist[i]["times"])
          }
          temp_dict = {
                      name:"web",
                      data: temp_list,
                      type: 'line',
                      stack:"总量",
                      smooth:true,
                      areaStyle:{},
                      color: "blue",
                    }
          this.lineData.push(temp_dict)

          for( let i=0;i < this.applist.length;i++){
              temp_list.push(parseInt(this.applist[i]["longtimes"]))
              // this.line_list.push(this.applist[i]["times"])
          }
          temp_dict = {
                      name:"app",
                      data: temp_list,
                      type: 'line',
                      stack:"总量",
                      smooth:true,
                      areaStyle:{},
                      color: "red",
                    }

          this.lineData.push(temp_dict)
          console.log(this.lineData)
          console.log(this.line_list)
        } else {
          this.weblist = []
          this.applist = []
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    // 当前日期
  addDate () {
    let nowDate = new Date()
    let date = {
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      date: nowDate.getDate()
     }
     this.todate = date.year + '-' + date.month + '-' + date.date
},
    getiddata (id) {
      getiddata(id).then(res => {
        if (res.data.code === 0) {
          this.iddata = res.data.data
        } else {
          this.iddata = []
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    getiddata2 (data) {
      this.getiddata(data.id)
      // console.log(this.iddata)
      setTimeout(() => {
        this.editModal(this.iddata[0], 'put', '编辑')
      }, 500)
    },
    renderContent (h, data) {
      return h('div', { style: { width: '60px', height: '120px' } },
        [
          h('img', {
            attrs: {
              src: data.img,
              width: 50,
              height: 50
            }

          }),
          h('a', {
            domProps: {
              href: 'javascript:;'
            },
            style: {
              marginRight: '10px',
              color: '#fff'
            }
          }, data.label),
          h('a', {
            style: {
              color: '#fff'
            },
            domProps: {
              href: 'javascript:;'
            }
          }, data.position),
          h('Dropdown', {
            attrs: {
              trigger: 'click'
            }
          }, [
            h('a', {
              style: {
                marginLeft: '10px',
                color: '#409eff'
              },
              domProps: {
                href: 'javascript:;'
              },
              on: {
                click: () => {
                  this.showFlag = !!data.children
                }
              }
            }, data.name),
            h('DropdownMenu', {
              slot: 'list'
            }, [
              h('DropdownItem', {
                nativeOn: {
                  click: () => {
                    this.editModal('', 'post', '新增人员')
                  }
                }
              }, '新增'),
              h('DropdownItem', {
                nativeOn: {
                  click: () => {
                    this.getiddata2(data)
                  }
                }
              }, '编辑'),
              h('DropdownItem', {
                nativeOn: {
                  click: () => {
                    this.handleDelete2(data)
                  //  this.$Modal.confirm({
                  //   title: '确定要删除吗？',
                  //   onOk: () => {
                  //       this.$Message.info('删除成功');
                  //       //删除成功
                  //   },
                  // });
                  }
                }
              }, '删除')
            ]
            )
          ])
        ])
    },

    toggleExpand (data, val) {
      var _this = this
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, 'expand', val)
          if (item.children) {
            _this.toggleExpand(item.children, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.children) {
          _this.toggleExpand(data.children, val)
        }
      }
    },
    collapse (list) {
      var _this = this
      list.forEach(function (child) {
        if (child.expand) {
          child.expand = false
        }
        child.children && _this.collapse(child.children)
      })
    },
    onExpand (e, data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.children) {
          this.collapse(data.children)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    changestime (data) {
      this.formValidate.startdate = data
    },
    changeetime (data) {
      this.formValidate.enddate = data
    },
    handleSuccess (res, file) {
      // console.log(file)
      this.getpeoplelist(this.pageNum, this.pageSize)
      this.modalMap2.modalVisible = false
      this.$Message.success('文件上传成功')
    },
    handleError (error) {
      // console.log(error)
      this.modalMap2.modalVisible = false
      this.$Message.success('文件上传失败')
    },
    post_getid () {
      post_getid().then(res => {
        if (res.data.code === 0) {
          this.alljobpostList = res.data.data
        } else {
          this.alljobpostList = []
        }
      })
    },
    geturl () {
      geturl().then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.surl = res.data.data
          setTimeout(() => {
            document.getElementById('surl').click()
          }, 1000)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleSubmitTable () {
      // console.log(JSON.stringify(this.todate))
      if (JSON.stringify(this.todate) == '""') {
        alert('请选择日期范围')
      } else {
        this.tocolor = "blue"
        this.to_setname = "服务稳定性"
        // this.lineData = [10,81,20,9,21,22,3,5,66,25,0,68,10,81,30,9,21,22,3,5,26,55,68,39,90]
        // this.getdatelist(this.todate[0], this.todate[1])
        this.meterList(this.todate)

      }
    },
    handleSubmitTable1 () {
      console.log(JSON.stringify(this.todate))
      if (JSON.stringify(this.todate) == '""') {
        alert('请选择日期范围')
      } else {
        this.tocolor = "green"
        this.to_setname = "系统运行效率"
        this.lineData = [10,81,30,9,21,22,3,5,66,12,0,68,10,81,30,9,21,22,3,5,66,23,68,39,90]
        // this.getdatelist(this.todate[0], this.todate[1])
      }
    },
    handleSubmitTable2 () {
      console.log(JSON.stringify(this.todate))
      if (JSON.stringify(this.todate) == '""') {
        alert('请选择日期范围')
      } else {
        this.tocolor = "orange"
        this.to_setname = "网上支付平台"
        this.lineData = [0,0,0,0,0,22,3,5,22,55,0,68,10,81,30,9,21,22,3,25,66,55,68,39,90]
        // this.getdatelist(this.todate[0], this.todate[1])
      }
    },
    handleSubmitTable3 () {
      console.log(JSON.stringify(this.todate))
      if (JSON.stringify(this.todate) == '""') {
        alert('请选择日期范围')
      } else {
        this.tocolor = "#1E90FF"
        this.to_setname = "内外网数据交换"
        this.lineData = [10,81,30,9,12,22,3,5,66,55,0,68,10,81,30,9,21,22,3,5,66,55,68,39,90]
        // this.getdatelist(this.todate[0], this.todate[1])
      }
    },
    handleSubmitTable5 () {
      console.log(JSON.stringify(this.todate))
      if (JSON.stringify(this.todate) == '""') {
        alert('请选择日期范围')
      } else {
        this.tocolor = "red"
        this.to_setname = "省数据交换"
        this.lineData = [10,81,30,9,12,2,3,5,66,32,0,68,10,81,30,9,21,22,3,5,35,55,68,39,90]
        // this.getdatelist(this.todate[0], this.todate[1])
      }
    },
    getdatelist (start, end) {
      getdatelist(start, end).then(res => {
        if (res.data.code === 0) {
          this.tableData5 = res.data.data
          this.barData = res.data.dict[0]
          this.bar_list = res.data.bar_list
        } else {
          this.tableData5 = []
          this.barData = {}
        }
      })
    },
    getlist () {
      getlist().then(res => {
        if (res.data.code === 0) {
          this.allusernameList = res.data.data
          this.allsupe_departmentList = res.data.department
          this.treeData2 = res.data.treelist
          this.treedata = res.data.treelist
        } else {
          this.allusernameList = []
          this.treeData = []
          this.allsupe_departmentList = []
        }
      })
    },
    getterr () {
      // console.log(this.treeData2)
      this.treedata = this.treeData2
    },
    getDictConfList () {
      getDictConfList().then(res => {
        if (res.data.code === 0) {
          // let stakeholder_company_list = JSON.parse(res.data.data['stakeholder_company_list'])
          // let stakeholder_department_list = JSON.parse(res.data.data['stakeholder_department_list'])
          let stakeholder_company_list = eval(res.data.data['stakeholder_company_list'])
          let stakeholder_department_list = eval(res.data.data['stakeholder_department_list'])
          if (stakeholder_company_list) {
            this.allcompanyList = stakeholder_company_list
            // console.log(this.allcompanyList)
          }
          if (stakeholder_department_list) {
            this.alldepartmentList = stakeholder_department_list
          }
        } else {
          this.alldepartmentList = []
          this.allcompanyList = []
          // this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    editModal2 () {
      this.modalMap2.modalVisible = true
      this.modalMap2.modalTitle = '上传文件'
    },
    editModal5 () {
      this.todate = []
      this.barData = {}
      this.tableData5 = []
      setTimeout(() => {
        this.modalMap5.modalVisible = true
        this.modalMap5.modalTitle = '频率'
      }, 500)
    },
    editModal3 () {
      this.getterr()
      this.toggleExpand(this.treedata, true)
      setTimeout(() => {
        this.modalMap3.modalVisible = true
        this.modalMap3.modalTitle = '组织架构'
      }, 1000)
    },
    editModal (paramsRow, meth, mtitle) {
      this.modalMap.modalVisible = true
      this.modalMap.modalTitle = mtitle
      this.editModalData = meth
      if (paramsRow && paramsRow.id) {
        // put
        this.formValidate = {
          id: paramsRow.id,
          type: paramsRow.type,
          username: paramsRow.username,
          sex: paramsRow.sex,
          jobpost: paramsRow.jobpost,
          tel: paramsRow.tel,
          department: paramsRow.department,
          supe_department: paramsRow.supe_department,
          othername: eval(paramsRow.othername),
          startdate: paramsRow.startdate,
          enddate: paramsRow.enddate,
          supe_name: paramsRow.supe_name
        }
      } else {
        // post
        this.formValidate = {
          username: '',
          sex: '',
          jobpost: '',
          tel: '',
          type: '',
          department: '',
          supe_department: '',
          othername: '',
          startdate: '',
          enddate: ''
        }
      }
    },
    handleDelete (params) {
      if (confirm(`确定要删除 ${params.row.username}`)) {
        delpeoplelist({ id: params.row.id }).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getpeoplelist(this.pageNum, this.pageSize, this.tokey, this.tovalue)
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    handleDelete2 (data) {
      if (confirm(`确定要删除 ${data.name}`)) {
        delpeoplelist({ id: data.id }).then(res => {
          if (res.data.code === 0) {
            this.$Message.success(`${res.data.msg}`)
            this.getpeoplelist(this.pageNum, this.pageSize, this.tokey, this.tovalue)
            this.getlist()
          } else {
            this.$Message.error(`${res.data.msg}`)
          }
        })
      }
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    changePage (value) {
      this.pageNum = value
      this.getpeoplelist(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    handleSearch () {
      this.getpeoplelist(1, this.pageSize, this.searchKey, this.searchValue)
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getpeoplelist(1, this.pageSize, this.searchKey, this.searchValue)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    handleSearchTable (key, val) {
      this.pageNum = 1
      this.searchKey = key
      this.searchValue = val
      this.getpeoplelist(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    // 获取用户列表
    getpeoplelist (page, limit, key, value) {
      getpeoplelist(page, limit, key, value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.pageTotal = res.data.count
          this.tableData = res.data.data
        } else {
          this.tableData = []
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleSubmit (value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          this.isDisable = true
          if (this.formValidate.tel.length > 11) {
            this.$Message.error('请输入正确的手机号')
          }
          setTimeout(() => {
            if (this.editModalData == 'post') {
              addpeoplelist(this.formValidate).then(res => {
                const data = res.data
                if (res.data.code === 0) {
                  this.$Message.info(`${data.msg}`)
                  // 重新获取数据
                  this.getpeoplelist(this.pageNum, this.pageSize)
                  this.getlist()
                } else {
                  this.$Message.error(`${data.msg}`)
                }
              }).catch(err => {
                this.$Message.error(err)
              })
            }
            if (this.editModalData == 'put') {
              updatepeoplelist(this.formValidate).then(res => {
                const data = res.data
                if (res.data.code === 0) {
                  this.$Message.info(`${data.msg}`)
                  // 重新获取数据
                  this.getpeoplelist(this.pageNum, this.pageSize)
                  this.getlist()
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
    handleInput (editData) {
      // 行内编辑
      const EditData = {
        user_id: editData.row.user_id,
        key: editData.column.key,
        value: editData.value
      }
      updatepeoplelist(EditData).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    companylist (key, value) {
      companylist(key, value).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          // console.log(res.data.data)
          this.alldemand_unit = res.data.data
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
    handleClear (e) {
      // if (e.target.value === '') this.tableData = this.value
    },
    handleSelectChange (val) {
      let userList = []
      val.forEach(item => {
        userList.push(item.user_id)
      })
      this.selectionList = userList
    }
  },
  watch: {
    // barData: function () {
    //   this.$refs.childBar.initBar()
    // }
    lineData: function () {
      this.$refs.childLine.initLine()
    }
    // treeData: function () {
    //   this.$refs.peopleTree.initTree()
    // },
  },
  mounted () {
    this.getpeoplelist(this.pageNum, this.pageSize)
    this.getDictConfList()
    this.post_getid()
    this.getlist()
    this.toggleExpand(this.treedata, true)
    this.addDate()
  }

}
</script>

<style lang="less">
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

  .bg-color-orange {
    color: #fff;
    background-color: orange;
  }
   .org-boxs{
      width:100%;
      height:100%;
      text-align: center;
      /*background: #030C24;*/
      background-image: -webkit-radial-gradient(ellipse farthest-corner at center 40%, #000d4d 0%, #000105 100%);
      background-image: radial-gradient(ellipse farthest-corner at center 40%, #000d4d 0%, #000105 100%);
     overflow-y: scroll;
   }
  .oTree {
    margin-top: 5px;
    text-align: center;
    width: 100%;
    height: 50%;
  }
  .background{
    background:url(meter.jpeg);
    width:100%;
    height:100%;  /**宽高100%是为了图片铺满屏幕 */
    z-index:-1;
    /*position: absolute;*/

}
</style>
