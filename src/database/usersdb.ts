export type IUserDTO = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export class UsersDB {
  static [s: string]: any;

  private static users: IUserDTO[] = []

  static async get(_: never): Promise<IUserDTO[]>
  static async get (_: never, _id: string): Promise<IUserDTO | false>
  static async get(_: never, _id?: string) {
    if (!_id) {
      return UsersDB.users;
    }

    const user = UsersDB.users.find(({ id }) => _id === id);
    return user ? user : false;
  }

  static async post (user: IUserDTO) {
    return UsersDB.users.push(user);
  }

  static async put (_user: IUserDTO, id: string) {
    let updated = false; 

    UsersDB.users = UsersDB.users.map((user) => {
      const match = user.id === id;

      if (match) {
        updated = true;
      }

      return match ? {..._user, id } : user;
    });

    return updated;
  }

  static async delete (_:never, _id: string) {
    const index = UsersDB.users.findIndex(({ id }) => _id === id);

    return ~index ? Boolean(UsersDB.users.splice(index, 1)) : false;
  }
}