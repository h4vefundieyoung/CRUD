import { ServerResponse } from "node:http"

import { usersdb } from "./usersdb";

import type { requestT } from "../middlewares/middlewareManager";

const wrongRequestMessage = "Wrong db request";

class DBController {
  private users = usersdb;

  handleRequest(req: requestT, res: ServerResponse) {
    const { parsedUrl, body } = req;
    const [_, path, param] = parsedUrl!.pathname.split("/");
    const method = req.method || "";

    switch(path) {
      case "users": {
        if (this.users[method]) {
          const data = this.users[method](param, body);
          const isObject = typeof data === "object" && data !== null;
          const statusCode = data ? 200 : 404;
          const headers = { 'Content-Type': isObject ? 'application/json' : 'text/plain' }

          res.writeHead(statusCode, headers);
          res.end(isObject ? JSON.stringify(data) : statusCode === 200 ? "" : "Not Found");
        } else {
          res.writeHead(400);
          res.end(wrongRequestMessage);
        }

        break;
      }
      default: {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end(wrongRequestMessage);
      }
    } 
  }
}

export const controller = new DBController();