<template>
    <div class="container-md center">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 11</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="d-flex flex-wrap flex-row">
                    <div class="metarow p-2 mb-3" v-for="sp in metaList" :key="sp.pid">
                        <button class="btn btn-lg" :class="[sp.is_finished ? 'btn-outline-success' : 'btn-outline-primary']" @click="showPuzzle(sp.pid)">{{ sp.title }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.metarow{
    flex: 0 0 25%;
}
</style>

<script setup>
import { ref } from "@vue/reactivity";
import isLogin from '../utils/IsLogin'
import { useRouter } from "vue-router";
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/FetchPost"
import { onMounted } from "@vue/runtime-core";
import gConst from "../globalconst"

const router = useRouter();
const metaList = ref([]);

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }

    reloadMetaList();
});

async function reloadMetaList(){
    let api = gConst.apiRoot + "/play/get-meta-list";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if (data['status'] == 1) {
        metaList.value = data["simple_puzzles"];
    } else {
        defaultApiErrorAction(data);
    }
}

function showPuzzle(pid) {
    router.push(`/clue/${pid}`);
}
</script>