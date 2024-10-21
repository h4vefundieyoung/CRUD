import { createServer, ServerResponse } from "node:http";

import { MiddlewareManager } from "../middlewares";
import { sendServerError } from "../helpers";
import { AppRouter } from "../router";

import type { requestT } from "../middlewares";

const PORT = process.env.WORKER_PORT || process.env.APP_PORT || 3000;

if (!process.env.WORKER_PORT) {
  await import("./store")
}

export const serverHandler = async (req: requestT, res: ServerResponse) => {
  try {
    console.log(`Handling on PID:${process.pid} PORT: ${PORT}`);
    await MiddlewareManager.process(req);
    AppRouter.processRequest(req, res);
  } catch (e) {
    sendServerError(res);
  };
}

export const server = createServer(serverHandler).listen(PORT);

console.log(`Server started on port: ${PORT}`);