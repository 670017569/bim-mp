//Component Object

import Request from "../../../utils/request"

var that;

Component({
  properties: {

  },
  data: {
    activity: {},
    news: {},
    page: 1
  },
  lifetimes: {
    created: async function () {
      console.log("toutiao creat")
      //查询缓存中是否有数据
      try {
        var activity = await wx.getStorageSync("toutiao_activity");
        var news = await wx.getStorageSync("toutiao_news");
        if (activity && news) {
          this.setData({
            activity: activity,
            news: news
          })
        }
      } catch (error) {
        console.log(error);
      }
    }
  },
  methods: {
    // 请求数据（由父组件调用）
    async getData(show) {
      try {
        console.log("toutiao component");
        //加载3条活动数据作为轮播图
        //加载10条新闻数据作为今日热点
        var msg = await Promise.all([Request.request({
          url: "/bbs/activity/page?len=3&page=1"
        }, show), Request.request({
          url: "/bbs/link?len=10&type=news&page=1"
        }, show)]);
        //缓存数据
        wx.setStorageSync("toutiao_activity", msg[0].data);
        wx.setStorageSync("toutiao_news", msg[1].data.list);
        this.setData({
          page: this.data.page + 1,
          activity: msg[0].data,
          news: msg[1].data.list
        })
      } catch (error) {
        console.log(error);
      }
    },
    //加载下一页数据
    async getNextData() {
      if (this.data.news.length < 10) {
        wx.showToast({
          icon: 'none',
          title: '已经到底了'
        })
        return;
      }
      try {
        console.log("next toutiao");
        //加载后10条新闻数据
        var msg = await Request.request({
          url: `/bbs/link?len=10&type=news&page=${this.data.page}`
        });
        if (msg.data.list.length === 0) {
          wx.showToast({
            icon: 'none',
            title: '已经到底了'
          })
          return;
        }
        this.setData({
          page: this.data.page + 1,
          news: [...this.data.news, ...msg.data.list]
        })
      } catch (error) {
        console.log(error);
      }
    }
  }
});