import { ref } from '@vue/reactivity';
import gConst from '../../globalconst';
import { fetchPostWithSign, defaultApiErrorAction } from '../../utils/FetchPost';
import isLogin from '../../utils/IsLogin';
import sleep from '../../utils/Sleep';
import { Modal } from 'bootstrap';
import { reactive } from 'vue';
import marked from 'marked';
import formatTimestamp from '../../utils/FormatDate';

export default function useMessage() {
    const unreadAnnouncement = ref(0);
    const unreadMessage = ref(0);
    const mailList = ref([]);
    const mailInfo = reactive({
        newMail: "",
        nowPage: 0,
        totalCount: 0,
        isLoading: false,
        noMore: false
    });

    const sendHeartbeat = async () => {
        while (true) {
            if (isLogin()) {
                let api = gConst.apiRoot + "/heartbeat-puzzle";
                let res = await fetchPostWithSign(api, {});
                let data = await res.json();
        
                if (data['status'] == 1) {
                    unreadAnnouncement.value = data.unread;
                    unreadMessage.value = data.new_message;
                } else {
                    defaultApiErrorAction(data);
                }
            }
            
            await sleep(60000);
        }
    }

    const showInbox = () => {
        resetMail();

        var inboxDialog = new Modal(document.getElementById("inbox"));
        inboxDialog.show();
    }

    const resetMail = () => {
        mailInfo.newMail = "";
        mailInfo.nowPage = 0;
        mailInfo.totalCount = 0;
        mailInfo.isLoading = false;
        mailInfo.noMore = false;
        mailList.value = [];
        reloadMail();
    }

    const reloadMail = async () => {
        mailInfo.isLoading = true;
        mailInfo.nowPage += 1;

        let api = gConst.apiRoot + "/get-mail";
        let res = await fetchPostWithSign(api, {
            page: mailInfo.nowPage
        });
        let data = await res.json();

        if (data["status"] == 1) {
            mailInfo.totalCount = data.total_count;
            if (data.messages) {
                for (let m of data.messages) {
                    m.formatedDate = formatTimestamp(m.create_time);
                    m.renderedHtml = marked(m.content);
                    mailList.value.push(m);
                }
            }

            if (mailList.value.length >= mailInfo.totalCount) {
                mailInfo.noMore = true;
            }
        } else {
            defaultApiErrorAction(data);
        }

        mailInfo.isLoading = false;
    }

    const sendMail = async () => {
        let api = gConst.apiRoot + "/send-mail";
        let res = await fetchPostWithSign(api, {
            content: mailInfo.newMail
        });

        let data = await res.json();

        if (data["status"] == 1) {
            gConst.globalBus.emit("message", {
                type: "success",
                message: "成功发送"
            });
            resetMail();
        } else {
            defaultApiErrorAction(data);
        }
    }

    return {
        unreadAnnouncement,
        unreadMessage,
        mailList,
        mailInfo,
        sendHeartbeat,
        showInbox,
        resetMail,
        reloadMail,
        sendMail
    }
}