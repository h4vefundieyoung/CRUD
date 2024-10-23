import { createServer } from "http";
import { URL } from "url"

import { controller } from "./controller"

const port = process.env.USERS_DB_PORT;
const dbServer = createServer((req, res) => {
  const { method, url, headers } = req;
  const parsedURL = new URL(url || "", `http://${headers.host}`);
  const data: Buffer[] = [];

  req.on("data", (chunk: Buffer) => data.push(chunk));
  req.on("end", () => {
    const body = Buffer.concat(data).toString();
    controller.handleRequest(parsedURL, method!.toLowerCase(), body, res);
  });
});

dbServer.listen(port || 3000);

console.log(`DB Server is running on port ${port || 3000}`);