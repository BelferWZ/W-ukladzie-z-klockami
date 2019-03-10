function createUrl() {
    let msg = '';

    for (let s of Global.segments) {
        if (s instanceof Index == false) {
            let val = Global.urlCodes[Global.colors.indexOf(s.fill)];
            msg += val;
        }
    }
    msg = compressStr(msg);
    msg = `localhost:5500/?save=${msg}`;
    // msg = `https://mzmix.github.io/projects/wuzk/?save=${msg}`;

    copyUrl(msg);
    print(msg);
}

function compressStr(str) {
    let compressedStr = '';

    for (let i = 0; i < str.length; i++) {

        let letter = str[i];
        let charRepeat = 1;

        while (str[i + 1] === letter) {
            charRepeat++;
            i++;
        }
        compressedStr += charRepeat + letter;
    }

    if (compressedStr.length > str.length) return str;
    return compressedStr;
}

function copyUrl(text) {
    let holder = document.createElement("input");
    document.body.appendChild(holder);
    holder.setAttribute('value', text);
    holder.select();

    document.execCommand("copy");
    document.body.removeChild(holder);

    alert('Link skopiowany do schowka!');
}