const express = require('express');
const cors = require('cors');
const socket = require('socket.io');

const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const msgRoutes = require('./routes/msgRoutes');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', userRoutes);
app.use('/api/messages', msgRoutes);

console.log("req.body");
// app.use('/api/auth', (req, res, next) => {
//     console.log('Incoming request:', req.method, req.url, req.body);
//     next();
//   }, userRoutes);

// mongoose.connect(process.env.MONGO_URL,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// mongoose.connect(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB has been connected successfully");
  })
  .catch((err) => {
    console.error("Error connecting to DB:", err);
    process.exit(1); // Exit the process on connection error
  });
  
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT,()=>{
    console.log(`Server started on ${process.env.PORT}`);
})


const io = socket(server,{
  cors:{
    origin: process.env.ORIGIN,
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection",(socket)=>{
  global.chatSocket = socket;
  socket.on("add-user",(userId)=>{
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
   console.log("sending msges",{data});
    const sendUserSocket = onlineUsers.get(data.to); // Fix the typo here
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
  
})








