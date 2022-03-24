// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {

  // const {
  //   OPENID
  // } = cloud.getWXContext()
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: cloud.getWXContext().OPENID,
      page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
      templateId:'pIFEAQeintiu3QqOVoJ2HurJ4ei8ywj41N8CRY0irY0',
      lang:'zh_CN',
      data: {
        phrase1: {
          value: '评价完成'
        },
        thing2: {
          value: event.content
        },
      },
      templateId: 'pIFEAQeintiu3QqOVoJ2HurJ4ei8ywj41N8CRY0irY0',
      formId: event.formId



    })
    return result
  }catch(err){
    return err
  }
}