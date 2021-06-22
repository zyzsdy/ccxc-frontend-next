<template>
  <BottomBar></BottomBar>
  <Modal></Modal>
  <MessageToasts></MessageToasts>
  <div class="app-main-view">
    <router-view></router-view>
  </div>
  <BottomFooter></BottomFooter>
</template>

<script setup>
import gConst from './globalconst'
import Modal from './components/Modal.vue'
import MessageToasts from './components/MessageToasts.vue'
import BottomFooter from './components/BottomFooter.vue'
import BottomBar from './components/BottomBar.vue'

console.log("CCXC Engine v1.1 created by Ted Zyzsdy, supported by MeowSound Idols.");
gConst.status.isLogin = localStorage.getItem("token") == null;
gConst.status.username = localStorage.getItem("username") || "[][NULL]";
gConst.status.skipPrologue = localStorage.getItem("skipPrologue") == "on";

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
.app-main-view{
  min-height: 120vh;
}
</style>
