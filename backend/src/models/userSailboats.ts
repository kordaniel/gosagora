import {
  type Attributes,
  type CreationAttributes,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from 'sequelize';

import {
  SAILBOAT_CONSTANTS,
  USER_CONSTANTS,
  USER_SAILBOATS_CONSTANTS,
} from '../constants';

import { sequelize } from '../database';

export type UserSailboatsAttributesType = Attributes<UserSailboats>;
export type UserSailboatsCreationAttributesType = CreationAttributes<UserSailboats>;

class UserSailboats extends Model<InferAttributes<UserSailboats>, InferCreationAttributes<UserSailboats>> {
  declare userId: number;
  declare sailboatId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;
};

UserSailboats.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: USER_CONSTANTS.MODEL_NAME,
      key: 'id'
    },
  },
  sailboatId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: SAILBOAT_CONSTANTS.MODEL_NAME,
      key: 'id'
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    validate: {
      isDate: true,
    },
  },
}, {
  sequelize,
  modelName: USER_SAILBOATS_CONSTANTS.MODEL_NAME,
  paranoid: true,
  timestamps: true,
  underscored: true,
});

export default UserSailboats;
