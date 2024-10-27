
import { ServerResponse } from "node:http";

export function sendCustomError (res: ServerResponse, code: number, msg: string) {
  res.writeHead(400);
  res.end(msg);
};  