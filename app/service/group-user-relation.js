'use strict';

module.exports = app => {
    return class GroupUserRelationService extends app.Service {
        async deleteByGroupId(gid) {
            return await this.app.mysql.delete('group_user_relation', {
                to_group_id: gid
            });
        }
        async leaveGroup(gid, uid) {
            return await this.app.mysql.query(
                'delete from group_user_relation where to_group_id = ? and user_id = ?',
                [gid, uid]
            );
        }
    };
};
