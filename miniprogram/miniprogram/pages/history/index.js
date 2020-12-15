// pages/history/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datapoints: [],
    dialog1: false
  },
  close: function () {
    this.setData({
      dialog1: false
    });
  },
  open1() {
    this.setData({
      dialog1: true
    });
  },
  download: function (params) {
    var that = this;
    wx.request({
      url: 'https://api.heclouds.com/devices/651971616/datapoints?datastream_id=message&limit=10',
      method: "get",
      header: {
        "api-key": "******",
      },
      success: function (res) {
        var list = res.data.data.datastreams[0].datapoints;
        for (var i = 0; i < list.length; i++) {
          list[i]['at'] = list[i]['at'].slice(5, 16);
        }
        that.setData({
          datapoints: list
        })

        that.open1();
      }
    })
  },

  // upload: function (params) {
  //   wx.request({
  //     url: 'http://api.heclouds.com/devices/651971616/datapoints?datastream_id=temperature&limit=10',
  //     method: "post",
  //     header: {
  //       "api-key": "woqyuqd0Ab7h=fheOGecLfLMD00=",
  //     },
  //     data: {
  //       "datastreams": [{
  //           "id": "message",
  //           "datapoints": [{
  //               "value": "10101010-00001111-10101111-00110101"
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     success: function (res) {
  //       console.log(res)
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})