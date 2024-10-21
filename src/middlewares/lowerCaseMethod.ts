import type { middlewareT, requestT } from "./middlewareManager";

import { middlewareManager } from "./middlewareManager";

const lowerCaseMethod: middlewareT = (req: requestT) => {
  req.method = req.method && req.method.toLocaleLowerCase();
};

middlewareManager.use(lowerCaseMethod);