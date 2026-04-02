const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 

const connectDB = require('./Config/DB');
const authRoutes = require('./Routes/authRoutes');
const userRoutes = require('./Routes/userRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const socketSetup = require('./socket'); 
const conversationRoutes=require('./Routes/conversationRoutes')

dotenv.config();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to GossipGO');
});

// DB connection
connectDB();

// Routes
app.use('/api/users',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations',conversationRoutes);

//  Create server
const server = http.createServer(app);

//  Attach socket
socketSetup(server);

// Start server
const Port = 8000;
server.listen(Port, () => {
  console.log(`Server is Listening on ${Port} Port`);
});