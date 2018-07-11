Page({
	data:{
		tasksNum:0,
	},
	onLoad: function(){
		var that = this;
	    var id = wx.getStorageSync('id');
	    wx.request({  
	      url: 'https://wxapp.fshd.com/wx/endtime', 
	      data: {id:id},
	      method: 'POST', 
	      success: function(res){ 
	       var res =res.data;
	        if(res.code==200){ 
	          that.setData({
	            tasksNum: res.data.num
	          })
	        }
	      }
	    })
	},
	goback:function(){
	 	wx.redirectTo({
	      url:'/pages/tasks/tasks'
	    })
	},
	makePhoneCall:function(event){
		wx.makePhoneCall({
			phoneNumber:'4006189920'
		})
	}
})