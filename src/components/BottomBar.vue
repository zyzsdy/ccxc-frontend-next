<template>
    <nav class="navbar navbar-expand-md fixed-bottom navbar-dark bg-dark">
        <div class="container-md">
            <a class="navbar-brand" href="#">{{gConst.status.username}}</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mb-2 me-auto mb-md-0">
                    <li class="nav-item dropup">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        导航
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#" @click="goCorridor">前往走廊</a></li>
                            <li><a class="dropdown-item" href="#" @click="goPrologue">前往序章</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="autoSkipPrologue" v-model="skipPrologue" @click="checkSkipSwitcher">
                                    <label class="form-check-label" for="autoSkipPrologue">进入时跳过序章</label>
                                </div>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item" v-if="gConst.status.navLinkType === 'an'"><a class="nav-link" href="#" @click="goAnalysisRoom">案情分析室</a></li>
                    <li class="nav-item" v-if="gConst.status.navLinkType === 'of'"><a class="nav-link" href="#">警官办公室</a></li>
                    <li class="nav-item" v-if="route.path.indexOf('clue') != -1"><a class="nav-link" href="#" @click="showTip">显示提示</a></li>
                    <li class="nav-item" v-if="route.path.indexOf('clue') != -1"><a class="nav-link" href="#" @click="showAnswerHistory">答题记录</a></li>
                </ul>
                <ul class="navbar-nav"  v-if="route.path.indexOf('clue') != -1">
                    <form class="d-flex" @submit.prevent="sendAnswer">
                        <input class="form-control me-2 mb-2 mb-md-0 bg-dark text-light" type="input" placeholder="Answer" aria-label="Answer" v-model="answer">
                    </form>
                    <li class="nav-item me-2"><button class="btn btn-outline-success" @click="sendAnswer">提交</button></li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="modal fade" id="puzzleTips" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="puzzleTipsDialogHeader" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title" id="puzzleTipsDialogHeader">提示</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="text-info mb-4">
                        提示币数量： {{tipsCoin}} c
                    </div>
                    <div class="container-fluid" v-if="tipsCoin > 0">
                        <div v-for="tip in answerTips" :key="tip.tips_id" class="mb-4">
                            <div class="d-flex justify-content-between">
                                <div><h5>提示{{tip.tip_num}}：{{tip.title}}
                                    <span class="badge bg-secondary" v-if="tip.is_open == 0">消耗 {{tip.cost}}c 解锁</span>
                                    <span class="badge bg-success" v-else>已解锁</span>
                                </h5>
                                </div><div>
                                <button v-if="tip.is_open == 0" class="btn btn-secondary" @click="unlockTip(tip.tip_num)">解锁</button></div>
                            </div>
                            <div>{{tip.content}}</div>
                        </div>
                        <div v-if="answerTips.length == 0">
                            暂时没有提示，说不定过一段时间回来看看会有。
                        </div>
                    </div>
                    <div v-else>
                        没有提示币怎么要提示啊。（24小时后每小时会获得1枚提示币）
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script setup>
import gConst from '../globalconst'
import { useRoute, useRouter } from 'vue-router'
import { fetchPostWithSign, defaultApiErrorAction } from '../utils/FetchPost'
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { Modal } from 'bootstrap';

const route = useRoute();
const router = useRouter();

const skipPrologue = ref(false);
const answer = ref("");

const answerTips = ref([]);
const tipsCoin = ref(0.0);


onMounted(() => {
    skipPrologue.value = gConst.status.skipPrologue;
});

function sendAnswer() {
    let answerString = answer.value;
    let pid = route.params.pid;
    if (!pid) {
        gConst.status.emit("message", {
            type: "info",
            message: "题目ID不正确"
        });
        return;
    }

    console.log(pid, answerString);


    answer.value = "";
}

async function showTip() {
    let pid = parseInt(route.params.pid);
    if (!pid) {
        gConst.status.emit("message", {
            type: "info",
            message: "题目ID不正确"
        });
        return;
    }

    await reloadTip(pid);

    var tipDialog = new Modal(document.getElementById("puzzleTips"));
    tipDialog.show();
}

async function unlockTip(tip_num){
    let pid = parseInt(route.params.pid);
    if (!pid) {
        gConst.status.emit("message", {
            type: "info",
            message: "题目ID不正确"
        });
        return;
    }

    let api = gConst.apiRoot + "/play/unlock-tips";
    let res = await fetchPostWithSign(api, {
        pid,
        tip_num
    });
    let data = await res.json();

    if (data['status'] == 1) {
        await reloadTip(pid);
    } else {
        defaultApiErrorAction(data);
    }
}

async function reloadTip(pid){
    let api = gConst.apiRoot + "/play/get-tips";
    let res = await fetchPostWithSign(api, {
        pid
    });
    let data = await res.json();

    if (data['status'] == 1) {
        if (data.puzzle_tips) {
            answerTips.value = data.puzzle_tips
        }
        tipsCoin.value = data.tips_coin;
    } else {
        defaultApiErrorAction(data);
    }
}

function showAnswerHistory() {
    let pid = route.params.pid;
    if (!pid) {
        gConst.status.emit("message", {
            type: "info",
            message: "题目ID不正确"
        });
        return;
    }

    console.log("showAnswerHistory Clicked");
}

function checkSkipSwitcher() {
    if (skipPrologue.value == false) {
        gConst.status.skipPrologue = true;
        localStorage.setItem("skipPrologue", "on");
    } else {
        gConst.status.skipPrologue = false;
        localStorage.setItem("skipPrologue", "off");
    }
}

function goPrologue() {
    router.push("/prologue");
}

function goCorridor() {
    router.push("/corridor");
}

function goAnalysisRoom(){
    router.push("/analysis-room");
}
</script>