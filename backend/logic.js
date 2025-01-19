import { ChatListInfo } from "./model.js";

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
    chatListInfo.chatList = ["chat1", "chat2", "chat3"];
    return chatListInfo;
}