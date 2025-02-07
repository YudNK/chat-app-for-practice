let counter = 0;

const socket = io({
    auth: {
        serverOffset: 0,
    },
    ackTimeout: 10000,
    retries: 3,
});

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const toggleButton = document.getElementById("toggle-btn");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit("chat message", input.value, (err, status) => {
            if (err) {
                console.log(err.message);
                alert("send failed.");
            } else if (status == "ng") {
                console.log(status);
                alert("send failed.");
            } else {
                console.log(status);
            }
        });
        input.value = '';
    }
});

toggleButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (socket.connected) {
        toggleButton.innerText = "Connect";
        socket.disconnect();
    } else {
        toggleButton.innerText = "Disconnect";
        socket.connect();
    }
});

socket.on("chat message", (serverOffset, userId, msg) => {
    const item = document.createElement("li");
    item.textContent = userId + ": " + msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);

    socket.auth.serverOffset = serverOffset;
});

socket.on("connect_error", (err) => {
    console.log(err.message);
    alert(err.message);
    location.href = "/";
});
