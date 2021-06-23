import { reactive } from 'vue'
import mitt from 'mitt'

const gConst = {
    apiRoot: "https://api.ccbc11.test/api/v1", //local
    //apiRoot: "https://apiv2.cipherpuzzles.com/api/v1", //remote
    globalBus: mitt(),
    status: reactive({
        isLogin: false,
        username: "[][NULL]",
        skipPrologue: false,
        navLinkType: "", //当前导航跳转链接 an-显示返回案情分析室按钮 of-显示返回警官办公室按钮
    })
}

export default gConst;