// app.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

App({
  onLaunch() {
    var local_acc = wx.getStorageSync('acc') || "";
    if (local_acc == "") {
      this.globalData.login_status = false;
      this.globalData.avatarUrl = defaultAvatarUrl;
      this.globalData.nickname = "";
    } else {
      this.globalData.login_status = true;
      this.globalData.avatarUrl = wx.getStorageSync('avatarUrl');
      this.globalData.nickname = wx.getStorageSync('nickname');
    }
  },
  globalData: {
    login_status: false,
    avatarUrl: defaultAvatarUrl,
    nickname: ""
  },
  // 引入`towxml3.0`解析方法
	towxml: require('/towxml/index')
})
