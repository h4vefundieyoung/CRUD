import { ServerResponse } from 'node:http';
import { pipeline } from "node:stream"

import { Controller, Service } from "../abstractions";
import { usersService } from '../services';

import type { requestT } from '../middlewares';
import { sendServerError, sendWrongRequestError } from '../helpers';

class MainController implements Controller {
  private services: { [key: string]: Service  } = {
    users: usersService
  }

  async handleRequest(req: requestT, res: ServerResponse) {
    const { parsedUrl, method, body: reqBody } = req;
    const [, service, param] = parsedUrl!.pathname.split("/");
    const formattedService = service.toLowerCase().trim();
    
    if(this.services[formattedService]) {
      const { body, status, statusText, headers } = await this.services[formattedService].requestData(method || "", reqBody, param);

      res.writeHead(status, statusText, Object.fromEntries(headers.entries()));

      if (body) {
        pipeline(body, res, (e) => {
          if (e) {
            return !res.closed && sendServerError(res);
          }
          
          res.end();
        });
      } else {
        res.end();
      }
    } else {
      sendWrongRequestError(res);
    }
  }
};

export const mainController = new MainController();