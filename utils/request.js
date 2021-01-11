let app = getApp()
/**
 * 服务端 URL, 末尾没有'/', 请求路径需要以'/' 开头
 * @type {string}
 */
// const BASE_URL = 'http://bbs.bmy8.xyz/wx';
const BASE_URL='http://localhost:9001/wx';
/**
 * POST/PUT默认请求头
 */
const header = {
  'content-type': 'application/json',
};

/**
 * 对BBS微服务的DELETE 请求
 * @param path 应用路径
 * @param callback 回调
 */
function deleteRequest(path, callback) {
  wx.request({
    url: BASE_URL + path,
    method: 'DELETE',
    success: res => {
      callback(res);
    }
  })
}


/**
 * 对BBS微服务的GET 请求
 * @param path 应用路径
 * @param callback 回调
 */
function getRequest(path, callback) {
  wx.request({
    url: BASE_URL + path,
    method: 'GET',
    header: header,
    success: res => {
      callback(res);
    }
  })
}

/**
 *对BBS微服务的 POST 请求
 * @param path 应用路径
 * @param data 请求数据
 * @param callback 回调
 * @param header 请求头 (可选参数)
 */
function postRequest(path, data, callback, header = header) {
  wx.request({
    url: BASE_URL + path,
    method: 'POST',
    header: header,
    data: data,
    success: res => {
      callback(res);
    }
  })
}

/**
 * 对BBS微服务的PUT 请求
 * @param path 应用路径
 * @param data 请求数据
 * @param callback 回调
 * @param header 请求头 (可选参数)
 */
function putRequest(path, data, callback, header = header) {
  wx.request({
    url: BASE_URL + path,
    method: 'PUT',
    header: header,
    data: data,
    success: res => {
      callback(res);
    }
  })
}

/**
 * 版本迭代 2020/10/28
 * obj = {
 * @param url 必填 请丢地址
 * @param method 选填 请求方法 默认get
 * @param data 选填 数据
 * @param header 选填 请求头
 * }
 * 
 * @param show 选填默认true 是否出现加载动画（针对下拉刷新）
 * @param msgShow 选填默认true 请求完成后是否需要提示信息
 * @param msg 选填默认 '加载完成' 请求完成提示信息内容
 */


let sum = 0;
// 对微服务请求封装
function request(obj, show = true, msgShow = true, msg = '加载完成') {
  let token = 'bearer ';
  //获取请求头token
  if (wx.getStorageSync('token').access_token) {
    token += wx.getStorageSync('token').access_token;
  } else {
    token = 'no token';
  }
  let header = {
    'content-type': 'application/json',
    'Authorization': token
  };
  console.log(header);
  return new Promise((resolve, reject) => {
    sum++;
    // 请求数据时产生等待动画
    if (sum <= 1 && show) {
      wx.showLoading({
        title: 'Loading...'
      })
    }
    wx.request({
      header: header,
      method: 'get',
      ...obj,
      url: BASE_URL + obj.url,
      success: res => {
        resolve(res);
      },
      fail: (err) => {
        // 请求数据失败提示
        wx.hideLoading();
        wx.showToast({
          icon: "none",
          mask: true,
          title: '加载失败，请刷新重试',
          duration: 3000
        })
        reject(err);
      },
      complete: () => {
        // 判断请求是否完毕，并关闭等待动画
        if (--sum === 0) {
          if (!show) {
            wx.stopPullDownRefresh({
              complete: (res) => {
                if (msgShow) {
                  wx.showToast({
                    title: msg,
                    icon: 'none'
                  })
                }

              }
            })
          }
          wx.hideLoading();
        }
      }
    })
  })
}

module.exports = {
  getRequest: getRequest,
  postRequest: postRequest,
  putRequest: putRequest,
  deleteRequest: deleteRequest,

  request: request
};