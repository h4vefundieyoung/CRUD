import { ServerResponse } from "node:http";

import { usersController } from "../controllers";

import type { requestT } from "../middlewares";
import { sendNotFoundError } from "../helpers";

export class AppRouter {
  static [key: string]: (req: requestT, res: ServerResponse) => void;

  private static users (req: requestT, res: ServerResponse) {
    usersController.handleRequest(req, res);
  }

  static processRequest (req: requestT, res: ServerResponse) {
    const [_, route] = req.parsedUrl!.pathname.split("/");

    if (!AppRouter[route]) {
      return sendNotFoundError(res);
    }

    AppRouter[route](req, res);
  }
}