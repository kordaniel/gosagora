import Race, * as RaceModule from './race';
import Sailboat, * as SailboatModule from './sailboat';
import User, * as UserModule from './user';
import UserSailboats, * as UserSailboatsModule from './userSailboats';

User.hasMany(Race);
Race.belongsTo(User);

User.belongsToMany(Sailboat, { through: UserSailboats });
Sailboat.belongsToMany(User, { through: UserSailboats });

export {
  Race,
  RaceModule,
  Sailboat,
  SailboatModule,
  User,
  UserModule,
  UserSailboats,
  UserSailboatsModule,
};
