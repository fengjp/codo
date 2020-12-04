<template>
  <div>
       <h1>欢迎使用.</h1>
  </div>
</template>

<script>
  import store from '@/store'
  import {getToken, setTitle, setToken} from '@/libs/util'
  export default {
    name: 'tips',
    components: {
    },
    data() {
      return {
        tempData: [],
      }
    },
    methods: {
      reAuthorization() {
        store.dispatch('authorization').then(rules => {
          store.dispatch('concatRoutes', rules).then(routers => {
             // router.addRoutes(routers) //加载子路由
          }).catch((err) => {
            console.log(err)
            setToken('')
            // next({name: 'login'})
            this.$router.push({name:'login'})
          })

        }).catch((err1) => {
          console.log(err1)
          setToken('')
          // next({name: 'login'})
          this.$router.push({name:'login'})
        })
      },
    },
    mounted() {
      // this.reAuthorization() // 刷新前端权限
      localStorage.temphome_name = 'tips'
      localStorage.temphome_path = '/tips'
    },
    watch: {
    }
  }
</script>

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
