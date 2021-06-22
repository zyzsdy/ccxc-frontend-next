<template>
    <div class="container-md center">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 11</div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                <div class="ratio ratio-board main-grid">
                    <div class="container-fluid">
                        <div class="row row-cols-8 main-grid-row" v-for="row in clueMatrix" :key="row.rowKey">
                            <div class="col" v-for="col in row.l" :key="col.colKey">
                                <div class="ratio ratio-1x1 sticker-box" v-if="col.show == 1" @click="showPuzzle(col.pid)">
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
.ratio-board{
    --bs-aspect-ratio: calc(4 / 5 * 100%);
}
.main-grid{
    background-image: url('../assets/board-bg.png');
    border: 16px solid transparent;
    border-image: url('../assets/border-bg.png') 18 stretch;
}
.main-grid-row{
    height: 82px;
}
.sticker-box {
    background-image: url('../assets/sticker.png');
    background-size: 100% 100%;
    cursor: pointer;
}
.number-box{
    font-size: 45px;
    margin-top: 10px;
    color: rgb(56, 131, 243);
}
.number-box-finish{
    color: rgb(13, 196, 4);
}

@include media-breakpoint-down(xxl) {
    .number-box{
        font-size: 35px;
        margin-top: 8px;
    }
    .main-grid-row{
        height: 71px;
    }
}
@include media-breakpoint-down(xl) {
    .number-box{
        font-size: 35px;
        margin-top: 10px;
    }
    .main-grid-row{
        height: 74px;
    }
}
@include media-breakpoint-down(lg) {
    .number-box{
        font-size: 30px;
        margin-top: 9px;
    }
    .main-grid-row{
        height: 67px;
    }
}
@include media-breakpoint-down(md) {
    .number-box{
        font-size: 3.5vw;
        margin-top: 1vw;
    }
    .main-grid-row{
        height: 9.2vw;
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
    gConst.status.fromRoomStatus = 1;
    router.push(`/clue/${pid}`);
}
</script>
