export function RandomString(length = 8) {
    let charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charNum = charList.length;
    let n = "";
    for (let i = 0; i < length; i++) {
        n += charList.charAt(Math.floor(Math.random() * charNum));
    }

    return n;
}