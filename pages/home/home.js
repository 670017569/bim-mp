// pages/home/xuetang/xuetang.js
let Request = require("../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attentionButton: "关注",
    user: '默认',
    //activity: {},
    // imgUrl: [
    //   "http://tmp/wx709ec57613620a10.o6zAJsyKmOl0pqIDaGxctAcrUge8.jjznZKLP7PKL5e23b46026364a516cce7477e719a7c5.jpg"
    // ],
    dynamic: {
      "list": []
    },
    //tabs信息
    Tabs: [{
        id: 0,
        name: "头条",
        componentId: "toutiao",
        isActive: true,
        dataComplete: false //数据是否已经加载
      },
      {
        id: 1,
        name: "标准",
        componentId: "standard",
        isActive: false,
        dataComplete: false
      },
      {
        id: 2,
        name: "话题",
        componentId: "huati",
        isActive: false,
        dataComplete: false
      },
      {
        id: 3,
        name: "学堂",
        componentId: "xuetang",
        isActive: false,
        dataComplete: false
      }
    ]
  },

  //获取对应Tabs[id]的数据
  getList(id, update = false) {
    if (!this.data.Tabs[id].dataComplete || update) {
      var cpt = this.selectComponent("#" + this.data.Tabs[id].componentId);
      cpt.getData(!update);
      //修改数据是否已经加载
      this.data.Tabs[id].dataComplete = true;
    }
  },

  //监听更新事件
  getNextList(id) {
    //获取下一页数据；
    var cpt = this.selectComponent("#" + this.data.Tabs[id].componentId);
    cpt.getNextData();
  },

  //头条等tab切换
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
    //加载数据
    that.loadInitData();
  },

  //加载初始数据
  loadInitData: function () {
    that.setData({
      user: app.globalData.user
    })
    var homeIndex = app.globalData.homeIndex;
    // 目前为第一页
    var currentPage = 1;
    // 请封装自己的网络请求接口.
    switch (homeIndex) {
      case 0:
        that.getList(0); //加载头条数据
        break;
      case 1:
        that.getList(1); //加载标准数据
        break;
      case 2:
        that.getList(2); //加载话题数据
        break;
      case 3:
        that.getList(3); //加载学堂数据
        break;
      default:
        wx.showToast({
          title: '小程序出错，请重新启动',
        })
    }
  },

  //加载下一页数据
  loadMoreData: function () {
    var homeIndex = app.globalData.homeIndex;
    switch (homeIndex) {
      case 0:
        this.getNextList(0);
        break;
      case 1:
        this.getNextList(1);
        break;
      case 2:
        this.getNextList(2);
        break;
    }
  },

  //动态点赞
  // likeClick: function (e) {
  //   // wx.showLoading({
  //   //   title: 'Loading...',
  //   //   mask: true
  //   // })
  //   //拿到点击的dyid
  //   let dyid = e.currentTarget.dataset.dyid;
  //   //拿到当前用户id
  //   var userid = app.globalData.user.userid;
  //   //拿到当前点赞index
  //   let index = e.currentTarget.dataset.index;
  //   //拿到当前dynamic
  //   var dynamic = this.data.dynamic;
  //   console.log(index)
  //   //拿到是否点赞
  //   var isLike = dynamic.list[index].isLike;
  //   if (isLike == false) {
  //     dynamic.list[index].isLike = true;
  //     dynamic.list[index].likes++;
  //     that.setData({
  //       dynamic: dynamic
  //     }, function () {
  //       wx.hideLoading();
  //     })
  //     Request.postRequest("/like?toid=" + dyid + "&type=dynamic&userid=" + userid, null, function (res) {
  //       //打印请求结果
  //       // console.log(res);
  //       console.log("点赞成功");
  //     })
  //   } else {
  //     dynamic.list[index].isLike = false;
  //     dynamic.list[index].likes--;
  //     that.setData({
  //       dynamic: dynamic
  //     }, function () {
  //       wx.hideLoading();
  //     })
  //     Request.deleteRequest("/dislike?toid=" + dyid + "&type=dynamic&userid=" + userid, function (res) {
  //       //打印请求结果
  //       // console.log(res);
  //       console.log("取消赞成功");
  //     })
  //   }
  // },
  //图片预览
  // preview(event) {
  //   let currentUrl = event.currentTarget.dataset.src
  //   let URLs = event.currentTarget.dataset.list
  //   console.log(event.currentTarget.dataset.list)
  //   wx.previewImage({
  //     current: currentUrl, // 当前显示图片的http链接
  //     urls: URLs // 需要预览的图片http链接列表
  //   })
  // },
  //Dynamic跳转
  // getDynamic: function (e) {
  //   let dyid = e.currentTarget.dataset.dyid;
  //   wx.navigateTo({
  //     url: '/pages/homePage/dynamicDetail/dynamicDetail?dyid=' + dyid
  //   })
  // },
  // getDynamicsList(currentPage) {
  //   // wx.showLoading({
  //   //   title: 'Loading...',
  //   //   mask: true
  //   // })
  //   var access_token = app.globalData.accesstoken.access_token;
  //   // + "&access_token=" + access_token
  //   Request.getRequest("/dynamic/page?len=5&page=" + currentPage + "&userid=" + app.globalData.user.userid, function (res) {
  //     wx.hideLoading();
  //     wx.stopPullDownRefresh() //停止下拉刷新
  //     console.log(res.data)
  //     var resData = res.data;
  //     if (resData.list.length == 0) {
  //       wx.showToast({
  //         title: '没有更多了',
  //       })
  //     } else {
  //       console.log("getDynamics " + currentPage + " page");
  //       var nowDynamic = that.data.dynamic;
  //       if (currentPage == 1) {
  //         nowDynamic = resData
  //       } else {
  //         nowDynamic.list = nowDynamic.list.concat(resData.list);
  //       }
  //       that.setData({
  //         dynamic: nowDynamic,
  //         dynamicCurrentPage: currentPage
  //       })
  //     }

  //   })
  // },
  // attentionClick: function (e) {
  //   let userid = e.currentTarget.dataset.userid;
  //   if (app.globalData.user.userid == userid) {
  //     wx.showToast({
  //       title: '不能关注自己！',
  //       icon: 'none'
  //     })
  //   } else {
  //     var path = "/follow";
  //     var data = {
  //       "touserid": userid,
  //       "userid": app.globalData.user.userid
  //     }
  //     Request.postRequest(path, data, function () {});
  //     console.log("关注成功！");
  //     wx.showToast({
  //       title: '关注成功',
  //     })
  //     that.loadInitData(2);
  //   }
  // },
  // getInfo() {
  //   //判断是否需要重新加载
  //   if (that.data.isRefresh) {
  //     that.loadInitData();
  //     //设置显示的tab，主要用于发布动态或话题后的跳转
  //     var Tabs = that.data.Tabs;
  //     Tabs.forEach((v, i) => i === app.globalData.homeIndex ? v.isActive = true : v.isActive = false);
  //     that.setData({
  //       Tabs: Tabs
  //     })
  //   } else {
  //     that.setData({
  //       isRefresh: true
  //     })
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log("页面初始化")
    if (!app.globalData.user) {
      app.userInit();
    }
    that.loadInitData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var homeIndex = app.globalData.homeIndex;
    console.log("下拉刷新" + homeIndex);
    switch (homeIndex) {
      case 0:
        this.getList(0, true);
        break;
      case 1:
        this.getList(1, true);
        break;
      case 2:
        this.getList(2, true);
        break;
      case 3:
        this.getList(3, true);
        break;
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadMoreData(); //触发加载下一页
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})