// pages/home/xuetang/xuetang.js
let Request = require("../../utils/request"); // 封装请求
let that; // 指向本page
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 标准
     */
    activeNames: ['1'],
    attentionButton:"关注",
    user: '默认',
    activity:{},
    imgUrl:[
      "http://tmp/wx709ec57613620a10.o6zAJsyKmOl0pqIDaGxctAcrUge8.jjznZKLP7PKL5e23b46026364a516cce7477e719a7c5.jpg"
    ],
    dynamic:{
      "list":[]
    },
    topic:{
      "list":[]
    },
    news: {},
    sample: {}, 
    software:{},
    course:{},
    biaozhun:{},
    province_list:{},
    Tabs: [
      {
        id: 0,
        name: "头条",
        isActive: true
      },
      {
        id: 1,
        name: "标准",
        isActive: false
      },
      {
        id: 2,
        name: "话题",
        isActive: false
      },
      {
        id: 3,
        name: "学堂",
        isActive: false
      }
    ],
    newsCurrentPage:1,
    dynamicCurrentPage:1,
    topicCurrentPage: 1,


    //标准栏左边被点击的菜单
    biaozhunCurrentIndex:0,
    biaozhunCurrentProvince:'北京市',
  },

  /**
   * 标准tab
   */
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  //tab切换
  handleItemChange(e) {
    //接收传递过来的参数
    const { index } = e.detail;
    app.globalData.homeIndex = index;
    
    let { Tabs } = this.data;
    Tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      Tabs
    })

    //加载数据
    that.loadInitData();
  },
  //动态点赞
  likeClick: function (e) {
    wx.showLoading({
      title: 'Loading...',
    })
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
      dynamic.list[index].likes ++ ;
      that.setData({
        dynamic: dynamic
      }, function () {
        wx.hideLoading();
      })
      Request.postRequest("/like?toid=" + dyid + "&type=dynamic&userid=" + userid,null,function (res) {
        //打印请求结果
        // console.log(res);
        console.log("点赞成功");
      })
    }
    else{
      dynamic.list[index].isLike = false;
      dynamic.list[index].likes -- ;
      that.setData({
        dynamic: dynamic
      }, function () {
        wx.hideLoading();
      })
      Request.deleteRequest("/dislike?toid=" + dyid + "&type=dynamic&userid=" + userid, function (res) {
        //打印请求结果
        // console.log(res);
        console.log("取消赞成功");
      })
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
  getTopic: function (e) {
    let tpid = e.currentTarget.dataset.tpid;
    wx.navigateTo({
      url: '/pages/homePage/huatiDetail/huatiDetail?tpid=' + tpid
    })
  },
  sendUrl1: function (e) {
    let url1 = e.currentTarget.dataset.url1;
    console.log(url1);
    wx.navigateTo({
      url: '/pages/home/xuetang/course_video/course_video?url1=' + url1
    })
  },
  softwareDetail:function(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/home/toutiao/news_detail/news_detail?url=' + url
    })
  },
  attentionClick: function (e) {
    let userid = e.currentTarget.dataset.userid;
    if (app.globalData.user.userid == userid){
      wx.showToast({
        title: '不能关注自己！',
        icon: 'none'
      })
    }
    else{
      var path = "/follow";
      var data = {
        "touserid": userid,
        "userid": app.globalData.user.userid
      }
      Request.postRequest(path, data, function () { });
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
  
  //标准左侧省份栏点击事件
  handleBiaozhunItem:function(e){
    var province = e.currentTarget.dataset.province;
    console.log(province);
    this.setData({
      biaozhunCurrentProvince:province,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
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
    if(app.globalData.user == "" || app.globalData.user == null || app.globalData.user == undefined){
      wx.showLoading({
        title: 'Loading...',
      })
      app.userInit(function () {
        that.getInfos();
      });
    }
    else
    {
      that.getInfos();
    }
  },
  getInfos(){
    that.loadInitData();
    //设置显示的tab，主要用于发布动态或话题后的跳转
    var Tabs = that.data.Tabs;
    Tabs.forEach((v, i) => i === app.globalData.homeIndex ? v.isActive = true : v.isActive = false);
    that.setData({
      Tabs: Tabs
    })
  },
  getInfo(){
    //判断是否需要重新加载
    if (that.data.isRefresh) {
      that.loadInitData();
      //设置显示的tab，主要用于发布动态或话题后的跳转
      var Tabs = that.data.Tabs;
      Tabs.forEach((v, i) => i === app.globalData.homeIndex ? v.isActive = true : v.isActive = false);
      that.setData({
        Tabs: Tabs
      })
    }
    else {
      that.setData({
        isRefresh: true
      })
    }
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
    switch (homeIndex){
      case 0:
        that.getToutiaoList();
        break;
      case 1:
        that.getXuetangList();
        break;
      case 2:
        if (app.globalData.isTopRefresh == true) {
          that.getTopicsList(currentPage);
          app.globalData.isTopRefresh = false;
          that.setData({
            topicCurrentPage: 1,
          })
        }
        break;
      case 3:
        that.getXuetangList();
        break;
      default:
        wx.showToast({
          title: '小程序出错，请退出重进',
        })
    }
  },
  //加载下一页数据
  loadMoreData: function () {
    var homeIndex = app.globalData.homeIndex;
    switch(homeIndex){
      case 0:
        // this.getToutiaoList();
        // wx.navigateTo({
        //   url: '/pages/home/toutiao/all_news/all_news?type=news',
        // })
        break;
      case 1:
        this.getDynamicsList(this.data.dynamicCurrentPage+1);
        break;
      case 2:
        this.getTopicsList(this.data.topicCurrentPage+1);
        break;
    }
  },
  getToutiaoList(){
    console.log("getToutiao ");
    wx.showLoading({
      title: 'Loading...',
    })
    //加载3条活动数据作为轮播图
    Request.getRequest("/activity/page?len=3&page=1", function (res) {
      // console.log(res.data)
      that.setData({
        activity: res.data
      })
    })
    //加载10条新闻数据作为今日热点
    Request.getRequest("/link?len=10&type=news&page=1", function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh() //停止下拉刷新
      // console.log(res.data)
      that.setData({
        news: res.data
      })
    })
  },
  getDynamicsList(currentPage){
    wx.showLoading({
      title: 'Loading...',
    })
    var access_token = app.globalData.accesstoken.access_token;
    // + "&access_token=" + access_token
    Request.getRequest("/dynamic/page?len=5&page=" + currentPage + "&userid=" + app.globalData.user.userid, function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh() //停止下拉刷新
      console.log(res.data)
      var resData = res.data;
      if (resData.list.length == 0){
        wx.showToast({
          title: '没有更多了',
        })
      }
      else{
        console.log("getDynamics " + currentPage + " page");
        var nowDynamic = that.data.dynamic;
        if(currentPage == 1){
          nowDynamic = resData
        }
        else{
          nowDynamic.list = nowDynamic.list.concat(resData.list);
        }
        that.setData({
          dynamic: nowDynamic,
          dynamicCurrentPage: currentPage
        })
      }
      
    })
  },
  getTopicsList(currentPage){
    Request.getRequest("/topic/page?len=5&page=" + currentPage, function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh() //停止下拉刷新
      var resData = res.data;
      if (resData.list.length == 0) {
        wx.showToast({
          title: '没有更多了',
        })
      }
      else {
        console.log("getTopics " + currentPage + " page");
        var nowTopic = that.data.topic;
        if(currentPage == 1){
          nowTopic = resData;
        }
        else{
          nowTopic.list = nowTopic.list.concat(resData.list);
        }
        that.setData({
          topic: nowTopic,
          topicCurrentPage: currentPage
        })
      }
    })
  },
  getXuetangList(){
    //加载一条案例
    Request.getRequest("/link?len=1&type=sample&page=1", function (res) {
      // console.log(res.data)
      that.setData({
        sample: res.data.list[0]
      })
    })
    //加载6条软件
    Request.getRequest("/link?len=6&type=software&page=1", function (res) {
      wx.hideLoading();
      wx.stopPullDownRefresh() //停止下拉刷新
      // console.log(res.data)
      that.setData({
        software: res.data.list
      })
    })
    //加载4条课程
    Request.getRequest("/link?len=4&type=course&page=1", function (res) {
      that.setData({
        course: res.data.list
      })
    })

    //加载标准链接
    Request.getRequest("/link?len=20&page=1&type=standard", function (res) {
      that.setData({
        biaozhun: res.data.list
      })
    })

    Request.getRequest("/link/province_list", function (res) {
      that.setData({
        province_list: res.data.list
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
 * 下载文件并预览
 */
  downloadFile: function (e) {
    console.log(e);
    let url = e.currentTarget.dataset.url;
    wx.downloadFile({
      url: url,
      header: {},
      success: function (res) {
        var filePath = res.tempFilePath;
        console.log(filePath);
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        })
      },
      fail: function (res) {
        console.log('文件下载失败');
      },
      complete: function (res) { },


      onProgressUpdate:function (res) {
        console.log('下载进度', res.progress)
        console.log('已经下载的数据长度', res.totalBytesWritten)
        console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
      },
    })

  
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
    var homeIndex = app.globalData.homeIndex;
    console.log("下拉刷新" + homeIndex);
    switch (homeIndex) {
      case 0:
        this.getToutiaoList();
        break;
      case 1:
        app.globalData.isDynRefresh = true
        this.getDynamicsList(1);
        break;
      case 2:
        app.globalData.isTopRefresh = true
        this.getTopicsList(1);
        break;
      case 3:
        this.getXuetangList();
        break;
    }
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
