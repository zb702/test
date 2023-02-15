// 建表
function createTables2(createTable) {
    //如果有数据库文件存在，删除掉旧的库文件  判读fs://tianrui_offline.db存在，删除、、
    //创建数据库
    var ret = db.openDatabaseSync({
        name: 'tianrui_offline',
        path: 'fs://tianrui_offline.db'
    });
    createlog = [];
    for (let i = 0; i < createTable.length; i++) {
        let sql = createTable[i];
        result = db.executeSqlSync({
            name: 'tianrui_offline',
            sql: sql
        });
        createlog.push({ sql, result });
    }
    console.log(JSON.stringify(createlog));
    //检查某个表所有数据
    //console.log(JSON.stringify(varselectSqlSync = select2('tr_voc_basic_report')));
}

/**
 * 增数据
 * @param {*} tableName  表名
 * @param {*} obj        对象{name：value,createtime:45151544}形式
 */
 var insertFailed = []
 function insert2(tableName, obj) {
     var maxid = ''
     if (!obj.createtime) {
         obj.createtime = parseInt(new Date().getTime() / 1000);
     }
     if (!obj.id) {
         maxid = maxId2(tableName);
         obj.id = Number(maxid) + 1;
     }
     if (1 != obj.is_upload) {
         obj.is_upload = 0
     }
     var keyStr = '';
     var valueStr = '';
     for (key in obj) {
         keyStr += (keyStr ? ',' : '') + key;
         if (typeof (obj[key]) === 'string') {
             valueStr += (valueStr ? ',' : '') + '\'' + obj[key] + '\'';
         } else {
             valueStr += (valueStr ? ',' : '') + obj[key];
         }
     }
     // console.log('INSERT INTO ' + tableName + '(' + keyStr + ') VALUES (' + valueStr + ');')
     // console.log(JSON.stringify(obj));
     var ret = db.executeSqlSync({
         name: 'tianrui_offline',
         sql: 'INSERT INTO ' + tableName + '(' + keyStr + ') VALUES (' + valueStr + ');'
     });
     // console.log(maxid);
     if (ret.status) {
         if (maxid >= 0) {
             return Number(maxid) + 1;
         }
     } else {
         console.log(JSON.stringify(ret))
         // alert("添加数据失败");
     }
 
 }

/**
 * 删除数据
 * @param {*} tableName 表名
 * @param {*} idArr     要删除的id 或id数组
 */
function dbdelete2(tableName, idArr) {
    var where = '';
    if (typeof idArr === 'string') {
        where = "id=" + idArr;
    } else {
        for (i in idArr) {
            where = (where ? where + "," : '') + idArr[i];
        }
        where = "id in(" + where + ")";
    }
    var result = db.executeSqlSync({
        name: 'tianrui_offline',
        sql: 'DELETE FROM ' + tableName + ' WHERE ' + where + ';'
    });
    return result
}

/**
 * 改 更新数据
 * @param {*} tableName     表名    
 * @param {*} obj           更新数据 
 * @param {*} where         更新的条件
 */
function update2(tableName, obj, where = {},isdownload = false) {
    if (!isdownload && getPrefs('candownload') == 1) {
        setPrefs('candownload',0)
    }
    var setkeyval = '';
    var whereStr = '';
    //set key1=value1,key2=value2
    for (key in obj) {
        value = obj[key];
        setkeyval += (setkeyval ? ',' : '') + key + '=\'' + value + '\'';
    }
    if (JSON.stringify(where) == '{}') {
        if (obj.id) {
            whereStr = 'id=' + obj.id;
        } else {
            alert("缺少更新条件"); return false;
        }
    } else {
        for (i in where) {
            whereStr = (whereStr ? whereStr + " AND " : '') + i + '=' +where[i];
        }
    }
    // console.log(JSON.stringify(obj));
    // console.log(whereStr);
    // console.log('UPDATE ' + tableName + ' SET ' + setkeyval + ' where ' + whereStr);
    result = db.executeSqlSync({
        name: 'tianrui_offline',
        sql: 'UPDATE ' + tableName + ' SET ' + setkeyval + ' where ' + whereStr
    });
    return result;
}

