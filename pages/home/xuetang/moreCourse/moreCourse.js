let Request = require("../../../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courses: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;
    that.getXuetangList();
  },

  getXuetangList:function() {
   
    Request.getRequest("/link?len=10&type=course&page=1", function (res) {
      console.log(res.data);
      that.setData({
        courses: res.data.list
      })
    })
    console.log(course);
 
  },
  sendUrl1: function (e) {
    let url1 = e.currentTarget.dataset.url1;
    console.log(url1);
    wx.navigateTo({
      url: '/pages/home/xuetang/course_video/course_video?url1=' + url1
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})