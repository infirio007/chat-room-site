const chatBox = document.querySelector(".show-msg")
const element = document.getElementById("scroll");
const btn = document.querySelector("form")
const chat = document.querySelector("#msg")
const socket = io();
const user = document.querySelector("#name").innerHTML
const roomName = document.querySelector("#room").innerHTML

const putmsg = (pos, cls, msg) => {
    const p = document.createElement("P");
    const div = document.createElement("DIV");

    p.innerHTML = msg;
    div.className = `chat-div ${pos}`;
    p.className = "msg " + cls;
    div.appendChild(p)
    chatBox.appendChild(div)
}

btn.addEventListener("submit", (e) => {
    e.preventDefault();
    socket.emit("send", chat.value);
    putmsg("right", "send", chat.value);
    element.scrollTop = element.scrollHeight - element.clientHeight;
})

socket.emit("new-user-added", user)

socket.on("connect", () => {
    putmsg("center", "add", `Welcome ${user} to ${roomName} chat room`)
    socket.emit("joint", {user, roomName})
})

socket.on("user-added", msg => {
    putmsg("center", "add", `${msg} added to the chat`)
    element.scrollTop = element.scrollHeight - element.clientHeight;
})

socket.on("recieve", msg => {
    putmsg("left", "recv", msg)
    element.scrollTop = element.scrollHeight - element.clientHeight;
})

socket.on("user-disconnected", nm => {
    putmsg("left", "recv", nm + " disconnected from the chat")
    element.scrollTop = element.scrollHeight - element.clientHeight;
})