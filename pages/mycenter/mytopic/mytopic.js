// pages/mycenter/mytopic/mytopic.js
let app = getApp()
let Request = require("../../../utils/request"); // 封装请求
let that; // 指向本page
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    topic: {},
    currentPage: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var userid = options.userid;
    that.getInfo(userid);
  },
  getInfo(userid){
    //从app.js拿到user
    var appUser = app.globalData.user;
    if (appUser.userid == userid) {
      this.setData({
        user: appUser,
      })
      //加载初始数据
      this.loadInitData();
    }
    else {
      Request.getRequest("/user/lookup?touserid=" + userid + "&userid=" + appUser.userid, function (res) {
        that.setData({
          user: res.data,
        })
        //加载初始数据
        that.loadInitData();
      })
    }
  },
  //加载初始数据
  loadInitData: function () {
    //目前为第一页
    var currentPage = 1;
    var tips = "Loading";
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    Request.getRequest("/topic/userid/" + this.data.user.userid + "?len=5&page=1", function (res) {
      if (res.data.list.length == 0) {
        wx.showToast({
          title: '还未发布过话题',
        })
        that.setData({
          topic: {}
        })
      }
      else {
        //隐藏加载提示框
        wx.hideLoading();
        console.log(res.data);
        that.setData({
          topic: res.data,
          currentPage: currentPage
        })
      }
    })
  },
  //加载下一页数据
  loadMoreData: function () {
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "Loading...";
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    Request.getRequest("/topic/userid/" + that.data.user.userid + "?len=5&page=" + currentPage, function (res) {
      wx.hideLoading();
      //拿到新获取到的list
      var resData = res.data.list;
      if (resData.length == 0) {
        wx.showToast({
          title: '下面没有了',
        })
      }
      else {
        //拿到当前的topic
        var originTopic = that.data.topic;
        //加上新获取到的list
        originTopic.list = originTopic.list.concat(resData);
        console.log(originTopic);
        that.setData({
          topic: originTopic,
          currentPage: currentPage
        })
      }
    })
  },

  getTopic: function (e) {
    let tpid = e.currentTarget.dataset.tpid;
    wx.navigateTo({
      url: '/pages/homePage/huatiDetail/huatiDetail?tpid=' + tpid
    })
  },
  deleteTop: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除此条话题吗',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          let tpid = e.currentTarget.dataset.tpid;
          let index = e.currentTarget.dataset.index;
          var path = "/topic/" + tpid;
          Request.deleteRequest(path, function () {
            wx.showToast({
              title: '删除成功！',
            })
            console.log("删除动态 tpid=" + tpid);
            that.getInfo(app.globalData.user.userid);
            getApp().updateUserInfo();
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
    this.loadMoreData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})