import { IncomingMessage } from "http";

export type requestT = { body?: string | Object, parsedUrl?: URL } & IncomingMessage;
export type middlewareT = (req: requestT) => void;
export type middlewareParamsT = Parameters<middlewareT>;

class MiddlewareManager {
  middlewareList: middlewareT[] = [];

  use (...args: middlewareT[]) {
    this.middlewareList.push(...args);
  }

  process (...args: middlewareParamsT) {
    return new Promise(async (res, rej) => {
      for (let middleware of this.middlewareList) {
        try {
          await middleware(...args);
        } catch (e) {
          rej(e);
        }
      };
      res(args);
    })
  }
}

export const middlewareManager = new MiddlewareManager();