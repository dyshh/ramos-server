'use strict';
module.exports = app => {
    return class GroupService extends app.Service {
        /**
         * 加群
         * @param {object} param0 群id、用户id
         */
        async groupAddUser({ to_group_id, user_id }) {
            return await this.app.mysql.insert('group_user_relation', {
                to_group_id,
                user_id
            });
        }
        /**
         * 根据群id获取群成员列表
         * @param {number} gid 群id
         */
        async getMembersByGroupId(gid) {
            return await this.app.mysql.select('group_user_relation', {
                where: {
                    to_group_id: gid
                }
            });
        }
        /**
         * 根据用户id获取他所在的群列表
         * @param {number} uid 用户id
         */
        async getGroupsByUserId(uid) {
            return await this.app.mysql.select('group_user_relation', {
                where: {
                    user_id: uid
                }
            });
        }
        /**
         * 根据群id获取在线成员
         * @param {number} gid 群id
         */
        async getOnlineMembersByGroupId(gid) {
            const allOnlinePeople = await this.ctx.service.user.getAllOnlineUsers();
            const usersInThisGroup = await this.getMembersByGroupId(gid);
            const userIdsInThisGroup = usersInThisGroup.map(
                item => item.user_id
            );
            const onlineMembersInThisGroup = allOnlinePeople.filter(item =>
                userIdsInThisGroup.includes(item.id)
            );
            return onlineMembersInThisGroup;
        }
        /**
         * 根据用户id给所在群发登录状态消息
         * @param {number} uid 用户id
         */
        async emitLoginStatus(uid) {
            const { app } = this;
            const nsp = app.io.of('/');
            const groupList = await this.getGroupsByUserId(uid);
            for (const item of groupList) {
                const { to_group_id } = item;
                // 给该用户所在群组发group_online_members
                const onlineMembersInThisGroup = await this.getOnlineMembersByGroupId(
                    to_group_id
                );
                nsp.to(to_group_id).emit('group_online_members', {
                    group_id: to_group_id,
                    list: onlineMembersInThisGroup
                });
            }
        }
    };
};
