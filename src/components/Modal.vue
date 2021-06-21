<template>
  <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h4 class="modal-title" id="myModalLabel">{{title}}</h4>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  {{msg}}
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-bs-dismiss="modal">关闭</button>
              </div>
          </div>
      </div>
  </div>
</template>

<style lang="scss">
.modal{
  color: black;
}
</style>

<script setup>
import { ref } from 'vue'
import { Modal } from 'bootstrap'
import gConst from '../globalconst'
import { useRouter } from 'vue-router'

const router = useRouter();

const title = ref("消息");
const msg = ref("");

function showModal() {
  let modal = new Modal(document.getElementById("myModal"));
  modal.show();
}

gConst.globalBus.on("show-error", (message) => {
  msg.value = message;
  title.value = "错误";
  showModal();
});

gConst.globalBus.on("redirect-location", (data) => {
  msg.value = data.message;
  title.value = "消息";

  router.push(data.location);
  showModal();
});

gConst.globalBus.on("log-out", (data) => {
  msg.value = data.message;
  msg.title = "您的登录已经注销";

  localStorage.removeItem("uid");
  localStorage.removeItem("username");
  localStorage.removeItem("roleid");
  localStorage.removeItem("token");
  localStorage.removeItem("sk");
  localStorage.removeItem("etc");

  gConst.status.isLogin = false;
  router.push("/");
  showModal();
});
</script>