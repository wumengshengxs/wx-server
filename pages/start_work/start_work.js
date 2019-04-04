var config = require('../../libs/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var url = config.Config.url;
    var sign = wx.getStorageSync('sign');
    //request 请求选择工单
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        wx.request({
          url: url + 'server/workstart',
          data: {
            sign: sign,
            id: options.id,
            lat: res.latitude,
            lng: res.longitude
          },
          method: 'post',
          header: {
            'content-type': 'application/json',
          },
          success: function(res) {
            if (res.data.code == 0) {
              that.setData({
                work: res.data.data
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
            }
          },
          fail: function(err) {

          }
        });
      }
    })
  }, //开始接单
  codeTap: function(e) {
    var that = this;
    var url = config.Config.url;
    var sign = wx.getStorageSync('sign');
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        //request 请求选择工单,
        wx.request({
          url: url + 'server/worktake',
          data: {
            sign: sign,
            id: that.data.work.id,
            lat: res.latitude,
            lng: res.longitude
          },
          method: 'post',
          header: {
            'content-type': 'application/json',
          },
          success: function(res) {
            if (res.data.code == 0) {
              wx.setStorageSync('order', that.data.work.id);
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 3000,
                success: function(e) {
                  wx.redirectTo({
                    url: '/pages/close_work/close_work?id=' + that.data.work.id,
                  })
                }
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
            }
          },
          fail: function(err) {

          }
        });
      }
    })

  }, //上一条
  upTap: function(e) {
    var that = this;
    var url = config.Config.url;
    var sign = wx.getStorageSync('sign');
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        //request 请求选择工单,
        wx.request({
          url: url + 'server/workup',
          data: {
            sign: sign,
            id: that.data.work.id,
            lat: res.latitude,
            lng: res.longitude
          },
          method: 'post',
          header: {
            'content-type': 'application/json',
          },
          success: function(res) {
            if (res.data.code == 0) {
              if (res.data.data) {
                that.setData({
                  work: res.data.data
                })
              } else {
                wx.showToast({
                  title: '已经到底了',
                  icon: 'none',
                  duration: 2000,
                })
              }
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
            }
          },
          fail: function(err) {

          }
        });
      }
    })

  }, //下一条
  nextTap: function(e) {
    var that = this;
    var url = config.Config.url;
    var sign = wx.getStorageSync('sign');
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        //request 请求选择工单,
        wx.request({
          url: url + 'server/worknext',
          data: {
            sign: sign,
            id: that.data.work.id,
            lat: res.latitude,
            lng: res.longitude
          },
          method: 'post',
          header: {
            'content-type': 'application/json',
          },
          success: function(res) {
            if (res.data.code == 0) {
              if (res.data.data) {
                that.setData({
                  work: res.data.data
                })
              } else {
                wx.showToast({
                  title: '已经到底了',
                  icon: 'none',
                  duration: 2000,
                })
              }

            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000,
              })
            }
          },
          fail: function(err) {

          }
        });
      }
    })
  },

  tel: function(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.work.mobile,
    })
  },
  kefutel: function(e) {
    wx.makePhoneCall({
      phoneNumber: '80181111',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})