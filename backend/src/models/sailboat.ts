import {
  type Attributes,
  type CreationAttributes,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from 'sequelize';

import { SAILBOAT_CONSTANTS } from '../constants';
import { sequelize } from '../database';

export type SailboatAttributesType = Attributes<Sailboat>;
export type SailboatCreationAttributesType = CreationAttributes<Sailboat>;

class Sailboat extends Model<InferAttributes<Sailboat>, InferCreationAttributes<Sailboat>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare sailNumber: string | null;
  declare description: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;
};

Sailboat.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [
        SAILBOAT_CONSTANTS.VALIDATION.NAME_LEN.MIN,
        SAILBOAT_CONSTANTS.VALIDATION.NAME_LEN.MAX,
      ],
    },
  },
  sailNumber: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    validate: {
      len: [
        SAILBOAT_CONSTANTS.VALIDATION.SAIL_NUMBER_LEN.MIN,
        SAILBOAT_CONSTANTS.VALIDATION.SAIL_NUMBER_LEN.MAX,
      ],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    validate: {
      len: [
        SAILBOAT_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MIN,
        SAILBOAT_CONSTANTS.VALIDATION.DESCRIPTION_LEN.MAX,
      ],
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
  modelName: SAILBOAT_CONSTANTS.MODEL_NAME,
  paranoid: true,
  timestamps: true,
  underscored: true,
});

export default Sailboat;
