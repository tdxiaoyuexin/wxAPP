var util = require("../../utils/util.js");
var app = getApp();
Page({
	data:{
		title:'',
		is_show:true,
		companyId:0,
		storeId:0,
		warnTitle: "",
		is_warnshow:false,
		is_warnshow2:false,
		username:'',
		yzCode:'',
		searchValue: '',  
		password:'',
		stepShow:false,
		companyList:[],
		myname:'',
		position:'',
		picker_show:true,
		disabled:true,
		showModal: false,
		titleMsg:'',
		isHead:false,
		openid:'',
	}, 
	countdown:10,
	settime:function(){
		var that=this;
		if(this.countdown ==0) {
			this.countdown==10;
			this.setData({
				is_show:true,
				last_time: this.countdown
			})
			return;
		} else {
			this.setData({
				is_show: false,
				last_time: this.countdown
			});
			this.countdown--;
		}

		setTimeout(function() {
			that.settime();
		},1000);
	},
	checkPhone:function(e) {
		var that =this;
		that.setData({
			username:e.detail.value,
		});
	
		if(e.detail.value==''){
			that.setData({    
		      	warnTitle:'',
		      	is_warnshow:false
	      	})
		}else{
			this.checkUserName(e.detail.value);
		}
	},
	checkUserName:function(param){
		if(param.length==0) {
			this.setData({
		 		warnTitle:'请输入手机号码!',
		 		is_warnshow:true
		 	});
		 	return false;
		}
	    var phone = util.regexConfig().phone;
	    if(phone.test(param)){
	   		this.setData({
	   		//	disabled:false,  
        		opacity:1,
		      	warnTitle:'',
		      	is_warnshow:false
	      	})
	      return true;
	    }else{
	      this.setData({
	    //  	disabled:true,  
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
			    warnTitle:'*请输入6-12位数字或字母!',
			    is_warnshow:true
			})
			return false;
		}else{
			this.setData({
			    warnTitle:'',
			    is_warnshow:false
			});
			return true;
		}
	},
	password:function(e){
		var that=this;
		var password=e.detail.value;
		that.setData({
			password:password
		})
		that.checkPassword(password);
	},
	yzm:function(e){
		var that=this;
		var yzCode =e.detail.value
		that.setData({
			yzCode:yzCode,
		});
		that.checkCode(yzCode)
	},
	checkCode:function(param){
		if(param.length==0) {
			this.setData({
				warnTitle:'请输入验证码！',
				is_warnshow:true
			})
			return false;
		}else if( param.toUpperCase()!=this.data.codeValue.toUpperCase()){
	    	this.setData({
	      		warnTitle:'*请输入正确的验证码!',
	      		is_warnshow:true
	        })
	      return false;
	    }else{
	    	this.setData({
	      		warnTitle:'',
	      		is_warnshow:false
	        })
	        return true;
	    }
	},
	nextFirst: function(){
		var that =this;
		if(that.checkUserName(that.data.username)&&that.checkCode(that.data.yzCode)&&that.checkPassword(that.data.password)){
			that.setData({
				stepShow:true
			})
		};
	},
  	scanfName: function(e){
  		this.setData({
  			myname:e.detail.value
  		})
  	},
  	scanfPosition:function(e){
  		this.setData({
  			position:e.detail.value
  		})
  	},
	formSubmit: function(e){
		var that =this;
		if(this.data.searchValue=="") {
    		this.setData({
    			warnNextTitle:"请搜索您所属的公司！",
    			is_warnshow2:true
    		})
    		return false;
    	};
    	if(this.data.storeId==0) {
    		this.setData({
    			warnNextTitle:"请选择您所属的门店！",
    			is_warnshow2:true
    		})
    		return false;
    	};
    	if(this.data.myname==""){
    		this.setData({
    			warnNextTitle:"请输入您的姓名！",
    			is_warnshow2:true
    		})
    		return false;
    	};
    	if(this.data.position==""){
    		this.setData({
    			warnNextTitle:"请输入您的职务！",
    			is_warnshow2:true
    		})
    		return false;
    	};
    	this.setData({
    		warnNextTitle:"",
    		is_warnshow2:false
    	});

		var company = e.detail.value.company_id;
    	var store = e.detail.value.store_id;
    	var pass = e.detail.value.password;
    	var phone = e.detail.value.username;
    	var name = e.detail.value.myname;
    	var level = e.detail.value.position;
    	var openid =this.data.openid;
    	console.log(openid)
  		var formData = {
  	company:company,store:store,pass:pass,phone:phone,name:name,level:level,openid:openid
  };
    	console.log(formData,openid);
    	wx.request({
    		url:'https://wxapp.fshd.com/wx/task/region',
    		method:'POST',
    		data:formData,
    		success:function(res){
    			console.log(res)
    			var res = res.data;
    			if(res.code==200){
    				wx.clearStorage();
    				that.setData({
    					isHead:true,
    					titleMsg:'粉丝互动会在1个工作日内审核\n您的注册申请,请耐心等待！',
    					showModal:true,
    					success:true
    				})
    			}else{
    				that.setData({
    					isHead:false,
    					titleMsg:res.msg,
    					showModal:true,
    					success:false
    				})
    			}
    		}
    	})
	},
	onCancel:function() {
/*		console.log(this.data.success);
*/		this.setData({
			titleMsg:'',
			showModal: false
		})
		if(this.data.success){
			wx.redirectTo({
				url:'/pages/login/login'
			})
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
	searchCompany: function(e){
	    // 搜索公司名称
	    var that= this;
	    var keyWord = e.detail.value;
	    if(!keyWord.length) {
	      this.setData({
	        searchList:{},
	        resultShow: false,
	        loadShow:false
	      })
	      return false
	    } else{
	      //输入内容不为空
	        this.setData({
	          searchList:{},
	          companyId:0,
	          disabled:true,
	          picker_show:true,
	          storeId:0,
	          loadShow: true
	        })
	      clearTimeout(timer);
	        var timer = setTimeout(function(){
	        var arr=[];
	        for(var s=0; s<that.data.companyList.length; s++) {

	          if(that.data.companyList[s].companyName.indexOf(keyWord)>=0){
	            arr.push({'id':that.data.companyList[s].id,'companyName':that.data.companyList[s].companyName});
	          } 
	        }
	       // console.log(arr.length)
	        if(arr.length==0){
	          that.setData({
	            searchList: {},
	            resultShow: false,
	            loadShow:true,
	            disabled:true
	          })
	        } else{
	          that.data.searchList =arr;
	          that.setData({
	            searchList: that.data.searchList,
	            resultShow: true,
	            loadShow:false,
	            disabled:false
	          })
	        }
	      },500) 
	    }
	},
	tapCompany:function(e){
  //  e.preventDefault()
    var that =this;
    var cid = e.currentTarget.dataset.id;
    this.setData({
      searchValue:e.currentTarget.dataset.name,
      companyId:e.currentTarget.dataset.id,
      searchList:{},
      resultShow: false,
      companyfocus: true,
      disabled:false
    })

    wx.request({
      url:"https://wxapp.fshd.com/wx/get/store",
      data: {cid: cid,task_id:0},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      success: function(res){ 
      	console.log(res);
        var arr=[];
        var res =res.data;
        if(res.code=200) {
          for(var key in res.data) {
            arr.push({'id':key,'storeName':res.data[key]})
          } 
        };
        that.data.storeArray=arr;
        that.setData({
          storeArray:that.data.storeArray
        });
      }
    })

  },
	bindPickerChange: function(e) {
	   // console.log('picker发送选择改变，携带值为', e.detail.value)
	    var index = e.detail.value;
	    var currentId = this.data.storeArray[index].id; // 这个id就是选中项的id
	    this.setData({
		    picker_show:false,
		    storeId:currentId,
	      index: e.detail.value
	    })
	},
  //  点击日期组件  
	bindDateChange: function (e) {  
	    this.setData({  
	      date: e.detail.value  
	    })  
	}, 
	onLoad:function(){
		var that=this;
		this.createCode();
//获取openid
	wx.login({
	success:function(res){
		var code = res.code;
		console.log(code);
		wx.getUserInfo({
			success:function(res_user) {
			/*	console.log(res_user);
				console.log('encryptedData:',res_user.encryptedData)
				console.log('iv:',res_user.iv)*/
				wx.request({
				    url:'https://wxapp.fshd.com/wx/openid',
				    data: {	code:code,encrypted:res_user.encryptedData,iv:res_user.iv},
				    method: 'POST', 
				    success: function(res){ 
				    	console.log(res);
				   		var res = res.data;
				   		if(res ==201){
				   			//请先关注公众号
				   			that.setData({
								titleMsg:'请先关注公众号,然后再重新注册',
						  		showModal:true
						  	})
				   		} else {
					   		that.setData({
					   			openid: res
					   		});
					   	}
				    }
				});
			},
			fail:function(){
				//调用微信授权
				console.log('获取个人信息失败')
				wx.getSetting({
			      success: (response) => {
			        console.log(response)
			        if (!response.authSetting['scope.userInfo']) {
			          wx.authorize({
			            scope: 'scope.userInfo',
			            success: () => {
			              console.log('yes')
			            }
			          })
			        }
			      }
			    })
			}
		});
	 	
	}
});

		var newarray = new Array();
		/*获取公司数据*/
	    wx.request({
	      url:'https://wxapp.fshd.com/wx/get/company',
	      data: {task_id:0},
	      method: 'POST', 
	      success: function(res){ 
	        var res =res.data;
	    //    console.log.log(res);
	        if(res.code==200) {
	          for(var key in res.data) {
	            newarray.push({'id':key,'companyName':res.data[key]});
	          };
	          that.data.companyList =newarray.concat(that.data.companyList);
	        }
	        that.setData({
	          'companyList': that.data.companyList
	        })
	      }
	    });
	}
})