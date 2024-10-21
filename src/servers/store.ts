import { createServer } from "node:http";

import { dbController } from "../controllers"
import { MiddlewareManager } from "../middlewares";
import { sendServerError } from "../helpers";

const PORT = process.env.DB_PORT || 4000;

const dbServer = createServer(async (req, res) => {
  try {
    await MiddlewareManager.process(req);
    dbController.handleRequest(req, res);
  } catch (e) {
    sendServerError(res);
  }
});

dbServer.listen(PORT);

console.log(`DB Server's running on port ${PORT}`);