var app = getApp()
var config = require('../../libs/config.js');
Page({
  data: {
    currentTab: 0,
    navTab: ['最新工单', '当前工单', '已结工单', '全部工单'],
    work:{},
    list:{}
  },
  onLoad: function(options) {
    var that = this;
    var url = config.Config.url;
    var sign = wx.getStorageSync('sign');
    //request 请求选择工单
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        wx.request({
          url: url + 'server/workshow',
          data: {
            sign: sign,
            lat: res.latitude,
            lng: res.longitude
          },
          method: 'post',
          header: {
            'content-type': 'application/json',
          },
          success: function (res) {
            if (res.data.code == 0) {
              that.setData({
                work: res.data.data[0],
                list: res.data.data
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
            }
          },
          fail: function (err) {

          }
        });
      }
    })
  },
  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.setData({
      work: this.data.list[e.detail.current]
    });

  },
  listTab: function(e) {
    var state = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    if(state == 1){
      wx.navigateTo({
        url: '/pages/start_work/start_work?id='+id,
      })
    } else if(state == 2){
      wx.navigateTo({
        url: '/pages/close_work/close_work?id=' + id,
      })
    } else if (state == 3) {
      wx.navigateTo({
        url: '/pages/end_work/end_work?id=' + id,
      })
    }
    
  },
  //点击切换
  clickTab: function(e) {

    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})