import { ServerResponse } from "node:http";

const msg = "Internal server error";

export function sendServerError (res: ServerResponse) {
  res.writeHead(500);
  res.end(msg);
};