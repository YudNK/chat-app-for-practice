import { randomUUID } from "node:crypto";

import { UserInfo } from "./model/dto.js";
import {
    createUserInfo,
    validateUserInfo,
    getChatListInfo
} from "./logic.js";

// map for cache. key:session id, value: user id 
const sessionIdMap = new Map();
let currentSessionId = null;
export function configSession(req, res, next) {
    try {
        currentSessionId = null;
        if (!req.cookies.sessionId) {
            // generate session id 
            const newSessionId = randomUUID();
            // set map (set null to value before authentication.)
            sessionIdMap.set(newSessionId, null);
            // set response
            res.cookie("sessionId", newSessionId);

            currentSessionId = newSessionId;
        } else {
            if (!sessionIdMap.has(req.cookies.sessionId)) {
                // no session id in map. (when map was initialized by reboot etc..)
                // clear session id in cookies.
                res.clearCookie("sessionId");
                // regenerate session id
                const newSessionId = randomUUID();
                // set map (set null to value before authentication.)
                sessionIdMap.set(newSessionId, null);
                // set response
                res.cookie("sessionId", newSessionId);

                currentSessionId = newSessionId;
            } else {
                currentSessionId = req.cookies.sessionId;
            }
        }
        next();

    } catch (e) {
        next(e);
    }
}

export function sendSignInPage(req, res, next) {
    try {
        if (sessionIdMap.get(currentSessionId)) {
            next();
        } else {
            res.render("signin", { message: "Welcome!" });
        }
    } catch (e) {
        next(e);
    }
}

export async function createUser(req, res, next) {
    try {
        const userInfo = new UserInfo();
        userInfo.userId = req.body.userId;
        userInfo.userPassword = req.body.userPassword;
        if (await createUserInfo(userInfo)) {
            // regenerate session id 
            sessionIdMap.delete(currentSessionId);
            // clear session id in cookies.
            res.clearCookie("sessionId");
            // regenerate session id
            const newSessionId = randomUUID();
            // set map (set user id to value before authentication.)
            sessionIdMap.set(newSessionId, userInfo.userId);
            // set response
            res.cookie("sessionId", newSessionId);

            currentSessionId = newSessionId;

            next();
        } else {
            res.render("signin", { message: "The id is already used." });
        }

    } catch (e) {
        next(e);
    }
}

export async function validateUser(req, res, next) {
    try {
        // authentication
        const userInfo = new UserInfo();
        userInfo.userId = req.body.userId;
        userInfo.userPassword = req.body.userPassword;
        if (await validateUserInfo(userInfo)) {
            // regenerate session id 
            sessionIdMap.delete(currentSessionId);
            // clear session id in cookies.
            res.clearCookie("sessionId");
            // regenerate session id
            const newSessionId = randomUUID();
            // set map (set user id to value before authentication.)
            sessionIdMap.set(newSessionId, userInfo.userId);
            // set response
            res.cookie("sessionId", newSessionId);

            currentSessionId = newSessionId;

            next();
        } else {
            res.render("signin", { message: "id or pw is wrong!" });
        }

    } catch (e) {
        next(e);
    }
}

export function authUser(req, res, next) {
    try {
        if (sessionIdMap.get(currentSessionId)) {
            next();
        } else {
            res.render("signin", { message: "please signin!" });
        }
    } catch (e) {
        next(e);
    }

}

export function sendChatListPage(req, res, next) {
    try {
        const userId = sessionIdMap.get(currentSessionId);
        const chatListInfo = getChatListInfo(userId);
        res.render("chatlist", {
            userId: chatListInfo.userId,
            chatList: chatListInfo.chatList.map(e => {
                return { chatId: e.chatId };
            })
        });

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

export function signoutUser(req, res, next) {
    try {
        // sessionのvalueをnullにする
        sessionIdMap.set(currentSessionId, null);
        next();
    } catch (e) {
        next(e);
    }
}

// for socket.io
export async function action4ChatMessage(msg, clientOffset, callback) {
    try {
        let result;
        result = await db.run("INSERT INTO messages (content, client_offset) VALUES (?,?)", msg, clientOffset);
    } catch (e) {
        if (e.errno === 19) {
            callback();
            console.log(e)
        } else {

        }
        return;
    }
    io.emit("chat message", msg, result.lastID);
    callback();

}