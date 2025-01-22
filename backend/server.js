import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";

import { sendLoginPage, sendChatList, sendChatPage } from "./controller.js";

if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    console.log(numCPUs);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({
            PORT: 3000 + i
        });
    }
    setupPrimary();

} else {
    const db = await open({
        filename: "db/chat.db",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_offset TEXT UNIQUE,
            content TEXT
        );
    `);

    const app = express();
    const server = createServer(app);
    const io = new Server(server, {
        connectionStateRecovery: {},
        adapter: createAdapter()
    });

    const __dirname = dirname(fileURLToPath(import.meta.url));

    app.set("views", join(__dirname, "../frontend/views"));
    app.set("view engine", "ejs");

    app.use(express.urlencoded());

    app.use((req, res, next) => {
        console.log(req.url);
        next();
    });

    // static directory
    app.use(express.static(join(__dirname, "../frontend/static")));

    // routing
    app.get("/", sendLoginPage);
    app.get("/chat", sendChatPage);

    app.post("/chatlist", sendChatList);

    app.use((err, req, res, next) => {
        console.log("Oops!" + err.stack);
        console.log(res.url);
        res.status(500).send("Something Wrong");
    });

    io.on("connection", async (socket) => {
        socket.on("chat message", async (msg, clientOffset, callback) => {
            let result;
            try {
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
        })

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

        socket.on("disconnect", () => {
            console.log("user disconnected.");
        });

    });

    const port = process.env.PORT;
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
