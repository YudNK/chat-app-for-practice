import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import cookieParser from "cookie-parser";
import cookie from "cookie";

import { setting } from "./setting.js";
import {
    configSession,
    authUser,
    sendSignInPage,
    registerUser,
    validateUser,
    sendChatPage,
    sendChatListPage,
    joinChat,
    sendCreateChatPage,
    registerChat,
    signoutUser,
    searchUser,
    recoveryMessages,
    registerMessage,
    authSocketUser
} from "./controller.js";

if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    console.log(numCPUs);
    // for (let i = 0; i < numCPUs; i++) {
    for (let i = 0; i < 1; i++) {
        cluster.fork({
            PORT: 3000 + i
        });
    }
    setupPrimary();

} else {

    await setting();

    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        connectionStateRecovery: {},
        adapter: createAdapter()
    });

    const __dirname = dirname(fileURLToPath(import.meta.url));

    // template engine
    app.set("views", join(__dirname, "../frontend/views"));
    app.set("view engine", "ejs");

    // リクエストの前処理
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(cookieParser());

    // logger
    app.use((req, res, next) => {
        console.log(req.url);
        console.log(req.cookies);
        next();
    });

    // static directory
    app.use(express.static(join(__dirname, "../frontend/static")));
    // seeion id 発行
    app.use(configSession);

    // routing
    app.get("/", sendSignInPage, sendChatListPage);
    app.post("/createuser", registerUser, sendChatListPage);
    app.post("/signin", validateUser, sendChatListPage);

    // need athentication route
    app.get("/chatlist", authUser, sendChatListPage);
    app.get("/chat", authUser, sendChatPage);
    app.post("/joinchat", authUser, joinChat, sendChatListPage);
    app.get("/createchat", authUser, sendCreateChatPage);
    app.get("/signout", authUser, signoutUser, sendSignInPage);

    // for fetch api
    app.get("/fetch/searchuser", authUser, searchUser);
    app.post("/fetch/registerchat", authUser, registerChat);

    // error handling 
    app.use((err, req, res, next) => {
        console.log("Oops!" + err.stack);
        console.log(res.url);
        res.status(500).send("Something Wrong");
    });

    // socket.io setting
    // authentication
    io.use((socket, next) => {
        const cookies = cookie.parse(socket.request.headers.cookie || "");
        const sessionId = cookies.sessionId;
        authSocketUser(sessionId, next);
    });

    io.on("connection", async (socket) => {
        console.log("user connected");
        const cookies = cookie.parse(socket.request.headers.cookie || "");
        const sessionId = cookies.sessionId;
        const chatId = cookies.chatId;
        let serverOffset = socket.handshake.auth.serverOffset;


        // socketをchatIdのroomにjoin
        socket.join(chatId);

        if (!socket.recovered) {
            try {
                const messages = await recoveryMessages(chatId, serverOffset);
                for (const msgInfo of messages) {
                    // 今接続しているsocketにemit 
                    socket.emit("chat message", msgInfo.id, msgInfo.userId, msgInfo.messageBody);
                }
            } catch (e) {
                console.log(e.message);
            }
        }

        socket.on("chat message", async (msg, callback) => {
            try {
                const [lastId, userId] = await registerMessage(msg, sessionId, chatId);
                // 自分向け
                socket.emit("chat message", lastId, userId, msg);
                // 他メンバー向け
                socket.to(chatId).emit("chat message", lastId, userId, msg);

                callback("ok");
            } catch (e) {
                callback("ng");
            }
        });

        socket.on("disconnect", () => {
            console.log("user disconnected.");
        });

    });

    // server start
    const port = process.env.PORT;
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
