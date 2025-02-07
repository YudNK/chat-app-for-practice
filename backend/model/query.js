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
            chat_name TEXT,
            join_flg INTEGER,
            UNIQUE(user_id, chat_id)
        );
    `,
    createChatTable: `
        CREATE TABLE IF NOT EXISTS Chat (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id TEXT NOT NULL,
            message_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            message_body TEXT,
            UNIQUE(chat_id, message_id)
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
            chat_id,
            chat_name,
            join_flg
        ) values (
            ?,
            ?,
            ?,
            ?
        ); 
    `,
    selectChatListTable: `
        SELECT
            user_id,
            chat_id,
            chat_name,
            join_flg
        FROM ChatList
        WHERE
            user_id = ?
        ORDER BY id
        ;
    `,
    updateChatListTable: `
        UPDATE ChatList
        SET (
            join_flg
        ) = (
            ?
        )
        WHERE
            user_id = ?
        AND chat_id = ?
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
            message_id,
            user_id,
            message_body
        ) values (
            ?,
            ?,
            ?,
            ?
        ); 
    `,
    selectChatTable: `
        SELECT
            id,
            chat_id,
            message_id,
            user_id,
            message_body
        FROM Chat
        WHERE
            chat_id = ?
        AND id > ?
        ORDER BY id
        ;
    `,
    updateChatTable: `
        UPDATE Chat
        SET (
            message_body
        ) = (
            ?
        )
        WHERE
            chat_id = ?
        AND message_id = ?
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
