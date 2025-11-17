import {
  type Attributes,
  type CreationAttributes,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
} from 'sequelize';

import {
  SAILBOAT_CONSTANTS,
  TRAIL_CONSTANTS,
  USER_CONSTANTS
} from '../constants';
import Sailboat from './sailboat';
import User from './user';
import { sequelize } from '../database';

export type TrailAttributesType = Attributes<Trail>;
export type TrailCreationAttributesType = CreationAttributes<Trail>;

class Trail extends Model<InferAttributes<Trail>, InferCreationAttributes<Trail>> {
  declare id: CreationOptional<number>;
  declare userId: number | null;
  declare sailboatId: number | null;
  declare public: CreationOptional<boolean>;
  declare name: string;
  declare description: string;
  declare avgVelocity: CreationOptional<number | null>;
  declare maxVelocity: CreationOptional<number | null>;
  declare length: CreationOptional<number | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare endedAt: Date | null;
  declare deletedAt: Date | null;

  declare user: NonAttribute<User>;
  declare sailboat: NonAttribute<Sailboat>;
};

Trail.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: USER_CONSTANTS.MODEL_NAME, key: 'id' },
    onDelete: 'SET NULL',
  },
  sailboatId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: SAILBOAT_CONSTANTS.MODEL_NAME, key: 'id' },
    onDelete: 'SET NULL',
  },
  public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [
        TRAIL_CONSTANTS.VALIDATION.NAME_LEN.MIN,
        TRAIL_CONSTANTS.VALIDATION.NAME_LEN.MAX,
      ],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [
        TRAIL_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MIN,
        TRAIL_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MAX,
      ],
    },
  },
  avgVelocity: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: null,
    validate: {
      isNumeric: true,
      min: 0,
    },
  },
  maxVelocity: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: null,
    validate: {
      isNumeric: true,
      min: 0,
    },
  },
  length: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: null,
    validate: {
      isNumeric: true,
      min: 0,
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
  endedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    validate: {
      isDate: true,
    },
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
  modelName: TRAIL_CONSTANTS.MODEL_NAME,
  paranoid: true,
  timestamps: true,
  underscored: true,
});

export default Trail;
