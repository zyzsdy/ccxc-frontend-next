import { ref } from '@vue/reactivity';
import gConst from '../../globalconst';
import { Modal } from 'bootstrap';
import marked from 'marked';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/FetchPost';

export default function useTipsPart() {
    const answerTips = ref([]);
    const tipsCoin = ref(0.0);

    const showTip = async (pid) => {
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

    const unlockTip = async (pid, tip_num) => {
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

    const reloadTip = async (pid) => {
        let api = gConst.apiRoot + "/play/get-tips";
        let res = await fetchPostWithSign(api, {
            pid
        });
        let data = await res.json();
    
        if (data['status'] == 1) {
            if (data.puzzle_tips) {
                for (let pti in data.puzzle_tips) {
                    data.puzzle_tips[pti].content_html = "";
                    if (data.puzzle_tips[pti].content && data.puzzle_tips[pti].content.length > 0) {
                        data.puzzle_tips[pti].content_html = marked(data.puzzle_tips[pti].content);
                    }
                }
    
                answerTips.value = data.puzzle_tips
            }
            tipsCoin.value = data.tips_coin;
        } else {
            defaultApiErrorAction(data);
        }
    }

    return {
        answerTips,
        tipsCoin,
        showTip,
        unlockTip,
        reloadTip
    }
}
