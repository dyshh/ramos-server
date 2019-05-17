'use strict';

const Controller = require('egg').Controller;
const { isEmpty } = require('lodash');
const assert = require('assert');

class GroupUserController extends Controller {
    /**
     * 主动加群
     */
    async create() {
        const { to_group_id } = this.ctx.request.body;
        const { id: user_id } = this.ctx.service.auth.decodeToken();
        const isExist = await this.app.mysql.query(
            'SELECT * FROM group_user_relation AS g WHERE g.user_id = ? AND to_group_id = ?',
            [user_id, to_group_id]
        );
        assert(isEmpty(isExist), '你已经在这个群里了哦');
        // 把建群人加进群
        const ret = await this.app.mysql.query(
            'INSERT INTO group_user_relation (to_group_id,user_id,created_at) VALUES (?,?,?)',
            [to_group_id, user_id, new Date()]
        );
        this.ctx.body = ret;
    }
}

module.exports = GroupUserController;
