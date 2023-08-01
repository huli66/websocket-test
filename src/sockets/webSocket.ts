import { genID } from "../utils/commonFn";

export enum SocketServer {
  MDM = 0x000001,
  TDM = 0x000010,
  SCM = 0x000100,
}

let status = 0x000000;

const getStatus = () => {
  return status;
};

const socketUrlMap: Map<SocketServer, string> = new Map([
  [SocketServer.MDM, "ws://localhost:3000/mdm"],
  [SocketServer.TDM, "ws://localhost:3000/tdm"],
  [SocketServer.SCM, "ws://localhost:3000/scm"],
]);

// TODO: 改成数组存储也可以
const socketMap: Map<SocketServer, WebSocket> = new Map();
const callbackMap: Map<SocketServer, Map<string, unknown>> = new Map();
const lockReconnectLockMap: { [socketServer: string]: boolean } = {};

const changeStatus = (socketServer: SocketServer, isConnected: boolean) => {
  console.log(socketServer, isConnected);
  if (!isConnected) {
    status |= socketServer;
  } else {
    status &= ~socketServer;
  }
};

const createWebsocket = (socketServer: SocketServer) => {
  const url = socketUrlMap.get(socketServer) || "";
  console.log("url", url);
  const websocket = new WebSocket(url);
  const onStatusChange = (isConnected: boolean) =>
    changeStatus(socketServer, isConnected);

  socketMap.set(socketServer, websocket);
  heartCheck.start(socketServer);
  onStatusChange(true);

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

interface SubScribeParams<T = unknown, K = unknown> {
  callback: (message: T) => void;
  params?: K;
}

const subscribeWebsocket = (
  socketServer: SocketServer,
  subscribeParams: SubScribeParams
) => {
  // 1.判断是否订阅过
  let websocket = socketMap.get(socketServer);
  console.log(websocket);
  if (websocket) {
    console.log("已经订阅过");
  } else {
    websocket = createWebsocket(socketServer);
  }

  // 2.生成唯一id，保存回调事件
  const subscribeId = genID("socket");

  if (callbackMap.has(socketServer)) {
    const serverCallback = callbackMap.get(socketServer);
    serverCallback?.set(subscribeId, subscribeParams.callback);
    websocket.send(
      JSON.stringify({
        id: subscribeId,
        params: subscribeParams.params,
      })
    );
  }

  return subscribeId;
};

const unSubscribeWebsocket = (
  socketServer: SocketServer,
  subscribeId: string
) => {
  // 1.移除事件map中对应id 的事件
  const serverCallback = callbackMap.get(socketServer);
  serverCallback?.delete(subscribeId);
  console.log(serverCallback?.size);
  // 2.判断是否还有事件，没有则 closeWebsocket
  if (serverCallback?.size === 0) {
    closeWebsocket(socketServer);
  }
};

const reconnect = (socketServer: SocketServer) => {
  if (lockReconnectLockMap[socketServer]) return;
  //没连接上会一直重连，设置延迟避免请求过多
  lockReconnectLockMap[socketServer] = true;
  setTimeout(() => {
    createWebsocket(socketServer);
    lockReconnectLockMap[socketServer] = false;
  }, 6000);
};

interface IHeartCheckType {
  timeout: number;
  timeoutId: { [socketServer: number]: number };
  sendCount: { [socketServer: number]: number };
  start: (socketServer: SocketServer) => void;
  clear: (socketServer: SocketServer) => void;
}
const heartCheck: IHeartCheckType = {
  timeout: 2000,
  timeoutId: {},
  sendCount: {},
  start: function (socketServer) {
    clearInterval(this.timeoutId[socketServer]);
    this.timeoutId[socketServer] = setInterval(() => {
      const websocket = socketMap.get(socketServer) as WebSocket;
      if (websocket?.readyState === 1) {
        websocket.send(`PING`);
      }
      this.sendCount[socketServer] += 1;
      if (this.sendCount[socketServer] > 3) {
        changeStatus(socketServer, false);
        websocket.onclose = null;
        websocket.onerror = null;
        reconnect(socketServer);
      }
    }, this.timeout);
  },
  clear: function (socketServer) {
    this.sendCount[socketServer] = 0;
  },
};

const closeWebsocket = (socketServer: SocketServer) => {
  // 1.关闭websocket
  const websocket = socketMap.get(socketServer);
  websocket && websocket.close();
  // 2.释放空间
  socketMap.delete(socketServer);
  callbackMap.delete(socketServer);
};

export {
  closeWebsocket,
  createWebsocket,
  subscribeWebsocket,
  unSubscribeWebsocket,
  getStatus,
};
