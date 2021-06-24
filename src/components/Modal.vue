<template>
  <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content text-light bg-dark" >
              <div class="modal-header" :class="[ bgType ]">
                  <h4 class="modal-title" id="myModalLabel">{{title}}</h4>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                  {{msg}}
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
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
const bgType = ref("bg-dark");

function showModal() {
  let modal = new Modal(document.getElementById("myModal"));
  modal.show();
}

gConst.globalBus.on("show-message", (data) => {
  msg.value = data.message;
  title.value = data.title || "消息";
  let dataType = data.type || "dark";
  bgType.value = `bg-${dataType}`;

  showModal();
});

gConst.globalBus.on("show-error", (message) => {
  msg.value = message;
  title.value = "错误";
  bgType.value = "bg-danger";

  showModal();
});

gConst.globalBus.on("redirect-location", (data) => {
  msg.value = data.message;
  title.value = "消息";
  bgType.value = "bg-info";

  router.push(data.location);
  showModal();
});

gConst.globalBus.on("log-out", (data) => {
  msg.value = data.message;
  msg.title = "您的登录已经注销";
  bgType.value = "bg-info";

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