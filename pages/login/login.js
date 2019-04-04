var config = require('../../libs/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['服务人员', '子女登录'],
    mobile: '',
    password: '',
    objectArray: [{
        id: 0,
        name: '服务人员'
      },
      {
        id: 1,
        name: '子女登录'
      }
    ],

  },
  getMobile(e){
    var val = e.detail.value;
    this.setData({
      mobile: val
    });
  },
  getPass(e) {
    var val = e.detail.value;
    this.setData({
      password: val
    });
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      index: 0
    })

    var sign = wx.getStorageSync('sign');
    if (sign) {
      wx.redirectTo({
        url: '/pages/server/server',
      })
    }
  },//请求登录request
  register: function(e) {
    var url = config.Config.url;
    var that = this;
    var mobile = this.data.mobile;
    var password = this.data.password;
    if (!mobile || !password) {
      wx.showToast({
        title: '账号和密码不能为空',
        icon: 'none',
        duration: 1000,
      })
      return
    }
    wx.login({
      success: function(res) {
        var code = res.code;
        wx.getUserInfo({
          success: function(res) {
            wx.request({
              url: url + 'login/login',
              method: 'POST',
              data: {
                code: code,
                mobile: mobile,
                password: password,
                signature: res.signature,
                rawData: res.rawData,
                iv : res.iv,
                encryptedData: res.encryptedData
              },
              success: function(res) {
                if(res.data.code != 0){
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000,
                  })
                }else{
                  wx.setStorageSync('sign', res.data.sign);
                  wx.showToast({
                    title: '登陆成功',
                    icon: 'none',
                    duration: 3000,
                    success: function (e) {
                      wx.redirectTo({
                        url: '/pages/server/server',
                      })
                    }
                  })
                }
       
              }
            })
          },
          fail: function(res) {

          }
        });
      }
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