// pages/homePage/huatiDetail/huatiDetail.js
let app = getApp()
const util = require('../../../utils/util.js');
let Request = require("../../../utils/request"); // 封装请求
let that; // 指向本page
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    user: {},
    nowUser: {},
    nodes: '',
    isAttention: "关注",
    comInputValue: null,
    topCommentContent: null,
    no_pl_hidden: true,
    commentCurrentPage: 1,
    comment: [],
    tpid: {},
    secComment: null,
    userid: {},
    show: false,
    tocmid: 0
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
    console.log(e.currentTarget.dataset.cmid),
      this.setData({
        tocmid: e.currentTarget.dataset.cmid,
        comInputValue: e.currentTarget.dataset.nickName,
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
    //设置返回时不刷新
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isRefresh: false,
    })
    that = this;
    this.setData({
      tpid: options.tpid,
      userid: app.globalData.user.userid,
    })
    console.log(that.data.tpid);
    var tpid = that.data.tpid;
    that.getInfo(that.data.commentCurrentPage, tpid);
  },

  getInfo(commentCurrentPage, tpid) {
    //获取数据
    wx.showLoading({
      title: 'Loading...',
    })
    that.setData({
      nowUser: app.globalData.user
    })
    Request.getRequest('/topic/' + tpid + "?userid=" + app.globalData.user.userid, function (res) {
      console.log(res.data)
      wx.hideLoading();
      that.setData({
        topic: res.data.topic,
        user: res.data.user,
        nodes: res.data.topic.content
      })
    })

    Request.getRequest('/comment/page?len=10&page=' + commentCurrentPage + '&type=topic&toid=' + tpid, function (res) {
      console.log(res.data);
      wx.hideLoading();
      var resData = res.data;
      console.log(resData.list.length);
      if (resData.list.length == 0) {
        wx.showToast({
          title: '还没有评论哦',
          icon: 'none'
        })
      } else {
        var nowComments = that.data.comment;
        if (commentCurrentPage == 1) {
          nowComments = resData
        } else {
          nowComments.list = nowComments.list.concat(resData.list);
        }
        that.setData({
          comment: nowComments,
        })
      }

    })
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
            that.getInfo(1, that.data.tpid);
            getApp().updateUserInfo();
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
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
            that.getInfo(that.data.commentCurrentPage, that.data.topic.tpid);
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
      that.getInfo(that.data.commentCurrentPage, that.data.topic.tpid);
    });
  },

  publishCom(e) {
    var content = e.detail.value.content;
    var tpid = that.data.tpid;
    var tocmid = that.data.tocmid;
    console.log("发评论" + tocmid);
    if (!content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }
    var path = '/comment?type=topic';
    var userid = app.globalData.user.userid
    var data = {
      "content": content,
      "publishTime": util.formatTime,
      "userid": userid,
      "toid": tpid,
      "touserid": that.data.user.userid,
      "tocmid": that.data.tocmid
    };
    Request.postRequest(path, data, function () {
      that.getInfo(that.data.commentCurrentPage, that.data.tpid);
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
    that.getInfo(1, that.data.tpid);
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
      that.setData({
        secComment: res.data,
      })
      console.log(that.data.secComment);
    })
    that.getInfo(1, that.data.tpid);

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
    console.log(that.data.tpid);

    var nowCurrentPage = that.data.commentCurrentPage + 1;
    var tpid = that.data.tpid;
    that.getInfo(nowCurrentPage, tpid);
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