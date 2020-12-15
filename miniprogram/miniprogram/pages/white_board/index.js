// pages/setting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active_list: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ],
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
    var array = this.data.active_list;
    var result = "";
    for (var i = 0; i < 8; i++) {
      var res_2 = ""
      for (var j = 0; j < 2; j++) {
        var num = 0;
        var times = 8;
        var code;
        for (var k = 0; k < 4; k++) {
          var dot = array[j * 4 + k][i];
          if (dot == 1) {
            num += times;
          }
          times = times / 2;
        }

        if (num < 10) {
          code = num.toString();
        } else {
          var s = "ABCDEF";
          code = s[num - 10];
        }

        res_2 += code;
      }
      result += res_2;
    }

    return result;
  },
  upload: function (params) {
    var that = this;
    var data = this.decode_func();
    if (data == "0000000000000000") {
      wx.showToast({
        title: 'please paint!',
        icon: 'none'
      });
      return;
    }
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
            "value": data
          }]
        }]
      },
      success: function (res) {
        // console.log(res);
        that.openIOS2();

      }
    })
  },
  handle_touchstart: function (params) {
    var i = params.currentTarget.dataset.address[0];
    var j = params.currentTarget.dataset.address[1];
    // console.log(this.data.active_list[i][j]);
    var s = "active_list[" + i + "][" + j + "]";
    this.setData({
      [s]: (this.data.active_list[i][j] + 1) % 2
    })
  },
  handle_touchend: function (params) {
    // console.log(params.currentTarget.dataset.address)
    var that = this;
    // console.log(params.changedTouches[0].pageX, params.changedTouches[0].pageY);
    var x = parseInt(params.changedTouches[0].pageX / 40);
    var y = parseInt(params.changedTouches[0].pageY / 40);
    var s = "active_list[" + y + "][" + x + "]";

    that.setData({
      [s]: (this.data.active_list[x][y] + 1) % 2
    });


  },
  submit_func: function (params) {
    this.upload();
  },
  reset_func: function (params) {
    var active_list = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    this.setData({
      active_list: active_list
    })


  },

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