import Race, * as RaceModule from './race';
import Sailboat, * as SailboatModule from './sailboat';
import User, * as UserModule from './user';
import UserSailboat, * as UserSailboatModule from './userSailboat';

User.hasMany(Race);
Race.belongsTo(User);

User.belongsToMany(Sailboat, { through: UserSailboat });
Sailboat.belongsToMany(User, { through: UserSailboat });

export {
  Race,
  RaceModule,
  Sailboat,
  SailboatModule,
  User,
  UserModule,
  UserSailboat,
  UserSailboatModule,
};
