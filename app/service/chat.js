'use strict';
module.exports = app => {
    return class ChatService extends app.Service {
        /**
         * 根据用户id获取他加的群组列表
         * @param {number} uid 用户id
         */
        async getGroupListById(uid) {
            const arr = await this.app.mysql.select('group_user_relation', {
                where: {
                    user_id: uid
                }
            });
            const originList = await Promise.all(
                arr.map(item =>
                    this.app.mysql.get('group_info', {
                        id: item.to_group_id
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
                    id: 1
                }
            });
            return await this.joinMsgInfoToGroupList(originList);
        }
        async groupAddUser({ to_group_id, user_id }) {
            return await this.app.mysql.insert('group_user_relation', {
                to_group_id,
                user_id
            });
        }

        /**
         * 给群列表加上最新消息
         * @param {array} originList 原始群列表
         */
        async joinMsgInfoToGroupList(originList) {
            return await Promise.all(
                originList.map(async item => {
                    const { id } = item;
                    const ret = await this.ctx.service.messages.getHistoryList({
                        groupId: id,
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
    };
};
