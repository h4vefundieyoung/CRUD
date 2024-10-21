import { ServerResponse } from "node:http";

const msg = "Not found";

export function sendNotFoundError (res: ServerResponse) {
  res.writeHead(404);
  res.end(msg);
};