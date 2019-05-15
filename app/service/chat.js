'use strict';
module.exports = app => {
    return class ChatService extends app.Service {
        /**
         * 根据用户id获取他的好友列表
         * @param {number} uid 用户id
         */
        async getFriendListById(uid) {
            const data = [uid];
            const sql =
                'SELECT u.id,u.name,u.avatar,u.created_at,u.status FROM user_user_relation AS uu INNER JOIN user AS u ON uu.friend_id = u.id WHERE uu.user_id = ?';
            const originList = await this.app.mysql.query(sql, data);
            return this.joinMsgInfoToPrivateList(originList, uid);
        }
        /**
         * 根据用户id获取他加的群组列表
         * @param {number} uid 用户id
         */
        async getGroupListById(uid) {
            const arr = await this.ctx.service.group.getGroupsByUserId(uid);
            const originList = await Promise.all(
                arr.map(item =>
                    this.app.mysql.get('group_info', {
                        to_group_id: item.to_group_id
                    })
                )
            );
            return await this.joinMsgInfoToGroupList(originList);
        }

        /**
         * 没登录的默认群
         */
        async getDefaultGroup() {
            const originList = await this.app.mysql.select('group_info', {
                where: {
                    to_group_id: 'cb437f5a-7557-11e9-8f9e-2a86e4085a59'
                }
            });
            return await this.joinMsgInfoToGroupList(originList);
        }

        /**
         * 给群列表加上最新消息
         * @param {array} originList 原始群列表
         */
        async joinMsgInfoToGroupList(originList) {
            return await Promise.all(
                originList.map(async item => {
                    const { to_group_id } = item;
                    const ret = await this.ctx.service.groupMsg.getHistoryList({
                        groupId: to_group_id,
                        page: 1,
                        size: 1
                    });
                    const { message, from_user_id } = ret[0];
                    const { name } = await this.ctx.service.user.findOne({
                        id: from_user_id
                    });
                    return {
                        ...item,
                        lastest_message_info: {
                            from_user_id,
                            from_user_name: name,
                            last_message: message
                        }
                    };
                })
            );
        }

        async joinMsgInfoToPrivateList(originList, from_user_id) {
            return await Promise.all(
                originList.map(async item => {
                    const { id } = item;
                    const ret = await this.ctx.service.privateMsg.getHistoryList(
                        {
                            from_user_id,
                            to_user_id: id,
                            page: 1,
                            size: 1
                        }
                    );
                    const { message } = ret[0];
                    return {
                        ...item,
                        lastest_message_info: {
                            last_message: message
                        }
                    };
                })
            );
        }
    };
};
