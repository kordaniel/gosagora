import Race, * as RaceModule from './race';
import User, * as UserModule from './user';

User.hasMany(Race);
Race.belongsTo(User);

export {
  User,
  UserModule,
  Race,
  RaceModule,
};
