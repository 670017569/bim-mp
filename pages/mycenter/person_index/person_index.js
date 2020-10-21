// pages/mycenter/person_index/person_index.js
let app = getApp()
let Request = require("../../../utils/request"); // 封装请求
let that; // 指向本page
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    dynamic: {},
    topic: {},
    activity: {},
    imgArr: [],
    nowUser:{},
    attentionState:3,
    isIphoneX:false
  },
  preview(event) {
    var imgArr = this.data.imgArr;
    imgArr.push(this.data.user.avatar)
    this.setData({
      imgArr
    })
    console.log(this.data.imgArr)
    wx.previewImage({
      urls: this.data.imgArr
    })
  },
  previewDyn(event) {
    let currentUrl = event.currentTarget.dataset.src
    let URLs = event.currentTarget.dataset.list
    // console.log(event.currentTarget.dataset.list)
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: URLs // 需要预览的图片http链接列表
    })
  },
  activityDetail(e) {
    let acid = e.currentTarget.dataset.acid;
    wx.navigateTo({
      url: '/pages/homePage/activityDetail/activityDetail?back=true&acid=' + acid,
    })
  },
  MyDynamic: function (options) {
    var userid = this.data.user.userid;
    wx.navigateTo({
      url: '../mydynamic/mydynamic?userid=' + userid
    })
  },
  MyTopic: function (options) {
    var userid = this.data.user.userid;
    wx.navigateTo({
      url: '../mytopic/mytopic?userid=' + userid
    })
  },
  MyAttention: function (options) {
    var touserid = this.data.user.userid;
    wx.navigateTo({
      url: '../myattention/myattention?touserid=' + touserid
    })
  },
  MyFans: function (options) {
    var touserid = this.data.user.userid;
    wx.navigateTo({
      url: '../myfans/myfans?touserid=' + touserid
    })
  },
  getDynamic: function (e) {
    let dyid = e.currentTarget.dataset.dyid;
    wx.navigateTo({
      url: '/pages/homePage/dynamicDetail/dynamicDetail?dyid=' + dyid
    })
  },
  getTopic: function (e) {
    let tpid = e.currentTarget.dataset.tpid;
    wx.navigateTo({
      url: '/pages/homePage/huatiDetail/huatiDetail?tpid=' + tpid
    })
  },
  activityDetail(e) {
    let acid = e.currentTarget.dataset.acid;
    wx.navigateTo({
      url: '/pages/homePage/activityDetail/activityDetail?back=true&acid=' + acid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    //iphoneX判断
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isRefresh: false
    })
    wx.showLoading({
      title: 'Loading...',
    })
    let userid = options.userid;
    this.getInfo(userid);
  },
  chatClick(){
    wx.showToast({
      icon:'none',
      title: '暂未开放!',
    })
  },
  getInfo(userid){
    var nowUser = app.globalData.user;
    Request.getRequest("/user/lookup?userid=" + nowUser.userid + "&touserid=" + userid, function (res) {
      console.log(res.data)
      //判断相互关注关系 1为已关注 2为互相关注 3为未关注
      var isFans = res.data.isFans;
      var isFollow = res.data.isFollow;
      var attentionState = isFollow == true?(isFans == true?2:1):3;
      console.log(attentionState);
      that.setData({
        user: res.data,
        nowUser: nowUser,
        attentionState: attentionState
      })
    })
    Request.getRequest("/topic/userid/" + userid + "?len=3", function (res) {
      that.setData({
        topic: res.data
      })
    })
    Request.getRequest("/dynamic/userid/" + userid + "?len=3", function (res) {
      wx.hideLoading();
      that.setData({
        dynamic: res.data
      })
    })
    Request.getRequest("/activity/user?userid=" + userid + "&len=3&page=1", function (res) {
      // console.log(res.data)
      that.setData({
        activity: res.data
      })
    })
    // that.setData({
    //   nowUserId: app.globalData.user.userid
    // })
  },
  //关注
  attentionClick: function (e) {
    var touserid = this.data.user.userid;
    var userid = this.data.nowUser.userid;
    var attentionState = this.data.attentionState;
    var path = '';
    if (attentionState == 1 || attentionState == 2)
    {
      //取消关注
      wx.showModal({
        title: '提示',
        content: '确认取消关注吗',
        success: function (e) {
          if (e.confirm) {
            path = "/follow/cancel?touserid=" + touserid + "&userid=" + userid;
            Request.deleteRequest(path, function () {
              console.log(userid + "取关" + touserid);
            })
            that.setData({
              attentionState:3
            })
          }
        }
      })
    }
    else{
      //关注
      path = "/follow";
      var data = {
        "touserid": touserid,
        "userid": userid
      }
      Request.postRequest(path, data, function () {
        console.log("关注成功！");
        wx.showToast({
          title: '关注成功',
        })
      });
      attentionState = (that.data.user.isFans) == true ? 2 :1
      that.setData({
        attentionState: attentionState
      })
    }
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