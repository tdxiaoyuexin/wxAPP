var WxParse = require('../../wxParse/wxParse.js');

//获取应用实例
Page({
  data: {
    currentPage: 0,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    disableScroll: true,
    vertical:false,
    taskList:[],
    article:'',
    taskId:0

  },
  /*轮播图*/
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  swiperChange: function (e) { 

  },
  /*左切换*/
  tapSwiperLeft: function(e){
    var that=this;
     var temp = this.data.currentPage - 1;  
      if (temp <= 0) {  
          temp = 0 ;  
      }  
    this.setData({  
      currentPage: temp,
      'article': that.data.taskList[temp].task_example
    })
    WxParse.wxParse('article', 'html', that.data.article, that, 5);
  },
   
  /*右切换*/
  tapSwiperRight: function(){
    var that=this;
    var count = this.data.taskList.length-1;
    var temp = this.data.currentPage + 1;  
    if (temp >= count) {  
        temp = count;  
    }  
    this.setData({  
      currentPage: temp,
      'article': that.data.taskList[temp].task_example
    });
    WxParse.wxParse('article', 'html', that.data.article, that, 5);
  },
  onLoad: function (options) {
    var that =this;
    var id = wx.getStorageSync('id');
    var num = options.num;
    var newarray=new Array();
    wx.request({  
      url: 'https://wxapp.fshd.com/wx/task/list',//上线的话必须是https，没有appId的本地请求貌似不受影响  
      data: {total:num,id:id,num:1},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      success: function(res){ 
      /*  var res = JSON.parse(res.data);*/
        var res =res.data;
          console.log(res);
        if(res.code==200){
            
          for (var i =0; i<res.data.length; i++) {
            newarray[i] = {
                id: res.data[i].id,
                task: res.data[i].task,
                pass_num: parseInt(res.data[i].pass_num),
                photo_num: parseInt(res.data[i].photo_num),
                task_note: res.data[i].task_note,
                task_example: res.data[i].task_example,
                deadline: res.data[i].deadline,
                progressValue: (parseInt(res.data[i].pass_num)/parseInt(res.data[i].photo_num)).toFixed(2)*100
            };
        /*    that.data.taskList[i].id: res.data[i].id;
            that.data.taskList[i].task=res.data[i].task;
            that.data.taskList[i].pass_num =parseInt(res.data[i].pass_num);
            that.data.taskList[i].photo_num= parseInt(res.data[i].photo_num);
            that.data.taskList[i].task_note =res.data[i].task_note;
            that.data.taskList[i].task_example =res.data[i].task_example;
            that.data.taskList[i].progressValue =(parseInt(res.data[i].pass_num)/parseInt(res.data[i].photo_num)).toFixed(2)*100;*/
          };
          that.data.taskList = newarray.concat(that.data.taskList);
          that.setData({
           // 'taskList':newarray.concat(that.data.taskList)
            'taskList': that.data.taskList,
            'article': that.data.taskList[that.data.currentPage].task_example
          })
          //富文本编辑框
          WxParse.wxParse('article', 'html', that.data.article, that, 5);


        }
      }
    })
        

   
  }
})