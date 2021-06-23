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
</template>

<style lang="scss" scoped>

</style>

<script setup>
import gConst from '../globalconst'
import { useRoute, useRouter } from 'vue-router'
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';

const route = useRoute();
const router = useRouter();

const skipPrologue = ref(false);
const answer = ref("");


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

function showTip() {
    let pid = route.params.pid;
    if (!pid) {
        gConst.status.emit("message", {
            type: "info",
            message: "题目ID不正确"
        });
        return;
    }

    console.log("showTip Clicked");
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