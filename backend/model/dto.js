import { createHash } from "node:crypto";

// DTOの定義
export class UserInfo {
    _userId;
    _userPassword;
    _salt;

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

    set salt(value) {
        this._salt = value;
    }
    get salt() {
        return this._salt;
    }

    genHashedPassword() {
        const hash = createHash("sha256");
        hash.update(this._userPassword);
        hash.update(this._salt);
        return hash.digest("base64");
    }
}

export class ChatListInfo {
    _userId;
    _chatId;
    _chatName;
    _joinFlg = '0'; // sqliteにはbool型がないため

    set userId(value) {
        this._userId = value;
    }
    get userId() {
        return this._userId;
    }

    set chatId(value) {
        this._chatId = value;
    }
    get chatId() {
        return this._chatId;
    }

    set chatName(value) {
        this._chatName = value;
    }
    get chatName() {
        return this._chatName;
    }

    set joinFlg(value) {
        this._joinFlg = value;
    }
    get joinFlg() {
        return this._joinFlg;
    }
}

export class ChatInfo {
    _id;
    _chatId;
    _messageId;
    _userId;
    _messageBody;

    constructor(chatId) {
        this._chatId = chatId;
    }

    set id(value) {
        this._id= value;
    }
    get id() {
        return this._id;
    }

    set chatId(value) {
        this._chatId = value;
    }
    get chatId() {
        return this._chatId;
    }

    set messageId(value) {
        this._messageId = value;
    }
    get messageId() {
        return this._messageId;
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
