import type { Service } from "../abstractions";

const DB_PORT = process.env.DB_PORT || 4000;
const DB_HOST = process.env.DB_HOST || `http://localhost`;
  
class UsersService implements Service {
  async requestData (method: string, body?: string, param?: string) {
    const isBodyAllowed = method !== "get" && method !== "head";
    const URL = `${DB_HOST}:${DB_PORT}/${param ? param : ""}`; 
    return fetch(URL, { body: isBodyAllowed ? body : null, method });
  }
};

export const usersService = new UsersService();