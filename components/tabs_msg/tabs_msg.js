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
      
      const { index } = e.currentTarget.dataset;
      this.triggerEvent("itemChange", { index });

    
    }
  }
})
