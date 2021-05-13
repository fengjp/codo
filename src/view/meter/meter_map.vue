<template>
   <div>
     <Row>
         <div >
         <Col  style=" text-align:center;">
             <h1 >广东省互联网应用情况自评(2021版：总分100分）</h1>


         </Col>
           </div>
         </Row>
        <Row style=" text-align:right;">
         <div >
            <Col style=" text-align:right;">
           <DatePicker :clearable="false"
                              style="width:135px;margin-right:5px"
                              :value="start_date"
                              @on-change="start_date=$event"
                              format="yyyy-MM"
                              placeholder="请选择开始日期"
                              type="month">

                  </DatePicker>

             <Button @click="getbusinesslist()" style="margin-right:5px" type="primary">查询</Button>
               <Button type="success"  @click="editModal2" style="margin-right:5px">导入</Button>
              <Button @click="editModaltable4" style="margin-right:5px" type="info">编辑</Button>
              <Button @click="editModaltable5"  type="success"   style="margin-right:5px">线性图</Button>
               </Col >
         </div>
         </Row>
            <Row>
               <Col span="12" >
              <chart-map  ref="childLine" :keylist="key_list2"  :value="velue_list2" :list="business_list" style="width: 100%;height: 700px;" />
                  </Col>
                     <Col span="12" >
            <div id="myChart" :style="{width: '800px', height: '750px'}"></div>
                        </Col>
              </Row>
     <Modal
        v-model="modalMap2.modalVisible"
        :loading=true
        :footer-hide=true
        width="30%"
      >
      <Upload
        type="drag"
        :action=UploadUrl3
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>请选择或拖拽一个文件上传</p>
        </div>
    </Upload>
    </Modal>
     <Modal :footer-hide=true :loading=true :title="modalTable4.tableTitle" v-model="modalTable4.tableVisible"  width="1760" >
        <div >
             <Form :inline="true" :label-width="170" :model="formValidate"  ref="formValidate">
               <FormItem label="选择编辑日期" prop="riqi" style="width:350px;margin-right:5px"
                >
                  <DatePicker :clearable="false"
                              :value="bjriqi"
                              @on-change="bjriqi=$event"
                              format="yyyy-MM"
                              placeholder="请选择日期"
                              type="month">

                  </DatePicker>

                </FormItem>
               <FormItem label="地级市" prop="city" style="width:300px;margin-right:20px">
               <Select placeholder="请选择地级市" v-model="city">
                    <Option  :value="item.k" v-for="item in allTypeList">{{item.v}}
                    </Option>
                  </Select>
                 </FormItem>
               <Button @click="getcitydata()" style="margin-right:5px" type="info">获取数据</Button>
            <Row >
              <Col span="8" >
                <Card style="width:560px;">
                <p slot="title">业务应用</p>
                   <Row >
                     <Col span="12" >
                        <FormItem label="补换领牌证" prop="bhlpz" style="width:230px;">
                          <Input
                           :maxlength="45"
                           placeholder="请输入得分"
                           v-model="formValidate.bhlpz"
                          ></Input>
                        </FormItem>
                     </Col>
                     <Col span="12" >
                        <FormItem label="申领免检标志" prop="slmjbz" style="width:260px;">
                          <Input
                           :maxlength="45"
                           placeholder="请输入得分"
                           v-model="formValidate.slmjbz"
                          ></Input>
                        </FormItem>
                     </Col>
                   </Row >
                  <Row >
                     <Col span="12" >
                <FormItem label="电子监控处理" prop="dzjkcl" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.dzjkcl"
                ></Input>
                </FormItem>
                        </Col>
                    <Col span="12" >
                <FormItem label="交通事故快处" prop="jtsgkc" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.jtsgkc"
                ></Input>
                </FormItem>
                        </Col>
                   </Row >
                  <Row >
                     <Col span="12" >
                <FormItem label="预选机动车号牌" prop="yxjdchp" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.yxjdchp"
                ></Input>
                </FormItem>
                       </Col>
                    <Col span="12" >
                <FormItem label="满分审验教育" prop="mfsyjy" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.mfsyjy"
                ></Input>
                </FormItem>
                       </Col>
                   </Row >


               </Card>
              </Col>
              <Col span="8" >
                <Card  style="width:560px;">
                   <p slot="title">业务及时处理</p>
                  <Row >
                     <Col span="12" >
                <FormItem label="牌证业务及时受理率" prop="pzywjscl" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.pzywjscl"
                ></Input>
                </FormItem>
                     </Col >
                    <Col span="12" >
                <FormItem label="预选号牌资料及时审核率" prop="yxhpzljsshl" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.yxhpzljsshl"
                ></Input>
                </FormItem>
                     </Col >
                     </Row >
                       <Row >
                     <Col span="12" >
                  <FormItem label="退费申请及时受理率" prop="tfsqjschl" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.tfsqjschl"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                  <FormItem label="满分审验教育及时审核率" prop="mfsyjyjsshl" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.mfsyjyjsshl"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                         <FormItem label="用户信息及时审核率" prop="yhxxjsshl" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.yhxxjsshl"
                ></Input>
                </FormItem>
                </Card>
              </Col>
              <Col span="8" >
                <Card  style="width:560px;">
                   <p slot="title">用户满意度</p>
                       <Row >
                     <Col span="12" >
                             <FormItem label="网办业务满意度" prop="wbywmyd" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.wbywmyd"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
               <FormItem label="用户反馈满意度" prop="yhfkmyd" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.yhfkmyd"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                </Card>
              </Col>
              </Row>
              <Row>
                <Col span="8"  >
                <Card  style="width:560px;height:260px">
                   <p slot="title">其他</p>

                       <Row >
                     <Col span="12" >
                             <FormItem label="一站式服务基础信息维护" prop="yzsfwjcxxwh" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.yzsfwjcxxwh"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                              <FormItem label="交通安全宣传" prop="jtaqxc" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.jtaqxc"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                   <Row >

                         <Col span="12" >
                              <FormItem label="总分" prop="defen" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.defen"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                </Card>
              </Col>

            </Row>
            <Row style=" text-align:right;">
              <FormItem>
                <Button
                :disabled="isDisable"
                @click="handleSubmit()"
                type="primary"
              >提交
              </Button>
                <Button
                @click="handleReset('formValidate')"
                style="margin-left: 8px"
              >重置
              </Button>
              </FormItem>
            </Row>
        </Form>
        </div>
      </Modal>

     <Modal :footer-hide=true :loading=true :title="modalTable5.tableTitle" v-model="modalTable5.tableVisible"  width="860" >
        <div >
             <Form :inline="true" :label-width="90" :model="formValidate3"  ref="formValidate">
               <FormItem label="开始日期" prop="startdate" style="width:300px;"
                >
                  <DatePicker :clearable="false"
                              :value="formValidate3.startdate"
                              @on-change="formValidate3.startdate=$event"
                              format="yyyy-MM"
                              placeholder="请选择日期"
                              type="month">

                  </DatePicker>

                </FormItem>
                <FormItem label="地级市" prop="city" style="width:400px;">
               <Select placeholder="请选择地级市" v-model="formValidate3.city">
                    <Option  :value="item.k" v-for="item in allTypeList">{{item.v}}
                    </Option>
                  </Select>
                 </FormItem>
               <FormItem label="结束日期" prop="enddate" style="width:300px;"
                >
                  <DatePicker :clearable="false"
                              :value="formValidate3.enddate"
                              @on-change="formValidate3.enddate=$event"
                              format="yyyy-MM"
                              placeholder="请选择日期"
                              type="month">

                  </DatePicker>

                </FormItem>

               <FormItem label="选择指标" prop="zhibiao" style="width:400px;">
               <Select placeholder="请选择指标" v-model="formValidate3.zhibiao" multiple :max-tag-count="2">
                    <Option  :value="item.k" v-for="item in allzhibiaoList">{{item.v}}
                    </Option>
                  </Select>
                 </FormItem>

               <Button @click="getcitydata2()"  type="info">获取数据</Button>
        </Form>
<!--          <chart-line3 :keylist="line_list" :value="lineData"  ref="childLine3" style="width: 800px;height: 340px;" :text="text" />-->
          <chart-line5  :legend="legendlist" :keylist="line_list" :value="lineData5"  ref="childLine5" style="width: 830px;height: 420px;"  />
        </div>
      </Modal>
  </div>

</template>

<script>
  import {  ChartMap } from '_c/charts'
  import { ChartLine3,ChartLine5} from '_c/charts'
  import  echarts  from  'echarts'
  import { UploadUrl3} from '@/api/task'
  import { getbusinesslist,getcitydata,getcitydata2,businesspost} from '@/api/task'
export default {
    components: {
    ChartMap,
      ChartLine3,
      ChartLine5,
  },
  name: 'hello',
  data () {
    return {
      legendlist:[],//['补换领牌证','申领免检标志','电子监控处理','交通事故快处','预选机动车号牌'],
      text:'',
      lineData:[],
      lineData5:[],
      line_list:[],
      line_list5:[],
      temp_id:'',
      bjriqi:'',
      isDisable:false,
      modalMap2: {
        modalVisible: false,
        modalTitle: '新增'
      },
       UploadUrl3:'',
      start_date:'2020-12',
      data_list:'',
      key_list:'',
      velue_list:'',
       key_list2:[],
      velue_list2:[],
      business_list:[],
      modalTable4: {
        tableVisible: false,
        tableTitle: '编辑'
      },
      modalTable5: {
        tableVisible: false,
        tableTitle: ''
      },
      formValidate3:{
        'startdate':'',
        'enddate':'',
        'zhibiao':'',
        'city':''
      },
      formValidate: {
           'city': '',
          'bhlpz': '',
          'slmjbz': '',
          'dzjkcl': '',
          'jtsgkc': '',
          'yxjdchp': '',
          'mfsyjy': '',
          'pzywjscl': '',
          'yxhpzljsshl': '',
          'tfsqjschl': '',
          'mfsyjyjsshl': '',
          'yhxxjsshl': '',
          'wbywmyd': '',
          'yhfkmyd': '',
          'yzsfwjcxxwh':'',
          'jtaqxc': '',
          'defen': '',
            },
      allzhibiaoList:[
        {'k': "bhlpz", 'v': '补换领牌证'},
        {'k': "slmjbz", 'v': '申领免检标志'},
        {'k': "dzjkcl", 'v': '电子监控处理'},
        {'k': "jtsgkc", 'v': '交通事故快处'},
        {'k': "yxjdchp", 'v': '预选机动车号牌'},
        {'k': "mfsyjy", 'v': '满分审验教育'},
        {'k': "pzywjscl", 'v': '牌证业务及时受理率'},
        {'k': "yxhpzljsshl", 'v': '预选号牌资料及时审核率'},
        {'k': "tfsqjschl", 'v': '退费申请及时受理率'},
        {'k': "mfsyjyjsshl", 'v': '满分审验教育及时审核率'},
        {'k': "yhxxjsshl", 'v': '用户信息及时审核率'},
        {'k': "wbywmyd", 'v': '网办业务满意度'},
        {'k': "yhfkmyd", 'v': '用户反馈满意度'},
        {'k': "yzsfwjcxxwh", 'v': '一站式服务基础信息维护'},
        {'k': "jtaqxc", 'v': '交通安全宣传'},
      ],
       allTypeList: [
         {'k': "guangzhou", 'v': '广州市'},
          {'k': "shenzhen", 'v': '深圳市'},
          {'k': "shaoguan", 'v': '韶关市'},
         {'k': "foshan", 'v': '佛山市'},
         {'k': "zhongshan", 'v': '中山市'},
         {'k': "zhuhai", 'v': '珠海市'},
         {'k': "huizhou", 'v': '惠州市'},
         {'k': "shantou", 'v': '汕头市'},
         {'k': "jiangmen", 'v': '江门市'},
         {'k': "zhanjiang", 'v': '湛江市'},
         {'k': "maoming", 'v': '茂名市'},
         {'k': "zhaoqing", 'v': '肇庆市'},
         {'k': "meizhou", 'v': '梅州市'},
         {'k': "shanwei", 'v': '汕尾市'},
         {'k': "heyuan", 'v': '河源市'},
         {'k': "yangjiang", 'v': '阳江市'},
         {'k': "qingyuan", 'v': '清远市'},
         {'k': "dongguan", 'v': '东莞市'},
         {'k': "chaozhou", 'v': '潮州市'},
         {'k': "jieyang", 'v': '揭阳市'},
         {'k': "yunfu", 'v': '云浮市'},
        ],
      city:'',
    }
  },
  mounted(){
    this.drawLine();
    this.UploadUrl3 = UploadUrl3
    this.getbusinesslist("2020-12")
    // this.getcitydata2(this.formValidate3)
  },
  methods: {
       handleSubmit () {
          this.isDisable  = false

          setTimeout(() => {
            businesspost({"riqi":this.bjriqi,"city":this.city,"datalist":this.formValidate}).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)

                 this.modalTable4.tableVisible = false

              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })

           this.isDisable  = true
          }, 1000)
    },
        handleReset (name) {
      this.$refs[name].resetFields()
    },
      getcitydata(){
        getcitydata(this.bjriqi,this.city).then(res => {
             if (res.data.code === 0) {
               console.log( this.city)
               console.log( res.data.data[0][this.city])
               this.formValidate = eval('(' + res.data.data[0][this.city] + ')')
               this.temp_id = res.data.data['id']
             } else {
            }
           })

      },
    getcitydata2() {
      let temp_flag = 1
      if (JSON.stringify(this.formValidate3.startdate) == '""') {
        this.$Message.error("开始日期不能为空。")
        temp_flag = 0
      }
      if (JSON.stringify(this.formValidate3.enddate) == '""') {
        this.$Message.error("结束日期不能为空。")
        temp_flag = 0
      }
      if (JSON.stringify(this.formValidate3.city) == '""') {
        this.$Message.error("城市名字不能为空。")
        temp_flag = 0
      }
      if (JSON.stringify(this.formValidate3.zhibiao) == '""') {
        this.$Message.error("指标数据不能为空。")
        temp_flag = 0
      }
   　

      let start_date2 =  parseInt(JSON.stringify(this.formValidate3.startdate).replace("-","").substr(1,6))
      let end_date2 =  parseInt(JSON.stringify(this.formValidate3.enddate).replace("-","").substr(1,6))
      if(start_date2 > end_date2 ){
         this.$Message.error("开始日期不能大于结束日期。")
         temp_flag = 0
      }
      this.line_list = []
      this.lineData = []
      this.lineData5 = []
      this.legendlist = []
      if (temp_flag === 1) {

            getcitydata2(this.formValidate3).then(res => {
                if (res.data.code === 0) {

                     console.log(res.data.data)
                     console.log(res.data.months)

                     this.line_list = res.data.months
                     this.lineData5 = res.data.data
                     this.legendlist = res.data.legendlist

          } else {
                  this.line_list = []
                     this.lineData5 = []
                     this.legendlist = []
             this.$Message.error(`${res.data.msg}`)
          }
        })


      }
      },
      editModaltable4 () {
      this.formValidate = {}
      this.isDisable  = false
      this.modalTable4.tableVisible = true
      this.modalTable4.tableTitle = '编辑'
    },
    editModaltable5 () {
      this.modalTable5.tableVisible = true
      this.modalTable5.tableTitle = ''
    },
    getbusinesslist () {
           getbusinesslist(this.start_date).then(res => {
             this.map = ''
             if (res.data.code === 0) {
                this.business_list = res.data.data
               this.key_list = res.data.key,
                 this.velue_list =res.data.velue

               this.key_list2 = res.data.key,
                 this.velue_list2 =res.data.velue

             } else {
                    this.business_list = []
                this.key_list = []
                  this.velue_list = []
               this.key_list2 = []
                  this.velue_list2 = []
            }
           })
       },
    handleSuccess (res, file) {
          // console.log(file)
          this.modalMap2.modalVisible = false
          this.$Message.success("文件上传成功")

             },
    handleError (error) {
                console.log(error)
                this.modalMap2.modalVisible = false
                this.$Message.success("文件上传失败")
             },
      editModal2 () {
      this.modalMap2.modalVisible = true
      this.modalMap2.modalTitle = '上传文件'
    },
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
            title: { text: '互联网应用得分排行榜' },
            tooltip: {},
            xAxis: {},
            yAxis: {
               type: 'category',
               data:this.key_list,
            },
            series: [{
                name: '得分',
                type: 'bar',
                data: this.velue_list,
                label: {
                  show: true,
                  position: 'right',
                  valueAnimation: true
                }
            }]
        });
    }
  },
  watch: {
    velue_list: function () {
      this.drawLine()
    },
    velue_list2: function () {
      this.$refs.childLine.initLine()
    },
    lineData5: function () {
      this.$refs.childLine5.initLine()
    }
  },
}
</script>

<style lang="less">

</style>
