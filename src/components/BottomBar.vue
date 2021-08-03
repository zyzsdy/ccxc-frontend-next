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
                            <span class="badge bg-danger" v-if="(unreadAnnouncement + unreadMessage) > 0">{{ unreadAnnouncement + unreadMessage }}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#" @click="goCommOffice">前往警官办公室</a></li>
                            <li><a class="dropdown-item" href="#" @click="goAnalysisRoom">前往案情分析板</a></li>
                            <li><a class="dropdown-item" href="#" @click="goPrologue">前往序章</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="autoSkipPrologue" v-model="skipPrologue" @click="checkSkipSwitcher">
                                    <label class="form-check-label" for="autoSkipPrologue">进入时跳过序章</label>
                                </div>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li v-if="unreadMessage == 0"><a class="dropdown-item" href="#" @click="showInbox">站内信</a></li>
                            <li v-else class="bg-danger"><a class="dropdown-item" href="#" @click="showInbox">站内信 {{unreadMessage}} 条未读</a></li>
                            <li class="bg-danger" v-if="unreadAnnouncement > 0"><a class="dropdown-item" href="https://ccbc11.cipherpuzzles.com/announcement" target="_blank">新公告 {{ unreadAnnouncement }} 条未读</a></li>
                        </ul>
                    </li>
                    <li class="nav-item" v-if="gConst.status.navLinkType === 'an'"><a class="nav-link" href="#" @click="goAnalysisRoom">案情分析板</a></li>
                    <li class="nav-item" v-if="gConst.status.navLinkType === 'of'"><a class="nav-link" href="#" @click="goCommOffice">警官办公室</a></li>
                    <li class="nav-item" v-if="$route.path.indexOf('clue') != -1"><a class="nav-link" href="#" @click="showTip($route.params.pid)">显示提示</a></li>
                    <li class="nav-item" v-if="$route.path.indexOf('clue') != -1"><a class="nav-link" href="#" @click="showAnswerHistory($route.params.pid)">答题记录</a></li>
                </ul>
                <ul class="navbar-nav"  v-if="$route.path.indexOf('clue') != -1">
                    <form class="d-flex" @submit.prevent="sendAnswer($route.params.pid)">
                        <input class="form-control me-2 mb-2 mb-md-0 bg-dark text-light" type="input" placeholder="Answer" aria-label="Answer" v-model="answer">
                    </form>
                    <li class="nav-item me-2"><button class="btn btn-outline-success" @click="sendAnswer($route.params.pid)">提交</button></li>
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
                    <div v-if="tipsCoin == 0">
                        没有提示币怎么要提示啊。（24小时后每小时会获得1枚提示币）
                    </div>
                    <div class="container-fluid mt-4">
                        <div v-for="tip in answerTips" :key="tip.tips_id" class="mb-4">
                            <div class="d-flex justify-content-between">
                                <div><h5>提示{{tip.tip_num}}：{{tip.title}}
                                    <span class="badge bg-secondary" v-if="tip.is_open == 0">消耗 {{tip.cost}}c 解锁</span>
                                    <span class="badge bg-success" v-else>已解锁</span>
                                </h5>
                                </div><div>
                                <button v-if="tip.is_open == 0" class="btn btn-secondary" @click="unlockTip($route.params.pid, tip.tip_num)">解锁</button></div>
                            </div>
                            <div v-html="tip.content_html"></div>
                        </div>
                        <div v-if="answerTips.length == 0">
                            暂时没有提示，说不定过一段时间回来看看会有。
                        </div>
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
    <div class="modal fade" id="inbox" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="inboxDialogHeader" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-md-down modal-lg">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title" id="inboxDialogHeader">站内信</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div>
                        <form @submit.prevent="sendMail">
                            <div class="mb-3">
                                <textarea class="form-control bg-dark text-light" rows="8" placeholder="使用Markdown书写要发送的内容。" v-model="mailInfo.newMail"></textarea>
                            </div>
                            <div class="mb-3">
                                <button type="submit" class="btn btn-primary">发送</button>
                            </div>
                        </form>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between">
                        <h3>消息记录：</h3>
                        <button class="btn btn-info btn-sm" @click="resetMail">刷新</button>
                    </div>
                    <div>
                        <div class="mail-tips" v-if="mailList.length == 0">没有消息</div>
                        <ul class="mail-history-list">
                            <li v-for="m in mailList" :key="m.mid">
                                <div class="mail-card">
                                    <div class="mail-header">
                                        <span>From: {{ m.user_name }}<role-badge :roleid="m.roleid"></role-badge></span>
                                        <span class="mail-time">{{ m.formatedDate }}</span>
                                        <span class="mail-read-marker" v-if="m.is_read == 0">[未读]</span>
                                    </div>
                                    <div class="mail-content" v-html="m.renderedHtml"></div>
                                </div>
                            </li>
                        </ul>
                        <div class="mail-tips load-next-button" v-if="!mailInfo.noMore && mailList.length > 0" @click="reloadMail">点击继续加载</div>
                        <div class="mail-tips" v-if="mailInfo.isLoading">加载中...</div>
                        <div class="mail-tips" v-if="mailInfo.noMore && mailList.length > 0">没有更多消息了</div>
                    </div>
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
.mail-history-list{
    overflow: auto;
    padding-left: 0;
    li {
        list-style: none;
    }
}
.mail-card{
    margin-top: 20px;
    background-color: #4b4b4b;
    border-radius: 20px;
    .mail-header{
        border-bottom: 1px solid #999999;
        padding: 10px;
        font-size: 18px;
        .mail-time{
            float: right;
            font-size: 15px;
            line-height: 18px;
            color: #999999;
        }
        .mail-read-marker{
            float: right;
            font-size: 15px;
            line-height: 18px;
            color: #f15252;
        }
    }
    .mail-content{
        padding: 10px;
    }
}
.mail-tips{
    text-align: center;
    padding: 5px;
    background-color: #4b4b4b;
    border-radius: 10px;
}
.load-next-button{
    transition: all .2s linear;
    cursor: pointer;
}
.load-next-button:hover{
    background-color: #3a3a3a;
}
</style>

<script setup>
import gConst from '../globalconst';
import { useRouter } from 'vue-router';
import { onMounted } from '@vue/runtime-core';
import RoleBadge from './RoleBadge.vue';

import useTipsPart from './parts/tips';
import useCooldownToast from './parts/cooldownToast';
import useJumpHelper from './parts/jumpHelper';
import useAnswerHistory from './parts/answerHistory';
import useCheckAnswer from './parts/checkAnswer';
import useMessage from './parts/message';

const router = useRouter();

const { answerTips, tipsCoin, showTip, unlockTip, reloadTip } = useTipsPart();
const { cooldownRemainSeconds, showCooldownToast, startCountdown } = useCooldownToast();
const { skipPrologue, checkSkipSwitcher, goPrologue, goCorridor, goAnalysisRoom, goCommOffice }  = useJumpHelper(router);
const { answerHistory, showAnswerHistory } = useAnswerHistory();
const { answer, sendAnswer } = useCheckAnswer(cooldownRemainSeconds, showCooldownToast);
const { unreadAnnouncement, unreadMessage, mailList, mailInfo, sendHeartbeat, showInbox, resetMail, reloadMail, sendMail } = useMessage();

//onCreated
sendHeartbeat();
startCountdown();

onMounted(() => {
    skipPrologue.value = gConst.status.skipPrologue;
});
</script>