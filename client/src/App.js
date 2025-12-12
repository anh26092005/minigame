import { useEffect, useState } from "react";
import { socket } from "./socket";

function App() {
  const [nickname, setNickname] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState([]);

  // 1) Kết nối socket + lắng nghe event từ server
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("players_update", (list) => {
      setPlayers(list);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    // cleanup khi unmount
    return () => {
      socket.off("connect");
      socket.off("players_update");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  // 2) Khi bấm Join
  const joinLobby = () => {
    const name = nickname.trim();
    if (!name) return;

    socket.emit("join_lobby", { nickname: name });
    setJoined(true);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Chat Mafia Online</h1>

      {!joined ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            placeholder="Nhập tên..."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && joinLobby()}
            style={{ padding: 8, width: 240 }}
          />
          <button onClick={joinLobby} style={{ padding: "8px 12px" }}>
            Join Lobby
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <h2>Danh sách người chơi ({players.length})</h2>
          <ul>
            {players.map((p) => (
              <li key={p.socketId}>
                {p.nickname} {p.alive === false ? "(dead)" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
