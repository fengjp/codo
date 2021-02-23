<template>
<!--  <div>-->
<!--<iframe src="http://baidu.com"  width="100%" height="800" frameborder="0"></iframe>-->
<!--  </div>-->
  <div>
    <a  :href =temp_url target="_blank" >grafana仪表跳转</a>
<!--<iframe   :src="temp_url" width="100%"  height="800" frameborder="0"></iframe>-->
  </div>
</template>
<script>
import { grafana_Bearer } from '@/api/grafana_temp'

export default {
  components: {
  },
  data () {
    return {
      temp_url: 'http://192.168.79.100:3000/'
    }
  },
  methods: {
  },
  watch: {

  },
  mounted() {
    window.open(this.temp_url);
  }

}
</script>

<style >

</style>
