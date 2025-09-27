import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import ChatBubble from "./ChatBubble";

const API_URL = `${process.env.REACT_APP_API_URL}/api/messages`;

export default function Chat({ socket, username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(API_URL);
      setMessages(res.data);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on("chatMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("userList", (list) => setUsers(list));
    return () => {
      socket.off("chatMessage");
      socket.off("userList");
    };
  }, []);

  const endRef = useRef();
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input) return;
    socket.emit("chatMessage", { message: input });
    setInput("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "70%",
        mx: "auto",
        mt: 5,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Welcome, {username}
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Online: {users.join(", ")}
      </Typography>

      <Box
        sx={{
          flex: 1, // grow to fill available space if parent uses flex
          maxHeight: "70vh", // or any fixed value
          overflowY: "auto", // 🔑 vertical scrolling
          px: 2,
          py: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List sx={{ display: "flex", flexDirection: "column" }}>
          {messages.map((m) => (
            <ChatBubble
              key={m._id || Math.random()}
              message={m}
              isOwn={m.username === username}
            />
          ))}
        </List>
        <div ref={endRef} />
      </Box>

      <TextField
        label="Message"
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
      />
      <Button
        variant="contained"
        sx={{ mt: 1 }}
        fullWidth
        onClick={sendMessage}
      >
        Send
      </Button>
    </Box>
  );
}
