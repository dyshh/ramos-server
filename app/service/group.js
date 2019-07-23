'use strict';
module.exports = app => {
    return class GroupService extends app.Service {
        /**
         * 获取默认群：群表第一个群为默认群
         */
        async getDefaultGroup() {
            return await this.app.mysql.select('group_info', {
                limit: 1
            });
        }

        /**
         * 加群
         * @param {object} param0 群id、用户id
         */
        async groupAddUser({ to_group_id, user_id }) {
            return await this.app.mysql.insert('group_user_relation', {
                to_group_id,
                user_id,
                created_at: new Date()
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
         * 根据群id获取在线和离线成员
         * @param {number} gid 群id
         * @param {number} status 是否在线
         */
        async getMembersByGroupId(gid, status = 1) {
            return await this.app.mysql.query(
                'SELECT * FROM (SELECT gu.user_id FROM group_info AS g INNER JOIN group_user_relation AS gu ON g.to_group_id = gu.to_group_id WHERE g.to_group_id = ?) as z JOIN user AS u ON z.user_id = u.id WHERE u.status = ?',
                [gid, status]
            );
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
                const [onlineMembersInThisGroup, offlineMembersInThisGroup] = [
                    await this.ctx.service.group.getMembersByGroupId(
                        to_group_id,
                        1
                    ),
                    await this.ctx.service.group.getMembersByGroupId(
                        to_group_id,
                        0
                    )
                ];
                nsp.to(to_group_id).emit('group_online_members', {
                    group_id: to_group_id,
                    onlineList: onlineMembersInThisGroup,
                    offlineList: offlineMembersInThisGroup
                });
            }
        }

        async update(gid, params) {
            return await this.app.mysql.update(
                'group_info',
                JSON.parse(JSON.stringify(params)),
                {
                    where: {
                        to_group_id: gid
                    }
                }
            );
        }

        async findOne(gid, columns) {
            return await this.app.mysql.get(
                'group_info',
                { to_group_id: gid },
                {
                    columns
                }
            );
        }
    };
};
