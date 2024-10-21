import { MiddlewareManager } from "./middlewareManager";

import type { middlewareT, requestT } from "./middlewareManager";

const lowerCaseMethod: middlewareT = (req: requestT) => {
  req.method = req.method && req.method.toLocaleLowerCase();
};

MiddlewareManager.use(lowerCaseMethod);