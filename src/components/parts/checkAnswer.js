import { ref } from '@vue/reactivity';
import gConst from '../../globalconst';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/FetchPost';

export default function useCheckAnswer(cooldownRemainSeconds, showCooldownToast, router) {
    const answer = ref("");

    const sendAnswer = async (pid) => {
        let answerString = answer.value;
    
        if (answerString == null || answerString == ""){
            gConst.globalBus.emit("message", {
                type: "danger",
                message: "答案不能为空"
            });
            return;
        }
    
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

    return {
        answer,
        sendAnswer
    }
}