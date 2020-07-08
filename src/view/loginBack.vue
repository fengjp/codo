<template>
  <p>111111</p>
</template>

<script>
  export default {
    data() {
      this.$router.replace({
        name: this.$config.homeName
      });
      // this.$router.go(0);
      return {}
    },
    methods: {}
  }
</script>

<style>
</style>
