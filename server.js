const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require("path")

app.set("views", "views")
app.set("view engine", "ejs")
app.use("/static", express.static("C:\\Users\\home\\Desktop\\learn_socket\\public"))
app.use(express.urlencoded({ extended: true }))

const rooms = {room1: {roomName:"room1", roomPass:"pass"}, room2: {roomName:"room2", roomPass:"pass1"}}

app.get("/", (req, res) => {
  res.render("login")
})

app.post("/room", (req, res) => {
  if(rooms[req.body.room] != null){
    return res.redirect(`http://localhost:3000/`);
  }
  rooms[req.body.room] = {roomName: req.body.room, roomPass: req.body.pass}
  res.redirect(`http://localhost:3000/join?room=${req.body.room}&pass=${req.body.pass}&name=${req.body.name}`);
  // ?name=rohan&room=room1&pass=pass
})

app.get('/join', (req, res) => {
  if (rooms[req.query.room] == null){
    return res.redirect("http://localhost:3000")
  }
  else{
    if(rooms[req.query.room]["roomPass"] == req.query.pass){
      res.render("index.ejs", {room: req.query.room, name: req.query.name});
    }
    else{
      return res.redirect("http://localhost:3000")
    }
  }
});

const names = {}

io.on('connection', (socket) => {
  socket.on("joint", ({user, roomName}) => {
    names[socket.id] = {name: user, room: roomName}
    socket.join(roomName)
    socket.in(names[socket.id]["room"]).on("new-user-added", name => {
      socket.in(names[socket.id]["room"]).broadcast.emit("user-added", name)
    })
    socket.in(names[socket.id]["room"]).on("send", msg => {
      socket.in(names[socket.id]["room"]).broadcast.emit("recieve", msg)
    })
    socket.in(names[socket.id]["room"]).on("disconnect", name => {
      socket.in(names[socket.id]["room"]).broadcast.emit("user-disconnected", names[socket.id]["name"])
    })
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});