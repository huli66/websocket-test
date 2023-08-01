import Express from "express";
import ExpressWs from "express-ws";

const app = Express();
ExpressWs(app);

app.use(function (req, res, next) {
  // console.log("middleware");
  res.setHeader("Access-Control-Allow-Origin", "*");
  req.testing = "testing";
  return next();
});

app.get("/name", function (req, res) {
  console.log("get route", req.testing);
  res.write("hello");
  res.end("world!");
});

app.ws("/mdm", function (ws, req) {
  ws.on("message", function (msg) {
    if (msg === "PING") {
      ws.send("PONG");
      return;
    }
    console.log(msg);
    ws.send("mdm socket receive");
  });
  console.log("socket", req.testing);
});

app.ws("/tdm", function (ws, req) {
  ws.on("message", function (msg) {
    if (msg === "PING") {
      ws.send("PONG");
      return;
    }
    console.log(msg);
    ws.send("socket receive");
  });
  console.log("socket", req.testing);
});

// app.ws("/scm", function (ws, req) {
//   ws.on("message", function (msg) {
//     if (msg === "PING") {
//       ws.send("PONG");
//       return;
//     }
//     console.log(msg);
//     ws.send("socket receive");
//   });
//   console.log("socket", req.testing);
// });

app.listen(3000, () => console.log("start"));
