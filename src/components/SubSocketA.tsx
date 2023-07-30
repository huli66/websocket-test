import { SocketServer, subscribeWebsocket } from "../sockets/webSocket";

const SubSocketA = () => {
  const subscribeSocket = (socketServer: SocketServer) => {
    subscribeWebsocket(socketServer, {});
  };
  return (
    <ul>
      <li onClick={() => subscribeSocket(SocketServer.MDM)}>sub MDM</li>
      <li onClick={() => subscribeSocket(SocketServer.TDM)}>sub TDM</li>
      <li onClick={() => subscribeSocket(SocketServer.SCM)}>sub SCM</li>
    </ul>
  );
};

export default SubSocketA;
