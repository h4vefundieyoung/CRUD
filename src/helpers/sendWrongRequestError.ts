
import { ServerResponse } from "node:http";

const msg = "Request error";

export function sendWrongRequestError (res: ServerResponse) {
  res.writeHead(400);
  res.end(msg);
};  