<template>
    <div class="container-md center">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 11</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="ratio ratio-16x9 main-grid">
                    <div class="container-fluid question-area">
                        <div class="row row-cols-8 main-grid-row" v-for="row in clueMatrix" :key="row.rowKey">
                            <div class="col p-0" v-for="col in row.l" :key="col.colKey">
                                <div class="ratio ratio-4x3 sticker-box" v-if="col.show == 1" @click="showPuzzle(col.pid)">
                                    <div class="number-box" :class="{'number-box-finish' : col.finish}">{{ col.title }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "../node_modules/bootstrap/scss/functions";
@import "../node_modules/bootstrap/scss/variables";
@import "../node_modules/bootstrap/scss/mixins";
.question-area{
    position: absolute;
    width: 57%;
    height: 80%;
    top: 10%;
    left: 18.5%;
}
.main-grid{
    background-image: url('../assets/board.jpg');
    background-size: 100% 100%;
}
.main-grid-row{
    height: 70px;
}
.sticker-box {
    background-image: url('../assets/question.png');
    background-size: 100% 100%;
    cursor: pointer;
    transition: all 0.2s linear;
}
.sticker-box:hover{
    background-image: url('../assets/question_hover.png');
}
.number-box{
    font-size: 45px;
    margin-top: 5px;
    color: #2a1711;
}
.number-box-finish{
    color: #0ead00;
}

@include media-breakpoint-down(xxl) {
    .number-box{
        font-size: 40px;
        margin-top: 3px;
    }
    .main-grid-row{
        height: 62px;
    }
}
@include media-breakpoint-down(xl) {
    .number-box{
        font-size: 30px;
        margin-top: 5px;
    }
    .main-grid-row{
        height: 53px;
    }
}
@include media-breakpoint-down(lg) {
    .number-box{
        font-size: 25px;
        margin-top: 2px;
    }
    .main-grid-row{
        height: 39px;
    }
}
@include media-breakpoint-down(md) {
    .number-box{
        font-size: 3vw;
        margin-top: 0.4vw;
    }
    .main-grid-row{
        height: 5.2vw;
    }
}
</style>

<script setup>
import { ref } from 'vue'
import { onMounted } from '@vue/runtime-core'
import isLogin from '../utils/IsLogin'
import { useRouter } from "vue-router";
import { fetchPostWithSign, defaultApiErrorAction } from "../utils/FetchPost"
import gConst from "../globalconst"
import { RandomString } from "../utils/Random"

const clueMatrix = ref([]);

const router = useRouter();

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }

    reloadClueMatrix();
});

async function reloadClueMatrix() {
    let api = gConst.apiRoot + "/play/get-clue-matrix";
    let res = await fetchPostWithSign(api, {});
    let data = await res.json();

    if (data['status'] == 1) {
        let simplePuzzles = data["simple_puzzles"];
        let simple = [];

        for (let p of simplePuzzles) {
            simple[p.x * 8 + p.y] = p;
        }

        let mat = [];
        for (let i = 0; i < 8; i++) {
            let row = {
                rowKey: RandomString(),
                l: []
            };
            for (let j = 0; j < 8; j++) {
                if (simple[i * 8 + j]) {
                    let p = simple[i * 8 + j];
                    row.l.push({
                        colKey: RandomString(),
                        title: p.title,
                        show: 1,
                        finish: p.is_finished == 1,
                        pid: p.pid
                    });
                }else{
                    row.l.push({
                        colKey: RandomString(),
                        show: 0,
                        finish: false
                    });
                }
            }
            mat.push(row);
        }

        clueMatrix.value = mat;
    } else {
        defaultApiErrorAction(data);
    }
}

function showPuzzle(pid) {
    router.push(`/clue/${pid}`);
}
</script>
