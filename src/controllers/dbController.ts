import { ServerResponse } from "node:http"

import { UsersDB } from "../database/usersdb";
import { sendWrongRequestError } from "../helpers";

import type { requestT } from "../middlewares";
import type { Controller } from "../abstractions";

class DBController implements Controller {
  private static usersDB = UsersDB;

  async handleRequest(req: requestT, res: ServerResponse) {
    const { json, parsedUrl } = req;
    const [, param] = parsedUrl!.pathname.split("/");
    const method = req.method || "";
    
    if (DBController.usersDB[method]) {
      const data = await DBController.usersDB[method](json, param);
      const isObject = typeof data === "object" && data !== null;
      const statusCode = data ? 200 : 404;
      const headers = { 'Content-Type': isObject ? 'application/json' : 'text/plain' }
      
      res.writeHead(statusCode, headers);
      res.end(isObject ? JSON.stringify(data) : statusCode === 200 ? "" : "Not Found");
    } else {
      sendWrongRequestError(res);
    }
  }
}

export const dbController = new DBController();