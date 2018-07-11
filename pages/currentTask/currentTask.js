var WxParse = require('../../wxParse/wxParse.js');
import NumberAnimate from "../../utils/NumberAnimate";

//获取应用实例
Page({
  data: {
    leftArrow:false,
    rightArrow:false,
    currentPage: 0,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    disableScroll: true,
    vertical:false,
    taskList:[],
    article:'',
    taskId:0,
    showModal:true,
    isClick:true

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
      isClick:false,
      duration: e.detail.value
    })
    
  },
  swiperChange: function (e) { 
    var that = this;
    this.setData({
      currentPage:e.detail.current,
      isClick:true,
      'article': that.data.taskList[e.detail.current].task_example,
      'taskId':that.data.taskList[e.detail.current].id
    })
    this.setData({
      leftArrow:true,
      rightArrow:true
    })
 //   console.log(this.data.currentPage)
    if(this.data.currentPage<=0){
      this.setData({
        leftArrow:false,
        rightArrow:true
      })
    }
    if(this.data.currentPage>=this.data.taskList.length-1){
      this.setData({
        leftArrow:true,
        rightArrow:false
      })
    }

    WxParse.wxParse('article', 'html', that.data.article, that, 15);
    that.animate();
  },
  /*左切换*/
  tapSwiperLeft: function(e){
    var that=this;
    if(!that.data.isClick){
      return false; 
    }
    var temp = this.data.currentPage - 1;  
      if (temp <= 0) {  
          temp = 0 ;  
      }  
    this.setData({
     // isClick:false,
      currentPage: temp,
      'article': that.data.taskList[temp].task_example,
      //'taskId':that.data.taskList[that.data.currentPage].id
    })
    WxParse.wxParse('article', 'html', that.data.article, that, 15);
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
      'article': that.data.taskList[temp].task_example,
      //'taskId':that.data.taskList[that.data.currentPage].id
    });
    WxParse.wxParse('article', 'html', that.data.article, that, 15);
  },
  formatNote:function(value) {
    var strContent =value;
    var strNew =""
    var noteArray = new Array();
    noteArray = strContent.split('@'); //IE9、FF、chrome  
    return noteArray;
  },
  chagneStr: function(num){
    var pos=''
    if(num==1) {
      pos='首页';
    }
    if(num==2) {
      pos='播放前';
    }
    if(num==3) {
      pos='播放中';
    }
    return pos;
  },
  onLoad: function(options){
    var that =this;
  //  console.log(options);
    var id = wx.getStorageSync('id');
    var num = options.num;
    var newarray=new Array();
    that.setData({
      leftArrow:true,
      rightArrow:true,
      id:id,
      num:num
    })
    
    setTimeout(function(){
      that.setData({
        showModal:false
      })
    },1500);
   
    if(that.data.currentPage==0){
      that.setData({
        leftArrow:false
      })
    }
    wx.request({  
      url: 'https://wxapp.fshd.com/wx/task/list', 
      data: {id:that.data.id},
      method: 'POST', 
      success: function(res){ 
      /*  var res = JSON.parse(res.data);*/
   //   console.log(res)
        var res =res.data;
     //   console.log(res);
        if(res.code==200){
          that.setData({
            taskList:[]
          })
          that.data.taskList.length = 0;
       //   console.log(that.data.taskList);
          if(res.data.length==1){
            that.setData({
              indicatorDots: false,
              leftArrow:false,
              rightArrow:false
            })
          };
          for (var i =0; i<res.data.length; i++) {
            newarray[i] = {
                id: res.data[i].id,
                task: res.data[i].task,
                pass_num: parseInt(res.data[i].pass_num),
                photo_num: parseInt(res.data[i].photo_num),
                task_note: that.formatNote(res.data[i].task_note),
                task_example: res.data[i].task_example,
                deadline: res.data[i].deadline,
                ad_pos:that.chagneStr(res.data[i].ad_pos),
                progressValue: parseInt((parseInt(res.data[i].pass_num)+parseInt(res.data[i].check_status))/parseInt(res.data[i].photo_num)*100),
                num1:(parseInt(res.data[i].pass_num)/parseInt(res.data[i].photo_num)).toFixed(2)*100
            };

          };
          that.data.taskList = newarray.concat(that.data.taskList);
        //   console.log( that.data.taskList,that.data.currentPage)
          that.setData({
            'taskList': that.data.taskList,
            'article': that.data.taskList[that.data.currentPage].task_example,
            'taskId':that.data.taskList[that.data.currentPage].id
          })
          //富文本编辑框
          WxParse.wxParse('article', 'html', that.data.article, that, 15);
          that.animate();
        }
      }
    })
  },
  animate:function(){
    var num1 = this.data.taskList[this.data.currentPage].progressValue;
    var n1 = new NumberAnimate({
        from: num1,//开始时的数字
        speed:1000,// 总时间
        refreshTime:100,//  刷新一次的时间
        decimals:0,//小数点后的位数
        onUpdate:()=>{//更新回调函数
          this.setData({
            num1:n1.tempValue          
          });
        },
        onComplete:()=>{//完成回调函数
            this.setData({
              num1Complete:"完成了"
            });
        }
    });
 
  },
  dotask:function(){
   // console.log('datask',this.data.taskId)
    wx.redirectTo({
      url:'/pages/takePictures/takePictures?taskId='+this.data.taskId
    })
  }
})