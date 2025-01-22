import { ChatInfo, ChatListInfo } from "./model.js";

export function validateUserInfo(userInfo) {
    let result = false;
    if (userInfo.userId == "test") {
        result = true;
    }
    return result;
}

export function getChatListInfo(userInfo) {
    const chatListInfo = new ChatListInfo();
    chatListInfo.userId = userInfo.userId;
    chatListInfo.chatList = [
        new ChatInfo("chat1"),
        new ChatInfo("chat2"),
        new ChatInfo("chat3"),
    ];
    return chatListInfo;
}