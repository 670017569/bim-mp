let app = getApp()
/**
 * 服务端 URL, 末尾没有'/', 请求路径需要以'/' 开头
 * @type {string}
 */
//对bbs微服务的请求
const BBSURL = 'https://bbs.bmy8.xyz/bbs';

//对area微服务的请求
const AREAURL = 'https://bbs.bmy8.xyz/area';

/**
 * POST/PUT默认请求头
 */
const header = {
  'content-type': 'application/json',
  // 'Authorization':'bearer d60b971c-afb1-43fa-ab74-df1edaafd10d'
  
};

/**
 * 对Area微服务的GET请求封装
 * @param {path} path 
 * @param {callback} callback 
 */
function getAreaRequest(path,data,callback){
  wx.request({
    url: AREAURL + path,
    method: 'GET',
    data: data,
    header: header,
    success: res => {
      callback(res);
    }
  })
}

/**
 * 对AREA微服务的POST请求封装
 * @param {*} path 
 * @param {*} data 
 * @param {*} callback 
 * @param {*} header 
 */
function postAreaRequest(path,data,callback,header){
  wx.request({
    url: AREAURL + path,
    method: '',
    data: data,
    header: header,
    success: res => {
      callback(res);
    }
  })
}

/**
 * 对AREA微服务的PUT请求
 * @param path 应用路径
 * @param data 请求数据
 * @param callback 回调
 * @param header 请求头 (可选参数)
 */
function putAreaRequest(path, data, callback, header = header) {
  wx.request({
    url: AREAURL + path,
    method: 'PUT',
    header: header,
    data: data,
    success: res => {
      callback(res);
    }
  })
}

/**
 * 对BBS微服务的DELETE 请求
 * @param path 应用路径
 * @param callback 回调
 */
function deleteAreaRequest(path, callback) {
  wx.request({
    url: AREAURL + path,
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
    url: BBSURL + path,
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
    url: BBSURL + path,
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
    url: BBSURL + path,
    method: 'PUT',
    header: header,
    data: data,
    success: res => {
      callback(res);
    }
  })
}

/**
 * 对BBS微服务的DELETE 请求
 * @param path 应用路径
 * @param callback 回调
 */
function deleteRequest(path, callback) {
  wx.request({
    url: BBSURL + path,
    method: 'DELETE',
    success: res => {
      callback(res);
    }
  })
}

module.exports={
  getRequest: getRequest,
  postRequest: postRequest,
  putRequest: putRequest,
  deleteRequest: deleteRequest,

  getAreaRequest: getAreaRequest,
  postAreaRequest: postAreaRequest,
  putAreaRequest: putAreaRequest,
  deleteAreaRequest: deleteAreaRequest
};