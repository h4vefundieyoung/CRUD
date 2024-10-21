import { createServer } from "node:http";
import { cpus, EOL } from "node:os";
import { pipeline } from "node:stream";
import cluster from "node:cluster";

import { sendServerError } from "../helpers";
import { MiddlewareManager, requestT } from "../middlewares";

const PORT = Number(process.env.APP_PORT) || 3000;
const HOST = "http://localhost";

if (cluster.isPrimary) {
  await import("./store");
  const ports: Number[] = [];

  const loadBalancer = createServer(async (req: requestT, res) => {
    await MiddlewareManager.process(req);
    const { method, url, body: reqBody } = req;
    const port = ports.shift();

    try {
      const { body, headers: workerHeaders, status, statusText } = await fetch(`${HOST}:${port}${url}`, { method, body: reqBody });
      
      res.writeHead(status, statusText, Object.fromEntries(workerHeaders.entries()));

      if (body) {
        pipeline(body, res, (e) => {
          if (e) {
            return !res.closed && sendServerError(res);
          }
          res.end();
        });
      } else {
        res.end()
      }
      
      port && ports.push(port);
    } catch (e) {
      sendServerError(res);
    }
  }).listen(PORT);
  

  for(let i = 1; i <= cpus().length - 1; i++) {
    const WORKER_PORT = PORT + i;
    const onDisconnect = () => {
      const worker = cluster.fork({ WORKER_PORT });
      console.log(`${process.pid} died${EOL}reloaded PID: ${worker.process.pid} PORT: ${WORKER_PORT}`);
    };
    
    cluster.fork({ WORKER_PORT })
    .on("disconnect", onDisconnect)
    .on("error", onDisconnect);

    ports.push(WORKER_PORT);
  }
  console.log(  `Load balancer listening on port ${PORT}`);
} else {
    await import("./main");
};