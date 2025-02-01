import sqlite3 from "sqlite3";
import { open } from "sqlite";

import { createTableQuery } from "./query.js";


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