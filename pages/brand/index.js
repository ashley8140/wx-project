import config from '../../config';

var App = getApp();

var core = App.core;
var Utils = core.Utils;
var Store = core.Store;
var Deferred = core.Deferred;

var GetSerial = function(brandId) {
    return Store(config.serverIp + 'serialData', {
        brandId: brandId
    }).then(function(json, isSuccess) {
        return Deferred().resolve(json.data);
    });
};

Page({
    onLoad: function(searchObj) {
        //一个页面只会调用一次，可以在 onLoad 中获取打开当前页面所调用的 query 参数。
        var that = this;
        var brandId = searchObj.id;
        var brandInfo = {};
        GetSerial(brandId).then(function(data) {
            var brand = data.brand;
            var l = brand.length;
            for (var i = 0; i < l; i++) {
                if (brand[i].id == brandId) {
                    brandInfo = brand[i];
                    break;
                }
            }
            wx.setNavigationBarTitle({
                title: brandInfo.title
            });
            that.setData({
                params: searchObj,
                brandInfo: brandInfo
            });
            wx.hideToast();
        });
    },
    tabBrand: function(e) {
        var computerName = e.currentTarget.dataset.computername;
        var computerImg = e.currentTarget.dataset.computerimg;
        var computerId = e.currentTarget.dataset.computerid;
        wx.showToast({
            title: '',
            icon: 'loading',
            duration: 20000,
            mask: true
        });
        wx.navigateTo({
            url:
                '/pages/serial/index?computerId=' +
                computerId +
                '&computerName=' +
                computerName +
                '&computerImg=' +
                computerImg
        });
    },
    onShareAppMessage: function() {
        var brandName = this.data.brandInfo.title;
        return {
            title: brandName,
            desc: '【' + brandName + '】查询',
            path:
                '/pages/brand/index' + Utils.objToParams(this.data.params, true)
        };
    }
});
