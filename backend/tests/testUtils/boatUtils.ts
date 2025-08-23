import { User } from '../../src/models';
import testDatabase from './testDatabase';

const createBoatForUser = async (user: User) => {
  const boat = await testDatabase.insertSailboat({
    name: `${user.displayName} testboat 1`,
    sailNumber: 'TST-001',
    description: `This is the testboat number one for user ${user.displayName}`
  }, user.id);

  return boat;
};

export default {
  createBoatForUser,
};
