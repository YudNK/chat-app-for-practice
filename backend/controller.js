import { randomUUID } from "node:crypto";

import {
    createUser,
    verifyUser,
    searchUserId,
    createChatList,
    readChatList,
    updateChatList,
    readChatMessages,
    createChatMessage,
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

export async function registerUser(req, res, next) {
    try {
        const userId = req.body.userId;
        const userPassword = req.body.userPassword;
        if (await createUser(userId, userPassword)) {
            // regenerate session id 
            sessionIdMap.delete(currentSessionId);
            // clear session id in cookies.
            res.clearCookie("sessionId");
            // regenerate session id
            const newSessionId = randomUUID();
            // set map (set user id to value before authentication.)
            sessionIdMap.set(newSessionId, userId);
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
        const userId = req.body.userId;
        const userPassword = req.body.userPassword;
        if (await verifyUser(userId, userPassword)) {
            // regenerate session id 
            sessionIdMap.delete(currentSessionId);
            // clear session id in cookies.
            res.clearCookie("sessionId");
            // regenerate session id
            const newSessionId = randomUUID();
            // set map (set user id to value before authentication.)
            sessionIdMap.set(newSessionId, userId);
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

export async function sendChatListPage(req, res, next) {
    try {
        const userId = sessionIdMap.get(currentSessionId);
        const chatListInfoArr = await readChatList(userId);
        res.clearCookie("chatId");
        res.render("chatlist", {
            userId: userId,
            chatList: chatListInfoArr.map(e => {
                return {
                    chatId: e.chatId,
                    chatName: e.chatName,
                    joinFlg: e.joinFlg
                };
            })
        });

    } catch (e) {
        next(e);
    }
}

export function sendChatPage(req, res, next) {
    try {
        res.cookie("chatId", req.query.chatId);
        res.render("chat");
    } catch (e) {
        next(e);
    }
}

export async function joinChat(req, res, next) {
    try {
        const userId = sessionIdMap.get(currentSessionId);
        const chatId = req.body.chatId;
        await updateChatList(userId, chatId, 1);

        next();
    } catch (e) {
        next(e);
    }
}

export function sendCreateChatPage(req, res, next) {
    try {
        res.render("chatcreate");
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

// for fetch api
export async function searchUser(req, res, next) {
    try {
        const userId = req.query.userId;
        let result = [];
        let flg = false;
        if (userId == sessionIdMap.get(currentSessionId)) {
            result.push("it's you.");
        } else {
            result = await searchUserId(userId);
            if (result.length == 0) {
                result.push("no such user.");
            } else {
                flg = true;
            }
        }

        res.json({
            exist: flg,
            user: result[0]
        });
    } catch (e) {
        next(e);
    }
}

export async function registerChat(req, res, next) {
    try {
        const currentUserId = sessionIdMap.get(currentSessionId);
        const userIdArr = req.body.userIdArr;
        const chatName = req.body.chatName;

        userIdArr.push(currentUserId);

        await createChatList(currentUserId, userIdArr, chatName);
        // OK
        res.sendStatus(200);

    } catch (e) {
        next(e);
    }
}

// for socket.io
export function authSocketUser(sessionId, next) {
    if (sessionIdMap.get(sessionId)) {
        console.log("valid user.");
        next();
    } else {
        next(new Error("invalid user"));
    }
}

export async function recoveryMessages(chatId, serverOffset) {
    try {
        const messages = await readChatMessages(chatId, serverOffset);
        return messages;
    } catch (e) {
        throw new Error(e.message);
    }
}

export async function registerMessage(msg, sessionId, chatId) {
    const userId = sessionIdMap.get(sessionId);
    try {
        const lastId = await createChatMessage(chatId, userId, msg);
        return [lastId, userId];
    } catch (e) {
        throw new Error(e.message);
    }
}
