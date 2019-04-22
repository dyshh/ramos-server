'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller, io } = app;
    /** ----------------http------------------- */
    // 登录
    router.post('/login', controller.user.login);
    // 获取聊天列表
    router.get('/chat_list', controller.chat.getChatList);
    // 获取群组聊天记录
    router.get('/message/group/:group_id', controller.messages.getHistoryList);

    /** ----------------socket------------------- */
    // 发消息
    io.of('/').route('message', io.controller.chat.sendMsg);
};
