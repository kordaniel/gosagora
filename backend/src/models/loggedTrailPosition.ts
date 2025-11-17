import {
  type Attributes,
  type CreationAttributes,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
} from 'sequelize';

import { LOGGED_TRAIL_POSITION_CONSTANTS, TRAIL_CONSTANTS } from '../constants';
import { sequelize } from '../database';

export type LoggedTrailPositionType = Attributes<LoggedTrailPosition>;
export type LoggedTrailPositionCreationAttributesType = CreationAttributes<LoggedTrailPosition>;

class LoggedTrailPosition extends Model<
  InferAttributes<LoggedTrailPosition>,
  InferCreationAttributes<LoggedTrailPosition>
> {
  declare id: CreationOptional<number>;
  declare clientId?: string; // Virtual
  declare trailId: number;
  declare timestamp: Date;
  declare lat: number;
  declare lon: number;
  declare acc: number;        // Accuracy, meters
  declare hdg: number | null; // Heading, "COG", degrees with 0 = North
  declare vel: number | null; // Velocity, meters per second
};

LoggedTrailPosition.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clientId: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('clientId');
    },
    set(value: string) {
      this.setDataValue('clientId', value);
    },
  },
  trailId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: TRAIL_CONSTANTS.MODEL_NAME, key: 'id' },
    onDelete: 'CASCADE',
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
    },
  },
  lat: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      isNumeric: true,
      min: -90,
      max: 90,
    },
  },
  lon: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      isNumeric: true,
      min: -180,
      max: 180,
    },
  },
  acc: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      isNumeric: true,
      min: 0,
    },
  },
  hdg: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    validate: {
      isNumeric: true,
      min: 0,
      max: 360,
    },
  },
  vel: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    validate: {
      isNumeric: true,
      min: 0,
    },
  },
}, {
  sequelize,
  modelName: LOGGED_TRAIL_POSITION_CONSTANTS.MODEL_NAME,
  paranoid: false,
  timestamps: false,
  underscored: true,
});

export default LoggedTrailPosition;
