<template>
    <div class="container-md center">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 11</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div id="pHtmlContainer" v-html="prologueHtml"></div>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { nextTick, onMounted } from '@vue/runtime-core'
import isLogin from '../utils/IsLogin'
import { useRouter } from "vue-router";
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/FetchPost"
import gConst from "../globalconst"
import marked from "marked"

const router = useRouter();

const prologueHtml = ref("");

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }
    
    await reloadCorridorHtml(); 

    window["jumptoCommissionerOffice"] = () => {
        router.push("/commissioner-office");
    }
    window["jumptoAnalysisRoom"] = () => {
        router.push("/analysis-room");
    }
});

async function reloadCorridorHtml() {
    let api = gConst.apiRoot + "/play/get-corridor";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if (data['status'] == 1) {
        let html = marked(data.message);
        prologueHtml.value = html.replace(/<script.*?>([\s\S]+?)<\/script>/, (_, js) => {
            nextTick(() => {
                var htmlContainer = document.getElementById("pHtmlContainer");
                var ele = document.createElement("script");
                ele.innerHTML = js;
                htmlContainer.appendChild(ele);
            });
            return "";
        });
    } else {
        defaultApiErrorAction(data);
    }
}
</script>