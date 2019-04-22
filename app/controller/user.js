'use strict';

const Controller = require('egg').Controller;
const assert = require('assert');
const { generateToken } = require('../utils/token');

class UserController extends Controller {
    async login() {
        const { name, password } = this.ctx.request.body;
        const user = await this.ctx.service.user.findOne({ name });
        assert(user, '用户名不存在');
        const isPasswordCorrect = password === user.password;
        assert(isPasswordCorrect, '密码错误');
        const token = generateToken(user.id);
        this.ctx.body = {
            data: {
                token,
                userInfo: {
                    id: user.id
                }
            },
            message: '登录成功'
        };
    }
}

module.exports = UserController;
