var App = getApp();var core = App.core;var Utils = core.Utils;var Store = core.Store;var Deferred = core.Deferred;var GetSerial = function(brandId){    return Store('http://192.168.2.104/wx-project/weixin/public/core/serialData.json',{brandId: brandId}).then(function(json, isSuccess){        return Deferred().resolve(json.data);    })};Page({    onLoad: function(query){        console.log('dfddf')        //一个页面只会调用一次，可以在 onLoad 中获取打开当前页面所调用的 query 参数。        var that = this;        var brandId = query.id;        GetSerial(brandId).then(function(data){            wx.setNavigationBarTitle({title: data.brand.title});            that.setData({                params: query,                brand: data.brand,                factoryList: data.list            });            wx.hideToast();        })    },    tabBrand: function(e){        var id = e.currentTarget.dataset.id;        wx.showToast({title: '', icon: 'loading', duration: 20000, mask: true});        wx.navigateTo({url: '/computer/serial/index?id='+id});    },    onShareAppMessage: function(){        var brandName = this.data.brand.title;        return {            title: 'xxx',            desc: '【'+brandName+'】查询',            path: '/computer/brand/index'+Utils.objToParams(this.data.params, true)        }    }})