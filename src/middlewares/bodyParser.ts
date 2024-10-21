import { MiddlewareManager } from "./middlewareManager";

import type { middlewareT, requestT } from "./middlewareManager";

const parseBody: middlewareT = (req: requestT) => {
  return new Promise((res, rej) => {
    let body = '';
  
    req
    .on('error', rej)
    .on('data', (chunk) => {
      body += chunk;
    })
    .on('end', () => {
      try {
        req.json = JSON.parse(body);
      } catch {}
      req.body = body;
      res(null);
    });
  });
};

MiddlewareManager.use(parseBody);