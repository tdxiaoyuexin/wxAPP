var util = require("../../utils/util.js");
var app = getApp();
Page({
	data:{
		title:'',
		loginBtnTxt:'登录',
		is_show:true,
		warnTitle:'',
		is_warnshow:false,
		titleMsg: " ",
		cancleBtn: false,
		isHead:false
		//showModal:false //是否显示对话框

	},
	checkPhone:function(e) {
		var that =this;
		if(e.detail.value==''){
			that.setData({    
		      	warnTitle:'',
		      	is_warnshow:false
	      	})
		}else{
			this.checkUserName(e.detail.value);
		}
	},
	password:function(e){
		var that=this;
		if(e.detail.value==''){
			that.setData({
		      	warnTitle:'',
		      	is_warnshow:false
	      	})
		}else{
			this.checkPassword(e.detail.value);
		}
	},
	yzm:function(e){
		var that=this;
		if(e.detail.value==''){
			that.setData({
		      	warnTitle:'',
		      	is_warnshow:false
	      	})
		}else{
			this.checkYzm(e.detail.value);
		}
	},
	clickVerify:function(){
		var that = this;
		that.setData({
			is_show:(!that.data.is_show)
		});
		that.settime();
	},
    createCode: function() {
    	console.log('createCode')
	    var code = "";
	    var codeLength = 4; //验证码的长度
	    var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
	    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
	    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的
	    for (var i = 0; i < codeLength; i++) {
	        var charNum = Math.floor(Math.random() * 52);
	        code += codeChars[charNum];
	    }
	    this.setData({
	    	codeValue:code
	    })
	},

	checkUserName:function(param){
	    var phone = util.regexConfig().phone;
	    if(phone.test(param)){
	   		this.setData({
	   			disabled:false,  
        		opacity:1,
		      	warnTitle:'',
		      	is_warnshow:false
	      	})
	      return true;
	    }else{
	      this.setData({
	      	disabled:true,  
        	opacity:.7,
	      	warnTitle:'*请输入正确的手机号!',
	      	is_warnshow:true
	      })
	      return false;
	    }
	  },
	checkPassword: function(param){   
		if(param.length<6 ||param.length>12){
			this.setData({
			    warnTitle:'*请输入6-12位数字或字母的密码!',
			    is_warnshow:true
			})
			return false;
		}
		this.setData({
			disabled:false,
			opacity:1,
		    warnTitle:'',
		    is_warnshow:false
		})
		return true;
	},
	checkYzm: function(param){
	  	if(param.length<=0){
	       this.setData({
	      	warnTitle:'*请输入验证码!',
	      	is_warnshow:true
	      })
	      return false;
	    }

	    if(param.toUpperCase()!=this.data.codeValue.toUpperCase()){
	    	this.setData({
	      		warnTitle:'*请输入正确的验证码!',
	      		is_warnshow:true
	        })
	      return false;
	    }else {
	    	this.setData({
	    		disabled:false,
	    		opacity:1,
	      		warnTitle:'',
	      		is_warnshow:false
	        })
	    	return true;
	    }
	},
	onModal: function(){
		this.setData({
			titleMsg:'请联系客服400-618-9920找回密码。',
	  		showModal:true
	  	})
	},
	onCancel:function(){
	  	this.setData({
	  		showModal:false
	  	})
	},
	/**
	 * 表单提交
	 * @param  {[type]} e [description]
	 * @return {[type]}   [description]
	 */
	formSubmit:function(e){
		
		var that=this;
		var param = e.detail.value;
		var inputUserName = param.username.trim();
 		var password = param.password.trim();
		var yzm = param.yzm.trim();

		var flag = that.checkUserName(inputUserName)&&that.checkPassword(password)&&that.checkYzm(yzm); //参数验证
		if(flag) {
			wx.request({  
			    url: 'https://wxapp.fshd.com/wx/login',//上线的话必须是https，没有appId的本地请求貌似不受影响  
			    data: {phone:inputUserName,pass:password},
			    method: 'POST', 
			    success: function(res){ 			    	
/*			   		var res = JSON.parse(res.data);
*/			   	
					var res = res.data;
					console.log(res);
					//{result: 1, code: 200, id: "41", msg: "success", timestamp: 1515634985}
			        if(res.code==200) {
			        	wx.setStorage({
						    key:'userName',
						    data:inputUserName
					    });
						wx.setStorage({
						    key:'userPassword',
						    data:password
						});
						wx.setStorage({
						  key:'id',
						  data:res.id
						})
				       	wx.showToast({
						  title: '成功',
						  icon: 'success',
						  duration: 2000
						})
				       	//数据缓存
					
						wx.redirectTo({
							url:'/pages/tasks/tasks'
						})
			        };
			        if(res.code==201) {
				        that.setData({
							titleMsg:'用户名或密码有误！',
					  		showModal:true
					  	})
						return false;
			       	};
			       	if(res.code==202){//禁用
					  	wx.redirectTo({
					  		url:'/pages/checkFail/checkFail?titleMsg='+res.msg+'&code=202'
					  	})
			       		return false;
			       	}
			       	if(res.code==203){
			       	//审核中',
	
					  	wx.redirectTo({
					  		url:'/pages/checkFail/checkFail?titleMsg='+res.msg+'&code=203'
					  	})
			       		return false;
			       	};
			       	if(res.code==204) {
			       		console.log('204')
			       		//审核失败
					  	wx.redirectTo({
					  		url:'/pages/checkFail/checkFail?titleMsg='+res.msg+'&code=204'
					  	})
					  	return false;
			       	}
			       
			    },  
			    fail: function(res) {  
			        console.log('fail');
			    }
	    	}) 
		}
  	},
	onLoad:function(){
	    var that =this;
		wx.getStorage({
		   key: 'userName',
		   success: function(res){
		    that.setData({userName: res.data});
		   }
		});
		 wx.getStorage({
		   key: 'userPassword',
		   success: function(res){
		    that.setData({userPassword: res.data});
		   }
		});
		that.createCode();
	}
})
