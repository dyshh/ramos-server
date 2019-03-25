'use strict';
// io模块的中间件， 在config/config.default里配置成connectionMiddleware， 只在connection的时候触发
module.exports = function robotMiddleware() {
  return async (ctx, next) => {
    const { app } = ctx;
    const nsp = app.io.of('/');
    // 向客户端推送online事件
    nsp.emit('online', '有新成员加入聊天室了');
    await next();
  };
};
