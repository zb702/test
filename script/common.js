var HOST_DOMAIN = {
    dev:"http://139.224.70.109:66/api/",
    test:"http://139.224.70.109:66/api/",
    prod:"http://pfladmin.skyray-ldaryun.com/api/",
};
var apideubg = false;//是否开启调试模式(打印强求响应参数)true|false
var UILoading;
var ENV = "prod";  // dev 开发  test  测试  prod  生产
var HOST = HOST_DOMAIN[ENV];
var token;
(function (w) {
    var a = {};
    a.showProgress = function (title, text) {
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: title || '网络请求中',
            text: text || '请稍后..',
            modal: false
        });
    };

    a.hideProgress = function () {
        api.hideProgress();
    };
    a.toast = function (msg) {
        api.toast({
            msg: msg,
            duration: 2000,
            location: 'middle',
            global: false
        });
    };
    a.addEventListener = function (name, callback) {
        api.addEventListener({
            name: name
        }, function (ret, err) {
            if (typeof callback !== "undefined") {
                callback(ret)
            }
        });

    };
    a.sendEvent = function (name, extra) {
        api.sendEvent({
            name: name,
            extra: extra
        });

    };
    //检测登录
    // a.checkLogin = function () {
    //     var token = getPrefs('token');
    //     if (!token) {
    //         return $app.openWin('win-login_login',
    //             { title: '登录', frameName: 'login', url: './login/login.html', bounces: false },
    //             { url: 'widget://html/win-login.html' })
    //     }

    // }
    a.openWin = function (winName, pageParam, otherParam) {
        var param = {
            name: winName,
            url: winName + '.html',
            pageParam: pageParam,
            useWKWebView: true,
            hScrollBarEnabled: false,
            slidBackType: 'edge',
            allowEdit: true,
            slidBackEnabled: true,
            softInputMode: 'resize',
            delay: 300,
            softInputDismissMode: ['tap', 'drag']
        };
        Object.assign(param, otherParam || {});
        api.openWin(param);
    };
    w.$app = a;
})(window)
/**
 * 示例代码 封装的公共请求  仅做示例，没有引用jquery请自行更改
 * @param api       接口
 * @param params    参数
 * @param callback  回调方法
 * @param method    请求方法    get|post|put|delete
 * @param headers   头部      {'Access-Token':$.cookie('access_token')}
 */
function apiRequest(apiUrl, params, callback, method = 'post', headers = {}) {
    //方式一、写在请求前  在封装的请求方法中【推荐】
    api.showProgress()
    let url = HOST + apiUrl;//域名最好设置为配置项
    if (apideubg == true) api_debug(url, Object.assign(params, headers));
    api.ajax({
        headers: headers,
        method: method,
        url: url,
        data: {
            values: params
        }
    }, function (ret, err) {
        api.hideProgress()
        // console.log('请求返回数据'+JSON.stringify(ret)+'--'+JSON.stringify(err))
        if (ret) {
            //方式二、不写在请求前，写到返回中
            if (apideubg == true) api_debug(url, Object.assign(params, headers));
            callback(ret);
        } else {
            if (apideubg == true) api_debug(url, Object.assign(params, headers), err);
            callback(err);
        }
    });
}
/**
 * @说明     公共打印接口参数方法
 * @用途     1、前端审查提交参数是否正常  2、规范化发送接口异常信息给后端用于后端调试
 * @param   url         sting  接口地址
 * @param   params      object 参数
 * @param   errormsg    object|string 错误信息
 */
