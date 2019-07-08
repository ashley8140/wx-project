var App = getApp();

var core = App.core;
var Utils = core.Utils;
var Store = core.Store;
var Deferred = core.Deferred;
import config from '../../config';

var GetGroupComputer = function(serialId) {
    return Store(config.serverIp + 'serial-grouped-price', {
        cityCode: App.getPageCity().code,
        serialId: serialId
    }).then(function(json, isSuccess) {
        return Deferred().resolve(json.data);
    });
};

var GetSummary = function(serialId) {
    return Store(config.serverIp + 'summary-info', {
        serialId: serialId
    }).then(function(json, isSuccess) {
        return Deferred().resolve(json.data);
    });
};
Page({
    data: {
        serialImageStyle: '',
        activeSaleStatus: ''
    },
    onLoad: function(searchObj) {
        var that = this;
        var computerId = searchObj.computerId;
        Deferred.when(
            GetSummary(computerId),
            GetGroupComputer(computerId)
        ).done(function(storeData) {
            var summary = storeData[0][0];
            var groupComputer = storeData[1][0];
            summary.serial.img = searchObj.computerImg;
            var activeSaleStatus = groupComputer.saleNameList[0].id;
            var activeYear =
                groupComputer.computersData[activeSaleStatus].years[0];
            // 设置页面标题
            wx.setNavigationBarTitle({
                title: searchObj.computerName
            });

            that.setData({
                params: searchObj,
                pageTitle: searchObj.computerName,

                serial: summary.serial,
                saleNameList: groupComputer.saleNameList,
                computersData: groupComputer.computersData
            });
            that.filterComputerList(activeSaleStatus, activeYear);

            wx.hideToast();
        });
    },
    filterComputerList: function(activeSaleStatus, activeYear) {
        var computersData = this.data.computersData;
        var computerGroupList = [];

        activeSaleStatus = activeSaleStatus || this.data.activeSaleStatus;
        activeYear = activeYear || computersData[activeSaleStatus].years[0];

        Utils.each(computersData[activeSaleStatus].computerGroupList, function(
            computerGroup
        ) {
            var computerList = [];

            Utils.each(computerGroup.computerList, function(computer) {
                if (computer.year === activeYear) {
                    computerList.push(computer);
                }
            });

            if (computerList.length) {
                computerGroupList.push({
                    title: computerGroup.title,
                    computerList: computerList
                });
            }
        });

        this.setData({
            computerGroupList: computerGroupList,
            yearList: this.data.computersData[activeSaleStatus].years,
            activeSaleStatus: activeSaleStatus,
            activeYear: activeYear
        });
    },
    serialImageLoad: function(e) {
        var detail = e.detail;
        this.setData({
            serialImageStyle:
                'height:' + (750 / detail.width) * detail.height + 'rpx'
        });
    },

    tabFilterSale: function(e) {
        var saleStatus = e.currentTarget.dataset.id;
        if (saleStatus === this.data.activeSaleStatus) return;
        this.filterComputerList(saleStatus);
    },

    tabFilterYear: function(e) {
        var year = e.currentTarget.dataset.id;
        if (year === this.data.activeYear) return;
        this.filterComputerList(undefined, year);
    },
    tapcomputerButton: function(e) {
        var id = e.currentTarget.dataset.id;
        var type = e.currentTarget.dataset.type;

        wx.showToast({
            title: '',
            icon: 'loading',
            duration: 20000,
            mask: true
        });

        if (type === 'config') {
            wx.navigateTo({
                url:
                    '/pages/config/index?computerId=' +
                    this.data.params.computerId +
                    '&computerName=' +
                    this.data.params.computerName +
                    '&computerImg=' +
                    this.data.params.computerImg
            });
        } else if (type === 'image') {
            wx.navigateTo({
                url:
                    '/pages/image-view/index?computerId=' +
                    this.data.params.computerId +
                    '&computerName=' +
                    this.data.params.computerName +
                    '&computerImg=' +
                    this.data.params.computerImg
            });
        } else {
            wx.navigateTo({
                url:
                    '/pages/order/index?computerId=' +
                    this.data.params.computerId +
                    '&computerName=' +
                    this.data.params.computerName +
                    '&computerImg=' +
                    this.data.params.computerImg +
                    '&action=' +
                    type
            });
        }
    },

    onShareAppMessage: function() {
        var serialName = this.data.pageTitle;
        return {
            title: serialName,
            desc: '【' + serialName + '】查询',
            path:
                '/pages/serial/index?id=' +
                Utils.objToParams(this.data.params, true)
        };
    }
});
