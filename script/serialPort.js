var clientId = '';
/**
 * 往串口发送指令
 * @param {*} value   要发送的指令 点火1 点火2
 */
function sendData(address, value, callback) {
    var orderList = {
        'fireOn1': '5a1b2001af0005000a0010278813e8038813881300000000000073',//点火1
        'fireOn2': '5a1b2001af0005000a0010278813e8038813881300000000010075',//点火2
        'fireOff': '5a1b2000af0005000a0010278813e80388138813000000000000b3',//关火
        'setCommond1_0': '5a05040044',//设置1 微电流大于6500
        'setCommond1_3': '5a05040347',//设置1 微电流小于6000
        'setCommond2_10': '5a0b0c00010750c30a004d',//设置2 微电流大于200
        'setCommond2_50': '5a0b0c00010750c332009d',//设置2 微电流小于200
        'setCommond3': '5a091e019600640014',//设置3 去掉头尾数组命令
        'setCommond4': '5a19240000000000b80b00000000000048f4ffffffffffff',//设置4 氢气压力补偿设置命令
        'readCommond': '5a042541',//读数据
    };
    var orderVal = orderList[value];
    serialPort.send(orderVal);
}
/**
 * 两个字节转换成一个整数
 * 参数传入时，字节索引大的在前
 * @param {*} b1  
 * @param {*} b0 
 */
function BytesTwo(b1, b0) {
    var bb1 = parseInt(b1, 2)
    var bb0 = parseInt(b0, 2)
    if (bb1 < 0) {
        bb1 += 256;
    }
    if (bb0 < 0) {
        bb0 += 256;
    }
    return 0xFFFF & ((bb1 << 8) | bb0);
}
/**
 * 四个字节转换成一个整数
 * 参数传入时，字节索引大的在前
 * @param {*} b3 
 * @param {*} b2 
 * @param {*} b1 
 * @param {*} b0 
 */
function BytesFour(b3, b2, b1, b0) {
    var bb3 = parseInt(b3, 2)
    var bb2 = parseInt(b2, 2)
    var bb1 = parseInt(b1, 2)
    var bb0 = parseInt(b0, 2)
    if (bb3 < 0) {
        bb3 += 256;
    }
    if (bb2 < 0) {
        bb2 += 256;
    }
    if (bb1 < 0) {
        bb1 += 256;
    }
    if (bb0 < 0) {
        bb0 += 256;
    }
    return parseInt((0x00FFFFFFFF & ((bb3 << 24) | (bb2 << 16) | (bb1 << 8) | bb0)));

}

/**
 * 电池电量百分比转换
 * @param {*} battery 
 */
function getBatteryPercent(battery) {
    var min = 6.1
    var max = 8.2
    if (battery > max) {
        return 100;
    } else if (battery < min) {
        return 0;
    } else {
        var k = parseFloat(100 / (max - min));
        var b = parseFloat(0 - min * k);
        return k * battery + b;
    }

}
/**
 * 16进制转2进制
 * @param {*} str 
 */
function hex_to_bin(str) {
    var value = parseInt(str, 16)
    return value.toString(2)
}
// 10进制转16进制
function dec_to_hex(str) {
    return str.toString(16).padStart(2, 0)
}

//切割字符串
function count(source, count) {
    var arr = [];
    for (var i = 0, len = source.length / count; i < len; i++) {
        var subStr = source.substr(0, count);
        arr.push(subStr);
        source = source.replace(subStr, "");
    }
    return arr;
}

//按照位数切割数组
function SplitArray(N, Q) {
    var R = [],
        F;
    for (F = 0; F < Q.length;) R.push(Q.slice(F, F += N))
    return R
}

//16进制转10进制
function change_ten(sixteen) {
    var ten = '';
    ten = parseInt(sixteen, 16);
    return ten;
    //使用字符串转换为整数的方法实现进制转换
}


//16进制转字符串
function HexToAscll(str) {
    var hexA = '';
    var pos = 0;
    var len = str.length / 2;
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        hexA += String.fromCharCode(`0x${s}`);
        pos += 2;
    }
    return hexA;
}

