import { Box, Typography , Button } from "@mui/material";
import { useEffect, useState } from "react";

export default function WebSocketCall({ socket }) {
  const [message, setMessage] = useState("off");
  const [messages, setMessages] = useState([]);

  const handleText = (e) => {
    const inputMessage = e.target.value;
    setMessage(inputMessage);
  };

  const handleSubmit = () => {
    if (message === "off") {
      socket.emit("data", message);
      setMessage("on");
    }
    else {
      setMessage("off");
    }
  };

  function remove_img(){
    if (document.getElementById('img') == null) {
      return 0
    }
    else {
    document.getElementById('img').remove();
    }

 }

  useEffect(() => {
    socket.on("data", (data) => {
      setMessages([...messages, data.data]);
    });
    return () => {
      socket.off("data", () => {
        console.log("data event was removed");
      });
    };
  }, [socket, messages]);

  return (
    <Box flex={4} p={2} >
      <Typography>WebSocket Communication</Typography>
      <input type="text" value={message} onChange={handleText} />
      {!message ? (
        <Button onClick={handleSubmit}>Turn on Websocket</Button>
      ) : (
        <>
          <Button onClick={handleSubmit}>Turn off Websocket</Button>
          <Button onClick={remove_img}> remove the image </Button>
          {messages.map((message, ind) => {
            return <img src={message.slice(0, -1) } alt="fire emblem" id="img"/>
          })}
        </>
      )}
    </Box>
  );
}
