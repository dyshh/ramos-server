'use strict';
module.exports = app => {
    return class ChatService extends app.Service {
        async getGroupListById(uid) {
            const arr = await this.app.mysql.select('group_user_relation', {
                where: {
                    user_id: uid
                }
            });
            const ret = await Promise.all(
                arr.map(item =>
                    this.app.mysql.get('group_info', {
                        id: item.to_group_id
                    })
                )
            );
            return ret;
        }
        async getDefaultGroup() {
            return await this.app.mysql.select('group_info', {
                where: {
                    id: 1
                }
            });
        }
        async groupAddUser({ to_group_id, user_id }) {
            return await this.app.mysql.insert('group_user_relation', {
                to_group_id,
                user_id
            });
        }
    };
};
