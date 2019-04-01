'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller, io } = app;
    router.get('/message/group/:group_id', controller.messages.getHistoryList);

    // 这里的sendMsg相当于一个接口， 负责处理客户端发送的sendMsg事件
    // 这个controller是io模块的controller， 和egg的controller不同
    io.of('/').route('sendMsg', io.controller.chat.sendMsg);
};
