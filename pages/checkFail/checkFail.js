Page({
	data:{
		titleMsg:'',
		code:0
	},
	goback: function(){
		wx.redirectTo({
			url:"/pages/login/login"
		});
	},
	onLoad: function(options){
		this.setData({
			titleMsg:options.titleMsg,
			code:options.code
		})
	}
})