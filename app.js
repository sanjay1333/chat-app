/** ExternalImports */
const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

const Message = require("./src/models/message.model.js");
const Group = require("./src/models/group.model.js");

/**Internal Imports*/
const { authenticateToken } = require("./src/middlewares/auth.middleware.js");
const { connectDatabase } = require("./src/config/dbConnection.js");

const indexRoute = require("./src/routes/index.js");

const userRoute = require("./src/routes/user.route.js");
const groupRoutes = require("./src/routes/group.route.js");

/***app and other variable initializations */
const app = express();
app.use(cors());
app.use(cookieParser());
const server = http.createServer(app);
const io = socketIo(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/select", authenticateToken, (req, res) => {
  res.render("select", { user: req.user });
});

app.get("/chat", authenticateToken, async (req, res) => {
  const messages = await Message.find({ recipients: req.user.userName });

  res.render("chat", {
    userId: req.user._id,
    username: req.user.userName,
    messages,
  });
});

// View groups
app.get("/groups", authenticateToken, async (req, res) => {
  const groups = await Group.find({ members: req.user.userName });
  res.render("groups", { groups, user: req.user });
});

const port = 3001;
connectDatabase();

/***Middlewares */

app.use(bodyParser.json({ limit: "100mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/", indexRoute);
app.use("/api/user", userRoute);
app.use("/api/groups", groupRoutes);

// function authenticateToken(req, res, next) {
//   const jwt = require("jsonwebtoken");
//   const token = req.cookies.token;
//   if (!token) return res.redirect("/login");

//   jwt.verify(token, "Login_Secret", (err, user) => {
//     if (err) return res.redirect("/login");
//     req.user = user;
//     next();
//   });
// }

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", (userId) => {
    socket.join(userId);

    Group.find({ members: userId }).then((groups) => {
      groups.forEach((group) => {
        socket.join(group.name);
      });
    });
  });

  socket.on("sendMessage", async ({ senderId, content, recipients, group }) => {
    const message = new Message({
      sender: senderId,
      content: content,
      recipients: group ? [] : recipients,
      group: group || null,
    });
    await message.save();

    if (group) {
      io.to(group).emit("receiveMessage", message);
    } else {
      recipients.forEach((recipient) => {
        io.to(recipient).emit("receiveMessage", message);
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

/* Error handler middleware */

app.use(async (req, res, next) => {
  console.log("inside not found");
  next(createError.NotFound());
});

const tokenBlacklist = new Set();

app.post("/logout", (req, res) => {
  const token = req.headers["authorization"];
  if (token) {
    tokenBlacklist.add(token);

    // res.status(200).json({ message: "Successfully logged out" });
  } else {
    res.status(400).json({ message: "No token provided" });
  }
});

function checkBlacklist(req, res, next) {
  const token = req.headers["authorization"];
  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({ message: "Token is invalid" });
  }
  next();
}
app.get("/logout", (req, res) => {
  res.render("login", { title: "Login" });
});
app.use(checkBlacklist);
app.use((err, req, res, next) => {
  console.log("inside error", err.status);
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

server.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`);
});

module.exports = app;
