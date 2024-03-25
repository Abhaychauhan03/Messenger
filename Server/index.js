const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  console.log("hello world !");
});

io.on("connection", (socket) => {
  console.log("socket connected");
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

const port = 8080;
server.listen(port, () => {
  console.log(`server started on ${port}`);
});
