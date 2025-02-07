import { randomUUID } from "node:crypto";

import {
    UserInfo,
    ChatListInfo,
    ChatInfo,
} from "./model/dto.js";
import {
    userTableDao,
    chatListTableDao,
    chatTableDao,
} from "./model/dao.js";


export async function createUser(userId, userPassword) {
    let result = false;

    const userInfo = new UserInfo();
    userInfo.userId = userId;
    userInfo.userPassword = userPassword;

    const userInfoArr = await userTableDao.selectUserInfo(userInfo);
    if (userInfoArr.length == 0) {
        // regist user
        result = true;
        // set salt
        userInfo.salt = randomUUID();
        await userTableDao.insertUserInfo(userInfo);
    }
    return result;
}

export async function verifyUser(userId, userPassword) {
    let result = false;

    const userInfo = new UserInfo();
    userInfo.userId = userId;
    userInfo.userPassword = userPassword;

    const userInfoArr = await userTableDao.selectUserInfo(userInfo);
    if (userInfoArr.length == 1) {
        const expectUserInfo = userInfoArr[0];
        userInfo.salt = expectUserInfo.salt;
        if (userInfo.genHashedPassword() === expectUserInfo.userPassword) {
            result = true;
        }
    }
    return result;
}

export async function searchUserId(userId) {
    const result = [];
    const userInfo = new UserInfo();
    userInfo.userId = userId;
    const userInfoArr = await userTableDao.selectUserInfo(userInfo);
    userInfoArr.forEach(e => result.push(e.userId));

    return result;
}

export async function createChatList(currentUserId, userIdArr, chatName) {
    const chatId = randomUUID();
    for (const e of userIdArr) {
        const chatListInfo = new ChatListInfo();
        chatListInfo.userId = e;
        chatListInfo.chatId = chatId;
        chatListInfo.chatName = chatName;
        if (currentUserId == e) {
            chatListInfo.joinFlg = 1;
        } else {
            chatListInfo.joinFlg = 0;
        }

        await chatListTableDao.insertChatListInfo(chatListInfo);
    }

}

export async function readChatList(userId) {
    const chatListInfo = new ChatListInfo();
    chatListInfo.userId = userId;
    const result = await chatListTableDao.selectChatListInfo(chatListInfo);

    return result;
}

export async function updateChatList(userId, chatId, joinFlg) {
    const chatListInfo = new ChatListInfo();
    chatListInfo.userId = userId;
    chatListInfo.chatId = chatId;
    chatListInfo.joinFlg = joinFlg;
    await chatListTableDao.updateChatListInfo(chatListInfo);
}

export async function readChatMessages(chatId, id) {
    const chatInfo = new ChatInfo();
    chatInfo.id = id;
    chatInfo.chatId = chatId;
    const chatInfoArr = await chatTableDao.selectChatInfo(chatInfo);

    return chatInfoArr;
}

export async function createChatMessage(chatId, userId, messageBody) {
    const chatInfo = new ChatInfo();
    chatInfo.messageId = randomUUID();
    chatInfo.chatId = chatId;
    chatInfo.userId = userId;
    chatInfo.messageBody = messageBody;
    const lastId = await chatTableDao.insertChatInfo(chatInfo);

    return lastId;

}