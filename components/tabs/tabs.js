// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */

  // 里面存放 要从父组件中接收的数据
  properties: {
    //要接收数据的名称
    Tabs: {
      //type 要接收的数据类型
      type: Array,
      //value 默认值
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 1 页面.js文件中存放事件回调函数 存在data同层级下
   * 2 组件.js文件中 存放事件回调函数的时候 必须存在methods中
   */
  methods: {
    hanldeItemTap(e) {
      // 1 绑定点击事件 需要在methods中绑定
      // 2 获取被点击的索引
      // 3 获取原数组
      // 4 对数组循环
      //   1 给每一个循环项 选中属性改为false
      //   2 给当前的索引项添加激活选中效果
      const { index } = e.currentTarget.dataset;
      this.triggerEvent("itemChange", { index });

      //let {tabs}=this.data;
      //tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);

      //this.setData({
      //tabs
      //})
    }
  }
})
