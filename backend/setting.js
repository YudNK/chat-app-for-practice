import { setUpDB } from "./model/dao.js";

export async function setting() {
    // set up DB
    await setUpDB();

}
