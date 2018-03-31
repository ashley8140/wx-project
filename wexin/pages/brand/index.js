var App = getApp();

var core = App.core;
var Utils = core.Utils;
var Store = core.Store;
var Deferred = core.Deferred;

var GetSerial = function(brandId){
    return Store('http://p6e5hhlwb.bkt.clouddn.com/wx_productModel/data/serialData.json',{brandId: brandId}).then(function(json, isSuccess){
        return Deferred().resolve(json.data);
    })
};

Page({
    onLoad: function(query){
        //一个页面只会调用一次，可以在 onLoad 中获取打开当前页面所调用的 query 参数。
        var that = this;
        var brandId = query.id;
        var brandInfo = {};
        GetSerial(brandId).then(function(data){
            var brand = data.brand;
            var l = brand.length;
            var serialComputerList = [];
            var serialComputer = {};
            for (var i = 0; i< l; i++){
                if (brand[i].id == brandId) {
                    serialComputer = brand[i];
                    break;
                }
            }
            console.log('serialComputer=>', serialComputer)
            brandInfo.title = serialComputer.title;
            brandInfo.logo = serialComputer.logo;
            serialComputerList = serialComputer.brand;

            wx.setNavigationBarTitle({title: brandInfo.title});

            that.setData({
                params: query,
                brandInfo: brandInfo,
                factoryList: serialComputerList
            });

            wx.hideToast();
        })

    },
    tabBrand: function(e){
        var id = e.currentTarget.dataset.id;
        var serial = e.currentTarget.dataset.title;
        var img = e.currentTarget.dataset.img;
        wx.showToast({title: '', icon: 'loading', duration: 20000, mask: true});
        wx.navigateTo({url: '/pages/serial/index?id='+id+'&&serial='+serial+'&&img='+img});
    },
    onShareAppMessage: function(){
        var brandName = this.data.brandInfo.title;
        return {
            title: brandName,
            desc: '【'+brandName+'】查询',
            path: '/pages/brand/index'+Utils.objToParams(this.data.params, true)
        }
    }
})