<template>
<!--  <div>-->
<!--<iframe src="http://baidu.com"  width="100%" height="800" frameborder="0"></iframe>-->
<!--  </div>-->
  <div>
    <a  :href ="temp_url" target="_blank">grafana仪表跳转</a>
<!--<iframe   :src="temp_url" width="100%"  height="800" frameborder="0"></iframe>-->
  </div>
</template>
<script>
import { grafana_Bearer, } from '@/api/grafana_temp'

export default {
  components: {
  },
  data () {
    return {
       temp_url:'http://localhost:3000/d/_pdRIMLGz/ping-dashboard?from=1611345251000&to=1611345273000&orgId=1'
    }
  },
  methods: {
    // 获取用户列表
      grafana_Bearer() {
        grafana_Bearer().then(res => {
           console.log("2222222222222222")
           console.log(res)
           console.log("22222222222222222")
          // if (res.data.code === 0) {
          //   this.$Message.success(`${res.data.msg}`)
          // } else {
          //   this.$Message.error(`${res.data.msg}`)
          // }
        })
      },
  },
  watch: {

  },
  mounted () {
    // this.grafana_Bearer()
  }

}
</script>

<style >

</style>
