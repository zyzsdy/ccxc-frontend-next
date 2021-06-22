<template>
    <div class="container-md center">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 11</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-html="prologueHtml"></div>
            </div>
        </div>
        <div class="row header-line">
            <div class="col">
                <button class="btn btn-primary" @click="goNext">去警察局 →</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from '@vue/runtime-core'
import isLogin from '../utils/IsLogin'
import { useRouter } from "vue-router";
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/FetchPost"
import gConst from "../globalconst"
import marked from 'marked'

const router = useRouter();

const prologueHtml = ref("");

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }

    //当localStorage("skipPrologue")值为on时跳过Prologue
    if (localStorage.getItem("prologue") === "o" && localStorage.getItem("skipPrologue") === "on") {
        router.push('/corridor');
        return;
    }
    
    await reloadPrologueHtml(); 
});

async function reloadPrologueHtml() {
    let api = gConst.apiRoot + "/play/get-prologue";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if (data['status'] == 1) {
        prologueHtml.value = marked(data.message);
        localStorage.setItem("prologue", "o");
    } else {
        defaultApiErrorAction(data);
    }
}

function goNext(){
    if (localStorage.getItem("prologue") === "o"){
        router.push('/corridor');
    } else {
        gConst.globalBus.emit("redirect-location", {
            message: "游戏存档状态不正确，请尝试重新登录。",
            location: "/"
        });
    }
}
</script>
