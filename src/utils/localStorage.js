
export function isObjEqual(o1, o2) {
    let props1 = Object.getOwnPropertyNames(o1);
    let props2 = Object.getOwnPropertyNames(o2);
    if (props1.length !== props2.length) {
        return false;
    }
    for (let i = 0, max = props1.length; i < max; i++) {
        let propName = props1[i];
        if (o1[propName] !== o2[propName]) {
            return false;
        }
    }
    return true;
}

export function formatDate(time, format) {
    let o = {
        "M+": time.getMonth() + 1,                 //月份
        "d+": time.getDate(),                    //日
        "h+": time.getHours(),                   //小时
        "m+": time.getMinutes(),                 //分
        "s+": time.getSeconds(),                 //秒
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度
        "S": time.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return format;
}

