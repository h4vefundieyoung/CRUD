import type { middlewareT, requestT } from "./middlewareManager";

import { middlewareManager } from "./middlewareManager";

const parseURL: middlewareT = (req: requestT) => {
  req.parsedUrl = new URL(req.url || "", `http://${req.headers.host}`);
};

middlewareManager.use(parseURL);