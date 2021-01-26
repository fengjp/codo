<template>
  <div>
         <Row>
         <div >
         <Col  style=" text-align:center;">
             <h1 >广东建设运行情况（总分100分）</h1>


         </Col>
           </div>
         </Row>
        <Row style=" text-align:right;">
         <div >
            <Col style="text-align: right; ">
           <DatePicker :clearable="false"
                              style="width:135px;margin-right:5px"
                              :value="start_date"
                              @on-change="start_date=$event"
                              format="yyyy-MM"
                              placeholder="请选择开始日期"
                              type="month">

                  </DatePicker>
           <DatePicker :clearable="false"
                              style="width:135px;margin-right:5px"
                              :value="end_date"
                              @on-change="end_date=$event"
                              format="yyyy-MM"
                              placeholder="请选择结束日期"

                              type="month">

                  </DatePicker>

             <Button @click="getdata()" style="margin-right:5px" type="primary">查询</Button>

             <Button @click="editModaltable3()" style="margin-right:5px" type="info">新增</Button>

           <Button type="success"  @click="editModal2" style="margin-right:5px">导入</Button>

           <Button @click="exportDateALL()" class="case-btn" type="warning">
              <Icon type="ios-download-outline"></Icon>
              导出数据
            </Button>
<!--           <Col  span="1"  >-->
<!--             <Button @click="editModaltable()" type="info">得分历史</Button>-->
<!--             </Col>-->
               </Col >
         </div>
         </Row>

    <Table
        border
        :columns="columns"
        :data="tableData"

        :span-method="handleSpan"
      ></Table>
