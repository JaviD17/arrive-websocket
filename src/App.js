import { useEffect, useState } from "react";
import uniqueId from "./utils/idGenerator";
import {
  Box,
  Button,
  Container,
  Typography,
  ListItem,
  ListItemText,
} from "@mui/material";
import ChatItem from "./components/ChatItem";
import List from "@mui/material/List";

const url = "wss://tso-take-home-chat-room.herokuapp.com/";
let webSocket;

function App() {
  const [chat, setChat] = useState([]);
  const [scoreboard, setScoreboard] = useState({});
  const [sorted, setSorted] = useState({});

  // empty array means it only runs once
  useEffect(() => {
    // socket invoked onMount
    webSocket = new WebSocket(url);

    // when socket opens console log event
    webSocket.onopen = (event) => {
      console.log("Socket open: ", event);
    };

    // fires close after unmount
    return () => {
      webSocket.close();
    };
  }, []);

  // handles webSocket onmessage event
  useEffect(() => {
    let user;
    let firstLetter;
    let message;
    let score;

    webSocket.onmessage = (event) => {
      user = event.data.split(": ")[0];
      firstLetter = event.data.split("")[0];
      message = event.data.split(": ")[1];
      score = event.data.split(" ").length;

      // computed property - derived from state like in Vue.js
      const sortedScoreboard = Object.entries(scoreboard)
        .sort(([, a], [, b]) => b - a)
        .reduce((accumulator, [key, val]) => {
          return { ...accumulator, [key]: val };
        }, {});

      // set sortedScoreboard to sorted with setSorted setter
      setSorted(sortedScoreboard);

      // ...chat to maintain previous state value and push a new object into it
      // set id with uniqueId() from uuidv4 to maintain unique keys on line 145
      setChat([
        ...chat,
        {
          id: uniqueId(),
          user,
          firstLetter,
          message,
        },
      ]);

      // if user isn't in scoreboard then spread previous state value
      // and push user as dynamic key with score as value
      if (!Object.keys(scoreboard).includes(user)) {
        setScoreboard({ ...scoreboard, [user]: score });
      } else {
        setScoreboard({ ...scoreboard, [user]: scoreboard[user] + score });
      }
    };
  }, [chat, scoreboard]);

  return (
    <Container>
      <Box
        sx={{
          margin: "4px auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          color="primary"
          variant="outlined"
          onClick={() => webSocket.close()}
          sx={{ borderRadius: 2 }}
        >
          Close ws connection
        </Button>
      </Box>
      <Box
        sx={{
          margin: "4px auto",
          // height: 200,
          maxWidth: 360,
          width: "100%",
          border: "2px solid",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" textAlign="center" sx={{ my: 1 }}>
          User Scoreboard
        </Typography>

        {/* used sorted */}
        {Object.keys(sorted).map((key) => (
          <ListItem
            key={key}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <ListItemText>
              {key}: {sorted[key]}
            </ListItemText>
          </ListItem>
        ))}
      </Box>

      <Box
        className="App"
        sx={{
          m: "auto",
          height: 200,
          maxWidth: 360,
          p: 0,
        }}
      >
        <List disablePadding>
          {chat.map((c) => (
            <ChatItem chat={c} key={c.id} />
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default App;
