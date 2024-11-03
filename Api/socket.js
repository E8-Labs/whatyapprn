// socket.js
import io from "socket.io-client";

const SERVER_URL = "ws://185.28.22.219:8004"; // Replace with your server URL
const socket = io(SERVER_URL, {
  autoConnect: false,
});

export default socket;
