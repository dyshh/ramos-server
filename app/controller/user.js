'use strict';

const Controller = require('egg').Controller;
const assert = require('assert');
const { generateToken } = require('../utils/token');
const bcrypt = require('bcrypt');

class UserController extends Controller {
    async login() {
        const { name, password } = this.ctx.request.body;
        const user = await this.ctx.service.user.findOne({ name });
        assert(user, '用户名不存在');
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        assert(isPasswordCorrect, '密码错误');
        const token = generateToken(user.id);
        // 更新用户表登录状态
        await this.ctx.service.user.update({
            id: user.id,
            status: 1
        });
        // 查出用户对象
        this.ctx.body = {
            data: {
                token,
                userInfo: {
                    id: user.id,
                    username: user.name
                }
            },
            message: '登录成功'
        };
    }
    async register() {
        const { name, password } = this.ctx.request.body;
        const user = await this.ctx.service.user.findOne({ name });
        assert(!user, '用户名已经被注册');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const params = {
            name,
            password: hash,
            salt
        };
        const { insertId } = await this.ctx.service.user.create(params);
        const token = generateToken(insertId);
        // 更新用户表登录状态
        await this.ctx.service.user.update({
            id: insertId,
            status: 1
        });
        // 加到默认群组
        await this.ctx.service.chat.groupAddUser({
            to_group_id: 1,
            user_id: insertId
        });

        this.ctx.body = {
            data: {
                token,
                userInfo: {
                    id: insertId,
                    username: user.name
                }
            },
            message: '注册成功'
        };
    }
}

module.exports = UserController;
