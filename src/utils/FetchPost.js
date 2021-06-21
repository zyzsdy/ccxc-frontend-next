import hmacSha1 from 'crypto-js/hmac-sha1'
import encBase64 from 'crypto-js/enc-base64'
import gConst from '../globalconst'

function hmac_sha1(text, pass) {
    let encrypted = hmacSha1(text, pass);

    let res = encBase64.stringify(encrypted);
    return res;
}

export function fetchPost(url, data){
    let dataBody = JSON.stringify(data);
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: dataBody
    });
}

export function fetchPostWithSign(url, data) {
    let token = localStorage.getItem("token") || "";
    let ts = Date.now();
    let dataBody = JSON.stringify(data);

    let unsignedString = `token=${token}&ts=${ts}&bodyString=${dataBody}`;
    let sk = localStorage.getItem("sk") || "";
    let sign = hmac_sha1(unsignedString, sk);

    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "User-Token": token,
            "X-Auth-Token": `Ccxc-Auth ${ts} ${sign}`
        },
        body: dataBody
    });
}

export function defaultApiErrorAction(data) {
    if(data['status'] == 2){
        gConst.globalBus.emit("show-error", data['message']);
    }
    else if(data['status'] == 3){
        gConst.globalBus.emit("redirect-location", {
            message: data['message'],
            location: data['location']
        });
    }
    else if(data['status'] == 4){
        gConst.globalBus.emit("log-out", {
            type: "error",
            message: data['message']
        });
    }
    else if(data['status'] == 13){
        gConst.globalBus.emit("log-out", {
            message: data['message'],
            type: "success"
        });
    }
}