'use strict';

const Controller = require('egg').Controller;
const { isEmpty } = require('lodash');
const assert = require('assert');

class GroupUserController extends Controller {
    /**
     * 主动加群
     */
    async create() {
        let { to_group_id, group_name } = this.ctx.request.body;
        const { id: user_id } = this.ctx.service.auth.decodeToken();
        if (group_name && !to_group_id) {
            // 分享加群只有群名
            const group = await this.app.mysql.query(
                'SELECT * FROM group_info AS g WHERE g.name = ?',
                [group_name]
            );
            assert(!isEmpty(group), '群组不存在');
            if (group) {
                to_group_id = group[0].to_group_id;
            }
        }
        const isExist = await this.app.mysql.query(
            'SELECT * FROM group_user_relation AS g WHERE g.user_id = ? AND to_group_id = ?',
            [user_id, to_group_id]
        );
        if (!isEmpty(isExist)) {
            this.ctx.throw(400, '你已经在这个群里了哦');
        }
        // 加群
        const ret = await this.app.mysql.query(
            'INSERT INTO group_user_relation (to_group_id,user_id,created_at) VALUES (?,?,?)',
            [to_group_id, user_id, new Date()]
        );
        this.ctx.body = ret;
    }
}

module.exports = GroupUserController;
