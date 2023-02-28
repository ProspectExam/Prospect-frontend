// pages/waterfall_content/waterfall_content.js
//获取应用实例
const app = getApp();
Page({
	data: {
		article: {}
	},
	onLoad: function (options) {
    console.log("page waterfall_content onLoad()")
    console.log(options)
    let post_id = options.post_id
		const that = this;

    wx.request({
      url: 'https://rinka-kujou.uk/' + post_id,
      method: "GET",
      success: function(e) {
        console.log(post_id)
        console.log("结果：")
        console.log(e)
        let obj = app.towxml(e.data, 'markdown', {
          // theme:'dark',
          events:{
            tap:e => {
              console.log('tap',e);
            },
            change:e => {
              console.log('todo',e);
            }
          }
        });
  
        that.setData({
          article: obj
        });
      }
    })
	}
})