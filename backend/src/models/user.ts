import {
  type Attributes,
  type CreationAttributes,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  Op,
} from 'sequelize';

import { sequelize } from '../database';

export type UserAttributesType = Attributes<User>;
export type UserCreationAttributesType = CreationAttributes<User>;

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare firebaseUid: string;
  declare displayName: string;
  declare lastseenAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;
  declare disabledAt: Date | null;

  async setDisabled(disabled: boolean = true) {
    this.disabledAt = disabled ? new Date() : null;
    await this.save();
  }

  async updateLastseen() {
    this.lastseenAt = new Date();
    await this.save();
  }
};

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      len: [8, 256],
    },
  },
  firebaseUid: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
  },
  displayName: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
    validate: {
      len: [4, 64],
    },
  },
  lastseenAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
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
  disabledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    validate: {
      // NOTE:
      // instance.disabled = true as unknown as Date; passes validation
      // instance.disabled = <integer> as unknown as Date; passes validation
      // instance..disabled = '2023-02-04T10:00:00' as unknown as Date; passes validation
      isDate: true,
    },
  },
}, {
  defaultScope: {
    where: {
      disabledAt: {
        [Op.is]: null,
      },
    },
  },
  scopes: {
    deleted: {
      where: {
        deletedAt: {
          [Op.not]: null,
        },
      },
    },
    disabled: {
      where: {
        disabledAt: {
          [Op.not]: null,
        },
      },
    },
  },
  sequelize,
  modelName: 'user',
  paranoid: true, // soft-delete
  timestamps: true,
  underscored: true,
});

export default User;
