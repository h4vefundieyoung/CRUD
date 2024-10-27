import type { IUserDTO } from "../../database/usersdb";

export function isUser(obj: unknown): obj is IUserDTO {
  return typeof obj === 'object' &&
          obj !== null &&
          'username' in obj &&
          typeof obj.username === 'string' &&
          'age' in obj &&
          !isNaN(Number(obj.age)) &&
          'hobbies' in obj && 
          Array.isArray(obj.hobbies);
}