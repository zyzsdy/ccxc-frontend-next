<template>
  <Modal></Modal>
  <router-view></router-view>
</template>

<script setup>
import gConst from './globalconst'
import Modal from './components/Modal.vue'

console.log("CCXC Engine v1.1 created by Ted Zyzsdy, supported by MeowSound Idols.");
gConst.status.isLogin = localStorage.getItem("token") == null;

</script>

<style lang="scss">
@import "../node_modules/bootstrap/dist/css/bootstrap.css";

body{
  margin: 0;
  background-color: #1e1e1e;
  color: #FFFFFF;
}
.center{
    text-align: center;
}
.header-line{
    margin-top: 60px;
    margin-bottom: 150px;
}
</style>