<!--     <Row>-->
<!--           <Card style="height:60px;margin-top: 5px;">-->
<!--             <Col  span="8">-->
<!--                <h3 >上月得分：{{benyue_defen}}分</h3>-->
<!--             </Col>-->
<!--             <Col  span="8">-->
<!--                <h3 >本月得分：{{shangyue_defen}}分</h3>-->
<!--             </Col>-->
<!--             <Col  span="8"  style=" text-align:right;">-->
<!--                <Button @click="editModaltable3()" style="marginRight: 2px;" type="success">新增</Button>-->
<!--                <Button @click="editModaltable()" type="info">得分历史</Button>-->
<!--             </Col>-->
<!--           </Card>-->
<!--           </Row>-->
    <Modal :footer-hide=true :loading=true :title="modalTable.tableTitle" v-model="modalTable.tableVisible"  width="1020">
        <div >
               <chart-line3 :keylist="line_list" :value="lineData"  ref="childLine"   style="width: 1010px;height: 500px;" />
        </div>
      </Modal>
    <Modal :footer-hide=true :loading=true :title="modalTable2.tableTitle" v-model="modalTable2.tableVisible"  width="500">
        <div >
             <h3 style=" text-align:center;" v-if="isShow">{{temp_text}}</h3>
             <ul  v-for="(item,index) in temp_modaltable_date">
               <ol>
               <li>时间：{{item.gettime}}      请求时长：{{item.getlongtime}}</li>
               </ol>
              </ul>
        </div>
      </Modal>
     <Modal :footer-hide=true :loading=true :title="modalTable3.tableTitle" v-model="modalTable3.tableVisible"  width="1760" >
        <div >
             <Form :inline="true" :label-width="130" :model="formValidate"  ref="formValidate">
            <Row >
              <Col span="8" >
                <Card style="width:560px;">
                <p slot="title">系统建设运维保障</p>
                   <Row >
                     <Col span="12" >
                        <FormItem label="服务稳定性" prop="fuwu" style="width:230px;">
                          <Input
                           :maxlength="45"
                           placeholder="请输入得分"
                           v-model="formValidate.fuwu"
                          ></Input>
                        </FormItem>
                     </Col>
                     <Col span="12" >
                        <FormItem label="评分说明" prop="fuwu_remarks" style="width:260px;">
                          <Input
                           :maxlength="45"
                           placeholder="稳定性评分说明"
                           v-model="formValidate.fuwu_remarks"
                          ></Input>
                        </FormItem>
                     </Col>
                   </Row >
                  <Row >
                     <Col span="12" >
                <FormItem label="系统运行效率" prop="xitong" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.xitong"
                ></Input>
                </FormItem>
                        </Col>
                    <Col span="12" >
                <FormItem label="评分说明" prop="xitong_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="运行效率评分说明"
                  v-model="formValidate.xitong_remarks"
                ></Input>
                </FormItem>
                        </Col>
                   </Row >
                  <Row >
                     <Col span="12" >
                <FormItem label="软硬件设备配置" prop="peizhi" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.peizhi"
                ></Input>
                </FormItem>
                       </Col>
                    <Col span="12" >
                <FormItem label="评分说明" prop="peizhi_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="设备配置评分说明"
                  v-model="formValidate.peizhi_remarks"
                ></Input>
                </FormItem>
                       </Col>
                   </Row >
                  <Row >
                     <Col span="12" >
                  <FormItem label="系统及时升级" prop="shengji" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.shengji"
                ></Input>
                </FormItem>
                       </Col>
                    <Col span="12" >
                  <FormItem label="评分说明" prop="shengji_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="系统升级评分说明"
                  v-model="formValidate.shengji_remarks"
                ></Input>
                </FormItem>
                       </Col>
                   </Row >
               </Card>
              </Col>
              <Col span="8" >
                <Card  style="width:560px;height:315px">
                   <p slot="title">短信平台</p>
                  <Row >
                     <Col span="12" >
                <FormItem label="跨省短信发送支持" prop="zhichi" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.zhichi"
                ></Input>
                </FormItem>
                     </Col >
                    <Col span="12" >
                <FormItem label="评分说明" prop="zhichi_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="跨省短信评分说明"
                  v-model="formValidate.zhichi_remarks"
                ></Input>
                </FormItem>
                     </Col >
                     </Row >
                       <Row >
                     <Col span="12" >
                  <FormItem label="短信发送成功率" prop="duanxin" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.duanxin"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                  <FormItem label="评分说明" prop="duanxin_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="短信成功率评分说明"
                  v-model="formValidate.duanxin_remarks"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                </Card>
              </Col>
              <Col span="8" >
                <Card  style="width:560px;">
                   <p slot="title">网上支付平台</p>
                       <Row >
                     <Col span="12" >
                <FormItem label="支付渠道" prop="qudao" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.qudao"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                <FormItem label="评分说明" prop="qudao_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="支付渠道评分说明"
                  v-model="formValidate.qudao_remarks"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                       <Row >
                     <Col span="12" >
                  <FormItem label="支付项目" prop="xiangmu" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.xiangmu"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                <FormItem label="评分说明" prop="xiangmu_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="支付项目评分说明"
                  v-model="formValidate.xiangmu_remarks"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                       <Row >
                     <Col span="12" >
                   <FormItem label="退款支持" prop="tuikuan" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.tuikuan"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                <FormItem label="评分说明" prop="tuikuan_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="退款支持评分说明"
                  v-model="formValidate.tuikuan_remarks"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                       <Row >
                     <Col span="12" >
                  <FormItem label="运行情况" prop="yunxing" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.yunxing"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                <FormItem label="评分说明" prop="yunxing_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="运行情况评分说明"
                  v-model="formValidate.yunxing_remarks"
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
                   <p slot="title">数据交换</p>

                       <Row >
                     <Col span="12" >
                <FormItem label="内外网数据交换" prop="jiaohuan" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.jiaohuan"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                <FormItem label="评分说明" prop="jiaohuan_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="内外网交换评分说明"
                  v-model="formValidate.jiaohuan_remarks"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                       <Row >
                     <Col span="12" >
                  <FormItem label="省际数据交换" prop="shengji_jiaohuan" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.shengji_jiaohuan"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                <FormItem label="评分说明" prop="shengji_jiaohuan_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="省际数据交换评分说明"
                  v-model="formValidate.shengji_jiaohuan_remarks"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >
                       <Row >
                     <Col span="12" >
                  <FormItem label="异地业务请求" prop="yidi" style="width:230px;">
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.yidi"
                ></Input>
                </FormItem>
                        </Col >
                         <Col span="12" >
                <FormItem label="评分说明" prop="yidi_remarks" style="width:260px;">
                  <Input
                  :maxlength="45"
                  placeholder="异地业务请求评分说明"
                  v-model="formValidate.yidi_remarks"
                ></Input>
                </FormItem>
                        </Col >
                     </Row >

                </Card>
              </Col>
               <Col span="8" >
                <Card  style="width:560px; height:260px">
                   <p slot="title">人脸识别</p>

                <FormItem label="人脸识别通过率" prop="renlian" >
                  <Input
                  :maxlength="45"
                  placeholder="请输入得分"
                  v-model="formValidate.renlian"
                ></Input>
                </FormItem>
                   <FormItem label="评分说明" prop="renlian_remarks" >
                  <Input
                  :maxlength="45"
                  placeholder="人脸识别评分说明"
                  v-model="formValidate.renlian_remarks"
                ></Input>
                </FormItem>
                </Card>
              </Col>

                 <Col span="8" >
                <Card  style="width:560px;height:260px">
                   <p slot="title">统计</p>
                  <FormItem label="日期" prop="riqi" style="width:250px;margin-right:50px"
                >
                  <DatePicker :clearable="false"
                              :value="formValidate.riqi"
                              @on-change="formValidate.riqi=$event"
                              format="yyyy-MM"
                              placeholder="请选择日期"
                              type="month">

                  </DatePicker>

                </FormItem>
                <FormItem label="排名" prop="paiming" >
                  <Input
                  :maxlength="45"
                  placeholder="请输入排名次"
                  v-model="formValidate.paiming"
                ></Input>
                </FormItem>
                  <FormItem label="总分" prop="zongfen" >
                  <Input
                  :maxlength="45"
                  placeholder="请输入总分"
                  v-model="formValidate.zongfen"
                ></Input>
                </FormItem>
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
    <Modal
        v-model="modalMap2.modalVisible"
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
        v-model="modalMapShow.modalVisible"
        :title="modalMapShow.modalTitle"
        :loading=true
        :footer-hide=true
        width=1000
      >
       <div >
         <DatePicker :clearable="false"
                              style="width:150px;margin-right:5px"
                              :value="start_date"
                              @on-change="start_date=$event"
                              format="yyyy-MM"
                              placeholder="请选择开始日期"
                              type="month">

                  </DatePicker>
           <DatePicker :clearable="false"
                              style="width:150px;margin-right:5px"
                              :value="end_date"
                              @on-change="end_date=$event"
                              format="yyyy-MM"
                              placeholder="请选择结束日期"

                              type="month">

                  </DatePicker>

             <Button @click="linedata()" style="margin-right:5px" type="primary">查询</Button>
               <chart-line3 :keylist="line_list" :value="lineData"  ref="childLine"   style="width: 1010px;height: 500px;" />
        </div>
      </Modal>
  </div>
