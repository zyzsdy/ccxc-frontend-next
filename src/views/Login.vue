<template>

</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router";
import { fetchPost, defaultApiErrorAction } from "../utils/FetchPost"
import gConst from "../globalconst"

const route = useRoute();
const router = useRouter();

const letter = ref(route.query?.letter);
loginCheck(letter.value);

async function loginCheck(ticket) {
    let api = gConst.apiRoot + "/puzzle-check-ticket"
    let res = await fetchPost(api, {
        ticket
    });
    let data = await res.json();

    if (data["status"] == 1) {
        gConst.status.isLogin = true;
        gConst.status.username = data["user_login_info"]["username"];
        router.push('/prologue');

        localStorage.setItem("uid", data["user_login_info"]["uid"]);
        localStorage.setItem("username", data["user_login_info"]["username"]);
        localStorage.setItem("roleid", data["user_login_info"]["roleid"]);
        localStorage.setItem("token", data["user_login_info"]["token"]);
        localStorage.setItem("sk", data["user_login_info"]["sk"]);
        localStorage.setItem("etc", data["user_login_info"]["etc"]);
    } else {
        if (data['status'] == 2){
            router.push('/');
        }
        gConst.status.isLogin = false;
        defaultApiErrorAction(data);
    }
}
</script>