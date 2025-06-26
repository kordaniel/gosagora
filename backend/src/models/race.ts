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

import User from './user';
import { sequelize } from '../database';

import { RaceType } from '@common/types/race';

export type RaceAttributesType = Attributes<Race>;
export type RaceCreationAttributesType = CreationAttributes<Race>;

class Race extends Model<InferAttributes<Race>, InferCreationAttributes<Race>> {
  declare id: CreationOptional<number>;
  declare userId: number | null;
  declare public: CreationOptional<boolean>;
  declare name: string;
  declare type: RaceType;
  declare url: string | null;
  declare email: string | null;
  declare description: string;
  declare dateFrom: Date;
  declare dateTo: Date;
  declare registrationOpenDate: Date;
  declare registrationCloseDate: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

  declare user: NonAttribute<User>;
};

Race.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // allow null values so the user can be deleted while keeping the races, requires SET NULL onDelete
    references: { model: 'user', key: 'id' },
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
      len: [4, 128],
    },
  },
  type: {
    type: DataTypes.ENUM,
    values: Object.values(RaceType),
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    validate: {
      len: [8, 256]
    },
  },
  email: {
    type: DataTypes.TEXT,
    validate: {
      isEmail: true,
      len: [8, 256],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [4, 2000],
    },
  },
  dateFrom: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  dateTo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  registrationOpenDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  registrationCloseDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
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
  modelName: 'race',
  paranoid: true,
  timestamps: true,
  underscored: true,
});

export default Race;
