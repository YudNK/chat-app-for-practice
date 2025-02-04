import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import cookieParser from "cookie-parser";

import { setting } from "./setting.js";
import {
    configSession,
    authUser,
    sendSignInPage,
    createUser,
    validateUser,
    sendChatPage,
    sendChatListPage,
    signoutUser,
    action4ChatMessage
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
    app.post("/createuser", createUser, sendChatListPage);
    app.post("/signin", validateUser, sendChatListPage);

    app.get("/chatlist", authUser, sendChatListPage);
    app.get("/chat", authUser, sendChatPage);
    app.get("/signout", authUser, signoutUser, sendSignInPage);

    // error handling 
    app.use((err, req, res, next) => {
        console.log("Oops!" + err.stack);
        console.log(res.url);
        res.status(500).send("Something Wrong");
    });

    // socket.io setting
    io.on("connection", async (socket) => {

        if (!socket.recovered) {
            try {
                await db.each("SELECT id, content FROM messages WHERE id > ?",
                    [socket.handshake.auth.serverOffset || 0], // undefined対策?
                    (_err, row) => {
                        socket.emit("chat message", row.content, row.id);
                    }
                )
            } catch (e) {
                console.log("failed recovery.");
            }
        }

        socket.on("chat message", action4ChatMessage); 
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