/**
 * 查  查询多条 返回二维数组
 * @param {*} tableName 表名
 * @param {*} where     查询条件
 * @param {*} page      页码
 * @param {*} limit     条数
 * @param {*} order     排序
 */
function select2(tableName, where = {}, page = 1, limit = 0, order = 'id desc') {
    var whereStr = '';
    var fenyeStr = '';
    var wherename = '';
    if (typeof where == 'object') {
        if (JSON.stringify(where) != '{}') {
            if (where.keyword && where.keyword != '') {
                whereStr = wherename + ' like "%' + where.keyword + '%"';
                delete where.keyword
            }

            for (i in where) {
                if (i != 'keyword') {
                    if (where[i] === null) {
                        whereStr = (whereStr ? whereStr + " AND " : '') + i + ' IS NULL' ;

                    } else {
                        whereStr = (whereStr ? whereStr + " AND " : '') + i + '=' + (typeof where[i] == 'string' ? '"' + where[i] + '"' : where[i]);

                    }

                }
            }

        }
    } else {
        whereStr = where
    }

    if (limit > 0) {
        //limit 0,10
        start = page * limit - limit;
        fenyeStr = ' limit ' + start + ',' + limit;
    }
    whereStr = whereStr ? ' where ' + whereStr : '';
    var ret = db.selectSqlSync({
        name: 'tianrui_offline',
        sql: 'SELECT * FROM ' + tableName + whereStr + ' order by ' + order + fenyeStr

    });
    // console.log('SELECT * FROM ' + tableName + whereStr + ' order by ' + order + fenyeStr);
    // console.log(JSON.stringify(ret));
    if (ret.status) {
        return ret.data;
    } else {
        // console.log('查询失败')
        // return false;
        alert("查询失败"); return null;
    }
}
/**
 * 
 * @param {string} tabaleName     表名 或者表名对应查询字段的对象 tablea | {tablea:'tablea.id,tablea.name'}
 * @param {object} withTableList   关联表信息  表名:[连表条件，查询字段]  {tableb:['tableb.id=tablea_id','tableb.name,tableb.number']}
 * @param {*} where 
 * @param {*} page 
 * @param {*} limit 
 * @param {*} order 
 */
function selectwith2(tableName = '', withTableList = {}, where = {}, page = 1, limit = 0, order = 'id desc') {
    //标准sql
    //sql = 'select a * from tablea as a inner join tableb as b on a.id=b.a_id';
    //首先 拼装from join
    var fieldList = '';
    var fromJoin = '', tableNameStr = '';
    if (typeof tableName == 'object') {
        tableNameStr = fromJoin = tableName[0];
        // fieldList = [];
        var arr = tableName[1].split(',')
        for (key in arr) {
            fieldList = (fieldList ? fieldList + "," : '') + tableNameStr + '.' + arr[key]
        }
    } else {
        tableNameStr = fromJoin = tableName;
        fieldList = tableName + '.*';
    }

    for (tmptable in withTableList) {
        item = withTableList[tmptable];
        fromJoin += ' left join ' + tmptable + ' ON ' + item[0];
        if (item[1]) {
            // fieldList += ',' + item[1];
            var arr = item[1].split(',')
            for (key in arr) {
                fieldList = (fieldList ? fieldList + "," : '') + tmptable + '.' + arr[key]
            }
        } else {
            fieldList += ',' + tmptable + '.*';
        }
    }
    var whereStr = '';
    var fenyeStr = '';
    var wherename = '';
    if (typeof where == 'object') {
        if (JSON.stringify(where) != '{}') {
            for (i in where) {
                whereStr = (whereStr ? whereStr + " AND " : '') + i + '=' + (typeof where[i] == 'string' ? '"' + where[i] + '"' : where[i]);
            }
        }
    } else {
        whereStr = where
    }

    if (limit > 0) {
        //limit 0,10
        start = page * limit - limit;
        fenyeStr = ' limit ' + start + ',' + limit;
    }
    whereStr = whereStr ? ' where ' + whereStr : '';
    var ret = db.selectSqlSync({
        name: 'tianrui_offline',
        sql: 'SELECT ' + fieldList + ' FROM ' + fromJoin + ' ' + whereStr + ' order by ' + tableNameStr + '.' + order + fenyeStr

    });
    // console.log('SELECT ' + fieldList + ' FROM ' + fromJoin + ' ' + whereStr + ' order by ' + tableNameStr + '.' + order + fenyeStr);
    // console.log(JSON.stringify(ret));
    if (ret.status) {
        return ret.data;
    } else {
        alert("查询失败"); return false;
    }

}
/**
 * 查询一条 返回对象
 * @param {string} tableName 表名
 * @param {object} where     查询条件
 * @param {number} page      页码
 * @param {number} limit     条数
 * @param {string} order     排序
 * @param {string} value     单个值的键名
 */
