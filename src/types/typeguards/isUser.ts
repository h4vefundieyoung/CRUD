import type { IUserDTO } from "../../database/usersdb";

export function isUser(obj: unknown): obj is IUserDTO {
  return typeof obj === 'object' &&
          obj !== null &&
          'name' in obj &&
          typeof obj.name === 'string' &&
          'age' in obj &&
          typeof obj.age === 'number';
}