import {
  Association,
  type Attributes,
  type CreationAttributes,
  type CreationOptional,
  DataTypes,
  type InferAttributes,
  type InferCreationAttributes,
  Model,
  type NonAttribute,
  Op,
} from 'sequelize';

import Sailboat from './sailboat';
import { USER_CONSTANTS } from '../constants';
import UserSailboats from './userSailboats';
import { sequelize } from '../database';

import { BoatIdentity } from '@common/types/boat';

export type UserAttributesType = Attributes<User>;
export type UserCreationAttributesType = CreationAttributes<User>;

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User, { omit: 'boatIdentities' }>
> {
  declare id: CreationOptional<number>;
  declare readonly boatIdentities: BoatIdentity[]; // Virtual
  declare email: string;
  declare firebaseUid: string;
  declare displayName: string;
  declare lastseenAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;
  declare disabledAt: Date | null;

  declare sailboats?: NonAttribute<Sailboat[]>;
  declare static associations: {
    sailboats: Association<User, Sailboat>;
  };

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
  boatIdentities: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.sailboats
        ? this.sailboats.map(({ id, name, boatType }) => ({ id, name, boatType }))
        : [];
    },
  },
  email: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      len: [
        USER_CONSTANTS.VALIDATION.EMAIL_LEN.MIN,
        USER_CONSTANTS.VALIDATION.EMAIL_LEN.MAX,
      ],
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
      len: [
        USER_CONSTANTS.VALIDATION.DISPLAY_NAME_LEN.MIN,
        USER_CONSTANTS.VALIDATION.DISPLAY_NAME_LEN.MAX,
      ],
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
  hooks: {
    afterDestroy: async (userInstance, options) => {
      await UserSailboats.destroy({
        where: { userId: userInstance.id },
        transaction: options.transaction,
      });
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
  modelName: USER_CONSTANTS.MODEL_NAME,
  paranoid: true, // soft-delete
  timestamps: true,
  underscored: true,
});

export default User;
