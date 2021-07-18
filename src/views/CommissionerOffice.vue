<template>
    <div class="container-md center">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 11</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="ratio ratio-16x9 mainimg">
                    <div class="d-flex flex-wrap flex-row buttonarea">
                        <div class="metarow" v-for="sp in metaList" :key="sp.pid">
                            <button class="meta-button" :class="[sp.is_finished ? 'mb-success' : 'mb-normal']" @click="showPuzzle(sp.pid)">{{ sp.title }}</button>
                        </div>
                        <div class="metarow-m" v-for="sp in metaMetaList" :key="sp.pid">
                            <button class="meta-button" :class="[sp.is_finished ? 'mb-success' : 'mb-normal']" @click="showPuzzle(sp.pid)">{{ sp.title }}</button>
                        </div>
                    </div>
                    <img :src="imgBoardHover" class="boardarea" @click="goAnalysisRoom">
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../node_modules/bootstrap/scss/functions";
@import "../node_modules/bootstrap/scss/variables";
@import "../node_modules/bootstrap/scss/mixins";
.boardarea{
    position: absolute;
    width: 11.7%;
    height: 60.2%;
    top: 19.5%;
    left: 0;
    opacity: 0;
    cursor: pointer;
    transition: all 0.2s linear;
}
.boardarea:hover{
    opacity: 1;
}
.meta-button{
    background-color: rgba(204, 195, 187, 0.7);
    border: #684d2c 2px solid;
    width: 120px;
    height: 30px;
    transition: all 0.2s linear;
    color: #2a1711;
}
.meta-button:hover{
    border-color: rgb(160,100,60);
    background-color: rgba(204, 195, 187);
}
.mb-success{
    background-color: rgba(70, 189, 62, 0.7);
    border: #327e28 2px solid;
}
.mb-success:hover{
    background-color: rgba(70, 189, 62);
    border-color: #24bd71;
}
.mainimg{
    background-image: url("../assets/cobg.jpg");
    background-size: 100% 100%;
}
.buttonarea{
    position: absolute;
    width: 30%;
    height: 28%;
    top: 50%;
    left: 35%;
}
.metarow{
    flex: 1 0 33%;
}
.metarow-m{
    flex: 2 0 50%;
}
@include media-breakpoint-down(xxl) {
    .meta-button{
        width: 100px;
        height: 30px;
    }
}
@include media-breakpoint-down(xl) {
    .meta-button{
        width: 90px;
        height: 25px;
        font-size: 14px;
    }
}
@include media-breakpoint-down(lg) {
    .meta-button{
        width: 100px;
        height: 30px;
    }
}
@include media-breakpoint-down(md) {
    .meta-button{
        width: 120px;
        height: 30px;
    }
}
</style>

<script setup>
import { ref } from "@vue/reactivity";
import isLogin from '../utils/IsLogin'
import { useRouter } from "vue-router";
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/FetchPost"
import { onMounted } from "@vue/runtime-core";
import gConst from "../globalconst"

import imgBoardHover from '../assets/board_hover.png'

const router = useRouter();
const metaList = ref([]);
const metaMetaList = ref([]);

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
        metaList.value = data["simple_puzzles"].filter(it => it.x == 0);
        metaMetaList.value = data["simple_puzzles"].filter(it => it.x > 0);
    } else {
        defaultApiErrorAction(data);
    }
}

function showPuzzle(pid) {
    router.push(`/clue/${pid}`);
}

function goAnalysisRoom() {
    router.push("/analysis-room");
}
</script>