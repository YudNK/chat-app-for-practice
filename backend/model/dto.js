// DTOの定義
export class UserInfo {
    _userId;
    _userPassword;

    set userId(value) {
        this._userId = value;
    }
    get userId() {
        return this._userId;
    }

    set userPassword(value) {
        this._userPassword = value;
    }
    get userPassword() {
        return this._userPassword;
    }
}

export class ChatListInfo {
    _userId;
    _chatList = [];

    set userId(value) {
        this._userId = value;
    }
    get userId() {
        return this._userId;
    }

    set chatList(value) {
        this._chatList = value;
    }
    get chatList() {
        return this._chatList;
    }
}

export class ChatInfo {
    _chatId;
    _messageList = [];

    constructor(chatId) {
        this._chatId = chatId;
    }

    set chatId(value) {
        this._chatId = value;
    }
    get chatId() {
        return this._chatId;
    }

    set messageList(value) {
        this._messageList = value;
    }
    get messageList() {
        return this._messageList;
    }
}

export class MessageInfo {
    _messageId;
    _chatId;
    _userId;
    _messageBody;

    set messageId(value) {
        this._messageId = value;
    }
    get messageId() {
        return this._messageId;
    }

    set chatId(value) {
        this._chatId = value;
    }
    get chatId() {
        return this._chatId;
    }

    set userId(value) {
        this._userId = value;
    }
    get userId() {
        return this._userId;
    }

    set messageBody(value) {
        this._messageBody = value;
    }
    get messageBody() {
        return this._messageBody;
    }
}
