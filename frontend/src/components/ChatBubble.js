import { Box, Typography } from "@mui/material";
import { nameToColor } from "../utils/colorHash"; // make sure export/import match

export default function ChatBubble({ message, isOwn }) {
  const userColor = nameToColor(message.username);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignSelf: isOwn ? "flex-end" : "flex-start", // 🔑 RIGHT for your own
        mb: 1,
        maxWidth: "70%",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: userColor,
          fontWeight: "bold",
          textAlign: isOwn ? "right" : "left",
          mb: 0.3,
        }}
      >
        {message.username}
      </Typography>

      <Box
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 2,
          bgcolor: isOwn ? "primary.main" : "grey.200",
          color: isOwn ? "primary.contrastText" : "text.primary",
          boxShadow: 1,
        }}
      >
        <Typography variant="body1">{message.message}</Typography>
      </Box>
    </Box>
  );
}
