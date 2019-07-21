'use strict';

const Controller = require('egg').Controller;
const { generateToken } = require('../utils/token');
const bcrypt = require('bcrypt');
const fs = require('mz/fs');
const path = require('path');
const { pick } = require('lodash');

class UserController extends Controller {
    async login() {
        const { name, password } = this.ctx.request.body;
        const user = await this.ctx.service.user.findOne({ name });
        if (!user) {
            this.ctx.throw(400, '用户名不存在');
        }
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            this.ctx.throw(400, '密码错误');
        }
        const token = generateToken(user.id);
        this.ctx.body = {
            data: {
                token,
                userInfo: {
                    id: user.id,
                    username: user.name,
                    avatar: user.avatar
                }
            },
            message: '登录成功'
        };
    }
    async register() {
        const { name, password } = this.ctx.request.body;
        const user = await this.ctx.service.user.findOne({ name });
        if (user) {
            this.ctx.throw(400, '用户名已经被注册');
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        // 随机分配头像
        const avatar = await this.ctx.service.user.giveRandomAvatar();
        const params = {
            name,
            password: hash,
            salt,
            avatar,
            created_at: new Date()
        };
        const { insertId } = await this.ctx.service.user.create(params);
        const token = generateToken(insertId);
        // 加到默认群组
        const defaultGroup = await this.ctx.service.group.getDefaultGroup();
        if (defaultGroup[0]) {
            await this.ctx.service.group.groupAddUser({
                to_group_id: defaultGroup[0].to_group_id,
                user_id: insertId
            });
        }

        this.ctx.body = {
            data: {
                token,
                userInfo: {
                    id: insertId,
                    username: name,
                    avatar
                }
            },
            message: '注册成功'
        };
    }
    async logout() {
        const { ctx } = this;
        const { uid } = ctx.params;
        await ctx.service.user.update({
            id: uid,
            status: 0,
            socket_id: null
        });
        this.ctx.body = {};
        // 通知所在群这个人下线了
        await this.ctx.service.group.emitLoginStatus(uid);
    }
    async uploadAvatar() {
        const { ctx } = this;
        const { user_id } = ctx.request.query;
        const file = ctx.request.files[0];
        const basename = path.basename(file.filepath);
        const destUrl = path.resolve('app/public/avatar', basename);
        try {
            // 查现在的头像地址
            const { avatar } = await ctx.service.user.findOne({
                id: user_id
            });
            // 删现在的头像
            if (avatar) {
                await fs.unlink(path.resolve('app/public', avatar));
            }
            // 复制到public目录下
            await fs.copyFile(file.filepath, destUrl);
            // 更新用户表
            await ctx.service.user.update({
                id: user_id,
                avatar: `avatar/${basename}`
            });
            this.ctx.body = {
                data: {
                    avatar: `avatar/${basename}`
                }
            };
        } finally {
            // 删除临时文件
            await fs.unlink(file.filepath);
        }
    }
    async updateUserInfo() {
        const { uid } = this.ctx.params;
        const { username, oldpsw, newpsw, avatar } = this.ctx.request.body;
        let hash;
        if (oldpsw) {
            const { password } = await this.ctx.service.user.findOne({
                id: uid
            });
            const isCorrect = await bcrypt.compare(oldpsw, password);
            if (!isCorrect) {
                this.ctx.throw(400, '旧密码错误');
            }
            const salt = await bcrypt.genSalt(10);
            hash = await bcrypt.hash(newpsw, salt);
        }
        await this.ctx.service.user.update({
            id: uid,
            name: username,
            password: hash,
            avatar
        });
        const userInfo = await this.ctx.service.user.findOne({
            id: uid
        });

        this.ctx.body = {
            data: pick(userInfo, ['id', 'avatar', 'name'])
        };
    }
}

module.exports = UserController;
