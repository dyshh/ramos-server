'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller, io } = app;
    /** ----------------http------------------- */
    // 登录
    router.post('/login', controller.user.login);
    // 注册
    router.post('/register', controller.user.register);
    // 注销
    router.post('/logout/:uid', controller.user.logout);
    // 获取聊天列表
    router.get('/chat_list', controller.chat.getChatList);
    // 获取聊天记录历史
    router.get('/message/:id', controller.messages.getHistoryList);
    // 上传头像
    router.post('/upload_avatar', controller.user.uploadAvatar);
    // 修改用户信息，用户名和密码
    router.patch('/user/:uid', controller.user.updateUserInfo);
    // 搜索群组和用户
    router.get('/search_all', controller.chat.searchUsersAndGroups);
    // 添加好友
    router.post('/user_user', controller.userUser.create);
    // 创建新群
    router.post('/group', controller.group.create);
    // 主动加群
    router.post('/group_user', controller.groupUser.create);
    // 获取七牛token
    router.get('/qiniu/token', controller.qiniu.getToken);

    /** ----------------socket------------------- */
    // 发消息
    io.of('/').route('message', io.controller.chat.sendMsg);
    // 断线
    io.of('/').route('disconnect', io.controller.user.disconnect);
    // 手动初始化socket和群组，用于登录后
    io.of('/').route('init', io.controller.socket.init);
    // 在线群成员
    io.of('/').route(
        'group_online_members',
        io.controller.socket.onlineMembers
    );
};
