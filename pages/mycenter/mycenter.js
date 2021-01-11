let app = getApp()
let Request = require("../../utils/request"); // 封装请求
let that; // 指向本page
Page({
  data: {
    sign_value: "签到",
    nav_font: true,
    user: {
      "nickName": "未登录",
      "dynamics": 0,
      "topics": 0,
      "follows": 0,
      "fans": 0,
    },
    user1: {
      "avatar": "../../images/test.png",
      "nickName": "未登录",
      "dynamics": 100,
      "topics": 32,
      "follows": 97,
      "fans": 12134,
    },
    brick: '',
    sign_in_number: 0,
    signinToday: null,
    token: ''
  },
  onLoad: function (options) {
    that = this
    this.getUserInfoFromApp();
  },
  getUserInfoFromApp() {
    console.log("从全局变量中获取user")
    var signValue = this.data.sign_value;
    if (app.globalData.user.signinToday == true) {
      signValue = "已签到";
    }
    var signTimes = app.globalData.user.signinTimes;
    if (signTimes == null) signTimes = 0;
    that.setData({
      user: app.globalData.user,
      sign_in_number: signTimes,
      signinToday: app.globalData.user.signinToday,
      sign_value: signValue,
      token: app.globalData.accesstoken.access_token
    })
  },
  onShow: function () {
    var mycenterRefresh = app.globalData.mycenterRefresh;
    if (mycenterRefresh) {
      app.updateUserInfo();
      app.globalData.mycenterRefresh = false;
    }
    console.log("mycenter onShow")
    that.getUserInfoFromApp();
  },
  creditInfo: function () {
    wx.navigateTo({
      url: '../mycenter/credit/credit',
    })
  },

  sign_click(e) {
    if (this.data.user.signinToday == true) return
    var path = "/user/sign?userid=" + this.data.user.userid
    Request.putRequest(path, 10, function () {
      var sign_in_number = that.data.sign_in_number + 1;
      wx.showToast({
        title: "已签到" + sign_in_number + "天",
      })
      Request.getRequest("/user/me?access_token=" + app.globalData.accesstoken.access_token, function (res) {
        app.globalData.user = res.data;
        console.log(app.globalData.user)
        that.setData({
          sign_value: "已签到",
          nav_font: false,
          user: app.globalData.user
        })
      })

    })

  },
  MyDynamic: function (options) {
    var userid = app.globalData.user.userid;
    wx.navigateTo({
      url: '../mycenter/mydynamic/mydynamic?userid=' + userid
    })
  },
  MyTopic: function (options) {
    var userid = app.globalData.user.userid;
    wx.navigateTo({
      url: '../mycenter/mytopic/mytopic?userid=' + userid
    })
  },
  MyAttention: function (options) {
    var touserid = app.globalData.user.userid;
    wx.navigateTo({
      url: '../mycenter/myattention/myattention?touserid=' + touserid
    })
  },
  MyFans: function (options) {
    var touserid = app.globalData.user.userid;
    wx.navigateTo({
      url: '../mycenter/myfans/myfans?touserid=' + touserid
    })
  },
  MyIntegral: function (options) {
    var brick = this.data.user.brick;
    wx.navigateTo({
      url: '../mycenter/myintegral/myintegral?brick=' + brick,
    })
  },
  MyOrder: function (options) {
    var user_id = this.data.userid;
    wx.navigateTo({
      url: '../mycenter/myorder/myorder'
    })
  },
  MyActivity: function (options) {
    // var user = encodeURIComponent(JSON.stringify(this.data.user));
    wx.navigateTo({
      url: '../mycenter/myactivity/myactivity'
    })
  },
  MyAddress: function (options) {
    wx.navigateTo({
      url: '../mycenter/myaddress/myaddress'
    })
  },
  person_index: function (options) {
    var userid = this.data.user.userid;
    wx.navigateTo({
      url: '../mycenter/person_index/person_index?userid=' + userid
    })
  }
})