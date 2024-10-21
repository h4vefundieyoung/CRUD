import { IncomingMessage, RequestOptions, get, request } from "node:http";

import type { IUserDTO } from "../database/usersdb";

export const getReqOpt = (method: string = "GET", path: string = ""): RequestOptions => {
  return {
    port: process.env.APP_PORT|| 3000,
    hostname: 'localhost',
    path: "/users" + path,
    method: method,
  };
}


type getUsersResponseData<T> = Promise<{
  getUsersResponse: IncomingMessage
  getUsersResponseData: T
}>

export function getUsers(): getUsersResponseData<IUserDTO[]>
export function getUsers(id: string): getUsersResponseData<Partial<IUserDTO>>
export function getUsers(id?: string) {
  return new Promise(async (res, rej) => {
    get(getReqOpt("GET", id ? `/${id}` : ""), (getUsersResponse) => {
      const getUsersResponseChunks: string[] = [];
      getUsersResponse
      .on("data", (chunk) => {
        getUsersResponseChunks.push(chunk);
      })
      .on("end", () => {
        res({
          getUsersResponse,
          getUsersResponseData: JSON.parse(getUsersResponseChunks.join())
        })
      })
      .on("err", () =>rej(getUsersResponse.statusCode));
    });
  })
};

export function customRequest(options: RequestOptions, body?: string): Promise<IncomingMessage> {

  return new Promise((res, rej) => {
    const req = request(options, (response) => {
      response.statusCode! >= 200 && response.statusCode! < 300 ? res(response) : rej(response.statusCode);
    });
    body && req.write(body);
    req.on("error", rej);
    req.on("timeout", rej);
    req.end();
  });
}