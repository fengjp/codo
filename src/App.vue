<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true,
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive = true
        });
      },
      mounted() {
        function checkIE() {
          return (
            "-ms-scroll-limit" in document.documentElement.style &&
            "-ms-ime-align" in document.documentElement.style
          );
        }

        if (checkIE()) {
          window.addEventListener(
            "hashchange",
            () => {
              var currentPath = window.location.hash.slice(1);
              if (this.$route.path !== currentPath) {
                this.$router.push(currentPath);
              }
            },
            false
          );
        }
      }
    },
  }
</script>

<style lang="less">
  .size {
    width: 100%;
    height: 100%;
  }

  html, body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #app {
    .size;
  }
</style>