function find2(tableName, where = {}, page = 1, limit = 0, order = 'id desc', value = '') {
    if (typeof where !== 'object') {
        where = { id: where };
    }
    arr = select2(tableName, where, 1, 1);
    if (value) {
        return arr[0][value];
    }
    // console.log(JSON.stringify(arr[0]));
    return arr[0];
}

/**
 * 获取最大ID 
 * @param {*} tableName 
 */
function maxId2(tableName) {
    var maxid = ''
    var ret = db.selectSqlSync({
        name: 'tianrui_offline',
        sql: "SELECT MAx(id) as id FROM " + tableName
    });
    // console.log(JSON.stringify(ret));
    if (ret.status) {
        try {
            maxid = ret.data[0].id == "" ? 0 : ret.data[0].id;
        } catch(err) {
            maxid = 0;
        }
        return maxid;
    } else {
        return 0;
    }
}
/**
 * 删除表
 * @param {*} tableName 表名
 */
function dropTables2(tableName) {
    var ret = db.executeSqlSync({
        name: 'tianrui_offline',
        sql: 'DROP TABLE ' + tableName
    });
    console.log(JSON.stringify(ret));
}

/**
 * 执行原生查询或操作
 */
function query2(sql, type = 0) {
    // console.log(sql);
    if (type == 0) {
        var ret = db.selectSqlSync({
            name: 'tianrui_offline',
            sql: sql
        });
        if (ret.status) {
            return ret.data;
        } else {
            $app.toast('查询失败');
        }
    } else {
        var ret = db.executeSqlSync({
            name: 'tianrui_offline',
            sql: sql
        });
        if (ret.status) {
            return true;
        } else {
            return false;
        }
    }

}
/**
 * 下载表数据处理
 * @param {*} tableName     表名
 * @param {*} obj           数据
 */
function save2(tableName, obj,isdownload = false) {
    var res = query2("SELECT id FROM " + tableName + " where id=" + obj.id)
    // console.log(JSON.stringify(res));
    // console.log("SELECT id FROM " + tableName + " where id=" + obj.id);
    if (res && res[0]) {
        // 查询到说明本地已有，做更新
        update2(tableName, obj,{},isdownload)

    } else {
        //查询不到就要增加数据
        insert2(tableName, obj,isdownload)
    }
    if (obj.localimage != undefined) {
        var fs = api.require('fs');
        var ret = fs.existSync({
            path: obj.localimage
        });
        if (ret.exist) {
            // 存在
        } else {
            // 不存在则下载
            api.download({
                url: obj.image,
                savePath: obj.localimage
            }, function (ret, err) {

            })
        }
    }
    if (obj.point_localimage != undefined) {
        var fs = api.require('fs');
        var ret = fs.existSync({
            path: obj.point_localimage
        });
        if (ret.exist) {
            // 存在
        } else {
            // 不存在则下载
            api.download({
                url: obj.point_image,
                savePath: obj.point_localimage
            }, function (ret, err) {

            })
        }
    }
}
/**
 * 获取某个值总和 
 * @param {*} tableName 
 * @param {*} value           某个值
 */
 function maxValue2(tableName,value) {
    var maxValue = '';
    var ret = db.selectSqlSync({
        name: 'tianrui_offline',
        sql: "SELECT sum("+value+") FROM " + tableName
    });
    // console.log(JSON.stringify(ret.data[0]['sum(times)']));
    return ret.data[0]['sum(times)']
    // if (ret.status) {
    //     try {
    //         maxid = ret.data[0].id == "" ? 0 : ret.data[0].id;
    //     } catch(err) {
    //         maxid = 0;
    //     }
    //     return maxid;
    // } else {
    //     return 0;
    // }
}