const formatMessage = require("./client/public/utils/messages");
const {
  userJoin,
  getRoomUsers,
  getCurrentUser,
  userLeave,
} = require("./client/public/utils/users");

const botName = "ChatHouseBot";

const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to server");
  // console.log(io.of('/').adapter);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome new user
    socket.emit("message", formatMessage(botName, "Welcome to chatHouse!"));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined chat`)
      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      users: getRoomUsers(user.room),
      room: user.room,
    });

    // Listens for chatMessage
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    });

    // Runs when client discconects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          users: getRoomUsers(user.room),
          room: user.room,
        });
      }
    });
  });
});