function api_debug(url = '', params = {}, errormsg = null) {
    if (url == '') return false;
    console.log('------------------------start------------------');
    console.log('接口地址:' + url);
    if (JSON.stringify(params) !== '{}') {
        console.log('请求参数:');
        for (field in params) {
            console.log(field + ':' + params[field]);
        }
    }
    if (errormsg !== null) {
        console.log('错误信息:');
        if (typeof errormsg == 'string') {
            try {
                $("body").append('<p id="api_debug_errormsg" style="display: none;"></p>');//模拟将html格式
                $("#api_debug_errormsg").html(errormsg);
                console.log($("#api_debug_errormsg").text());
            } catch (e) {
                console.log(errormsg);
            }
        } else {
            console.log(JSON.stringify(errormsg));
        }
    }
    console.log('------------------------end--------------------');
}
function $ajax(url, obj, callbackfun, fileObj) {
    api.ajax({
        url: HOST + url,
        timeout: 10,
        method: 'POST',
        data: {
            values: obj,
            files: fileObj
        },
    }, function (ret, err) {
        api.hideProgress()
        callbackfun(ret, err)
    })
}
// 存储数据
function setPrefs(key, value) {
    api.setPrefs({
        key: key,
        value: value
    });
}
// 读取存储
function getPrefs(key) {
    var value = api.getPrefs({
        sync: true,
        key: key
    });
    if (key == 'userInfo') {
        return JSON.parse(value)
    }
    return value
}
// 移除存储
function removePrefs(key) {
    api.removePrefs({
        key: key
    });
}
function line() {
    var online = api.connectionType;
    if (online == 'none') {
        // 无网
        return false
    } else {
        // 有网
        return true
    }
}
function showprogress(title, text) {
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: title || '网络请求中',
        text: text || '请稍后..',
        modal: false
    });
}
function dialogBoxFn(list, callback) {
    var dialogBox = api.require('dialogBox');
    dialogBox.scene({
        rect: {
            w: 600,
            h: 100 + 44 * list.length
        },
        texts: {
            title: '项目名称',
            content: '',
            okBtnTitle: '确定'
        },
        styles: {
            bg: '#fff',
            corner: 10,
            title: {
                bg: '#fff',
                h: 44,
                size: 18,
                color: '#000'
            },
            sceneImg: {
                h: 1,
                path: ''
            },
            content: {
                color: '#fff',
                size: 12
            },
            cell: {
                bg: '#fff',
                h: 48,
                text: {
                    color: '#333',
                    size: 13,
                    selectedColor: '#369AFB',
                },
                icon: {
                    marginL: 15,
                    marginT: 9,
                    w: 30,
                    h: 30,
                    corner: 2
                },
                lineColor: '#F5F7FB'
            },
            ok: {
                bg: '#0081FF',
                titleColor: '#fff',
                h: 44
            }
        },
        optionDatas: list
    }, function (ret, err) {
        callback(ret, err)
    });
}
function dialogBoxList(callback) {
    var dialogBox = api.require('dialogBox');
    dialogBox.list({
        tapClose: true,
        texts: {
            title: '检测记录',
            enter: '确定'
        },
        listTitles: ['样品名称', '检测部位', '检测次数', '检测时间'],
        styles: {
            bg: '#fff',
            corner: 10,
            w: 400,
            h: 350,
            title: {
                h: 44,
                size: 16,
                color: '#000'
            },
            list: {
                h: 220,
                row: 4,
                title: {
                    marginL: 20,
                    size: 14,
                    color: '#000'
                },
                content: {
                    marginL: 20,
                    size: 14,
                    color: '#000'
                }
            },
            dividingLine: {
                width: 1,
                color: '#F5F7FB'
            },
            enter: {
                w: 360,
                h: 44,
                bg: '#369AFB',
                color: '#fff',
                size: 14,
                corner: 10
            }
        }
    }, function (ret) {
        callback(ret)
        if (ret.eventType == 'enter') {
            var dialogBox = api.require('dialogBox');
            dialogBox.close({
                dialogName: 'list'
            });
        }
    });
}
//格式化时间戳
function formatDate(timestamp, format = null) {
    if (timestamp > 0) {
        timestamp = (tmplenth = (timestamp.toString()).length) < 13 ? (timestamp.toString()) + (new Array(13 - tmplenth + 1).join("0")) : timestamp;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    } else {
        timestamp = (new Date()).getTime();
    }
    var biaozhunFormat = 'Y-m-d H:i:s';
    if (format && format.length == 1) {
        zidingyiFormat = ((xiabiao = biaozhunFormat.indexOf(format)) != -1) ? biaozhunFormat.substr(0, xiabiao + 1) : biaozhunFormat;
    } else if (format != null) {
        zidingyiFormat = format;
    } else {
        zidingyiFormat = biaozhunFormat;
    }
    var date = new Date(parseInt(timestamp));
    year = (zidingyiFormat.indexOf('Y') != -1) ? date.getFullYear() : '';
    Yyear = (zidingyiFormat.indexOf('y') != -1) ? (date.getFullYear().toString()).slice(-2) : '';
    year = (zidingyiFormat.indexOf('Y') != -1) ? date.getFullYear() : '';
    Mmonth = (zidingyiFormat.indexOf('m') != -1) ? ("0" + (date.getMonth() + 1)).slice(-2) : '';
    Nmonth = (zidingyiFormat.indexOf('n') != -1) ? date.getMonth() + 1 : '';
    Ddate = (zidingyiFormat.indexOf('d') != -1) ? ("0" + date.getDate()).slice(-2) : '';
    Jdate = (zidingyiFormat.indexOf('j') != -1) ? date.getDate() : '';
    hour = (zidingyiFormat.indexOf('H') != -1) ? ("0" + date.getHours()).slice(-2) : '';
    minute = (zidingyiFormat.indexOf('i') != -1) ? ("0" + date.getMinutes()).slice(-2) : '';
    second = (zidingyiFormat.indexOf('s') != -1) ? ("0" + date.getSeconds()).slice(-2) : '';
    // 拼接
    var result = zidingyiFormat.replace('Y', year).replace('y', Yyear).replace('m', Mmonth).replace('n', Nmonth).replace('d', Ddate).replace('j', Jdate).replace('H', hour).replace('i', minute).replace('s', second);
    return result;
}
function compare(property) {
    return function (a, b) {
        var m = a[property];
        var n = b[property];
        return m - n;
    }
}
// 16进制转ascii码
function hexCharCodeToStr(hexCharCodeStr) {
    // if(hexCharCodeStr.indexOf("Read_Data:") == -1){
    //     return;
    // }
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) {
        alert("存在非法字符!");
        return "";
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
        curCharCode = parseInt(rawStr.substr(i, 2), 16);
        resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
}
/**
 *Pid过滤器，传入字符串或对象，过滤出来pid字符串 
*/
function filterPid(msgStr) {
    // if((msgStr.indexOf(":") != -1 )&&(msgStr.indexOf(",") != -1)){
    //     var substr = msgStr.match(/:(\S*),0/);
    //     console.log('数据'+substr)
    //     var needcode = substr[1];
    //     console.log('截取数据'+needcode)
    //     if(needcode>=10000){
    //         return needcode
    //     }else{
    //         return false
    //     }
    // }else{
    //     return false
    // }
    
    // if(typeof strData=='string'){
    //     strData=JSON.parse(strData);
    // }
    // if(!strData.value.msg){return false;}
    // msgStr = strData.value.msg;

    if (msgStr.indexOf('Read_Data:') !== 0) return false;
    msgStr = msgStr.replace('Read_Data:', '');
    msgArr = msgStr.split(',');
    if (msgArr.length != 3) return false;
    var result = true;
    for (num in msgArr) {
        if (parseInt(msgArr[num]).toString().length !== msgArr[num].length) {
            result = false;
        }
    }
    if (result == true) {
        return msgArr[0];
    } else {
        return false;
    }
}
/**
 * 必传参数验证方法
 * @param {*} requiredlist 必传参数对象 {name:"名称"}
 * @param {*} obj          获取的对象   {name:'152',type:1} 
 */
