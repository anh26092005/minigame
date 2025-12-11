// ================================
//  MAFIA GAME - SOCKET SERVER
// ================================

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

// Cho React frontend kết nối (port 3000)
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    })
);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const PORT = 5000;

// ================================
// LIST OF CONNECTED PLAYERS
// ================================

let players = []; // tạm thời không làm room, tất cả join chung

// ================================
// SOCKET EVENTS
// ================================

io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    // Player join lobby với nickname
    socket.on("join_lobby", ({ nickname }) => {
        players.push({
            socketId: socket.id,
            nickname,
            alive: true,
            role: null,
        });

        console.log(`👤 ${nickname} joined lobby`);

        // Gửi danh sách player cho tất cả người chơi
        io.emit("players_update", players);
    });

    // Player rời đi
    socket.on("disconnect", () => {
        players = players.filter((p) => p.socketId !== socket.id);
        io.emit("players_update", players);

        console.log("❌ Client disconnected:", socket.id);
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
