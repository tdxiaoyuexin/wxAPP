var WxParse = require('../../wxParse/wxParse.js');

//获取应用实例

var interval,varName,progress;
var ctx_arc= 'canvasArcCir';
var cxt_bg= 'canvasCircle';

Page({
  data: {
    currentPage: 0,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    disableScroll: true,
    canvasWidth:0, 
    canvasHeight:0 ,
    vertical:false,
    hidden:false,
    taskList:[]
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
   /* ctx_arc= 'canvasArcCir'+this.data.taskList[e.detail.current].taskId;
    cxt_bg= 'canvasCircle'+this.data.taskList[e.detail.current].taskId;
    progress = this.data.taskList[e.detail.current].progressValue;
    console.log(progress);
    this.drawbackground(cxt_bg);
    this.drawCircle(ctx_arc,progress);*/
    this.data.hidden=false;

    progress = this.data.taskList[e.detail.current].progressValue;
    this.drawbackground(cxt_bg);
    this.drawCircle(ctx_arc,progress);
    this.canvasToImage2('canvasCircle');
    this.canvasToImage('canvasArcCir');

  },
  canvasToImage: function(canvas_Id){
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      destWidth: this.data.canvasWidth,
      destHeight: this.data.canvasWidth,
      canvasId: canvas_Id,
      success: function(res) {
        console.log(res);
        console.log(res.tempFilePath);
        that.setData({
          canvasSrc:res.tempFilePath
        })
      } 
    })
  },
   canvasToImage2: function(canvas_Id){
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      destWidth: this.data.canvasWidth,
      destHeight: this.data.canvasWidth,
      canvasId: canvas_Id,
      success: function(res) {
        console.log(res);
        console.log(res.tempFilePath);
        that.setData({
          canvasSrc2:res.tempFilePath
        })
      } 
    })
  },
  /*左切换*/
  tapSwiperLeft: function(e){
    var that=this;
     var temp = this.data.currentPage - 1;  
      if (temp <= 0) {  
          temp = 0 ;  
      }  
    this.setData({  
      currentPage: temp
    })
/*    ctx_arc= 'canvasArcCir'+this.data.taskList[temp].taskId;
    progress = this.data.taskList[temp].progressValue;
    cxt_bg= 'canvasCircle'+this.data.taskList[temp].taskId;
    this.drawbackground(cxt_bg);
    this.drawCircle(ctx_arc,progress);*/
 
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
      currentPage: temp
    });
  /*  ctx_arc= 'canvasArcCir'+this.data.taskList[temp].taskId;
    cxt_bg= 'canvasCircle'+this.data.taskList[temp].taskId;
    progress = this.data.taskList[temp].progressValue;
    this.drawbackground(cxt_bg);
    this.drawCircle(ctx_arc,progress);*/
  },
  /*画图*/
  drawCircle: function (ctx,progress) {
    var that=this;

    var ctx = wx.createCanvasContext(ctx);
    ctx.clearActions();

    var end=progress;

    var endAngle = 1.5 * Math.PI*end/100;
 //   clearInterval(varName);
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, 200, 200);
      ctx.draw();
      var x = that.data.canvasWidth/2, y = that.data.canvasWidth/2, radius = that.data.canvasWidth/2-6;
      ctx.setLineWidth(6);
      ctx.setStrokeStyle('#ffe262');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, -Math.PI * 1 / 2, endAngle, false);
      ctx.stroke()
      ctx.draw()
    }
   drawArc();
  },
  drawbackground:function(cxt_bg){
      // 背景
      var cxt_bg = wx.createCanvasContext(cxt_bg);
      cxt_bg.setLineWidth(6);
      cxt_bg.setStrokeStyle('#35a2cd');
      cxt_bg.setLineCap('round');
      cxt_bg.beginPath();
      cxt_bg.arc(this.data.canvasWidth/2, this.data.canvasWidth/2, this.data.canvasWidth/2-6, 0, Math.PI*2, false);
      cxt_bg.stroke();
      cxt_bg.draw();
  },
  onReady: function () {
      var that = this;
    wx.getSystemInfo({  
      success: function(res) {  
        var windowWidth = res.windowWidth;
        that.setData({
          canvasWidth: 283/ 750 * windowWidth,
          canvasHeight: 283/ 750 * windowWidth
        })
      }  
    })
   /* for(var i=0; i<this.data.taskList.length;i++){
        ctx_arc= 'canvasArcCir'+this.data.taskList[i].taskId;
        cxt_bg= 'canvasCircle'+this.data.taskList[i].taskId;
        progress =this.data.taskList[i].progressValue;
        console.log(progress);
        this.drawbackground(cxt_bg);
        this.drawCircle(ctx_arc,progress);
    }*/
     //   progress =this.data.taskList[0].progressValue;
/*        this.drawbackground(cxt_bg);
        this.drawCircle(ctx_arc,progress);
        this.canvasToImage2('canvasCircle');
        this.canvasToImage('canvasArcCir');*/
  },
  onLoad: function (options) {
    var that =this;
    var id = wx.getStorageSync('id');
    var num = options.num;
    var newarray=new Array();
    /**/
    wx.request({  
      url: 'https://wxapp.fshd.com/wx/task/list',//上线的话必须是https，没有appId的本地请求貌似不受影响  
      data: {total:num,id:id,num:1},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        // header: {}, // 设置请求的 header  
      success: function(res){ 
        
        var res = JSON.parse(res.data);
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
                progressValue: (parseInt(res.data[i].pass_num)/parseInt(res.data[i].photo_num)).toFixed(2)*100
            };
           /* that.data.taskList[i].id: res.data[i].id;
            that.data.taskList[i].task=res.data[i].task;
            that.data.taskList[i].pass_num =parseInt(res.data[i].pass_num);
            that.data.taskList[i].photo_num= parseInt(res.data[i].photo_num);
            that.data.taskList[i].task_note =res.data[i].task_note;
            that.data.taskList[i].task_example =res.data[i].task_example;
            that.data.taskList[i].progressValue =(parseInt(res.data[i].pass_num)/parseInt(res.data[i].photo_num)).toFixed(2)*100;*/
          };
          that.data.taskList = newarray.concat(that.data.taskList);
          that.setData({
            'taskList':newarray.concat(that.data.taskList)
          })

        }
      }
    })
        

    var article = `< !DOCTYPE HTML ><!--注释: wxParse试验文本-->
      <div style="text-align:center;margin-top:10px;">
        <img src="https://weappdev.com/uploads/default/original/1X/84512e0f4591bcf0dee42c3293f826e0c24b560c.jpg" alt="wxParse-微信小程序富文本解析组件Logo">
        <h1 style="color:red;">wxParse-微信小程序富文本解析组件</h1>
        <h2 >支持Html及markdown转wxml可视化</h2>
      </div>
      <div style="margin-top:10px;">
        <h3 style="color: #000;">支持video</h3>
      </div>
    `;
    WxParse.wxParse('article', 'html', article, that, 5);
  }
})