//16进制转bcd
function changeBcd(num) {
    var num_one = [];
    var bcd_value = '';
    var num_one = func(num, 1);
    var corres_arrey = {
        '0': '0000',
        '1': '0001',
        '2': '0010',
        '3': '0011',
        '4': '0100',
        '5': '0101',
        '6': '0110',
        '7': '0111',
        '8': '1000',
        '9': '1001',
        'A': '1010',
        'B': '1011',
        'C': '1100',
        'D': '1101',
        'E': '1110',
        'F': '1111',
        'a': '1010',
        'b': '1011',
        'c': '1100',
        'd': '1101',
        'e': '1110',
        'f': '1111'
    }
    for (var i = 0; i < num_one.length; i++) {
        var bits = corres_arrey[num_one[0]] + corres_arrey[num_one[i]]
    }
    return bits
}
var vocStatus = {
    /**
     * 出口氢气压力
     */
    AirPressure: '',

    /**
     * 电池电压
     */
    BatteryVoltage: '',

    /**
     * 电池电量百分比
     */
    BatteryPercent: '',

    /**
     * 燃烧室温度
     */
    ChamberOuterTemp: '',

    FIDRange: '',

    /**
     * 火焰状态
     */
    IsIgnited: '',

    /**
     * 泵是否打开
     */
    IsPumpAOn: '',

    /**
     * 点火器A 状态
     */
    IsSolenoidAOn: '',

    IsSolenoidBOn: '',

    LongAveragePpm: '',

    /**
     * 微电流
     */
    PicoAmps: '',

    /**
     * 当前ppm
     */
    Ppm: '',

    PpmStr: '',

    /**
     * 泵功率
     */
    PumpPower: '',

    RawPpm: '',

    /**
     * 排出压力
     */
    SamplePressure: '',

    ShortAveragePpm: '',

    /**
     * 系统电流
     */
    SystemCurrent: '',

    /**
     * 氢气压力
     */
    TankPressure: '',
    /**
     * 氢气压力百分比
     */
    TankPressurePercent: '',
    /**
     * 热电耦温度
     */
    ThermoCouple: '',

    Timestamp: '',

    UseAverage: '',
}
/**
 * 火焰温度
 * @param kelvin
 * @return
 */
function ConvertKelvinToFahrenheit(kelvin) {
    return Math.round((((kelvin - 273.15) * 2.5) + 32));//1.8f 2.3f
}
/**
 * 燃烧室温度
 * @param kelvin
 * @return
 */
function ConvertKelvinToFahrenheit1(kelvin) {
    return Math.round((((kelvin - 273.15) * 1.6) + 32));
}
/**
 * 电池电量百分比
 * @param battery
 * @return
 */
function getBatteryPercent(battery) {
    var min = 6.1;
    var max = 8.2;
    if (battery > max) {
        return 100;
    } else if (battery < min) {
        return 0;
    } else {
        var k = (100 / (max - min));
        var b = 0 - min * k;
        return k * battery + b;
    }
}
/**
 * 氢气量百分比
 * @param TankPressure
 * @return
 */
function getTankPressurePercent(TankPressure) {
    var min = 30;
    var max = 2200;
    if (TankPressure > max) {
        return 100;
    } else if (TankPressure < min) {
        return 0;
    } else {
        var k = (100 / (max - min));
        var b = 0 - min * k;
        return k * TankPressure + b;
    }
}

