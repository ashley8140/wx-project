var App = getApp();

var core = App.core;
var Utils = core.Utils;
var Store = core.Store;
var Deferred = core.Deferred;

var getConfig = function (id) {
    return Store('http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/data/configData.json', {
        computerId: id
    }).then(function (json, isSuccess) {
        return Deferred().resolve(json.data);
    })
}
Page({
    data: {
        heightStyle: ''
    },
    onLoad: function (searchObj) {
        var that = this;
        var computerId = searchObj.computerId;
        var systemInfo = wx.getSystemInfoSync();
        var heightStyle = 'height:' + systemInfo.windowHeight + 'px';

        getConfig(computerId).then(function (data) {
            that.setData({
                params: searchObj,
                configList: data.lists,
                heightStyle: heightStyle,
            })
        });
        wx.hideToast();
        wx.setNavigationBarTitle({
            title: searchObj.computerName
        });
    },
    onScroll: function (e) {},
    onShareAppMessage: function () {
        return {
            title: 'computer',
            desc: '【' + this.data.params.computerName + '】参数配置',
            path: '/pages/serial/index?id=' + Utils.objToParams(this.data.params, true)
        }
    }
})