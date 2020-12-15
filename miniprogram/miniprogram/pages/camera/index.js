// pages/camera/index.js
import fonts from "../../fonts/fonts.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",
    iosDialog2: false,
  },
  close: function () {
    this.setData({
      iosDialog2: false,
    })
  },
  openIOS2: function () {
    this.setData({
      iosDialog2: true
    });
  },
  decode_func: function (content) {
    var s = content;
    var standard = "abc";
    var result = "";
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      var code;
      if (ch in fonts.fonts)
      {
        code = fonts.fonts[ch];
      }
      else
      {
        code = fonts.fonts[' '];
      }
      result += code;
    }
    return result;
  },
  scan_func: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var img_base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64");

        wx.cloud.callFunction({
          name: "ocr",
          data: {
            base64: img_base64
          },
          success: function(params) {
            var json = JSON.parse(params.result);
            var content = json.TextDetections[0].DetectedText;
            
            that.setData({
              content: content
            });

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
                    "value": that.decode_func(content)
                  }]
                }]
              },
              success: function () {
                that.openIOS2();
        
              }
            })
          },
          fail: function(params) {
            console.log(params)
          }
        })
        
      }
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