// //index.js



/*
 *       无效文件(分组件时有效，但index.wxml用了include)
 */




// //获取应用实例
// const {
//   BBSRequest
// } = require("../../../utils/request");
// let Request = require("../../../utils/request"); // 封装请求
// let that; // 指向本page
// const app = getApp()

// Page({
//   data: {
//     attentionButton: "关注",
//     user: '默认',
//     activity: {},
//     imgUrl: [
//       "http://tmp/wx709ec57613620a10.o6zAJsyKmOl0pqIDaGxctAcrUge8.jjznZKLP7PKL5e23b46026364a516cce7477e719a7c5.jpg"
//     ],
//     dynamic: {
//       "list": []
//     },
//     topic: {
//       "list": []
//     },
//     news: {},
//     sample: {},
//     software: {},
//     course: {},
//     biaozhun: {},
//     province_list: {},

//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo'),
//     Tabs: [{
//         id: 0,
//         name: "动态",
//         isActive: true
//       },
//       {
//         id: 1,
//         name: "消息",
//         isActive: false
//       },
//     ],
//   },

//   methods: {
//     hanldeItemTap(e) {
//       // 1 绑定点击事件 需要在methods中绑定
//       // 2 获取被点击的索引
//       // 3 获取原数组
//       // 4 对数组循环
//       //   1 给每一个循环项 选中属性改为false
//       //   2 给当前的索引项添加激活选中效果
//       console.log("点击成功");
//       const {
//         index
//       } = e.currentTarget.dataset;
//       this.triggerEvent("itemChange", {
//         index
//       });

//       let {
//         tabs
//       } = this.data;
//       tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);

//       this.setData({
//         tabs
//       })
//     }
//   },


//   handleItemChange(e) {
//     //接收传递过来的参数
//     const {
//       index
//     } = e.detail;
//     app.globalData.homeIndex = index;

//     let {
//       Tabs
//     } = this.data;
//     Tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
//     this.setData({
//       Tabs
//     })

//     //加载数据
//     that.loadInitData();
//   },




//   //动态点赞
//   likeClick: async function (e) {
//     //拿到点击的dyid
//     let dyid = e.currentTarget.dataset.dyid;
//     //拿到当前用户id
//     var userid = app.globalData.user.userid;
//     //拿到当前点赞index
//     let index = e.currentTarget.dataset.index;
//     //拿到当前dynamic
//     var dynamic = this.data.dynamic;
//     console.log(index)
//     //拿到是否点赞
//     var isLike = dynamic.list[index].isLike;
//     if (isLike == false) {
//       dynamic.list[index].isLike = true;
//       dynamic.list[index].likes++;
//       that.setData({
//         dynamic: dynamic
//       })
//       try {
//         let msg = await BBSRequest({
//           url: `/like?toid=${dyid}&type=dynamic&userid=${userid}`,
//           mothod: 'post'
//         })
//         console.log(msg);
//         console.log("点赞成功" + msg + "2356");
//       } catch (error) {
//         console.log("点赞失败");
//       }
//     } else {
//       dynamic.list[index].isLike = false;
//       dynamic.list[index].likes--;
//       try {
//         let msg = await BBSRequest({
//           url: `//dislike?toid=${dyid}&type=dynamic&userid=${userid}`,
//           mothod: 'delete'
//         })
//         console.log(msg);
//         console.log("取消赞成功");
//       } catch (error) {
//         console.log("取消赞失败");
//       }
//       that.setData({
//         dynamic: dynamic
//       })
//     }
//   },
//   preview(event) {
//     let currentUrl = event.currentTarget.dataset.src
//     let URLs = event.currentTarget.dataset.list
//     console.log(event.currentTarget.dataset.list)
//     wx.previewImage({
//       current: currentUrl, // 当前显示图片的http链接
//       urls: URLs // 需要预览的图片http链接列表
//     })
//     // this.setData({
//     //   isRefresh:false
//     // })
//   },
//   getDynamic: function (e) {
//     let dyid = e.currentTarget.dataset.dyid;
//     wx.navigateTo({
//       url: '/pages/homePage/dynamicDetail/dynamicDetail?dyid=' + dyid
//     })
//   },
//   sendUrl1: function (e) {
//     let url1 = e.currentTarget.dataset.url1;
//     console.log(url1);
//     wx.navigateTo({
//       url: '/pages/home/xuetang/course_video/course_video?url1=' + url1
//     })
//   },
//   softwareDetail: function (e) {
//     let url = e.currentTarget.dataset.url;
//     wx.navigateTo({
//       url: '/pages/home/toutiao/news_detail/news_detail?url=' + url
//     })
//   },
//   attentionClick: function (e) {
//     let userid = e.currentTarget.dataset.userid;
//     if (app.globalData.user.userid == userid) {
//       wx.showToast({
//         title: '不能关注自己！',
//         icon: 'none'
//       })
//     } else {
//       var path = "/follow";
//       var data = {
//         "touserid": userid,
//         "userid": app.globalData.user.userid
//       }
//       Request.postRequest(path, data, function () {});
//       console.log("关注成功！");
//       wx.showToast({
//         title: '关注成功'
//       })
//       that.loadInitData(2);
//     }
//   },
//   person_index: function (options) {
//     var userid = options.currentTarget.dataset.userid;
//     wx.navigateTo({
//       url: '/pages/mycenter/person_index/person_index?userid=' + userid
//     })
//   },

