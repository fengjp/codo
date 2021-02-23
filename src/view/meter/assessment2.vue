<template>
  <div>
         <Row>
         <div >
         <Col  style=" text-align:center;">
             <h1 >广东省互联网平台建设情况自评（总分100分）</h1>
         </Col>
         </div>
         </Row>
         <Row>
           <Card style="height:60px;margin-top: 5px;">
             <Col  span="8">
                <h3 >上月得分：{{benyue_defen}}分</h3>
             </Col>
             <Col  span="8">
                <h3 >本月自评得分：{{shangyue_defen}}分</h3>
             </Col>
<!--             <Col  span="8"  style=" text-align:right;">-->
<!--                <Button @click="editModaltable()" type="info">得分历史</Button>-->
<!--             </Col>-->
           </Card>
           </Row>
         <Row>
        <Col span="5" >
          <Card  style="height:255px;">
         <strong>系统建设运维保障:</strong>
        <br><br>
        <List >
            <ListItem><Button @click="handleSubmitTable('fuwu_remarks')"  ghost  type="primary">服务稳定性</Button>：{{fuwu_defen}}分</ListItem>
            <ListItem><Button @click="handleSubmitTable('xitong_remarks')"  ghost type="success">系统运行效率</Button>：{{xitong_defen}}分</ListItem>
            <ListItem>软硬件设备配置：10分</ListItem>
            <ListItem>系统及时升级：5分</ListItem>
        </List>
            </Card>
        </Col>
      <Col span="5" >
        <Card  style="height:255px;">
    <strong>短信平台:</strong>
        <br><br>
        <List  >
            <ListItem>跨省短信发送支持：5分</ListItem>
            <ListItem><Button @click="handleSubmitTable('duanxin_remarks')"  ghost type="success">短信发送成功率</Button>：{{duanxin_defen}}分</ListItem>
        </List>
          </Card>
        </Col>
      <Col span="5" >
        <Card  style="height:255px;">
    <strong>网上支付平台:</strong>
        <br><br>
        <List >
            <ListItem>支付渠道：5分</ListItem>
            <ListItem>支付项目：4分</ListItem>
            <ListItem>退款支持：10分</ListItem>
            <ListItem><Button @click="handleSubmitTable('yunxing_remarks')"  ghost type="success">运行情况</Button>：{{yunxing_defen}}分</ListItem>
        </List>
        </Card>
        </Col>
       <Col span="5" >
         <Card  style="height:255px;">
    <strong>数据交换:</strong>
        <br><br>
        <List >
            <ListItem><Button @click="handleSubmitTable('nwwang_remarks')"  ghost type="info">内外网数据交换</Button>：{{nwwang_defen}}分</ListItem>
            <ListItem>省际数据交换：5分</ListItem>
            <ListItem><Button @click="handleSubmitTable('yidi_remarks')"  ghost type="info">异地业务请求</Button>：{{yidi_defen}}分</ListItem>
        </List>
           </Card>
        </Col>
       <Col span="4" >
         <Card  style="height:255px;">
    <strong>人脸识别:</strong>
        <br><br>
        <List >
            <ListItem><Button @click="handleSubmitTable('renlian_remarks')"  ghost type="info">人脸识别通过率</Button>：{{renlian_defen}}分</ListItem>
        </List>
         </Card>
        </Col>
    </Row>
    <Row>
      <Col  span="10" >
        <Card>
        <div style="height: 410px;">
             <h5 style=" text-align:left;" >指标异常详细:</h5>
             <h1 style=" text-align:center;" >{{temp_title}}</h1>
             <h3 style=" text-align:center;" v-if="isShow">{{temp_text}}</h3>
             <ul  v-for="(item,index) in temp_modaltable_date">
               <ol>
               <li>时间：{{item.gettime}}      请求时长：{{item.getlongtime}}</li>
               </ol>
              </ul>
        </div>
          </Card>
      </Col>
      <Col span="14" >
        <Card>
        <div >
               <chart-line3 :keylist="line_list" :value="lineData"  ref="childLine"   style="width: 1010px;height: 410px;" :text="text" />
        </div>
          </Card>
      </Col>
    </Row>
<!--    <Modal :footer-hide=true :loading=true :title="modalTable.tableTitle" v-model="modalTable.tableVisible"  width="1020">-->
<!--        <div >-->
<!--               <chart-line3 :keylist="line_list" :value="lineData"  ref="childLine"   style="width: 1010px;height: 500px;" text="总得分线性图"/>-->
<!--        </div>-->
<!--      </Modal>-->
<!--    <Modal :footer-hide=true :loading=true :title="modalTable2.tableTitle" v-model="modalTable2.tableVisible"  width="500">-->
<!--        <div >-->
<!--             <h3 style=" text-align:center;" v-if="isShow">{{temp_text}}</h3>-->
<!--             <ul  v-for="(item,index) in temp_modaltable_date">-->
<!--               <ol>-->
<!--               <li>时间：{{item.gettime}}      请求时长：{{item.getlongtime}}</li>-->
<!--               </ol>-->
<!--              </ul>-->
<!--        </div>-->
<!--      </Modal>-->
  </div>
</template>

<script>
import { ChartLine3 } from '_c/charts'
import { meterList } from '@/api/task'
import FormGroup from '_c/form-group'
export default {
  components: {
    ChartLine3
  },
  data () {
    return {
      text:'总得分线性图',
      temp_title:'',
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
      lineData: [],//[55, 98, 39, 98, 86, 82, 90, 90, 80, 96, 93, 90],
      line_list: [],//['2021-02', '2021-03', '2020-04', '2020-05', '2020-06', '2020-07', '2020-08', '2020-09', '2020-10', '2020-11', '2020-12', '2021-01'],
      modalTable: {
        tableVisible: false,
        tableTitle: '历史得分线性图'
      },
      modalTable2: {
        tableVisible: false,
        tableTitle: '详细'
      }
    }
  },
  methods: {
    handleSubmitTable (date) {
      this.isShow = false
      this.modalTable2.tableVisible = true
      this.modalTable2.tableTitle = '详细'
      if(date === 'fuwu_remarks'){
        this.temp_title = '服务稳定性'
      }
      if(date === 'xitong_remarks'){
        this.temp_title = '系统运行效率'
      }
      if(date === 'duanxin_remarks'){
        this.temp_title = '短信发送成功率'
      }
      if(date === 'yunxing_remarks'){
        this.temp_title = '运行情况'
      }
      if(date === 'nwwang_remarks'){
        this.temp_title = '内外网数据交换'
      }
      if(date === 'yidi_remarks'){
        this.temp_title = '异地业务请求'
      }
      if(date === 'renlian_remarks'){
        this.temp_title = '人脸识别通过率'
      }
      this.temp_modaltable_date = eval(this.temp_date[0][date])
      if (JSON.stringify(this.temp_modaltable_date) === '[]') {
        this.temp_text = '无异常数据'
        this.isShow = true
      }
    },
    editModaltable () {
      this.modalTable.tableVisible = true
      this.modalTable.tableTitle = '历史得分线性图'
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
    this.meterList()
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
