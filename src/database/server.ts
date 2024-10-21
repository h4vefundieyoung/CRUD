import { createServer } from "node:http";

import { controller } from "./controller"
import { middlewareManager } from "../middlewares/middlewareManager";

const port = process.env.USERS_DB_PORT;
const dbServer = createServer(async (req, res) => {
  await middlewareManager.process(req);
  controller.handleRequest(req, res);
});

dbServer.listen(port || 3000);

console.log(`DB Server's running on port ${port || 3000}`);