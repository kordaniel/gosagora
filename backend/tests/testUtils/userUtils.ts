import { faker } from '@faker-js/faker';

import testDatabase from './testDatabase';
import testFirebase from './testFirebase';

// https://fakerjs.dev/
// Reproducible results
// If you want consistent results, you can set your own seed:
//faker.seed(1337);

// There are a few methods which use relative dates for which
// setting a random seed is not sufficient to have reproducible results
// (Mainly relative dates). Take this into account with:
//faker.setDefaultRefDate('2023-01-01T00:00:00.000Z');

export interface IUserBaseObject {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  displayName: string;
}

const createUserBase = (): IUserBaseObject => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });

  return {
    email, // Length must be in the closed range [8,256]
    firstName,
    lastName,
    password: faker.internet.password({
      length: Math.floor(Math.random() * 23) + 8, // [8, 30]
    }),
    displayName: faker.internet.displayName({
      firstName,
      lastName,
    }), // Length must be in the closed range [4,64]
  };
};

//const userBaseObjects: IUserBaseObject[] = [];

function* generateUserBaseObj(): Generator<
IUserBaseObject,
IUserBaseObject,
void
> {
  //let i: number = 0;
  while (true) {
    yield createUserBase();
    //userBaseObjects.push(createUserBase());
    //yield { index: i, userBaseObject: userBaseObjects[i++] };
  }
}

const userBaseObjectGenerator = generateUserBaseObj();

const createSignedInUser = async () => {
  const userBase = userBaseObjectGenerator.next().value;
  const credentials = await testFirebase.addNewUserEmailPassword(userBase.email, userBase.password);
  const user = await testDatabase.insertUser({
    email: userBase.email.toLowerCase(),
    displayName: userBase.displayName,
    firebaseUid: credentials.user.uid,
  });

  return { user, credentials };
};

export default {
  //userBaseObjects,
  userBaseObjectGenerator,
  createSignedInUser,
};
