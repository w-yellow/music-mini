// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    modelShow: false,
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                this.setData({
                  modelShow: true
                })
              },

            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },
    onLoginsuccess(event) {
      userInfo = event.detail
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          modelShow: true
        })
      })
    },
    onLoginfail() {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },
    // onBook(){
    //   wx.requestSubscribeMessage({
    //     tmplIds: ['pIFEAQeintiu3QqOVoJ2HurJ4ei8ywj41N8CRY0irY0'], 
    //     success(res) {
    //       console.log(res)

    //     }
    //   })
    // },
    onSend(event) {

      let formId = event.detail.formId
      let content = event.detail.value.content
      let blogId = this.properties.blogId
      wx.requestSubscribeMessage({
        tmplIds: ['pIFEAQeintiu3QqOVoJ2HurJ4ei8ywj41N8CRY0irY0'],
        success:(res)=> {
          console.log(res)
          if (res["errMsg"] == "requestSubscribeMessage:ok") {

            if (content.trim() == '') {
              wx.showModal({
                title: '评论内容不能为空',
                content: ''
              })
              return
            }
            wx.showLoading({
              title: '评价中',
              mask: true
            })
            db.collection('blog-comment').add({
              data: {
                content,
                createTime: db.serverDate(),
                blogId,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
              }
            }).then((res) => {
              wx.cloud.callFunction({
                name: 'sendMessage',
                data: {
                  content,
                  formId,
                  blogId
                }
              }).then((res) => {
                console.log(res);
              })
              wx.hideLoading()
              wx.showToast({
                title: '评论成功',
              })
              this.setData({
                modelShow: false,
                content: ''
              })
            })
            
          }
        }
      })

      // if (content.trim() == '') {
      //   wx.showModal({
      //     title: '评论内容不能为空',
      //     content: ''
      //   })
      //   return
      // }
      // wx.showLoading({
      //   title: '评价中',
      //   mask: true
      // })
      // db.collection('blog-comment').add({
      //   data: {
      //     content,
      //     createTime: db.serverDate(),
      //     blogId: this.properties.blogId,
      //     nickName: userInfo.nickName,
      //     avatarUrl: userInfo.avatarUrl,


      //   }
      // }).then((res) => {
      //   wx.cloud.callFunction({
      //     name: 'sendMessage',
      //     data: {
      //       content,
      //       formId,
      //       blogId: this.properties.blogId
      //     }
      //   }).then((res) => {
      //     console.log(res);

      //   })
      //   wx.hideLoading()
      //   wx.showToast({
      //     title: '评论成功',
      //   })
      //   this.setData({
      //     modelShow: false,
      //     content: ''
      //   })
      // })
    }
  }
})