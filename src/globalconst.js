import { reactive } from 'vue'
import mitt from 'mitt'

const gConst = {
    apiRoot: "https://api.ccbc11.test/api/v1", //local
    //apiRoot: "https://apiv2.cipherpuzzles.com/api/v1", //remote
    globalBus: mitt(),
    status: reactive({
        isLogin: false,
        username: "[][NULL]",
        fromRoomStatus: 0, //0-不显示 1-线索室 2-警长室
        skipPrologue: false
    })
}

export default gConst;