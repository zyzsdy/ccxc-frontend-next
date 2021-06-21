import { reactive } from 'vue'
import mitt from 'mitt'

const gConst = {
    apiRoot: "https://api.ccbc11.test/api/v1", //local
    //apiRoot: "https://apiv2.cipherpuzzles.com/api/v1", //remote
    globalBus: mitt(),
    status: reactive({
        isLogin: false
    })
}

export default gConst;