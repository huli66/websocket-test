import Koa from "koa";
import Router from "@koa/router";
import websocket from "koa-websocket";

const app = websocket(new Koa());
const router = new Router();

router.get("/get-name", (ctx) => {
  ctx.body = { message: "this is a api" };
});

app.ws.use((ctx, next) => {
  return next(ctx);
});

app.ws.use(
  router.all("/test-socket", function (ctx) {
    ctx.websocket.send("Hello World");
    ctx.websocket.on("message", (message) => {
      console.log("message", message);
    });
  })
);

app.use(router());

app.listen(3000, () => {
  console.log("start");
});
