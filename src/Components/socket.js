import { io } from "socket.io-client";

// Replace with your actual backend URL if deployed
const SOCKET_URL = "http://localhost:5000";

const socket = io(SOCKET_URL, {
    transports: ["websocket"], // Ensures WebSocket connection
    withCredentials: true,
});

export default socket;
