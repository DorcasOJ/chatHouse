import { io } from "socket.io-client";
import QueryString from "qs";

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomname = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URl
const { username, room } = QueryString.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("connected to ", socket.id);
});

// Join chat room
socket.emit("joinRoom", { username, room });

// Message from server
socket.on("message", (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


// Get room and users
socket.on("roomUsers", (result) => {
  outputRoomName(result.room);
  outputUsers(result.users);
});

// Message Submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();
  if(!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value= '';
  e.target.elements.msg.focus();
})

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += ` <span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  chatMessages.appendChild(div);
}

function outputRoomName(room) {
  roomname.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = "";
  if (users) {
    users.forEach((user) => {
      const li = document.createElement("li");
      li.innerText = user.username;
      userList.appendChild(li);
    });
  } else {
    userList.innerHTML = `<li class='error'>Error loading users...</li>`
  }
}

// Prompt the user before leaving chat room
document.getElementById('leave-btn').addEventListener('click', ()=>{
  const leaveRoom = confirm('Are you sure you want to leave the chatRoom?')
  if (leaveRoom) {
    window.location = '../index.html';
  } else {}
})