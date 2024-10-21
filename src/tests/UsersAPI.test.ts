import 'dotenv/config'

import { getUsers, getReqOpt, customRequest } from './testingHelpers';
import { IUserDTO } from '../database/usersdb';


describe('API Data Tests' , () => {
  const user = {
    username: 'John Doe',
    age: 20,
    hobbies: ['Hobby horsing']
  };
  const initBody = JSON.stringify(user);

  test('it should create user', async () => {
    const response = await customRequest(getReqOpt("POST"), initBody);
    expect(response.statusCode).toBe(201);
  });

  test('it should get users', async () => {
    const { getUsersResponse, getUsersResponseData } = await getUsers();

    expect(getUsersResponse.statusCode === 200).toBeTruthy();
    expect(Array.isArray(getUsersResponseData)).toBeTruthy();
    expect(getUsersResponseData.length).toBeGreaterThan(0);
  });

  test('it should get user by id', async () => {
    const { getUsersResponseData: getAllUsersResponseData } = await getUsers();
    const { getUsersResponse, getUsersResponseData } = await getUsers(getAllUsersResponseData.at(-1)!.id!);

    delete getUsersResponseData.id;

    expect(getUsersResponse.statusCode === 200).toBeTruthy();
    expect(JSON.stringify(getUsersResponseData)).toEqual(initBody);
  });

  test('it should update user', async () => {
    const { getUsersResponseData: getAllUsersResponseData } = await getUsers();
    const fetchedUser = getAllUsersResponseData.at(-1)!;
    const updatedUserClone = structuredClone(fetchedUser) as Partial<IUserDTO>;
    const updatedUserAge = 99;

    delete updatedUserClone.id;
    updatedUserClone.age = updatedUserAge;

    const res = await customRequest( getReqOpt("PUT", `/${fetchedUser.id}`), JSON.stringify(updatedUserClone));
    expect(res.statusCode).toBe(200);

    const { getUsersResponseData } = await getUsers(fetchedUser.id!);

    expect(getUsersResponseData.age).toBe(updatedUserAge);
  });

  test('it should delete user', async () => {
    const { getUsersResponseData } = await getUsers();
    const { id } = getUsersResponseData.at(-1)!;
    
    const res = await customRequest( getReqOpt("DELETE", `/${id}`));
    const { getUsersResponseData: getUsersResponseDataAfterDelete  } = await getUsers();

    expect(res.statusCode).toBe(204);
    expect(getUsersResponseDataAfterDelete.find(({ id: _id }) => _id === id)).toBeFalsy();
  });
});

describe('API Errors tests', () => {
  test('it should return 404 status code for non-existing user', async () => {
    const options = getReqOpt();
    options.path = "/nonexistingpath";
    expect(customRequest(options)).rejects.toBe(404);
  });

  test('it should return 400 status code for wrong args', () => {
    expect(customRequest(getReqOpt("POST"), JSON.stringify({random: "random"}))).rejects.toBe(400);
  });
});