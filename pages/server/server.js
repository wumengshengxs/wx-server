var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
var markersData = [];
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    textData: {},
    work: [],
    cancelText: '',
    hide: "none",
    city: ''
  },
  makertap: function(e) {
    var id = e.markerId;
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
    // 点击提示显示
    this.setData({
      hide: "hide",
      latitude: markersData[id].latitude,
      longitude: markersData[id].longitude,
    });
    that.setData({
      cancelText: markersData[id]
    })

  }, //加载页面运行
  onLoad: function(e) {
    var that = this;
    var sign = wx.getStorageSync('sign');
    var order = wx.getStorageSync('order');
    if (!sign) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }

    if (order) {
      that.setData({
        wid: order
      })
    }

    //request map
    if (e.keyworks) {
      that.mapList(e);
    } else {
      that.workRequest(e, sign);
    }
  },
  //request 工单列表
  workRequest: function(e, sign) {
    var that = this;
    var url = config.Config.url;
    wx.request({
      url: url + 'server/index',
      data: {
        sign: sign
      },
      method: 'post',
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        if (res.data.code == -199) {
          wx.removeStorageSync('sign')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
        if (res.data.code == 0) {
          that.mapList(e, res.data.data);
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
  },
  //request 地址
  mapList: function(e, work = '') {
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({
      key: key
    });
    var params = {
      iconPathSelected: '../../img/marker_checked.png',
      iconPath: '../../img/marker.png',
      success: function(data) {
        if (e.keywords) {
          markersData = data.markers;
          //定位搜索地址
          that.setData({
            latitude: markersData[0].latitude
          });
          that.setData({
            longitude: markersData[0].longitude
          });
          // var poisData = data.poisData;
        } else {
          markersData = work
          //定位到自己的地址
          wx.getLocation({
            type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
            success(res) {
              that.setData({
                latitude: res.latitude
              });
              that.setData({
                longitude: res.longitude
              });
            }
          })
        }
        var markers_new = [];
        markersData.forEach(function(item, index) {
          markers_new.push({
            id: item.id,
            latitude: item.latitude,
            longitude: item.longitude,
            iconPath: item.iconPath,
            width: item.width,
            height: item.height
          })

        })
        that.setData({
          markers: markers_new
        });
        that.showMarkerInfo(markersData, 0);
      
        that.showMarkerInfo(markersData, 0);
      },
      fail: function(info) {
        wx.showModal({title:info.errMsg})
      }
    }
    if (e && e.keywords) {
      params.querykeywords = e.keywords;
    }
    myAmapFun.getPoiAround(params)
  },
  bindInput: function(e) {
    var that = this;
    var url = '../input/input';
    if (e.target.dataset.latitude && e.target.dataset.longitude && e.target.dataset.city) {
      var dataset = e.target.dataset;
      url = url + '?lonlat=' + dataset.longitude + ',' + dataset.latitude + '&city=' + dataset.city;
    }
    wx.navigateTo({
      url: url
    })
  },
  showMarkerInfo: function(data, i) {

    var that = this;
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });
  },
  changeMarkerColor: function(data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        data[j].iconPath = "../../img/marker_checked.png";
      } else {
        data[j].iconPath = "../../img/marker.png";
      }
      markers.push({
        id: data[j].id,
        latitude: data[j].latitude,
        longitude: data[j].longitude,
        iconPath: data[j].iconPath,
        width: data[j].width,
        height: data[j].height
      })
    }
    that.setData({
      markers: markers
    });
  }, //一件接单
  receiving(e) {
    var cancel = this.data.cancelText;
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        if (!cancel) {
          wx.navigateTo({
            url: '/pages/start_work/start_work?id=0' + '&lat=' + res.latitude + '&lng=' + res.longitude,
          })
        } else {
          wx.navigateTo({
            url: '/pages/start_work/start_work?id=' + cancel.wid + '&lat=' + res.latitude + '&lng=' + res.longitude,
          })
        }
      }
    })
  }, //显示路线
  leftTap(e) {
    var that = this;
    var lat = parseFloat(that.data.latitude);
    var lng = parseFloat(that.data.longitude);
    if (!lat || !lng) {
      wx.showToast({
        title: '请选择工单',
        icon: 'none',
        duration: 1000,
      })
      return
    }
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = lat
        const longitude = lng
        wx.openLocation({
          latitude,
          longitude,
          scale: 12
        })
      }
    })
  }, //获取定位
  onReady(e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  }, //获取定位
  getCenterLocation(e) {
    this.mapCtx.getCenterLocation({
      success(res) {
        console.log(res.longitude)
        console.log(res.latitude)
      },
    })
  }, //移动定位
  moveToLocation: function() {
    this.mapCtx.moveToLocation()
    wx.showToast({
      title: '定位成功',
      icon: 'none',
      duration: 1000
    })
  }, //工单列表
  topTap(e) {
    wx.navigateTo({
      url: '/pages/show/show',
    })
  }, //--定位 返回上级
  outTap(e) {
    var order = wx.getStorageSync('order');
    wx.navigateTo({
      url: '/pages/close_work/close_work?id=' + order,
    })
  }, //弹出
  tapCancel(e) {
    this.setData({
      hide: "none"
    });
  }, //退出登录
  eixtTap() {
    wx.removeStorageSync('sign')
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }, //扫码接单
  jietap(e) {
    var order = wx.getStorageSync('order');
    wx.navigateTo({
      url: '/pages/close_work/close_work?id='+order,
    })
  }

})