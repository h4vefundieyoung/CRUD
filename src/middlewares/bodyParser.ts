import type { middlewareT, requestT } from "./middlewareManager";

import { middlewareManager } from "./middlewareManager";

const parseBody: middlewareT = (req: requestT) => {
  let body = '';
  
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      body = JSON.parse(body);
    } catch {}
    req.body = body;
  });
};

middlewareManager.use(parseBody);