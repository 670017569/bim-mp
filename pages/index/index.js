//index.js
//获取应用实例
let Request = require("../../utils/request"); // 封装请求
let that = this; // 指向本page
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    hasUserInfo: false,
    attentionButton: "关注",
    user: '默认',
    activity: {},
    imgUrl: [
      "http://tmp/wx709ec57613620a10.o6zAJsyKmOl0pqIDaGxctAcrUge8.jjznZKLP7PKL5e23b46026364a516cce7477e719a7c5.jpg"
    ],
    dynamic: {
      "list": []
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Tabs: [{
        id: 0,
        name: "动态",
        isActive: true
      },
      {
        id: 1,
        name: "消息",
        isActive: false
      },
    ],
    dynamicCurrentPage: 1,
  },

  methods: {
    hanldeItemTap(e) {
      console.log("点击成功");
      const {
        index
      } = e.currentTarget.dataset;
      this.triggerEvent("itemChange", {
        index
      });

      let {
        tabs
      } = this.data;
      tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);

      this.setData({
        tabs
      })
    }
  },
  handleItemChange(e) {
    //接收传递过来的参数
    const {
      index
    } = e.detail;
    app.globalData.homeIndex = index;

    let {
      Tabs
    } = this.data;
    Tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      Tabs
    })
  },


  onLoad: function () {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    that.loadInitData();
  },
  getUserInfo: function (e) {
    var that = this;
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    that.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  loadInitData: function () {
    var that = this;
    that.setData({
      user: app.globalData.user
    })
    var homeIndex = app.globalData.homeIndex;
    // 目前为第一页
    var currentPage = 1;
    // 请封装自己的网络请求接口.
    that.getDynamicsList(currentPage);

  },

  //动态点赞
  likeClick: async function (e) {
    var that = this;
    //拿到点击的dyid
    let dyid = e.currentTarget.dataset.dyid;
    //拿到当前用户id
    var userid = app.globalData.user.userid;
    //拿到当前点赞index
    let index = e.currentTarget.dataset.index;
    //拿到当前dynamic
    var dynamic = this.data.dynamic;
    console.log(index)
    //拿到是否点赞
    var isLike = dynamic.list[index].isLike;
    if (isLike == false) {
      dynamic.list[index].isLike = true;
      dynamic.list[index].likes++;
      that.setData({
        dynamic: dynamic
      })
      try {
        let msg = await Request.request({
          url: `/bbs/like?toid=${dyid}&type=dynamic&userid=${userid}`,
          method: 'post'
        }, false, false)
        if (msg.statusCode == 200) {
          console.log("点赞成功");
        } else {
          throw new Error("点赞失败");
        }
      } catch (error) {
        console.dir(error.message);
      }
    } else {
      dynamic.list[index].isLike = false;
      dynamic.list[index].likes--;
      that.setData({
        dynamic: dynamic
      })
      try {
        let msg = await Request.request({
          url: `/bbs/dislike?toid=${dyid}&type=dynamic&userid=${userid}`,
          method: 'delete'
        }, false, false)
        if (msg.statusCode == 200) {
          console.log("取消赞成功");
        } else {
          throw new Error("取消赞失败");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  },
  preview(event) {
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
  getDynamic: function (e) {
    let dyid = e.currentTarget.dataset.dyid;
    wx.navigateTo({
      url: '/pages/homePage/dynamicDetail/dynamicDetail?dyid=' + dyid
    })
  },


  attentionClick: function (e) {
    let userid = e.currentTarget.dataset.userid;
    if (app.globalData.user.userid == userid) {
      wx.showToast({
        title: '不能关注自己！',
        icon: 'none'
      })
    } else {
      var path = "/follow";
      var data = {
        "touserid": userid,
        "userid": app.globalData.user.userid
      }
      Request.postRequest(path, data, function () {});
      console.log("关注成功！");
      wx.showToast({
        title: '关注成功',
      })
      that.loadInitData(2);
    }
  },
  person_index: function (options) {
    var userid = options.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '/pages/mycenter/person_index/person_index?userid=' + userid
    })
  },



  //传userid给allComments界面
  getAllComments: function (e) {
    var userid = app.globalData.user.userid;
    console.log(userid);
    wx.navigateTo({
      url: '/pages/index/allComments/allComments?userid=' + userid
    })
  },

  getAllLike: function (e) {
    var userid = app.globalData.user.userid;
    console.log(userid);
    wx.navigateTo({
      url: '/pages/index/allLike/allLike?userid=' + userid
    })
  },


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //加载下一页数据
  loadMoreData: function () {
    var homeIndex = app.globalData.homeIndex;
    this.getDynamicsList(this.data.dynamicCurrentPage + 1);

  },

  getDynamicsList(currentPage) {
    var that = this;
    wx.showLoading({
      title: 'Loading...',
    })
    console.log("getDynamics " + currentPage + " page");
    var access_token = app.globalData.accesstoken.access_token;
    // + "&access_token=" + access_token
    Request.getRequest("/dynamic/page?len=5&page=" + currentPage + "&userid=" + app.globalData.user.userid, function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh() //停止下拉刷新
      console.log(res.data)
      var resData = res.data;
      if (resData.list.length == 0) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      } else {
        console.log("getDynamics " + currentPage + " page");
        var nowDynamic = that.data.dynamic;
        if (currentPage == 1) {
          nowDynamic = resData
        } else {
          nowDynamic.list = nowDynamic.list.concat(resData.list);
        }
        console.log(nowDynamic, app.globalData.user.userid);
        that.setData({
          dynamic: nowDynamic,
          dynamicCurrentPage: currentPage
        })
      }

    })
  },
  onReachBottom: function () {
    this.loadMoreData();
  },
})