<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="230" :collapsed-width="64" breakpoint="xl" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <img v-show="!collapsed" style="width:200px; height:48px; border-radius:5px 5px 5px 0; margin-left: 20px;" :src="maxLogo" key="max-logo" />
          <!--<img v-show="collapsed" style="width:40px; height:40px; margin-left: 12px; margin-top: 5px;" :src="minLogo" key="min-logo" />-->
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <user :user-avator="userAvator" :nick-name="nickName"/>
          <language v-if="$config.useI18n" @on-lang-change="setLocal" style="margin-right: 10px;" :lang="local"/>
          <!-- <error-store v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader" :has-read="hasReadErrorPage" :count="errorCount"></error-store> -->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <!-- <div class="tag-nav-wrapper">
            <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
          </div> -->
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
          </Content>
        </Layout>
      </Content>
      <copyRight></copyRight>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
// import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import minLogo from '@/assets/images/logo-min.jpg'
// import maxLogo from '@/assets/images/logo.png'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'
import copyRight from './components/footer/copyright'
import {authorization} from '@/api/user'
import {getDictConfList} from '@/api/app'
export default {
  name: 'Main',
  inject: ["reload"],
  components: {
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    // ErrorStore,
    User,
    copyRight
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo,
      isFullscreen: false
    }
  },
  computed: {
    ...mapGetters([
      'errorCount'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return this.$store.state.user.avatorImgPath
    },
    nickName () {
      return this.$store.state.user.nickName
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      //修改‘首页’的默认路由路径
    if(this.$store.state.app.breadCrumbList[0]){
    this.$store.state.app.breadCrumbList[0].name =  localStorage.temphome_name
    this.$store.state.app.breadCrumbList[0].path = localStorage.temphome_path
    this.$store.state.app.breadCrumbList[0].to = localStorage.temphome_path
    }
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    // hasReadErrorPage () {
    //   return this.$store.state.app.hasReadErrorPage
    // }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin',
       // 'handleGetResourceList'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = String(route)
      else {
        name = String(route.name)
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type === 'all') {
        this.turnToPage('home')
      } else if (routeEqual(this.$route, route)) {
        if (type === 'others') {
        } else {
          const nextRoute = getNextRoute(this.tagNavList, route)
          this.$router.push(nextRoute)
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    // handleGetResource() {
    //   this.handleGetResourceList().then(res => {
    //     if (res.code != 0) {
    //        this.$Message.error(`${res.msg}`)
    //     }
    //   })
    // },
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    // this.handleGetResource()
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.app.homeRoute
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    //部门列表
          getDictConfList().then(res => {
             if (res.data.code === 0) {
                        localStorage.departmentlist = res.data.data['statistics_department_list']
                        localStorage.sqldepartmentlist = res.data.data['sql_statistics_department_list']
                        localStorage.spoonsqldepartmentlist = res.data.data['spoon_statistics_department_list']
                        // console.log(localStorage)
                        if(localStorage.departmentlist === "undefined"){

                               localStorage.departmentlist = '[]'
                        }
                        if(localStorage.sqldepartmentlist === "undefined"){

                          localStorage.sqldepartmentlist = '[]'
                        }
                        if(localStorage.spoonsqldepartmentlist === "undefined"){

                          localStorage.spoonsqldepartmentlist = '[]'
                        }
                 }})
    //修改‘首页’的默认路由路径
    // if(this.$store.state.app.breadCrumbList[0]){
    // this.$store.state.app.breadCrumbList[0].name =  localStorage.temphome_name
    // this.$store.state.app.breadCrumbList[0].path = localStorage.temphome_path
    // this.$store.state.app.breadCrumbList[0].to = localStorage.temphome_path
    // }

  }
}
</script>
