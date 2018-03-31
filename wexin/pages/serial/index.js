var App = getApp();

var core = App.core;
var Utils = core.Utils;
var Store = core.Store;
var Deferred = core.Deferred;

var GetGroupComputer = function(serialId){
    return Store('http://192.168.2.100/public/data/serial-grouped-price.json', {cityCode: App.getPageCity().code, serialId: serialId}).then(function(json, isSuccess){
        return Deferred().resolve(json.data);
    })
};

var GetSummary = function(serialId){
    return Store('http://192.168.2.100/public/data/summary-info.json',{serialId: serialId}).then(function(json, isSuccess){
        return Deferred().resolve(json.data);
    })
};
Page({
    data: {
        serialImageStyle: '',
        activeSaleStatus: ''
    },
    onLoad: function(searchObj){
        var that = this;
        var serialId = searchObj.id;
        var serial = searchObj.serial;
        var img = searchObj.img;
        Deferred.when(GetSummary(serialId), GetGroupComputer(serialId)).done(function(storeData){
            console.log('storeData=>',storeData)
            var summary = storeData[0][0];
            var groupComputer = storeData[1][0];
            summary.serial.img = img;
            var activeSaleStatus = groupComputer.saleNameList[0].id;
            var activeYear = groupComputer.computersData[ activeSaleStatus ].years[0];

            // 设置页面标题
            wx.setNavigationBarTitle({title: serial});

            that.setData({
                params: searchObj,
                pageTitle: serial,

                serial: summary.serial,
                saleNameList: groupComputer.saleNameList,
                computersData: groupComputer.computersData
            });
            console.log(activeSaleStatus,activeYear)
            that.filterComputerList(activeSaleStatus, activeYear);

            wx.hideToast();
        })
    },
    filterComputerList: function(activeSaleStatus, activeYear){
        var computersData = this.data.computersData;
        var computerGroupList = [];

        activeSaleStatus = activeSaleStatus || this.data.activeSaleStatus;
        activeYear = activeYear || computersData[activeSaleStatus].years[0];

        Utils.each(computersData[activeSaleStatus].computerGroupList, function(computerGroup){
            var computerList = [];

            Utils.each(computerGroup.computerList, function(computer){
                if( computer.year ===  activeYear ){
                    computerList.push(computer);
                }
            });

            if( computerList.length ){
                computerGroupList.push({title: computerGroup.title, computerList: computerList});
            }
        });

        this.setData({
            computerGroupList: computerGroupList,
            yearList: this.data.computersData[ activeSaleStatus ].years,

            activeSaleStatus: activeSaleStatus,
            activeYear: activeYear
        });
    },
    serialImageLoad: function(e){
        var detail = e.detail;

        this.setData({
            serialImageStyle: 'height:' + (750  / detail.width * detail.height) + 'rpx'
        });
    },

    tabFilterSale: function(e){
        var saleStatus = e.currentTarget.dataset.id;

        if( saleStatus === this.data.activeSaleStatus ) return;

        this.filterComputerList(saleStatus);
    },

    tabFilterYear: function(e){
        var year = e.currentTarget.dataset.id;

        if( year === this.data.activeYear ) return;

        this.filterComputerList(undefined, year);
    },

    tapcomputerButton: function(e){
        var id = e.currentTarget.dataset.id;
        var type = e.currentTarget.dataset.type;

        wx.showToast({title: '', icon: 'loading', duration: 20000, mask: true});

        if( type === 'config' ){
            wx.navigateTo({url: '/pages/config/index?id=' + id});
        }else if( type === 'image' ){
            wx.navigateTo({url: '/pages/image-view/index?id=' + id});
        }else{
            wx.navigateTo({url: '/pages/order/index?id=' + id + '&action=' + type});
        }
    },

    onShareAppMessage: function(){
        var serialName = this.data.pageTitle;
        return {
            title: serialName,
            desc: '【' + serialName + '】查询',
            path: '/pages/serial/index?id=' + Utils.objToParams(this.data.params, true)
        };
    }

});