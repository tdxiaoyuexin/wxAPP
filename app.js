//app.js
App({
  onLaunch: function () {},
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData:{
    userInfo:null
  },
  apiFunc:{
   upload_file: function(url, filePath, name, formData, success, fail) {
      console.log('a='+filePath)
      wx.uploadFile({
        url: rootUrl + url,
        filePath:filePath,
        name:name,
        header: {
            'content-type':'multipart/form-data'
        }, // 设置请求的 header
         formData: formData, // HTTP 请求中其他额外的 form data
        success: function(res){
            console.log(res);
           if(res.statusCode ==200 && !res.data.result_code){
              typeof success == "function" && success(res.data);
          }else{
              typeof fail == "function" && fail(res);
          }
        },
        fail: function(res) {
            console.log(res);
          typeof fail == "function" && fail(res);
                }
          })
      }
  }
})
