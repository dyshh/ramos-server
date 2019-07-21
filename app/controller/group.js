'use strict';

const Controller = require('egg').Controller;
const { isEmpty } = require('lodash');
const uuid = require('uuid/v1');

class GroupController extends Controller {
    /**
     * 创建新群
     */
    async create() {
        const { name } = this.ctx.request.body;
        const isExist = await this.app.mysql.query(
            'SELECT * FROM group_info AS g WHERE g.name = ?',
            [name]
        );
        if (!isEmpty(isExist)) {
            this.ctx.throw(400, `群名【${name}】已经被使用了哦，换一个吧`);
        }
        const to_group_id = uuid();
        const { id: creator_id } = this.ctx.service.auth.decodeToken();
        const created_at = new Date();
        // 新增群
        await this.app.mysql.query(
            'INSERT INTO group_info (to_group_id,name,creator_id,created_at) VALUES (?,?,?,?)',
            [to_group_id, name, creator_id, created_at]
        );
        // 把建群人加进群
        const ret = await this.app.mysql.query(
            'INSERT INTO group_user_relation (to_group_id,user_id,created_at) VALUES (?,?,?)',
            [to_group_id, creator_id, created_at]
        );
        this.ctx.body = ret;
    }
}

module.exports = GroupController;
