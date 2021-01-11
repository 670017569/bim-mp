// pages/homePage/activityDetail/activityDetail.js
let Request = require("../../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: {},
    show: false,
    back: false,
    name: '',
    phone: '',
    userSms: '',
    requetSme: '',
    remark: '',
    isIphoneX: false,
    myState: '立即报名',
    disabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    //返回上一级界面不刷新
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isRefresh: false
    })
    //iphoneX判断
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    //获取活动详情
    var acid = options.acid;
    wx.showLoading({
      title: 'Loading...',
    })
    var back = options.back;
    that.setData({
      back: back
    })
    that.getInfo(acid);
  },
  getInfo(acid) {
    Request.getRequest("/activity/acid/" + acid + "?userid=" + app.globalData.user.userid, function (res) {
      wx.hideLoading();
      var myState = (res.data.isJoin == true ? '已报名' : '立即报名');
      var disabled = (res.data.isJoin == true ? true : false);
      that.setData({
        activity: res.data,
        myState: myState,
        disabled: disabled
      })
    })
  },
  bkmoreActivity() {
    if (this.data.back == true) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateTo({
        url: '/pages/homePage/moreActivity/moreActivity',
      })
    }
  },
  showModal() {
    var disabled = this.data.disabled;
    if (disabled == true) {
      wx.showModal({
        title: '提示',
        content: '确认取消报名此次活动吗',
        success: function (e) {
          if (e.confirm) {
            var acid = that.data.activity.acid;
            Request.putRequest("/activity/quit?acid=" + acid + "&userid=" + app.globalData.user.userid, null, function () {
              wx.showToast({
                title: '取消报名成功',
              })
              that.getInfo(acid);
            })
          }
        }
      })
    } else {
      this.setData({
        show: true
      })
    }
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  //发送验证码
  sendCode() {
    console.log("send Code")
    var phone = this.data.phone;
    if (phone == null || phone == '') {
      wx.showToast({
        title: '手机号码不能为空!',
        icon: 'none'
      })
      return;
    } else {
      Request.getRequest("/sms/send?phone=" + phone, function (res) {
        var code = res.data.code;
        var message = '发送成功'
        var icon = 'none'
        if (code == 200) {
          message = '发送成功';
          icon = 'success'
        }
        wx.showToast({
          title: message,
          icon: icon
        })
      })

    }

  },
  //活动报名
  applyActivity(e) {
    var data = {
      "name": this.data.name,
      "phone": this.data.phone,
      "remark": this.data.remark,
      "userid": app.globalData.user.userid,
      "acid": this.data.activity.acid,
      "smscode": this.data.userSms
    }
    console.log(data)
    Request.postRequest("/activity/enter", data, function (res) {
      // console.log(res.data)
      wx.showToast({
        title: '报名成功!',
      })
      that.setData({
        show: false
      })
    })
  },
  setName(e) {
    this.setData({
      name: e.detail
    })
  },
  setPhone(e) {
    this.setData({
      phone: e.detail
    })
  },
  setSms(e) {
    this.setData({
      userSms: e.detail
    })
  },
  setRemark(e) {
    this.setData({
      remark: e.detail
    })
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