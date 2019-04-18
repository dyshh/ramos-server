'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller, io } = app;
    /** ----------------http------------------- */
    // 获取聊天列表
    router.get('/chat_list/:uid', controller.chat.getChatList);
    // 获取群组聊天记录
    router.get('/message/group/:group_id', controller.messages.getHistoryList);

    /** ----------------socket------------------- */
    // 初始化socket
    io.of('/').route('init_socket', io.controller.socket.init);
    // 发消息
    io.of('/').route('sendMsg', io.controller.chat.sendMsg);
};
