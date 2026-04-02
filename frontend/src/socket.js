import { io } from "socket.io-client";

const socket = io("https://gossip-go.onrender.com");

export default socket;