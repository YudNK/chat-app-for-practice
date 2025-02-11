// js for chatcreate page
const userSet = new Set();
document.getElementById("search").addEventListener("click", async () => {
    const elem = document.getElementById("searchresult");
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }

    const value = document.getElementById("user-id").value;
    const params = { userId: value };
    const query = new URLSearchParams(params);

    try {
        const response = await fetch(`/fetch/searchuser?${query.toString()}`);
        if (!response.ok) {
            throw new Error(`response status: ${response.status}`);
        }

        const json = await response.json();

        const list = document.createElement("li");
        list.innerText = json.user;

        if (json.exist) {
            const addbtn = document.createElement("button");
            addbtn.setAttribute("value", json.user);
            addbtn.innerText = "add";
            addbtn.addEventListener("click", addUser);
            list.append(addbtn);
        }

        elem.append(list);

    } catch (e) {
        console.error(e.message);
    }
});

function addUser() {
    const value = this.value;

    const list = document.createElement("li");
    list.textContent = value;

    if (!userSet.has(value)) {
        const elem = document.getElementById("adduserlist")
        elem.append(list);
        userSet.add(value);
    } else {
        alert("already added.");
    }
}

document.getElementById("register").addEventListener("click", async () => {

    const value = document.getElementById("chat-name").value;
    if(!value){
        alert("chat name required.");
        return;
    }
    const arr = [...userSet];
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const request = new Request("/fetch/registerchat", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
            chatName: value,
            userIdArr: arr
        })
    });

    try {
        const response = await fetch(request);
        if (!response.ok) {
            alert("failed...");
            throw new Error(`response status: ${response.status}`);
        }

        alert("success!");

        const elem = document.getElementById("adduserlist");
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
        userSet.clear();

    } catch (e) {
        console.error(e.message);
    }
});