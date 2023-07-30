import { genID } from "../utils/commonFn";

export enum SocketServer {
  MDM = 0x0001,
  TDM = 0x0010,
  SCM = 0x0100,
}

const socketUrlMap: Map<SocketServer, string> = new Map([
  [SocketServer.MDM, "ws://localhost:3000/mdm"],
  [SocketServer.TDM, "ws://localhost:3000/tdm"],
  [SocketServer.SCM, "ws://localhost:3000/scm"],
]);

const socketMap: Map<SocketServer, WebSocket> = new Map();

// TODO: 改成数组存储吧
const callbackMap: Map<SocketServer, Map<string, any>> = new Map();

const onStatusChange = (socketServer: SocketServer, isConnected: boolean) => {
  console.log(socketServer, isConnected);
};

const createWebsocket = (socketServer: SocketServer) => {
  const url = socketUrlMap.get(socketServer) || "";
  console.log("url", url);
  const websocket = new WebSocket(url);
  const changeStatus = (isConnected: boolean) =>
    onStatusChange(socketServer, isConnected);

  socketMap.set(socketServer, websocket);
  heartCheck();
  changeStatus(true);

  websocket.onopen = (e) => {
    console.log("open", e, socketServer);
  };

  websocket.onmessage = (e) => {
    console.log("message", e);
  };

  websocket.onerror = (e) => {
    console.log("error", e);
  };

  websocket.onclose = (e) => {
    console.log("close", e);
  };

  return websocket;
};

interface IHeartCheckType {
  timeout: number;
  timeoutId: { [socketServer: number]: number };
  sendCount: { [socketServer: number]: number };
  start: (
    socketServer: SocketServer,
    changeStatus: (flag: boolean) => void,
    reconnect: () => void
  ) => void;
  clear: (socketServer: SocketServer) => void;
}
const heartCheck: IHeartCheckType = {
  timeout: 2000,
  timeoutId: {},
  sendCount: {},
  start: function (socketServer, changeStatus, reconnect) {
    clearInterval(this.timeoutId[socketServer]);
    this.timeoutId[socketServer] = setInterval(() => {
      const websocket = socketMap.get(socketServer) as WebSocket;
      if (websocket?.readyState === 1) {
        websocket.send(`PING`);
      }
      this.sendCount[socketServer] += 1;
      if (this.sendCount[socketServer] > 3) {
        changeStatus(false);
        websocket.onclose = null;
        websocket.onerror = null;
        reconnect();
      }
    }, this.timeout);
  },
  clear: function (socketServer) {
    this.sendCount[socketServer] = 0;
  },
};

const subscribeWebsocket = (
  socketServer: SocketServer,
  subscribeParams: any
) => {
  if (socketMap.has(socketServer)) {
    console.log("已经订阅过");
  } else {
    createWebsocket(socketServer);
  }
  const subscribeId = genID("mdm");

  if (callbackMap.has(socketServer)) {
    const serverCallback = callbackMap.get(socketServer);
    serverCallback?.set(subscribeId, subscribeParams);
  }
  console.log(subscribeParams);
};

const unSubscribeWebsocket = (
  socketServer: SocketServer,
  subscribeParams: any
) => {};

const closeWebsocket = () => {};

export {
  closeWebsocket,
  createWebsocket,
  subscribeWebsocket,
  unSubscribeWebsocket,
};
