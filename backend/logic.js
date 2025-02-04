import { randomUUID } from "node:crypto";

import {
    ChatInfo,
    ChatListInfo
} from "./model/dto.js";
import {
    chatListTableDao,
    userTableDao
} from "./model/dao.js";


export async function createUserInfo(userInfo) {
    let result = false;
    const userInfoList = await userTableDao.selectUserInfo(userInfo);
    if (userInfoList.length == 0) {
        // regist user
        result = true;
        // set salt
        userInfo.salt = randomUUID(); 
        await userTableDao.insertUserInfo(userInfo);
    }
    return result;
}

export async function validateUserInfo(userInfo) {
    let result = false;
    const userInfoList = await userTableDao.selectUserInfo(userInfo);
    if (userInfoList.length == 1) {
        const expectUserInfo = userInfoList[0];
        userInfo.salt = expectUserInfo.salt;
        if(userInfo.genHashedPassword() === expectUserInfo.userPassword) {
            result = true;
        }
    }
    return result;
}

export function getChatListInfo(userId) {
    const chatListInfo = new ChatListInfo();
    chatListInfo.userId = userId;
    chatListInfo.chatList = [
        new ChatInfo("chat1"),
        new ChatInfo("chat2"),
        new ChatInfo("chat3"),
    ];
    return chatListInfo;
}