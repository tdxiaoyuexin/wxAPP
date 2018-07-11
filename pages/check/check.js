Page({  
  calling:function(){  
    wx.makePhoneCall({  
      phoneNumber: '400-618-9920', //此号码并非真实电话号码，仅用于测试  
      success:function(){  
        console.log("拨打电话成功！")  
      },  
      fail:function(){  
        console.log("拨打电话失败！")  
      }  
    })  
  }  
})  