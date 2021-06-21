<template>
    <div class="container-md">
        <div class="row header-line">
            <div class="col">
                <div>CCBC 11</div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-html="renderedHtml"></div>
            </div>
        </div>
        <div class="row" v-if="puzzle.is_finish == 1 && puzzle.extend_content && puzzle.extend_content != ''">
            <div class="col">
                <div class="alert alert-dark">
                    <h5>隐藏的内容</h5>
                    <hr/>
                    <div v-html="renderedExtendHtml"></div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div v-if="puzzle.type == 0">
                    <img class="puzzle-image" :src="puzzle.image">
                </div>
                <div v-if="puzzle.type == 1" v-html="puzzle.html" id="puzzleHtml">

                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.puzzle-image{
    width: 100%;
}
</style>

<script setup>
import { nextTick, onMounted, reactive, ref } from '@vue/runtime-core'
import isLogin from '../utils/IsLogin'
import { useRoute, useRouter } from "vue-router";
import gConst from '../globalconst';
import { defaultApiErrorAction, fetchPostWithSign } from '../utils/FetchPost';
import marked from 'marked'

const route = useRoute();
const router = useRouter();

const puzzle = reactive({
    pid: 0,
    type: 0,
    title: "",
    content: "",
    image: "",
    html: "",
    answer_type: 0,
    extend_content: "",
    is_finish: 0
});
const renderedHtml = ref("");
const renderedExtendHtml = ref("");

onMounted(async () => {
    if (!isLogin()) {
        router.push('/');
        return;
    }

    await loadPuzzleDetail();
});

async function loadPuzzleDetail() {
    let pid = parseInt(route.params.pid);

    let api = gConst.apiRoot + "/play/get-puzzle-detail";
    let res = await fetchPostWithSign(api, {
        pid
    });
    let data = await res.json();

    if (data['status'] == 1) {
        if (data.puzzle) {
            Object.assign(puzzle, data.puzzle);

            if (puzzle.content) renderedHtml.value = marked(puzzle.content);
            if (puzzle.extend_content) renderedExtendHtml.value = marked(puzzle.extend_content);

            if (puzzle.type == 1){ //HTML
                let html = puzzle.html;
                puzzle.html = html.replace(/<script.*?>([\s\S]+?)<\/script>/, (_, js) => {
                    nextTick(() => {
                        var htmlContainer = document.getElementById("puzzleHtml");
                        var ele = document.createElement("script");
                        ele.innerHTML = js;
                        htmlContainer.appendChild(ele);
                    });
                    return "";
                });
            }
        }
    } else {
        defaultApiErrorAction(data);
    }
}
</script>