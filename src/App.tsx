import { useState } from "react";
import "./App.css";
import ShowStatus from "./components/ShowStatus";
import SubSocketA from "./components/SubSocketA";
import { SocketServer, createWebsocket } from "./sockets/webSocket";
import TestSocketHook from "./components/TestSocketHook";

function App() {
  const [status, setStatus] = useState(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const onStatusChange = (socketServer: SocketServer, isConnected: boolean) => {
    console.log("change", socketServer, isConnected);
  };

  return (
    <>
      <TestSocketHook />
      {/* <ShowStatus status={0x000001} />
      <SubSocketA />
      <div
        onClick={() => {
          const soc = createWebsocket(SocketServer.MDM);
          setSocket(soc);
        }}
      >
        create
      </div>
      <div
        onClick={() => {
          socket && socket.send("hello");
        }}
      >
        send
      </div>
      <div
        onClick={() => {
          fetch("http://localhost:3000/name").then((res) => {
            console.log("res", res);
          });
        }}
      >
        fetch
      </div> */}
    </>
  );
}

export default App;
