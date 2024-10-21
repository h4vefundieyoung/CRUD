import { ServerResponse } from 'node:http';
import { pipeline } from "node:stream"
import { v7, validate } from "uuid";

import { Controller } from "../abstractions";
import { usersService } from '../services';
import { sendServerError, sendWrongRequestError } from '../helpers';
import { isUser } from '../types/typeguards';

import type { requestT } from '../middlewares';

class UsersController implements Controller {
  async handleRequest(req: requestT, res: ServerResponse) {
    const { parsedUrl, method, json } = req;
    const [, service, param] = parsedUrl!.pathname.split("/");
    const formattedService = service.toLowerCase().trim();

    const isPost = method === "post";
    const isDelete = method === "delete";

    if(formattedService === "users") {
      if(param && !validate(param) || json && !isUser(json)) {
        return sendWrongRequestError(res);
      }
  
      if(isPost) {
        try {
          json!.id = v7();
          req.body = JSON.stringify(json);
        } catch (e) {
          sendServerError(res);
        }
      }

      const { body, status, statusText, headers, ok } = await usersService.requestData(method!, req.body, param);
      const updatedStatus = ok ? isPost ? 201 : isDelete ? 204 : status : status;

      res.writeHead(updatedStatus, statusText, Object.fromEntries(headers.entries()));

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

export const usersController = new UsersController();