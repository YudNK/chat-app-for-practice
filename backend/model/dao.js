import sqlite3 from "sqlite3";
import { open } from "sqlite";

import {
    UserInfo,
    ChatListInfo,
    ChatInfo,
    MessageInfo
} from "./dto.js";
import {
    createTableQuery,
    crudUserTableQuery,
    crudChatListTableQuery,
    crudChatTableQuery,
    crudMessageTableQuery
} from "./query.js";


// open Database
const db = await open({
    filename: "db/chatApp.db",
    driver: sqlite3.Database
});

export async function setUpDB() {
    // create Table if not exitsts
    for (const value of Object.values(createTableQuery)) {
        db.run(value);
    }

}

export const userTableDao = {
    insertUserInfo: async (userInfo) => {
        try {
            await db.run(crudUserTableQuery.insertUserTable,
                // コールバックを呼ぶ場合は配列で渡す必要がある.issue#116
                [userInfo.userId, userInfo.genHashedPassword(), userInfo.salt],
                // arrow functionだとthisでstatementオブジェクトを参照できない
                function (err) {
                    if (err) throw new Error(err);
                }
            );

        } catch (e) {
            // スタックトレースにより情報が伝搬しないことを意識
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    selectUserInfo: async (userInfo) => {
        try {
            const result = [];
            await db.each(crudUserTableQuery.selectUserTable,
                [userInfo.userId],
                function (err, rows) {
                    if (!err) {
                        const elem = new UserInfo();
                        elem.userId = rows.user_id;
                        elem.userPassword = rows.user_password;
                        elem.salt = rows.salt;
                        result.push(elem);
                    } else {
                        throw new Error(err);
                    }
                }
            );

            return result;

        } catch (e) {
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    updateUserInfo: async (userInfo) => {
        try {
            await db.run(crudUserTableQuery.updateUserTable,
                [userInfo.userPassword, userInfo.salt, userInfo.userId],
                function (err) {
                    if (err) throw new Error(err);
                }
            );

        } catch (e) {
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    deleteUserInfo: async (userInfo) => {
        try {
            await db.run(crudUserTableQuery.deleteUserTable,
                [userInfo.userId],
                function (err) {
                    if (err) throw new Error(err);
                }
            );
        } catch (e) {
            console.log(e.message);
            throw new Error("somthing wrong!");
        }
    }
};

export const chatListTableDao = {
    insertChatListInfo: async (chatListInfo) => {
        try {
            await db.run(crudChatListTableQuery.insertChatListTable,
                [chatListInfo.userId, chatListInfo.chatId],
                // arrow functionだとthisでstatementオブジェクトを参照できない
                function (err) {
                    if (err) throw new Error(err);
                }
            );

        } catch (e) {
            // スタックトレースにより情報が伝搬しないことを意識
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    selectChatListInfo: async (chatListInfo) => {
        try {
            const result = [];
            await db.each(crudChatListTableQuery.selectChatListTable,
                [chatListInfo.userId],
                function (err, rows) {
                    if (!err) {
                        const elem = new ChatListInfo();
                        elem.userId = rows.user_id;
                        elem.chatId = rows.chat_id;
                        result.push(elem);
                    } else {
                        throw new Error(err);
                    }
                }
            );

            return result;

        } catch (e) {
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    updateChatListInfo: async (chatListInfo) => {
        try {
            await db.run(crudChatListTableQuery.updateChatListTable,
                [chatListInfo.chatId, chatListInfo.userId],
                function (err) {
                    if (err) throw new Error(err);
                }
            );

        } catch (e) {
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    deleteChatListInfo: async (chatListInfo) => {
        try {
            await db.run(crudChatListTableQuery.deleteChatListTable,
                [chatListInfo.userId, chatListInfo.chatId],
                function (err) {
                    if (err) throw new Error(err);
                }
            );
        } catch (e) {
            console.log(e.message);
            throw new Error("somthing wrong!");
        }
    }
};

export const chatTableDao = {
    insertChatInfo: async (chatInfo) => {
        try {
            await db.run(crudChatTableQuery.insertChatTable,
                [chatInfo.chatId, chatInfo.messageId],
                // arrow functionだとthisでstatementオブジェクトを参照できない
                function (err) {
                    if (err) throw new Error(err);
                }
            );

        } catch (e) {
            // スタックトレースにより情報が伝搬しないことを意識
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    selectChatInfo: async (chatInfo) => {
        try {
            const result = [];
            await db.each(crudChatTableQuery.selectChatTable,
                [chatInfo.chatId],
                function (err, rows) {
                    if (!err) {
                        const elem = new ChatInfo();
                        elem.chatId = rows.chat_id;
                        elem.messageId = rows.message_id;
                        result.push(elem);
                    } else {
                        throw new Error(err);
                    }
                }
            );

            return result;

        } catch (e) {
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    updateChatInfo: async (chatInfo) => {
        try {
            await db.run(crudChatTableQuery.updateChatTable,
                [chatInfo.messageId, chatInfo.chatId],
                function (err) {
                    if (err) throw new Error(err);
                }
            );

        } catch (e) {
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    deleteChatInfo: async (chatInfo) => {
        try {
            await db.run(crudChatTableQuery.deleteChatTable,
                [chatInfo.chatId, chatInfo.messageId],
                function (err) {
                    if (err) throw new Error(err);
                }
            );
        } catch (e) {
            console.log(e.message);
            throw new Error("somthing wrong!");
        }
    }
};

export const messageTableDao = {
    insertMessageInfo: async (messageInfo) => {
        try {
            await db.run(crudMessageTableQuery.insertMessageTable,
                [
                    messageInfo.messageId,
                    messageInfo.chatId,
                    messageInfo.userId,
                    messageInfo.messageBody
                ],
                // arrow functionだとthisでstatementオブジェクトを参照できない
                function (err) {
                    if (err) throw new Error(err);
                }
            );

        } catch (e) {
            // スタックトレースにより情報が伝搬しないことを意識
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    selectMessageInfo: async (messageInfo) => {
        try {
            const result = [];
            await db.each(crudMessageTableQuery.selectMessageTable,
                [messageInfo.messageId],
                function (err, rows) {
                    if (!err) {
                        const elem = new MessageInfo();
                        elem.messageId = rows.message_id;
                        elem.messageId = rows.chat_id;
                        elem.messageId = rows.user_id;
                        elem.messageId = rows.message_body;
                        result.push(elem);
                    } else {
                        throw new Error(err);
                    }
                }
            );

            return result;

        } catch (e) {
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    updateMessageInfo: async (messageInfo) => {
        try {
            await db.run(crudMessageTableQuery.updateMessageTable,
                [
                    messageInfo.chatId,
                    messageInfo.userId,
                    messageInfo.messageBody,
                    messageInfo.messageId
                ],
                function (err) {
                    if (err) throw new Error(err);
                }
            );

        } catch (e) {
            console.log(e.message);
            throw new Error("something wrong!");
        }
    },
    deleteMessageInfo: async (messageInfo) => {
        try {
            await db.run(crudMessageTableQuery.deleteMessageTable,
                [messageInfo.messageId],
                function (err) {
                    if (err) throw new Error(err);
                }
            );
        } catch (e) {
            console.log(e.message);
            throw new Error("somthing wrong!");
        }
    }
};
