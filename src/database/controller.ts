import { ServerResponse } from "http"

import { usersdb } from "./usersdb";

const wrongRequestMessage = "Wrong db request";

class DBController {
  users = usersdb;

  handleRequest(url: URL, method: string, body: string, res: ServerResponse) {
    const [_, path, param] = url.pathname.split("/");
    const bodyObject = body && JSON.parse(body);

    switch(path) {
      case "users": {
        if (this.users[method.toLowerCase()]) {
          const data = this.users[method](param, bodyObject);
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