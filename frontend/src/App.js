import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

function App() {
  const [username, setUsername] = useState("");

  const handleLogin = (nickname, cb) => {
    socket.emit("login", nickname, (res) => {
      if (res.success) {
        setUsername(nickname);
      }
      cb(res);
    });
  };

  return (
    <>
      {username ? (
        <Chat username={username} socket={socket} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
