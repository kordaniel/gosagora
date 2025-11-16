import LoggedTrailPosition, * as LoggedTrailPositionModule from './loggedTrailPosition';
import Race, * as RaceModule from './race';
import Sailboat, * as SailboatModule from './sailboat';
import Trail, * as TrailModule from './trail';
import User, * as UserModule from './user';
import UserSailboats, * as UserSailboatsModule from './userSailboats';

User.hasMany(Race);
Race.belongsTo(User);

User.hasMany(Trail);
Sailboat.hasMany(Trail);
Trail.belongsTo(User);
Trail.belongsTo(Sailboat);

Trail.hasMany(LoggedTrailPosition);
LoggedTrailPosition.belongsTo(Trail);

User.belongsToMany(Sailboat, { through: UserSailboats, hooks: true });
Sailboat.belongsToMany(User, { through: UserSailboats, hooks: true });

export {
  LoggedTrailPosition,
  LoggedTrailPositionModule,
  Race,
  RaceModule,
  Sailboat,
  SailboatModule,
  Trail,
  TrailModule,
  User,
  UserModule,
  UserSailboats,
  UserSailboatsModule,
};