</template>

<script>
import { ChartLine3 } from '_c/charts'
import { meterList,meteradd ,rankinglist ,UploadUrl,getlinedata} from '@/api/task'
import FormGroup from '_c/form-group'
import excel from '@/libs/excel'

export default {
  components: {
    ChartLine3
  },
  data () {
    return {
       formValidate: {
        "fuwu": "",
         "fuwu_remarks": "",
        "xitong": "",
         "xitong_remarks": "",
        "peizhi": "",
          "peizhi_remarks": "",
        "shengji": "",
         "shengji_remarks": "",
         "zhichi":"",
         "zhichi_remarks":"",
         "duanxin":"",
         "duanxin_remarks":"",
         "qudao":"",
         "qudao_remarks":"",
         "xiangmu":"",
         "xiangmu_remarks":"",
         "tuikuan":"",
         "tuikuan_remarks":"",
         "yunxing":"",
          "yunxing_remarks":"",
         "jiaohuan":"",
         "jiaohuan_remarks":"",
         "shengji_jiaohuan":"",
         "shengji_jiaohuan_remarks":"",
         "yidi":"",
         "yidi_remarks":"",
         "renlian":"",
         "renlian_remarks":"",
         "riqi":"",
         "paiming":"",
         "zongfen":""
      },
      UploadUrl:'',
      start_date:'',
      end_date:'',
      isDisable:false,
      isShow: false,
      temp_text: '',
      temp_modaltable_date: '',
      benyue_defen: 0,
      shangyue_defen: 0,
      fuwu_defen: 0,
      duanxin_defen: 0,
      xitong_defen: 0,
      yidi_defen: 0,
      renlian_defen: 0,
      yunxing_defen: 0,
      nwwang_defen: 0,
      lineData: [],
      line_list: [],
      modalTable: {
        tableVisible: false,
        tableTitle: '历史得分线性图'
      },
      modalTable2: {
        tableVisible: false,
        tableTitle: '详细'
      },
      modalTable3: {
        tableVisible: false,
        tableTitle: '新增'
      },
       modalMap2: {
        modalVisible: false,
        modalTitle: '批量创建干系人'
      },
       modalMapShow: {
        modalVisible: false,
        modalTitle: '趋势图',
        user_key: ''
      },
      months_list:[],
      temp_date:[],
      columns: [],
      // columns: [
      //   { title: '', key: 'toname', align: 'center',width: 150, },
      //   { title: '指标名称', key: 'name', align: 'center',width: 150, },
      //   { title: '指标符号', key: 'Symbol', align: 'center',width: 100, },
      //   { title: '指标分值', key: 'branch', align: 'center', width: 100,},
      //   { title: '评分方法', key: 'method', align: 'center',width: 150,
      //   render: (h, params) => {
      //       let roleTitle = params.row.method
      //       return h('div', [
      //         h('span', {
      //           style: {
      //             display: 'inline-block',
      //             width: '100%',
      //             overflow: 'hidden',
      //             textOverflow: 'ellipsis',
      //             whiteSpace: 'nowrap'
      //           },
      //           domProps: {
      //             title: roleTitle
      //           }
      //         }, roleTitle)
      //       ])
      //     }
      //   },
      //   { title: '本月得分', key: 'num1', align: 'center',width: 100,},
      //  ],
      tableData: [
        {"toname":"系统建设运维保障","name":"服务稳定性","Symbol":"P1-1","branch":"10分","method":"对于互联网平台（网页版）连续服务故障3小时以上的，扣10分；对于互联网平台（网页版）连续服务故障1至3小时的，扣5分;对于“交管12123”APP连续服务故障2小时以上的，扣10分；对于“交管12123”APP连续服务故障1至2小时的，扣5分；对于互联网平台访问失败比率大于20%的，扣10分；对于互联网平台访问失败比率大于10%的，扣5分。因机房搬迁、运营商网络等原因造成服务中断且已上报部局备案的，不扣分。",
          },
        {"toname":"系统建设运维保障","name":"系统运行效率","Symbol":"P1-2","branch":"10分","method":"对于请求服务处理平均时间小于0.1秒的，得10分，请求服务处理平均时间每增加0.1秒，扣1分，直至0分为止。",
          },
        {"toname":"系统建设运维保障","name":"软硬件设备配置","Symbol":"P1-3","branch":"10分","method":"对于应用服务器、数据库服务器、网络设备、互联网网络专线等资源不足，未配置云防护，影响互联网平台正常运行的，扣3分；对于未能及时按照部局系统建设要求，配置软硬件设备,完成系统建设的，扣5分。",
          },
        {"toname":"系统建设运维保障","name":"系统及时升级","Symbol":"P1-4","branch":"5分","method":"对于未能按照部局发文要求及时升级软件的，扣5分；对未能及时升级软件补丁的，每次扣3分，直至0分为止。",
          },
        {"toname":"短信平台","name":"跨省短信发送支持","Symbol":"P1-5","branch":"5分","method":"对于互联网平台对接的电信、移动、联通三大运营商均支持跨省短信发送的，得5分；其余得0分。",
          },
        {"toname":"短信平台","name":"短信发送成功率","Symbol":"P1-6","branch":"5分","method":"对于短信发送成功率在90%以上的，得5分；对于短信发送成功率每减少10%的，扣1分，直至0分为止。",
          },
        {"toname":"网上支付平台","name":"支付渠道","Symbol":"P1-7","branch":"5分","method":"对于支持银联、支付宝和微信中两个支付渠道的，得5分；对于支持支付宝、微信中任一支付渠道的，得3分；对于支持银联支付渠道的，得2分；不支持银联、支付宝、微信，但支持其他网上支付渠道的，得1分；其余得0分。",
          },
        {"toname":"网上支付平台","name":"支付项目","Symbol":"P1-8","branch":"5分","method":"对于支持驾驶人考试费支付项目的，得2分；对于支持机动车、驾驶证牌证工本费支付项目的，得2分；对于支持邮寄费支付项目的，得1分。",
          },
        {"toname":"网上支付平台","name":"退款支持","Symbol":"P1-9","branch":"10分","method":"对于支持交通违法罚款退款的，得5分；对于支持机动车、驾驶证牌证工本费退款的，得3分；对于支持考试费退款的，得2分。",
          },
        {"toname":"网上支付平台","name":"运行情况","Symbol":"P1-10","branch":"10分","method":"监测互联网平台请求网上支付平台的响应成功率，对于请求响应成功率达90%以上的，得3分；监测用户网上支付成功交易的平均操作时长，对于用户平均操作时长小于2分钟的，得5分；监测用户网上支付成功比率，对于成功比率大于90%的，得2分。",
          },
        {"toname":"数据交换","name":"内外网数据交换","Symbol":"P1-11","branch":"10分","method":"计算互联网测试数据包交换到公安网，公安网生成反馈数据再交换到互联网的总时长。对于平均总时长在5分钟以内的，得10分；对于平均总时长每增加1分钟的，扣2分，直至0分为止。对于交通违法证据图片未交换至互联网，用户无法查看的，扣5分。",
          },
        {"toname":"数据交换","name":"省际数据交换","Symbol":"P1-12","branch":"5分","method":"对于部级互联网平台与地方互联网平台通讯异常的总时长小于30分钟的，得5分；对于通讯异常每增加1至10分钟的，扣1分，直至0分为止。",
          },
        {"name":"异地业务请求","Symbol":"P1-13","branch":"5分","method":"对于因网络阻断、系统异常导致异地业务请求无法正常返回的失败率低于0.2%的，得5分；对于失败率每增加0.2%，扣1分，直至0分为止。",
          },
        {"toname":"人脸识别","name":"人脸识别通过率","Symbol":"P1-14","branch":"5分","method":"对于人脸识别比对通过率在85%以上的，得5分；对于人脸识别比对通过率每减少5%的，扣1分，直至0分为止。",
          },
        {"toname":"","name":"合计总分","Symbol":"","branch":"100","method":""},
        ],
      temp_name:"",
    }
  },
  methods: {
    linedata(){
          console.log("33333333333333")
       console.log(this.temp_name)
       console.log("33333333333333")
      setTimeout(() => {
         this.getlinedata(this.temp_name ,this.start_date,this.end_date)
        }, 500)
    },
    getlinedata(name,start_date,end_date){
          getlinedata(name,start_date,end_date).then(res => {
             if (res.data.code === 0) {
                  this.lineData = res.data.data
                  this.line_list = res.data.list
             }
             else{
                   console.log("32222222222222222")
                   this.lineData = []
                   this.line_list = []
             }

          })
    },

    // 查看Key详细信息
    handleDetail (params) {
      setTimeout(() => {
        this.modalMapShow.modalVisible = true
        this.modalMapShow.modalTitle = params.row.name
        this.temp_name = params.row.name
        this.getlinedata(params.row.name,this.start_date,this.end_date)
      }, 500)
    },
     handleSuccess (res, file) {
          // console.log(file)
          this.modalMap2.modalVisible = false
          this.$Message.success("文件上传成功")
          this.rankinglist(this.start_date,this.end_date)
             },
    handleError (error) {
                // console.log(error)
                this.modalMap2.modalVisible = false
                this.$Message.success("文件上传失败")
             },
     editModal2 () {
      this.modalMap2.modalVisible = true
      this.modalMap2.modalTitle = '上传文件'
    },
     // 导出数据、支持分页、过滤、搜索、排序后导出
     //  exportDateALL() {
     //    // 查询所有数据
     //    getPlanList(this.pageNum, this.pageSize, this.tokey, this.tovalue, true).then(res => {
     //      if (res.data.code === 0) {
     //        this.tableDataALL = res.data.data
     //        this.exportData()
     //      } else {
     //        this.$Message.error(`${res.data.msg}`)
     //      }
     //    })
     //
     //  },
      exportDateALL() {
        var temp_title = []
        var temp_key   = []
        for (let i = 0, len = this.columns.length; i < len; i++) {
            temp_title.push(this.columns[i]["title"])
            temp_key.push(this.columns[i]["key"])
          }
        if (this.tableData.length) {
          // this.exportLoading = true
          const params = {
            title: temp_title,// ['计划工作', '类型', '状态', '项目', '优先级', '来源', '需求人', '处理人', '描述', '开始时间', '结束时间'],
            key: temp_key, //['plan_name', 'plan_type', 'plan_status', 'plan_obj', 'plan_priority', 'plan_source', 'demander', 'plan_executor', 'plan_details', 'plan_stime', 'plan_etime'],
            data: this.tableData, //this.tableDataALL,
            autoWidth: true,
            filename: String(this.start_date) + '-' + String(this.end_date) + '广东建设运行情况'
          }
          excel.export_array_to_excel(params)
          // this.exportLoading = false
        } else {
          this.$Message.info('表格数据不能为空！')
        }
      },
    getdata(){
      let temp_start_date = this.start_date.replace('-','')
      let temp_end_date = this.end_date.replace('-','')

      if(parseInt(temp_start_date)  > parseInt(temp_end_date)){
                   this.$Message.error("开始日期"+String(this.start_date)+"不能大于结束日期"+String(this.end_date))
      }
      else{
        this.rankinglist(this.start_date,this.end_date)
      }
    },
     handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleSpan ({ row, column, rowIndex, columnIndex }) {
                 if (rowIndex === 0 && columnIndex === 0) {
                    return {
                        rowspan: 4,
                        colspan: 1
                    };
                } else if (rowIndex === 1 && columnIndex === 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }else if (rowIndex === 2 && columnIndex === 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                } else if (rowIndex === 3 && columnIndex === 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
                  if (rowIndex === 4 && columnIndex === 0) {
                    return {
                        rowspan: 2,
                        colspan: 1
                    };
                } else if (rowIndex === 5 && columnIndex === 0) {
                    return {
                        rowspan: 2,
                        colspan: 0
                    };
                }
                  if (rowIndex === 6 && columnIndex === 0) {
                    return {
                        rowspan: 4,
                        colspan: 1
                    };
                } else if (rowIndex === 7 && columnIndex === 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }else if (rowIndex === 8 && columnIndex === 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                } else if (rowIndex === 9 && columnIndex === 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
                   if (rowIndex === 10 && columnIndex === 0) {
                    return {
                        rowspan: 3,
                        colspan: 1
                    };
                } else if (rowIndex === 11 && columnIndex === 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                } else if (rowIndex === 12 && columnIndex === 0) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            },
     handleSubmit () {
          this.isDisable  = false
          setTimeout(() => {
            meteradd(this.formValidate).then(res => {
              if (res.data.code === 0) {
                this.$Message.success(`${res.data.msg}`)
                 this.modalTable3.tableVisible = false
                 this.rankinglist(this.start_date,this.end_date)
              } else {
                this.$Message.error(`${res.data.msg}`)
              }
            })

           this.isDisable  = true
          }, 1000)
    },
    editModaltable () {
      this.modalTable.tableVisible = true
      this.modalTable.tableTitle = '历史得分线性图'
    },
    editModaltable3 () {
      this.modalTable3.tableVisible = true
      this.modalTable3.tableTitle = '新增'
    },
    meterList () {
      meterList().then(res => {
        if (res.data.code === 0) {
          this.line_list = res.data.list[0]
          this.benyue_defen = res.data.list[1][10]
          this.shangyue_defen = res.data.list[1][11]
          this.lineData = res.data.list[1]

          this.temp_date = res.data.data
          this.fuwu_defen = res.data.data[0]['fuwu_defen']
          this.duanxin_defen = res.data.data[0]['duanxin_defen']
          this.xitong_defen = res.data.data[0]['xitong_defen']
          this.yidi_defen = res.data.data[0]['yidi_defen']
          this.renlian_defen = res.data.data[0]['renlian_defen']
          this.yunxing_defen = res.data.data[0]['yunxing_defen']
          this.nwwang_defen = res.data.data[0]['nwwang_defen']
        } else {
          this.lineData = []
          this.line_list = []
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },
        rankinglist (star_date,end_date) {
      rankinglist(star_date,end_date).then(res => {
        if (res.data.code === 0) {
          this.months_list = res.data.list
          this.temp_date = res.data.data

          this.columns =  [
                      { title: '', key: 'toname', align: 'center',width: 150, },
                      { title: '指标名称', key: 'name', align: 'center',width: 150,
                        render: (h, params) => {

                             return h('a', {
                               on: {
                                   click: () => {
                                       this.handleDetail(params)
                                      }
                             }
                          }, params.row.name)
                        }
                      },
                       { title: '指标符号', key: 'Symbol', align: 'center',width: 100, },
                      { title: '指标分值', key: 'branch', align: 'center', width: 100,},
                       { title: '评分方法', key: 'method', align: 'center',width: 150,
                       render: (h, params) => {
                                let roleTitle = params.row.method
                                return h('div', [
                                     h('span', {
                                       style: {
                                       display: 'inline-block',
                                       width: '100%',
                                       overflow: 'hidden',
                                       textOverflow: 'ellipsis',
                                       whiteSpace: 'nowrap'
                                       },
                                       domProps: {
                                       title: roleTitle
                                       }
                                     }, roleTitle)
                                   ])
                                }}
                      ]
          for(let h in this.months_list ){
              let  temp_str6 = 'num'  +  String(h)
              this.columns.push({ title: this.months_list[h] , key: temp_str6, align: 'center',width: 120,
                         render: (h, params) => {
                                let roleTitle = params.row[temp_str6]
                                return h('div', [
                                     h('span', {
                                       style: {
                                       display: 'inline-block',
                                       width: '100%',
                                       overflow: 'hidden',
                                       textOverflow: 'ellipsis',
                                       whiteSpace: 'nowrap'
                                       },
                                       domProps: {
                                       title: roleTitle
                                       }
                                     }, roleTitle)
                                   ])
                                }
              })
          }

          // console.log(this.temp_date)
          //  console.log(this.columns)
          this.tableData =  eval(this.temp_date)
        } else {
            this.months_list = []
          this.temp_date = []
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

      date.month = date.month < 10 ? ('0' + date.month) : date.month
      date.date = date.date < 10 ? ('0' + date.date) : date.date

      this.todate = date.year + '-' + date.month + '-' + date.date
    }

  },
  watch: {

    lineData: function () {
      this.$refs.childLine.initLine()
    }
  },
  mounted () {
    this.UploadUrl = UploadUrl
    this.rankinglist(this.start_date,this.end_date)
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
    /*background:url(meter.jpeg);*/
    width:100%;
    height:100%;  /**宽高100%是为了图片铺满屏幕 */
    z-index:-1;
    /*position: absolute;*/

}
</style>
