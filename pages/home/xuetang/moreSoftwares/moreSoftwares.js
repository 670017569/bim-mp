let Request = require("../../../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    software: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isRefresh: false
    })
    that.loadInitData();
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
    Request.getRequest("/topic/page/software?len=20&page=1&userid=" + app.globalData.user.userid, function (res) {
      if (res.data.list.length == 0) {
        wx.showToast({
          title: '暂无软件',
        })
      }
      else {
        //隐藏加载提示框
        console.log(res.data)
        wx.hideLoading();
        that.setData({
          software: res.data.list,
          currentPage: currentPage
        })
      }
    })
  },
  //加载下一页数据
  loadMoreData: function () {
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    var tips = "Loading";
    console.log("load page " + (currentPage));
    wx.showLoading({
      title: tips,
    })
    // 请封装自己的网络请求接口，这里作为示例就直接使用了wx.request.
    Request.getRequest("/topic/page/software?len=5&page=" + currentPage + "&userid=" + app.globalData.user.userid, function (res) {
      wx.hideLoading();
      //拿到新获取到的list
      var resData = res.data.list;
      if (resData.length == 0) {
        wx.showToast({
          title: '下面没有了',
        })
      }
      else {
        //拿到当前的activityList
        var softwareList = that.data.software;
        //加上新获取到的list
        softwareList = softwareList.concat(resData);
        that.setData({
          software: softwareList,
          currentPage: currentPage
        })
      }
    })
  },
  softwareDetail: function (e) {
    let tpid = e.currentTarget.dataset.tpid;
    wx.navigateTo({
      url: '/pages/homePage/softwareDetail/softwareDetail?tpid=' + tpid
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