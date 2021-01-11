// pages/home/xuetang/morecases/morecases.js
let Request = require("../../../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    sample: {},
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
  loadInitData: async function () {
    //目前为第一页
    var currentPage = 1;
    console.log("load page " + (currentPage));
    try {
      // 请求第一页数据
      let msg = await Request.request({
        url: `/bbs/link?len=5&type=sample&page=1`
      });
      let data = msg.data.list;
      if (data == 0) {
        wx.showToast({
          title: '暂无案例',
          icon: 'none'
        })
      } else {
        that.setData({
          sample: data,
          currentPage: currentPage
        })
      }
    } catch (error) {
      console.log(error);
    }
  },
  //加载下一页数据
  loadMoreData: async function () {
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    console.log("load page " + (currentPage));
    try {
      // 请求下一页数据
      let msg = await Request.request({
        url: `/bbs/link?len=5&type=sample&page=${currentPage}`
      });
      let data = msg.data.list;
      if (data.length == 0) {
        wx.showToast({
          title: '已经到底了哦',
          icon: 'none'
        })
      } else {
        that.setData({
          sample: [...that.data.sample, ...data],
          currentPage: currentPage
        })
      }
    } catch (error) {
      console.log(error);
    }
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