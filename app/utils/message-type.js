'use strict';
const messageTypeMap = {
    TEXT: 1,
    IMAGE: 2
};

exports.messageTypeMap = messageTypeMap;

exports.getMessageByType = (type, message) => {
    if (type === messageTypeMap.TEXT) {
        return message;
    } else if (type === messageTypeMap.IMAGE) {
        return '[图片]';
    }
    return '[位置消息类型]';
};
