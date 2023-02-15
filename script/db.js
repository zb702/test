// 建表
function createTables(createTable) {
    createlog = [];
    for (var i = 0; i < createTable.length; i++) {
        sql = createTable[i];
        result = db.executeSqlSync({
            name: 'tianrui',
            sql: sql
        });
        createlog.push({
            "sql": sql,
            "result": result
        });
    }
    console.log(JSON.stringify(createlog));
}

/**
 * 增数据
 * @param {*} tableName  表名
 * @param {*} obj        对象{name：value,createtime:45151544}形式
 */
var insertFailed = []
function insert(tableName, obj,isdownload) {
    isdownload = isdownload || false;
    if (!isdownload && getPrefs('candownload') == 1) {
        setPrefs('candownload',0)
    }
    var maxid = ''
    if (!obj.createtime) {
        obj.createtime = parseInt(new Date().getTime() / 1000);
    }
    if (!obj.id) {
        maxid = maxId(tableName);
        // console.log(maxid);
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
        name: 'tianrui',
        sql: 'INSERT INTO ' + tableName + '(' + keyStr + ') VALUES (' + valueStr + ');'
    });
    // console.log(JSON.stringify(ret));
    // console.log(maxid);
    if (ret.status) {
        if (maxid >= 0) {
            return Number(maxid) + 1;
        }
    } else {
        insertFailed.push({
            tableName: obj
        })
        console.log(JSON.stringify(ret))
        // alert("添加数据失败");
    }

}

/**
 * 删除数据
 * @param {*} tableName 表名
 * @param {*} idArr     要删除的id 或id数组
 */
function dbdelete(tableName, idArr) {
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
        name: 'tianrui',
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
function update(tableName, obj, where,isdownload) {
    where = where = {} || {} 
    isdownload = isdownload || false;
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
        name: 'tianrui',
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
function select(tableName, where, page, limit, order) {
    where = where || {};
    page = page || 1;
    limit = limit || 0;
    order = order || 'id desc';
    var whereStr = '';
    var fenyeStr = '';
    var wherename = '';
    if (typeof where == 'object') {
        if (JSON.stringify(where) != '{}') {
            if (where.keyword && where.keyword != '') {
                // if (tableName == 'tr_tenant_enterprise') {
                //     wherename = 'enterprise_name'
                // }
                // if (tableName == 'tr_tenant_enterprise_device') {
                //     wherename = 'device_name'
                // }
                // if (tableName == 'tr_tenant_device_region') {
                //     wherename = 'region_name'
                // }
                // if (tableName == 'tr_tenant_region_equipment') {
                //     wherename = 'equipment_name'
                // }
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
        name: 'tianrui',
        sql: 'SELECT * FROM ' + tableName + whereStr + ' order by ' + order + fenyeStr

    });
    // console.log('SELECT * FROM ' + tableName + whereStr + ' order by ' + order + fenyeStr);
    // console.log(JSON.stringify(ret));
    if (ret.status) {
        return ret.data;
    } else {
        alert("查询失败"); return false;
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
function selectwith(tableName, withTableList, where, page, limit, order) {
    tableName = tableName || '';
    withTableList = withTableList || {};
    where = where || {};
    page = page || 1;
    limit = limit || 0;
    order = order || 'id desc';
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
        fromJoin += ',' + tmptable + ' ON ' + item[0];
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
        name: 'tianrui',
        sql: 'SELECT ' + fieldList + ' FROM ' + fromJoin + ' ' + whereStr + ' order by ' + tableNameStr + '.' + order + fenyeStr

    });
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
function find(tableName, where, page, limit, order, value) {
    where = where || {};
    page = page || 1;
    limit = limit || 0;
    order = order || 'id desc';
    value = value || '';
    if (typeof where !== 'object') {
        where = { id: where };
    }
    arr = select(tableName, where, 1, 1);
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
function maxId(tableName) {
    var maxid = ''
    var ret = db.selectSqlSync({
        name: 'tianrui',
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
function dropTables(tableName) {
    var ret = db.executeSqlSync({
        name: 'tianrui',
        sql: 'DROP TABLE ' + tableName
    });
    console.log(JSON.stringify(ret));
}

/**
 * 执行原生查询或操作
 */
function query(sql, type) {
    type = type || 0
    if (type == 0) {
        var ret = db.selectSqlSync({
            name: 'tianrui',
            sql: sql
        });
        if (ret.status) {
            return ret.data;
        } else {
            $app.toast('查询失败');
        }
    } else {
        var ret = db.executeSqlSync({
            name: 'tianrui',
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
function save(tableName, obj,isdownload) {
    isdownload = isdownload || false;
    // console.log(isdownload);
    var res = query("SELECT id FROM " + tableName + " where id=" + obj.id)
    // console.log(JSON.stringify(res));
    // console.log("SELECT id FROM " + tableName + " where id=" + obj.id);
    if (res && res[0]) {
        // 查询到说明本地已有，做更新
        update(tableName, obj,{},isdownload)
    } else {
        //查询不到就要增加数据
        insert(tableName, obj,isdownload)
    }
    // console.log(JSON.stringify(obj))
    // if(tableName == 'tr_tenant_enterprise_photograph'){
    //     // api.sendEvent({
    //     //     name:'refresh'
    //     // })
    //     // console.log(JSON.stringify(obj))
    // }
    console.log(JSON.stringify(obj))
    if (obj.point_localimage != undefined && obj.point_localimage != "") {
        var fs = api.require('fs');
        var ret = fs.existSync({
            path: obj.point_localimage
        });
        // console.log(JSON.stringify(ret))
        if (ret && ret.exist) {
            // 存在
        } else {
            // 不存在则下载
            api.download({
                url: obj.point_image,
                savePath: 'fs://pointpic/' + obj.point_localimage.split('pointpic/')[1],
                report: true,
                cache: true,
                allowResume: true
            }, function(ret, err) {
                console.log(JSON.stringify(ret))
                if (ret.state == 1) {
                    //下载成功
                } else {
    
                }
            });
        }
    }
}