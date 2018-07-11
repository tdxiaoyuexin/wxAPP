var util = require('../../utils/util.js');
var app = getApp();
Page({
  data:{
  	picker_show:true,
    picker_show2:true,
    companyList:[],
    companyId:0,
    storeId:0,
    storeName:'',
    companyName:'',
    searchList:[],
    loadShow:false,
  	storeArray: [],
    warnTitle:'请将信息和图片填写完整',
    resultShow:false,
    searchValue: '',  
    tapIndex:0,
    disabled:true,
    disabledCom:'',
    is_warnshow:false,
    header_pic:'',
    room_pic_a:'',
    room_pic_b:'',
    today_pic:'',
    isHead:false,
    pics:['/images/default.png','/images/default1.png','/images/default2.png','/images/default3.png'],
    taskId:0,
    task_img_id:'',
    showModal:false,
    showModal2:false,
    disabledButton:true
  },
  searchCompany: function(e){
    var that =this;
    // 搜索公司名称
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
        that.setData({
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
        //    disabled:true
          })
        } else{
          that.data.searchList =arr;
          that.setData({
            searchList: that.data.searchList,
            resultShow: true,
            loadShow:false,
         //   disabled:false
          })
        }
      },500)
      
    }
    
  },
  click_blank:function(e){
    this.setData({
      resultShow: false
    })
  },
  clear:function (){
    //清空数据
    this.setData({
      searchList:{}
    });
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
      data: {cid: cid,task_id:that.data.taskId},
      method: 'POST',  
      success: function(res){ 
        var arr=[];
        var res =res.data;
        if(res.code=200) {
          for(var key in res.data) {
            arr.push({'id':key,'storeName':res.data[key]})
          } 
        };
        that.data.storeArray=arr;
        that.setData({
          storeArray:that.data.storeArray,
        });
      }
    })

  },
  bindCompanyChange:function(e){
    var that =this
    var indexCom = e.detail.value;
    var currentId = this.data.companyList[indexCom].id; // 这个id就是选中项的id
    var compnayName = this.data.companyList[indexCom].companyName;
    this.setData({
      picker_show2:false,
      indexCom:indexCom,
      companyId:currentId,
      companyName:compnayName
    })
    wx.request({
      url:"https://wxapp.fshd.com/wx/get/store",
      data: {cid: currentId,task_id:that.data.taskId},
      method: 'POST',  
      success: function(res){
        console.log(res)
        var arr=[];
        var res =res.data;
        if(res.code=200) {
          for(var key in res.data) {
            arr.push({'id':key,'storeName':res.data[key]})
          } 
        };
        that.data.storeArray=arr;
        that.setData({
          storeArray:that.data.storeArray,
          disabled:false,
          picker_show:true,
          storeId:0
        });
      }
    })
  },
  bindPickerChange: function(e) {
   // console.log('picker发送选择改变，携带值为', e.detail.value)
   // 

    var index = e.detail.value;
    var currentId = this.data.storeArray[index].id; // 这个id就是选中项的id
    var storeName = this.data.storeArray[index].storeName;
    this.setData({
	    picker_show:false,
      index: e.detail.value,
      storeId:currentId,
      storeName:storeName
    })
  },
  //  点击日期组件  
  bindDateChange: function (e) {  
    this.setData({  
      date: e.detail.value  
    })  
  },  
  tabIndex:0,
  chooseImageTap: function(e){
    var that = this;

   //先判断是否已选择公司和门店
    if(that.data.companyId==0||that.data.storeId==0) {
      that.setData({ 
        titleMsg:'请先选择公司和门店。',  
        showModal:true
      })
      return false;
    }


    wx.request({
      url: 'https://wxapp.fshd.com/wx/get/token',
      method: 'GET',
      data: {},
      header: {
        'content-type':'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if(res.code=200) {
          that.token = res.data.token;
        }
      },
      fail:function (res) {
        console.log('error',res)
      }
    });
    that.setData({
      tapIndex: e.currentTarget.dataset.index
    })
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if(res.tapIndex == 0){
            that.gotoShow('album')
          }else if(res.tapIndex == 1){
            that.gotoShow('camera')
          }
        }
      }
    })
  },


  /*选择图片*/
  gotoShow: function(type){
    var that = this;
    wx.chooseImage({
       count: 1, // 最多可以选择的图片张数，默认9
       sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
       sourceType: [type], // album 从相册选图，camera 使用相机，默认二者都有
       success: function(res){
        var tempFilePaths = res.tempFilePaths;
        var tapIndex = that.data.tapIndex;
        if(tapIndex==0) {
          that.setData({
            'pics[0]':res.tempFilePaths[0],
            'picName':'足疗店门头照片'

          })
        }
        if(tapIndex==1) {
          that.setData({
            'pics[1]':res.tempFilePaths[0],
            'picName':'足疗店房间照片(一)'
          })
        }
        if(tapIndex==2) {
          that.setData({
            'pics[2]':res.tempFilePaths[0],
             'picName':'足疗店房间照片(二)'
          })
        }
        if(tapIndex==3) {
          that.setData({
            'pics[3]':res.tempFilePaths[0],
             'picName':'手持当天报纸照片'
          })
        }
        var filename =res.tempFilePaths[0];
        var local=filename.lastIndexOf("."); 
        var exten=filename.substring(local,filename.length);//后缀名 
        var key =that.data.searchValue+'--'+that.data.storeName+'--'+that.data.picName+'--'+Date.parse(new Date())+exten;
     
        wx.uploadFile({
          url:'https://upload.qiniup.com',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData:{
            'token':that.token,
            'key':key
          },
          success(res){
            
         //   console.log(res);
            if(res.statusCode==200){
              var res=JSON.parse(res.data);
              if(that.data.tapIndex==0){
                that.setData({
                  header_pic:res.key
                })
              } else if(that.data.tapIndex ==1) {
                that.setData({
                  room_pic_a:res.key
                });
              } else if(that.data.tapIndex==2) {
                that.setData({
                  room_pic_b:res.key
                })
              } else if(that.data.tapIndex==3) {
                that.setData({
                  today_pic:res.key
                });
              }
            }
          },
          fail:function(e){
            console.log('fail:',fail);
            wx.showModal({
              title: '提示',
              content: '上传失败',
              showCancel: false
            });
          },
          complete:function(){
            wx.hideToast();
          }
        })
       },
       fail: function() {
        // fail
       },
       complete: function() {
        // complete
       }
    })
  },
  /*表单提交*/
  bindSaveTap: function(e){
console.log(e)
    var that=this;
    var company_id = e.detail.value.company_id;
    var store_id = e.detail.value.store_id;
    var header_pic=e.detail.value.header_pic;
    var room_pic_a=e.detail.value.room_pic_a;
    var room_pic_b=e.detail.value.room_pic_b;
    var today_pic=e.detail.value.today_pic;
    var store_desc=e.detail.value.address;
    var room_a_name = e.detail.value.room1;
    var room_b_name = e.detail.value.room2;
    var img_time = e.detail.value.take_date;

//console.log('company_id:',company_id,'store_id:',store_id,store_desc,room_id,img_time,header_pic,room_pic_a,room_pic_b,today_pic)
    if(company_id=='0'){
      this.setData({
        warnTitle:'请选择公司',
        is_warnshow:true
      });
      return false;
    };
    if(store_id=="0"){
      this.setData({
        warnTitle:'请选择门店',
        is_warnshow:true
      });
      return false;
    };


    if(header_pic.length==0){
      this.setData({
        warnTitle:'请上传足疗店门头照片',
        is_warnshow:true
      });
      return false;
    };
    
    if(store_desc.length==0){
      this.setData({
        warnTitle:'请填写门店详细位置',
        is_warnshow:true
      });
      return false;
    };
    if(room_pic_a.length==0){
      this.setData({
        warnTitle:'请上传足疗店房间照片(一)',
        is_warnshow:true
      });
      return false;
    };

    if(room_a_name.length==0){
      this.setData({
        warnTitle:'请填写房间名称',
        is_warnshow:true
      });
      return false;
    };
    if(room_pic_b.length==0){
      this.setData({
        warnTitle:'请上传足疗店房间照片(二)',
        is_warnshow:true
      });
      return false;
    };
    if(room_b_name.length==0){
      this.setData({
        warnTitle:'请填写房间名称',
        is_warnshow:true
      });
      return false;
    };
    if(today_pic.length==0){
      this.setData({
        warnTitle:'请选择公司',
        is_warnshow:true
      });
      return false;
    };
    if(img_time==null){
      this.setData({
        warnTitle:'请填写拍照日期',
        is_warnshow:true
      });
      return false;
    };
       

    console.log('ok');
    this.setData({
        is_warnshow: false,
        showModal2:true,
        disabledButton:true
      });
    var formData = {
      company_id:company_id,
      store_id:store_id,
      store_desc:store_desc,
      room_a_name:room_a_name,
      room_b_name:room_b_name,

      header_pic:header_pic,
      room_pic_a:room_pic_a,
      room_pic_b:room_pic_b,
      today_pic:today_pic,
      

      img_time:img_time,
      task_id:that.data.taskId,
      user_id:that.data.user_id,  //缓存id
      task_img_id:that.data.task_img_id


    };
    console.log(formData)
    wx.request({
      url:'https://wxapp.fshd.com/wx/task/add',
      data:formData,
      method:'POST',
      success:function(res) {
        var res = res.data;
        console.log(res);
        //res.code==207 已上传过此任务
        if(res.code==200) {
         setTimeout(function(){
          that.setData({
            showModal2:false
          })
          wx.redirectTo({
            url:'/pages/uploadSucc/uploadSucc'
          })
         },1000);
          
        }else{
          that.setData({
            showModal2:false,
            titleMsg:res.msg,
            showModal:true
          })
          return false;
        }
      
      }
    });
 
  },
  onCancel: function() {
    this.setData({
      showModal:false
    })
  },
  onLoad: function(options){
    console.log(options);
    var user_id = wx.getStorageSync('id');
    /*重新上传时接收的参数*/
    var company = options.company;
    var companyid = options.companyid;
    var store = options.store;
    var storeid = options.storeid;
    var task_img_id = options.imgId;
    var taskId = options.taskId;
    var that= this;
    console.log(company,store);
    if(company&&store){
      that.setData({
        searchValue:company,
        companyName:company,
        companyId:companyid,
        storeName:store,
        storeId:storeid,
        task_img_id:task_img_id,
        disabled:true,
        disabledCom:'disabled',
        picker_show:false,
        picker_show2:false,
      })
    };
    that.setData({
      user_id:user_id,
      taskId:taskId
    });

    //var id = wx.getStorageSync('id');
    var newarray = new Array();
    /*获取公司数据*/
    wx.request({
      url:'https://wxapp.fshd.com/wx/get/company',
      data: { task_id:that.data.taskId},
      method: 'POST', 
      success: function(res){ 
        var res =res.data;
        console.log(res)
        if(res.code==200) {
          for(var key in res.data) {
            newarray.push({'id':key,'companyName':res.data[key]});
          };
          that.data.companyList =newarray.concat(that.data.companyList);
        }
        that.setData({
          'companyList': that.data.companyList,
          'listLength':that.data.companyList.length
        })
        console.log(that.data.listLength)
      }
    });
  }
})