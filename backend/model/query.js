// create table
export const createTableQuery = {
    createUserTable: `
        CREATE TABLE IF NOT EXISTS User (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            user_password TEXT NOT NULL,
            salt TEXT,
            UNIQUE(user_id)
        );
    `,
    createChatListTable: `
        CREATE TABLE IF NOT EXISTS ChatList (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            chat_id TEXT NOT NULL,
            UNIQUE(user_id, chat_id)
        );
    `,
    createChatTable: `
        CREATE TABLE IF NOT EXISTS Chat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id TEXT NOT NULL,
            message_id TEXT NOT NULL
        );
    `,
    createMessageTable: `
        CREATE TABLE IF NOT EXISTS Message (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message_id TEXT NOT NULL,
            chat_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            message_body TEXT,
            UNIQUE(message_id)
        );
    `,
}