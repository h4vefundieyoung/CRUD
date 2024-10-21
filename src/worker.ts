import { createServer } from "node:http";
import { cpus, EOL } from "node:os";
import cluster from "node:cluster";

import { middlewareManager } from "./middlewares/middlewareManager";

const port = process.env.APP_PORT || 3000;

if (cluster.isPrimary) {
  await import("./database/server");

  const onDisconnect = () => {
    const worker = cluster.fork();
    console.log(`${process.pid} died${EOL}reloaded PID: ${worker.process.pid}`)
  }

  for(let i = 0; i < cpus().length; i++) {
    const worker = cluster.fork()
    .on("disconnect", onDisconnect)
    .on("error", onDisconnect);

    console.log(`Worker PID: ${worker.process.pid}`);
  }

  console.log(`Server's running on port ${port}`)
} else {
  createServer((req, res) => {

  }).listen(port);
};