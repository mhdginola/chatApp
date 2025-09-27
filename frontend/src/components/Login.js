import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onLogin(name, (res) => {
      if (res.success) {
        setError("");
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <Box sx={{ width: 300, mx: "auto", mt: 10, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        Enter a nickname
      </Typography>
      <TextField
        fullWidth
        label="Nickname"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
      />
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        fullWidth
        onClick={handleSubmit}
      >
        Join as Guest
      </Button>
    </Box>
  );
}
