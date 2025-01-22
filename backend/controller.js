import { UserInfo } from "./model.js";
import { validateUserInfo, getChatListInfo } from "./logic.js";


export function sendLoginPage(req, res, next) {
    try {
        res.render("login", { message: "Welcome!" });

    } catch (e) {
        next(e);
    }
}

export function sendChatList(req, res, next) {
    try {
        const userInfo = new UserInfo();
        userInfo.userId = req.body.userId;
        userInfo.userPassword = req.body.userPassword;

        if (validateUserInfo(userInfo)) {
            const chatListInfo = getChatListInfo(userInfo);
            res.render("chatlist", {
                userId: chatListInfo.userId,
                chatList: chatListInfo.chatList.map(e => {
                    return { chatId: e.chatId };
                })
            });
        } else {
            res.render("login", { message: "Duplicate id!" });
        }

    } catch (e) {
        next(e);
    }
}
export function sendChatPage(req, res, next) {
    try {
        res.render("chat");

    } catch (e) {
        next(e);
    }
}