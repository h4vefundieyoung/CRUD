import type { IUser } from "../services/users"

class UsersDB {
  [s: string]: any;

  private users: IUser[] = []

  get(): IUser[]
  get (_id: string): IUser | null
  get(_id?: string) {
    if (!_id) {
      return this.users;
    }

    const user = this.users.find(({ id }) => _id === id);
    return user ? user : null;
  }

  post (_: unknown, user: IUser) {
    return this.users.push(user);
  }

  put (_: unknown, _user: IUser) {
    let updated = false; 

    this.users = this.users.map((user) => {
      const match = user.id === _user.id;

      if (match) {
        updated = true;
      }

      return match ? _user : user;
    });

    return updated;
  }

  delete (_id: string) {
    const index = this.users.findIndex(({ id }) => _id === id);

    return ~index ? Boolean(this.users.splice(index, 1)) : false;
  }
}

export const usersdb = new UsersDB();