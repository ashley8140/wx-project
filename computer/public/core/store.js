var Utils = require('./utils.js');
var Deferred = require('./deferred.js');
var Cache = require('./cache.js');

var CacheGroupTemp = {};

var GetCacheClient = function(cacheConfig){
    var group = cacheConfig.group || 'ajax';

    var client = CacheGroupTemp[group];
    if(client)  return client;
    return CacheGroupTemp[group] = new Cache(group, cacheConfig.maxSize, cacheConfig.expired);
}


var Store = function(url, postData, config){
    var configType = Utils.type(config);
    var method = ((configType === 'string' ? config : configType === 'object' ? config.method : '') || 'get').toUpperCase();
    var cacheKey = url;
    var cacheData, headers = {};

    if(configType !== 'object'){
        config = {};
    }

    if( method === 'GET' && config.cache ){
        cacheKey += Utils.objToParams(postData, true);
        cacheData = GetCacheClient(config.cache).get(cacheKey);
        if(cacheData){
            return Deferred().resolve(cacheData);
        }
    }

    postData = postData || {};

    if( method === 'POST'){
        headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
    }

    return Deferred(function(def){
        wx.request({
            url: url,
            header: headers,
            data: postData,
            method: method,
            success: function(data){
                var json = data.data;
                if(json.success){
                    if(Utils.type(config.dataFilter) === 'function' ){
                        json = config.dataFilter(json);
                    }
                    //缓存
                    if(method === 'GET' && config.cache){
                        GetCacheClient(config.cache).set(cacheKey, json);
                    }
                    def.resolve(json);
                }
            },
            fail: function(reason){

            }
        })
    })
};

module.exports = Store;