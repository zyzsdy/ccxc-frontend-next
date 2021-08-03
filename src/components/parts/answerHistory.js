import { ref } from '@vue/reactivity';
import gConst from '../../globalconst';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/FetchPost';
import { Modal } from 'bootstrap';
import formatTimestamp from '../../utils/FormatDate';

export default function useAnswerHistory() {
    const answerHistory = ref([]);
    const showAnswerHistory = async (pid) => {
        if (!pid) {
            gConst.globalBus.emit("message", {
                type: "info",
                message: "题目ID不正确"
            });
            return;
        }
    
        let api = gConst.apiRoot + "/play/get-last-answer-log";
        let res = await fetchPostWithSign(api, {
            pid
        });
        let data = await res.json();
    
        if (data['status'] == 1) {
            if (data.answer_log) {
                let answerLogList = [];
                for (let ah of data.answer_log) {
                    ah.dateString = formatTimestamp(ah.create_time);
                    
                    let statusLabel = "";
                    let rowClass = "";
                    if (ah.status == 1) { 
                        statusLabel = "OK";
                        rowClass = "table-success";
                    }
                    else if (ah.status == 2) {
                        statusLabel = "WRONG ANSWER";
                        rowClass = "table-danger";
                    }
                    else if (ah.status == 3) {
                        statusLabel = "COOL DOWN";
                        rowClass = "table-info";
                    }
                    else if (ah.status == 6) {
                        statusLabel = "HIT KEYWORD";
                        rowClass = "table-warning";
                    }
    
                    ah.statusLabel = statusLabel;
                    ah.rowClass = rowClass;
    
                    answerLogList.push(ah);
                }
    
                answerHistory.value = answerLogList;
    
                var answerHistoryDialog = new Modal(document.getElementById("answerHistory"));
                answerHistoryDialog.show();
            }
        } else {
            defaultApiErrorAction(data);
        }
    }

    return {
        answerHistory,
        showAnswerHistory
    }
}