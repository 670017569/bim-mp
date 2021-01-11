// pagesComponents/homeComponents/xuetang/xuetang.js
//Component Object
import Request from '../../../utils/request'

let that;

Component({
  properties: {

  },
  data: {
    sample: [],
    software: [],
    course: []
  },
  methods: {
    //获取数据
    async getData(show) {
      try {
        console.log("xuetang component");
      } catch (error) {

      }
      let msg = await Promise.all([Request.request({
        url: "/bbs/link?len=1&type=sample&page=1"
      }, show), Request.request({
        url: "/bbs/link?len=6&type=software&page=1"
      }, show), Request.request({
        url: "/bbs/link?len=4&type=course&page=1"
      }, show)]);
      //缓存数据
      wx.setStorageSync("xuetang_sample", msg[0].data.list);
      wx.setStorageSync("xuetang_software", msg[1].data.list);
      wx.setStorageSync("xuetang_course", msg[2].data.list);
      that.setData({
        sample: msg[0].data.list,
        software: msg[1].data.list,
        course: msg[2].data.list
      })
    },
    //software详情
    softwareDetail: function (e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: '/pages/home/toutiao/news_detail/news_detail?url=' + url
      })
    },
    //跳转video界面
    sendUrl1: function (e) {
      let url1 = e.currentTarget.dataset.url1;
      console.log(url1);
      wx.navigateTo({
        url: '/pages/home/xuetang/course_video/course_video?url1=' + url1
      })
    }
  },
  created: async function () {
    that = this;
    console.log("xuetang creat");
    //检测是否有缓存
    try {
      var sample = await wx.getStorageSync("xuetang_sample");
      var software = await wx.getStorageSync("xuetang_software");
      var course = await wx.getStorageSync("xuetang_course");
      if (sample && software && course) {
        this.setData({
          sample,
          software,
          course
        })
      }
    } catch (error) {
      console.log(error);
    }
  },
  attached: function () {

  },
  ready: function () {

  },
  moved: function () {

  },
  detached: function () {

  },
});