function dataHandle(data) {
    if (data != null && data.length > 38) {
        if (data[2] == '100101') {
            var num = 0.1 * BytesFour(data[35], data[34], data[33], data[32]);
            if (num >= 100.0) {
                num = parseInt(num);
            }
            if (num < 0.0) {
                num = 0.0;
            }
            if (num == 0.0) {
                this.num0s++;
                if (this.num0s > 5) {
                    this.num0s = -5;
                }
                if (this.num0s < 0) {
                    num = 0.1;
                }
            }

            vocStatus.IsPumpAOn = (data[4] & 1) > 0;
            vocStatus.AirPressure = ((BytesTwo(data[16], data[15])) * 0.01).toFixed(2);
            vocStatus.BatteryVoltage = ((BytesTwo(data[10], data[9])) * 0.001).toFixed(3);
            vocStatus.BatteryPercent = (getBatteryPercent((BytesTwo(data[10], data[9])) * 0.001)).toFixed(2) + '%'
            vocStatus.ChamberOuterTemp = (ConvertKelvinToFahrenheit1((BytesTwo(data[12], data[11])) * 0.1)).toFixed(2)
            vocStatus.RawPpm = num;
            vocStatus.SamplePressure = ((BytesTwo(data[14], data[13])) * 0.01).toFixed(2);
            vocStatus.TankPressure = (1.0 * BytesTwo(data[18], data[17])).toFixed(1);
            vocStatus.TankPressurePercent = (getTankPressurePercent(BytesTwo(data[18], data[17]))).toFixed(2) + '%'
            vocStatus.ThermoCouple = (ConvertKelvinToFahrenheit((BytesTwo(data[8], data[7])) * 0.1)).toFixed(2);
            vocStatus.PicoAmps = ((BytesFour(data[27], data[26], data[25], data[24])) * 0.1).toFixed(2);
            vocStatus.SystemCurrent = (BytesTwo(data[37], data[36])).toFixed(2);
            vocStatus.PumpPower = (parseInt(data[38], 2)).toFixed(1);
            vocStatus.IsSolenoidAOn = (data[4] & 4) > 0;
            vocStatus.IsSolenoidBOn = (data[4] & 8) > 0;
            vocStatus.FIDRange = parseInt(data[19], 2);
            // console.log(JSON.stringify(vocStatus));

            // var flag = this.CheckIfIgnited(vocStatus);
            // if (flag != this.prevIgnite) {
            //     this.ignitedChagedCount++;
            //     if (this.ignitedChagedCount >= 3) {
            //         this.prevIgnite = flag;
            //     }
            // } else {
            //     this.ignitedChagedCount = 0;
            // }
            return vocStatus;
        }
    }
}


// 本地校准信息处理
function historyJZhandle(currentJZ) {
    var historyJZ = getPrefs('historyJZ') ? JSON.parse(getPrefs('historyJZ')) : [];
    if (historyJZ.length == 0) {
        historyJZ = currentJZ
    }
    for (let i = 0; i < historyJZ.length; i++) {

    }
}

// 计算kb值
function calculateKB(_CalibrationInfos) {
    // 升序排列
    _CalibrationInfos.sort(compare('standard_value'));
    for (i = 0; i < _CalibrationInfos.length - 1; i++) {
        var m = _CalibrationInfos[i + 1].signal_value - _CalibrationInfos[i].signal_value;
        if (m != 0) {
            var k = (_CalibrationInfos[i + 1].standard_value - _CalibrationInfos[i].standard_value) / m;
            var b = _CalibrationInfos[i].standard_value - _CalibrationInfos[i].signal_value * k;
            _CalibrationInfos[i].k_value = k;
            _CalibrationInfos[i].b_value = b;
        } else {
            _CalibrationInfos[i].k_value = 1;
            _CalibrationInfos[i].b_value = 0;
        }
    }
}


function getValueBySignal(historyJZ, signal) {
    signal = Number(signal)
    result = signal;
    if (historyJZ != null) {
        if (historyJZ.length < 2) {
            return 0;
        }
        var index = -1;
        for (i = 0; i < historyJZ.length - 1; i++) {
            if (Number(historyJZ[i + 1].signal_value) >= signal) {
                index = i;
                break;
            }
        }
        if (index == -1) {
            index = historyJZ.length - 2;
        }

        result = (signal * Number(historyJZ[index].k_value) + Number(historyJZ[index].b_value));
        // 改变响应因子 
        // if (_Factor != null) {
        //     result = result * _Factor.getCoefficient();
        // }
    }

    if (result < 0) {
        result = 0;
    }

    return result;
}