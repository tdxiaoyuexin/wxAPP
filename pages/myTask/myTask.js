var autoHeight;
var autoWidth;
var flag;
Page({
	data:{
        activeList:[],
        tasksId:0,
        qnUrl:'http://fsimg.fensihudong.com/',
		imgalist:[],
		auto:{},
        page:0,
        imgViewHeight:0,
        imgViewWidth:0,
        hasMore:true
	},
    previewImage: function (e) {
        var imglist = new Array();
        var qnUrl = '';
        var taskIndex= e.currentTarget.dataset.task;
        imglist.push(this.data.qnUrl+this.data.activeList[taskIndex].header_pic);
        imglist.push(this.data.qnUrl+this.data.activeList[taskIndex].room_pic_b);
        imglist.push(this.data.qnUrl+this.data.activeList[taskIndex].room_pic_a);
        imglist.push(this.data.qnUrl+this.data.activeList[taskIndex].today_pic);
        this.data.imgalist=imglist;
        this.setData({
            imgalist:this.data.imgalist
        })
    	var that=this;
        var current=e.target.dataset.src; 
        flag=true; 
        wx.previewImage({  
            current: current, // 当前显示图片的http链接  
            urls: this.data.imgalist, // 需要预览的图片http链接列表
        }) 
    },
    autoImage: function(e) {
        var that=this;
    	//原图比例
        var $width = e.detail.width,
            $height = e.detail.height,
            ratio = $height/$width;
        var image = that.data.auto;

        image[e.target.dataset.index] ={
            width: that.data.imgViewHeight/ratio
        }

        that.setData({
            auto:image
        })
      
    },
    reUpload: function(e){
        console.log(e);
        var company= e.currentTarget.dataset.company;
        var companyid = e.currentTarget.dataset.companyid;
        var store = e.currentTarget.dataset.store;
        var storeid = e.currentTarget.dataset.storeid;
        var imgId = e.currentTarget.dataset.imgid;
        var taskId =e.currentTarget.dataset.taskid;
        wx.redirectTo({
          url:'/pages/takePictures/takePictures?company='+company+'&companyid='+companyid+'&store='+store+'&storeid='+storeid+'&imgId='+imgId+'&taskId='+taskId
        })
    },
    onLoad:function(){
    },
    onHide:function(){

    },
    onReachBottom: function () {  
        this.loadMore();
    },
    loadMore:function() {
        var that=this;
        var id = wx.getStorageSync('id');
          console.log(id,that.data.page);
        wx.request({
            url:'https://wxapp.fshd.com/wx/task/history',
            data:{page:that.data.page, id:id},
            method:'POST',
            success:function(res){
                console.log(res);
                var res = res.data;
                if(res.code==200) {
                    that.data.activeList=that.data.activeList.concat(res.data);
                  //  console.log(that.data.activeList);
                    that.data.page++;
                    that.setData({
                        activeList:that.data.activeList,
                        page:that.data.page
                    })
                }
                if(res.code==201) {
                    return false;
                }
            },
            complete: function() {
            // complete
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
            }
        });
    },
    onShow:function(){
        var that =this;
        wx.getSystemInfo({
            success:function(res){
                autoWidth = parseInt(res.windowWidth/750*156);
                autoHeight = parseInt(autoWidth/(156/88));
                that.setData({
                    imgViewHeight:autoHeight,
                    imgViewWidth:autoWidth,
                });
                that.loadMore();
            }
        });
       
    }   
})