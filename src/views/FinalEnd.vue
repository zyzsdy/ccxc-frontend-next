<template>
    <div class="container-md">
        <div class="row header-line center">
            <div class="col">
                <div>CCBC 11</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div id="pHtmlContainer" v-html="prologueHtml"></div>
            </div>
        </div>
        <div class="row header-line center">
            <div class="col">
                <a class="btn btn-primary" href="https://ccbc11.cipherpuzzles.com">返回CCBC 11主页</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from '@vue/runtime-core'
import isLogin from '../utils/IsLogin'
import { useRouter } from "vue-router";
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/FetchPost"
import gConst from "../globalconst"
import marked from "marked"

const router = useRouter();

const prologueHtml = ref("");
const rankTemp = ref(0);

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }
    
    await reloadCorridorHtml(); 
});

async function reloadCorridorHtml() {
    let api = gConst.apiRoot + "/play/get-final-info";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if (data['status'] == 1) {
        rankTemp.value = data.rank_temp;
        let html = marked(data.desc);
        prologueHtml.value = html.replace(/<script.*?>([\s\S]+?)<\/script>/, (_, js) => {
            nextTick(() => {
                let rankfunction = eval(js);
                let extraText = rankfunction(rankTemp.value) || "";

                prologueHtml.value += marked(extraText);
            });
            return "";
        });
    } else {
        defaultApiErrorAction(data);
    }
}
</script>