function required(requiredlist, obj) {
    for (field in requiredlist) {
        if (obj[field] == '') {
            console.log(requiredlist[field])
            $app.toast(requiredlist[field]);
            return false;
        }
    }
    return true;
}
function getAverage(arr) {
    var sum = 0
    for (let i = 0; i < arr.length; i++) {
        sum += Number(arr[i])
    }
    var average = (sum / arr.length).toFixed(1)
    return average
}
/**
 * 加密数据 获取带有request_token的对象
 * @param object params 数据对象
 * @return object  返回新对象
 */
//获取请求token
function getRequestToken(params) {
    /**具体处理方法**/
    //1、参数排序
    params = JsonSort(params);
    delete(params.request_token);//删掉request_token,使demo可以重复步骤1、2
    //2、参数序列化
    let jsonstr = JSON.stringify(params);
    //3、序列化后必须拼上仪器编号 加密
    let mergeStr = jsonstr+ get_instrument_code();
    params.request_token = md5(mergeStr);
    console.log('参数'+JSON.stringify(params))
    return params;
}
/**
  * 将json数据进行排序
  * @param {*jason} data
  */
 function JsonSort(jsonData) {
    try {
      let tempJsonObj = {};
      let sdic = Object.keys(jsonData).sort();
      sdic.map((item, index)=>{
        tempJsonObj[item] = jsonData[sdic[index]]
      })
      return tempJsonObj;
    } catch(e) {
      return jsonData;
    }
  }
/**
 *  获取缓存文件中的仪器编号
 * @returns string 仪器编号
 */
function get_instrument_code() {
    let inf = api.readFile({
        sync: true,
        path: 'fs://instrumentInformation.txt'
    });
    let infData = JSON.parse(inf);
    return infData.code;
}
//获取东八区时间  Beijing East 8th District Time
function getBJDistrictTime(){
    var timezone = 8; //目标时区时间，东八区   东时区正数 西市区负数
    var offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
    var nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    var targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var nowTime=targetDate.getFullYear() + "-" + parseInt(targetDate.getMonth() + 1)  + "-" + targetDate.getDate()+" "+targetDate.getHours()+":"+targetDate.getMinutes()+":"+targetDate.getSeconds();

}