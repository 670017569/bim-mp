// pages/home/toutiao/all_news/all_news.js
let Request = require("../../../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    news: {},
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let type = options.type;
    console.log(type)
    this.setData({
      type: type
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isRefresh: false
    })
    that.loadInitData(type);
  },
  //加载初始数据
  loadInitData: async function (type) {
    //目前为第一页
    var currentPage = 1;
    console.log("load page " + (currentPage));
    // 请数据
    try {
      let msg = await Request.request({
        url: `/bbs/link?len=8&type=${type}&page=1`
      });
      if (msg.data.list.length === 0) {
        wx.showToast({
          title: '暂无新闻',
          icon: 'none'
        })
      } else {
        that.setData({
          news: msg.data.list,
          currentPage: currentPage
        })
      }
    } catch (error) {
      console.log(error);
    }
  },
  //加载下一页数据
  loadMoreData: async function (type) {
    var currentPage = that.data.currentPage; // 获取当前页码
    currentPage += 1; // 加载当前页面的下一页数据
    console.log("load page " + currentPage);
    // 请求下一页数据
    let msg = await Request.request({
      url: `/bbs/link?len=8&type=${type}&page=${currentPage}`
    });
    //拿到新获取到的list
    var data = msg.data.list;
    if (data.length === 0) {
      wx.showToast({
        title: '已经到底了哦',
        icon: 'none'
      })
    } else {
      that.setData({
        //拼接原数据和新获取的数据
        news: [...that.data.news, ...data],
        currentPage: currentPage
      })
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
    this.loadMoreData(this.data.type);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})