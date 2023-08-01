import { useWebsocket, SocketServer } from "../sockets/useSocket";

const TestSocketHook = () => {
  const { status, subscribeWebsocket, unSubscribeWebsocket } = useWebsocket();

  return (
    <div>
      <div>{status}</div>
      <ul>
        <li
          onClick={() =>
            subscribeWebsocket(SocketServer.TDM, {
              callback: (message) => console.log(message),
            })
          }
        >
          TDM
        </li>
        <li
          onClick={() =>
            subscribeWebsocket(SocketServer.MDM, {
              callback: (message) => console.log(message),
            })
          }
        >
          MDM
        </li>
        <li
          onClick={() =>
            subscribeWebsocket(SocketServer.SCM, {
              callback: (message) => console.log(message),
            })
          }
        >
          SCM
        </li>
      </ul>
    </div>
  );
};

export default TestSocketHook;
