import type { IUser } from "../../services/users";

function isUser(obj: unknown): obj is IUser {
  return typeof obj === 'object' &&
          obj !== null &&
          'name' in obj &&
          typeof obj.name === 'string' &&
          'age' in obj &&
          typeof obj.age === 'number';
}