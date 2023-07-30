import { SocketServer, subscribeWebsocket } from "./webSocket";

// 大的hooks里面嵌套四个小的hooks

// 或者直接把整个websocket文件放在一个hook里面

function useSocket(socketServer: SocketServer) {
  const {} = subscribeWebsocket(socketServer);
  return {};
}