//   //标准左侧省份栏点击事件
//   handleBiaozhunItem: function (e) {
//     const index = e.currentTarget.dataset.index;
//     const province = e.currentTarget.dataset.province;
//     this.setData({
//       biaozhunCurrentIndex: index,
//       biaozhunCurrentProvince: province,
//     })
//   },




//   //传userid给allComments界面
//   getAllComments: function (e) {
//     var userid = app.globalData.user.userid;
//     console.log(userid);
//     wx.navigateTo({
//       url: '/pages/index/allComments/allComments?userid=' + userid
//     })
//   },

//   getAllLike: function (e) {
//     var userid = app.globalData.user.userid;
//     console.log(userid);
//     wx.navigateTo({
//       url: '/pages/index/allLike/allLike?userid=' + userid
//     })
//   },


//   //事件处理函数
//   bindViewTap: function () {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse) {
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function (e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   },
//   loadInitData: function () {
//     that.setData({
//       user: app.globalData.user
//     })
//     var homeIndex = app.globalData.homeIndex;
//     // 目前为第一页
//     var currentPage = 1;
//     // 请封装自己的网络请求接口.
//     switch (homeIndex) {
//       case 0:
//         that.getToutiaoList();
//         break;
//       case 1:
//         if (app.globalData.isDynRefresh == true) {
//           that.getDynamicsList(currentPage);
//           app.globalData.isDynRefresh = false
//           that.setData({
//             dynamicCurrentPage: 1,
//           })
//         }
//         break;
//       case 2:
//         if (app.globalData.isTopRefresh == true) {
//           that.getTopicsList(currentPage);
//           app.globalData.isTopRefresh = false;
//           that.setData({
//             topicCurrentPage: 1,
//           })
//         }
//         break;
//       case 3:
//         that.getXuetangList();
//         break;
//       default:
//         wx.showToast({
//           title: '小程序出错，请退出重进',
//           icon: 'none'
//         })
//     }
//   },
//   //加载下一页数据
//   loadMoreData: function () {
//     var homeIndex = app.globalData.homeIndex;
//     switch (homeIndex) {
//       case 0:
//         // this.getToutiaoList();
//         // wx.navigateTo({
//         //   url: '/pages/home/toutiao/all_news/all_news?type=news',
//         // })
//         break;
//       case 1:
//         this.getDynamicsList(this.data.dynamicCurrentPage + 1);
//         break;
//       case 2:
//         this.getTopicsList(this.data.topicCurrentPage + 1);
//         break;
//     }
//   },
//   getToutiaoList() {
//     console.log("getToutiao ");
//     wx.showLoading({
//       title: 'Loading...'
//     })
//     //加载3条活动数据作为轮播图
//     Request.getRequest("/activity/page?len=3&page=1", function (res) {
//       // console.log(res.data)
//       that.setData({
//         activity: res.data
//       })
//     })
//     //加载10条新闻数据作为今日热点
//     Request.getRequest("/link?len=10&type=news&page=1", function (res) {
//       wx.hideLoading();
//       wx.stopPullDownRefresh() //停止下拉刷新
//       // console.log(res.data)
//       that.setData({
//         news: res.data
//       })
//     })
//   },
//   getDynamicsList(currentPage) {
//     wx.showLoading({
//       title: 'Loading...'
//     })
//     var access_token = app.globalData.accesstoken.access_token;
//     // + "&access_token=" + access_token
//     Request.getRequest("/dynamic/page?len=5&page=" + currentPage + "&userid=" + app.globalData.user.userid, function (res) {
//       wx.hideLoading();
//       wx.stopPullDownRefresh() //停止下拉刷新
//       console.log(res.data)
//       var resData = res.data;
//       if (resData.list.length == 0) {
//         wx.showToast({
//           title: '已经到底了哦',
//           icon: 'none'
//         })
//       } else {
//         console.log("getDynamics " + currentPage + " page");
//         var nowDynamic = that.data.dynamic;
//         if (currentPage == 1) {
//           nowDynamic = resData
//         } else {
//           nowDynamic.list = nowDynamic.list.concat(resData.list);
//         }
//         that.setData({
//           dynamic: nowDynamic,
//           dynamicCurrentPage: currentPage
//         })
//       }

//     })
//   },
// })