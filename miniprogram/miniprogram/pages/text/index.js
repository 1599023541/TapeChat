// pages/setting/index.js
import fonts from "../../fonts/fonts.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    input: '',
    res: "",
    iosDialog2: false,
  },
  close: function () {
    this.setData({
      iosDialog2: false

    })
  },
  openIOS2: function () {
    this.setData({
      iosDialog2: true
    });
  },
  decode_func: function (params) {
    var s = this.data.input;
    var standard = "abc";
    var result = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      var code;
      if (ch in fonts.fonts) {
        code = fonts.fonts[ch];
      } else {
        code = fonts.fonts[' '];
      }
      result += code;
    }
    return result;
  },
  upload: function (params) {
    var that = this;
    wx.request({
      url: 'https://api.heclouds.com/devices/651971616/datapoints?datastream_id=temperature&limit=10',
      method: "post",
      header: {
        "api-key": "******",
      },
      data: {
        "datastreams": [{
          "id": "message",
          "datapoints": [{
            "value": this.decode_func()
          }]
        }]
      },
      success: function (res) {
        // console.log(res);
        that.openIOS2();

      }
    })
  },

  input_func: function (params) {
    this.setData({
      input: params.detail.value
    })


  },
  submit_func: function (params) {
    console.log(params);
    if (this.data.input == "") {
      wx.showToast({
        title: 'please input!',
        icon: 'none'
      })
    } else {
      this.upload();

    }
  },
  reset_func: function (params) {
    this.setData({
      input: ""
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(fonts);
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