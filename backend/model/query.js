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
            message_id TEXT NOT NULL,
            UNIQUE(chat_id, message_id)
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
};

// CRUD
export const crudUserTableQuery = {
    insertUserTable: `
        INSERT INTO User (
            user_id,
            user_password,
            salt
        ) VALUES (
            ?,
            ?,
            ?
        ); 
    `,
    selectUserTable: `
        SELECT
            user_id,
            user_password,
            salt
        FROM User
        WHERE
            user_id = ?
        ;
    `,
    updateUserTable: `
        UPDATE User
        SET (
            user_password,
            salt
        ) = (
            ?,
            ?
        )
        WHERE
            user_id = ?
        ;
    `,
    deleteUserTable: `
        DELETE FROM User
        WHERE
            user_id = ?
        ;    
    `
};

export const crudChatListTableQuery = {
    insertChatListTable: `
        INSERT INTO ChatList (
            user_id,
            chat_id
        ) values (
            ?,
            ?
        ); 
    `,
    selectChatListTable: `
        SELECT
            user_id,
            chat_id
        FROM ChatList
        WHERE
            user_id = ?
        ;
    `,
    updateChatListTable: `
        UPDATE ChatList
        SET (
            chat_id
        ) = (
            ?
        )
        WHERE
            user_id = ?
        ;
    `,
    deleteChatListTable: `
        DELETE FROM ChatList
        WHERE
            user_id = ?
        AND chat_id = ?
        ;    
    `
};

export const crudChatTableQuery = {
    insertChatTable: `
        INSERT INTO Chat (
            chat_id,
            message_id
        ) values (
            ?,
            ?
        ); 
    `,
    selectChatTable: `
        SELECT
            chat_id,
            message_id
        FROM Chat
        WHERE
            chat_id = ?
        ;
    `,
    updateChatTable: `
        UPDATE Chat
        SET (
            message_id
        ) = (
            ?
        )
        WHERE
            chat_id = ?
        ;
    `,
    deleteChatTable: `
        DELETE FROM Chat
        WHERE
            chat_id = ?
        AND message_id = ?
        ;    
    `
};

export const crudMessageTableQuery = {
    insertMessageTable: `
        INSERT INTO Message (
            message_id,
            chat_id,
            user_id,
            message_body
        ) values (
            ?,
            ?,
            ?,
            ?
        ); 
    `,
    selectMessageTable: `
        SELECT
            message_id,
            chat_id,
            user_id,
            message_body
        FROM Message
        WHERE
            message_id = ?
        ;
    `,
    updateMessageTable: `
        UPDATE Message
        SET (
            chat_id,
            user_id,
            message_body
        ) = (
            ?,
            ?,
            ?
        )
        WHERE
            message_id = ?
        ;
    `,
    deleteMessageTable: `
        DELETE FROM Message
        WHERE
            message_id = ?
        ;    
    `
};
