import { User } from '../../src/models';
import testDatabase from './testDatabase';

let testboatNum: number = 0;

const createBoatForUser = async (user: User) => {
  testboatNum += 1;

  const boat = await testDatabase.insertSailboat({
    name: `${user.displayName} testboat ${testboatNum}`,
    sailNumber: `TST-00${testboatNum}`,
    description: `This is a testboat created by user ${user.displayName}`
  }, user.id);

  return boat;
};

export default {
  createBoatForUser,
};
