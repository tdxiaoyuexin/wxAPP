
// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    disabled:false,
    tasksNum:0,
    lastHour:0,
    lastMin:0,
    lastSec:0,
    timeTile:"当前任务结束倒计时：" 
  },
/**
   * 时间秒数格式化
   * @param s 时间戳（单位：秒）
   * @returns {*} 格式化后的时分秒
   */
  sec_to_time:function(s) {
      var t="";
      if(s > -1){
          var hour = Math.floor(s/3600);
          var min = Math.floor(s/60) % 60;
          var sec = s % 60;
          if(hour < 10) {
              t = '0'+ hour + ":";
          } else {
              t = hour + ":";
          }

          if(min < 10){t += "0";}
          t += min + ":";
          if(sec < 10){t += "0";}
          t += sec.toFixed(2);
      }
      return t;
  },

  sec_to_hour:function(s) {
      var t="";
      if(s > -1){
          var hour = Math.floor(s/3600);
          var sec = s % 60;
          if(hour < 10) {
              t = '0'+ hour;
          } else {
              t = hour;
          }
      }
      return t;
  },
  sec_to_min:function(s) {

      var t="";
      if(s > -1){
        var min = Math.floor(s/60) % 60;

        if(min < 10){
          t += "0"+min;
        } else{
          t = min;
        }
        
      }
      return t;
  },
  sec_to_sec:function(s) {
      var t='';
      if(s > -1){
          var sec = s % 60;
          if(sec < 10){t += "0";}
          t += sec.toFixed(0);
          
      }
      return t;
  },
  time:0,
  timer:null,
  onShow: function (options) {
    var that = this;
    clearTimeout(that.timer);
    var id = wx.getStorageSync('id');
    wx.request({  
      url: 'https://wxapp.fshd.com/wx/endtime', 
      data: {id:id},
      method: 'POST', 
      success: function(res){ 
       var res =res.data;
          console.log(res);
        if(res.code==200){ 
          that.setData({
            tasksNum: res.data.num, //options.num,
            deadline: res.data.deadline,
            mytaskNum: res.data.my_num
          })
          if(that.data.tasksNum<=0){
            that.setData({
              disabled:true
            })
          }
           /*    var num = options.num; */
          var deadline = that.data.deadline;//options.deadline;
          that.time = deadline;
          that.cutdown();
        }
      }
    })


  },
  onLoad:function(){

  },
  onUnload:function(){
/*    clearTimeout(this.timer);*/
  },
  timer:null,
  cutdown: function() {
    this.time =this.time-1;
    if(this.time>0){ 
      var h =this.sec_to_hour(this.time);
      var m =this.sec_to_min(this.time);
      var s =this.sec_to_sec(this.time);
     // console.log(h,m,s);
      this.setData({
        lastHour:h,
        lastMin:m,
        lastSec:s
      }); 
      this.timer = setTimeout(this.cutdown,1000);
    }
  },
  jumpMytask: function() {
    clearTimeout(this.timer);
    wx.redirectTo({
      url:'/pages/currentTask/currentTask?num='+this.data.tasksNum
    })
  },
  mytask:function(){
    clearTimeout(this.timer);
    if(this.data.mytaskNum==0){

      wx.redirectTo({
        url:'/pages/noTask/noTask'
      })
    }else{
      wx.redirectTo({
        url:'/pages/myTask/myTask'
      })
    }
    /*var id = wx.getStorageSync('id');*/
  }
})