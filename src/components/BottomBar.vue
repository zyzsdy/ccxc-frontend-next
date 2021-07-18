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
                            <span class="badge bg-danger" v-if="unreadAnnouncement > 0">{{ unreadAnnouncement }}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#" @click="goCommOffice">前往警官办公室</a></li>
                            <li><a class="dropdown-item" href="#" @click="goAnalysisRoom">前往案情分析室</a></li>
                            <li><a class="dropdown-item" href="#" @click="goPrologue">前往序章</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="autoSkipPrologue" v-model="skipPrologue" @click="checkSkipSwitcher">
                                    <label class="form-check-label" for="autoSkipPrologue">进入时跳过序章</label>
                                </div>
                            </li>
                            <li v-if="unreadAnnouncement > 0"><hr class="dropdown-divider"></li>
                            <li class="bg-danger" v-if="unreadAnnouncement > 0"><a class="dropdown-item" href="https://ccbc11.cipherpuzzles.com/announcement" target="_blank">新公告 {{ unreadAnnouncement }} 条未读</a></li>
                        </ul>
                    </li>
                    <li class="nav-item" v-if="gConst.status.navLinkType === 'an'"><a class="nav-link" href="#" @click="goAnalysisRoom">案情分析室</a></li>
                    <li class="nav-item" v-if="gConst.status.navLinkType === 'of'"><a class="nav-link" href="#" @click="goCommOffice">警官办公室</a></li>
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
    <div class="modal fade" id="answerHistory" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="answerHistoryDialogHeader" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title" id="answerHistoryDialogHeader">答案记录</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table table-dark" v-if="answerHistory.length > 0">
                        <thead>
                            <tr>
                                <th scope="col">回答时间</th>
                                <th scope="col">回答者</th>
                                <th scope="col">答案</th>
                                <th scope="col">状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="ah in answerHistory" :key="ah.id" :class="[ ah.rowClass ]">
                                <td>{{ ah.dateString }}</td>
                                <td>{{ ah.user_name }}</td>
                                <td>{{ ah.answer }}</td>
                                <td>{{ ah.statusLabel }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else>还没有回答过这道题。</div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>
    <div class="toast-container position-fixed p-3 top-0 end-0">
        <div id="coolDownToast" class="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true"
            data-bs-autohide="false">
            <div class="d-flex">
                <div class="toast-body">
                    冷却中，还有 {{ Math.ceil(cooldownRemainSeconds) }} 秒。
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
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
import isLogin from '../utils/IsLogin'
import { Modal, Toast } from 'bootstrap';
import formatTimestamp from '../utils/FormatDate'
import sleep from '../utils/Sleep'

const route = useRoute();
const router = useRouter();

const skipPrologue = ref(false);
const answer = ref("");

const answerTips = ref([]);
const tipsCoin = ref(0.0);

const answerHistory = ref([]);

const unreadAnnouncement = ref(0);

const cooldownRemainSeconds = ref(0);


sendHeartbeat();
startCountdown();

onMounted(() => {
    skipPrologue.value = gConst.status.skipPrologue;
});

async function sendHeartbeat(){
    await sleep(60000);

    if (isLogin()) {
        let api = gConst.apiRoot + "/heartbeat-puzzle";
        let res = await fetchPostWithSign(api, {});
        let data = await res.json();

        if (data['status'] == 1) {
            unreadAnnouncement.value = data.unread;
        } else {
            defaultApiErrorAction(data);
        }
    }
    
    sendHeartbeat();
}

async function sendAnswer() {
    let answerString = answer.value;

    if (answerString == null || answerString == ""){
        gConst.globalBus.emit("message", {
            type: "danger",
            message: "答案不能为空"
        });
        return;
    }

    let pid = parseInt(route.params.pid);
    if (!pid) {
        gConst.globalBus.emit("message", {
            type: "info",
            message: "题目ID不正确"
        });
        return;
    }

    let api = gConst.apiRoot + "/check-answer";
    let res = await fetchPostWithSign(api, {
        pid,
        answer: answerString
    });
    let data = await res.json();

    if (data['status'] == 1) {
        //final正确，跳转到结束页面
        if(data.answer_status == 1 && data.extend_flag == 1){
            gConst.globalBus.emit("message", {
                type: "success",
                message: "回答正确！"
            });
            router.push('/finalend');
            return;
        }

        let type = "warning";
        if(data.answer_status == 1) type = "success";
        else if(data.answer_status == 2) type = "danger";
        else if(data.answer_status == 3) {
            type = "info";
            cooldownRemainSeconds.value = data.cooldown_remain_seconds;
            showCooldownToast();
        }

        gConst.globalBus.emit("show-message", {
            title: "答题结果",
            type,
            message: data.message
        });

        if(data.extend_flag == 16){
            gConst.globalBus.emit("reload");
        }
    } else {
        defaultApiErrorAction(data);
    }


    answer.value = "";
}

async function showTip() {
    let pid = parseInt(route.params.pid);
    if (!pid) {
        gConst.globalBus.emit("message", {
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
        gConst.globalBus.emit("message", {
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

async function showAnswerHistory() {
    let pid = parseInt(route.params.pid);
    if (!pid) {
        gConst.globalBus.emit("message", {
            type: "info",
            message: "题目ID不正确"
        });
        return;
    }

    let api = gConst.apiRoot + "/play/get-last-answer-log";
    let res = await fetchPostWithSign(api, {
        pid
    });
    let data = await res.json();

    if (data['status'] == 1) {
        if (data.answer_log) {
            let answerLogList = [];
            for (let ah of data.answer_log) {
                ah.dateString = formatTimestamp(ah.create_time);
                
                let statusLabel = "";
                let rowClass = "";
                if (ah.status == 1) { 
                    statusLabel = "OK";
                    rowClass = "table-success";
                }
                else if (ah.status == 2) {
                    statusLabel = "WRONG ANSWER";
                    rowClass = "table-danger";
                }
                else if (ah.status == 3) {
                    statusLabel = "COOL DOWN";
                    rowClass = "table-info";
                }
                else if (ah.status == 6) {
                    statusLabel = "HIT KEYWORD";
                    rowClass = "table-warning";
                }

                ah.statusLabel = statusLabel;
                ah.rowClass = rowClass;

                answerLogList.push(ah);
            }

            answerHistory.value = answerLogList;

            var answerHistoryDialog = new Modal(document.getElementById("answerHistory"));
            answerHistoryDialog.show();
        }
    } else {
        defaultApiErrorAction(data);
    }
}

function showCooldownToast() {
    let toastEl = document.getElementById("coolDownToast");
    let toast = new Toast(toastEl);
    toast.show();
}

async function startCountdown() {
    cooldownRemainSeconds.value -= 1;
    await sleep(1000);

    if (cooldownRemainSeconds.value <= 0) {
        let toastEl = document.getElementById("coolDownToast");
        let toast = new Toast(toastEl);
        toast.hide();
    }

    startCountdown();
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

function goAnalysisRoom() {
    router.push("/analysis-room");
}

function goCommOffice() {
    router.push("/commissioner-office")
}
</script>