import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

export default function ChatItem({ chat }) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "primary.light",
        borderRadius: 2,
        mt: 0.5,
      }}
    >
      <Chip
        color="secondary"
        avatar={<Avatar>{chat.firstLetter}</Avatar>}
        label={chat.user}
        sx={{ mt: 1, ml: 1 }}
      />
      <ListItem>
        <ListItemText>{chat.message}</ListItemText>
      </ListItem>
    </Box>
  );
}
