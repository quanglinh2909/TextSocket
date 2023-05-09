var express = require("express");
var app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", function (req, res) {
  res.render("home");
});

var server = require("http").Server(app);
var io = require("socket.io")(server);
//
server.listen(3000);

io.sockets.adapter.on("create-room", (room) => {
  if (room.startsWith("room")) {
    io.emit("user-online", room.substring(4));
  }
});

io.sockets.adapter.on("delete-room", (room) => {
  if (room.startsWith("room")) {
    io.emit("user-offline", room.substring(4));
  }
});

io.on("connection", function (socket) {
  console.log("Co nguoi ket noi: " + socket.id);
  //join room
  socket.on("join-room", function (data) {
    socket.join(data);
    // console.log(socket.id + " join room " + data);
    // console.log(io.sockets.adapter.rooms.get("1")?.size);
  });

  //leave room
  socket.on("leave-room", function (data) {
    socket.leave(data);
    console.log(socket.id + " leave room " + data);
  });

  //chat
  socket.on("message", function (data) {
    // console.log(socket.id + " send message: " + data);
    io.sockets.in(data.room).emit("message", data);
  });

  socket.on("disconnect", function () {
    // console.log(socket.id + " ngat ket noi");
  });
});
