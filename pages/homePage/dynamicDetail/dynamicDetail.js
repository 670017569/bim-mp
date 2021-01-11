let Request = require("../../../utils/request"); // 封装请求
const util = require('../../../utils/util.js');
let that; // 指向本page
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamic: {},
    user: {},
    attentionButton: '关注',
    nowUser: {},
    commentCurrentPage: 1,
    comment:[],
    dyid:{},
    userid:{},
    secComment: null,
  },

  showPopup() {
    this.setData({
      show: true,

    });
  },

  onClose() {
    this.setData({
      show: false,

    });

  },

  sendData: function (e) {
    this.setData({
      tocmid: e.currentTarget.dataset.cmid,
    });
  },
  sendDatA: function (e) {
    var that = this;
    that.setData({
      tocmid: e.currentTarget.dataset.cmid,

    });
    console.log("tocmid置空" + that.data.tocmid);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.setData({
      nowUser: app.globalData.user,
      dyid: options.dyid,
      userid: app.globalData.user.userid,
    })
    console.log(that.data.userid);
    console.log(that.data.dyid);
    //返回上一级界面不刷新
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isRefresh: false
    })
    var dyid = that.data.dyid;
    that.getInfo(that.data.commentCurrentPage,dyid);
  },

  preview(event) {
    console.log('pre');
    let currentUrl = event.currentTarget.dataset.src
    let URLs = event.currentTarget.dataset.list
    console.log(event.currentTarget.dataset.list)
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: URLs // 需要预览的图片http链接列表
    })
    // this.setData({
    //   isRefresh:false
    // })
  },
  getInfo(commentCurrentPage,dyid) {
    wx.showLoading({
      title: 'Loading...',
    })
    Request.getRequest("/dynamic/dyid/" + dyid + "?userid=" + app.globalData.user.userid, function (res) {
      wx.hideLoading();
      that.setData({
        dynamic: res.data.dynamic,
        user: res.data.userinfo
      })
    })
    Request.getRequest('/comment/page?len=10&page='+commentCurrentPage+'&type=dynamic&toid=' + dyid, function (res) {
      console.log(res.data);
      wx.hideLoading();
      var resData = res.data;
      console.log(resData.list.length);
      if (resData.list.length == 0) {
        wx.showToast({
          title: '没有更多了',
          duration: 2000,
        })
      }
      else {
        var nowComments = that.data.comment;
        if (commentCurrentPage == 1) {
          nowComments = resData
        }
        else {
          nowComments.list = nowComments.list.concat(resData.list);
        }
        that.setData({
          comment: nowComments,
        })
      }

    })
  },

  attentionClickFalse: function (e) {
    var path = "";
    wx.showModal({
      title: '提示',
      content: '确认取消关注吗',
      success: function (e) {
        if (e.confirm) {
          path = "/follow/cancel?touserid=" + that.data.user.userid + "&userid=" + that.data.nowUser.userid;
          Request.deleteRequest(path, function () {
            console.log(that.data.nowUser.userid + "取关" + that.data.user.userid);
            that.getInfo(that.data.commentCurrentPage,that.data.dynamic.dyid);
          })
        }
      }
    })
  },

  attentionClickTrue: function (e) {
    var path = "";
    path = "/follow/";
    var data = {
      "touserid": that.data.user.userid,
      "userid": that.data.nowUser.userid
    }
    Request.postRequest(path, data, function () {
      console.log("关注成功！");
      wx.showToast({
        title: '关注成功',
      })
      that.getInfo(that.data.commentCurrentPage,that.data.dynamic.dyid);
    });
  },

  publishCom(e) {
    var content = e.detail.value.content;
    var tocmid = that.data.tocmid;
    var dyid = that.data.dyid;
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }
    var path = '/comment?type=dynamic';
    var userid = app.globalData.user.userid;
    console.log(dyid);
    var data = {
      "content": content,
      "publishTime": util.formatTime,
      "userid": userid,
      "toid": dyid,
      "touserid": that.data.user.userid,
      "tocmid": tocmid,
    };
    Request.postRequest(path, data, function () {
      that.getInfo(1, that.data.dyid);
      wx.showToast({
        title: '发布成功',
        duration: 2000,
        success: res => {
          that.setData({
            comInputValue: '',
          })
        }
      })
    })
    that.getInfo(1, that.data.dyid);
  },

  deleteCom: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定删除此条评论吗',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          let cmid = e.currentTarget.dataset.cmid;
          let index = e.currentTarget.dataset.index;
          var path = "/comment/" + cmid;
          Request.deleteRequest(path, function () {
            wx.showToast({
              title: '删除成功！',
            })
            console.log("删除评论 cmid=" + cmid);
            that.getInfo(1, that.data.dyid);
            getApp().updateUserInfo();
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  getSecCom: function (e) {
    let cmid = e.currentTarget.dataset.cmid;
    var that = this;
    var path = '/comment/page/second?len=5&page=1';
    var data = {
      "tocmid": cmid,
    };
    Request.postRequest(path, data, function (res) {
      console.log(res.data);
      console.log(cmid + "获取二级评论成功");
      // if (res.data.list.length == 0) {
      //   wx.showToast({
      //     title: '没有更多了',
      //     duration: 2000,
      //   })
      // }
      that.setData({
        secComment: res.data,
      })
      console.log(that.data.secComment);
    })
    that.getInfo(1, that.data.dyid);

  },

  person_index: function (options) {
    var userid = this.data.user.userid;
    wx.navigateTo({
      url: '/pages/mycenter/person_index/person_index?userid=' + userid
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
    var that = this;
    console.log("下拉刷新");

    var nowCurrentPage = that.data.commentCurrentPage + 1;
    var dyid = that.data.dyid;
    that.getInfo(nowCurrentPage,dyid);
    that.setData({
      commentCurrentPage: nowCurrentPage,
    })
    console.log(nowCurrentPage);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})