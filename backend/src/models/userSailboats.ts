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

import {
  SAILBOAT_CONSTANTS,
  USER_CONSTANTS,
  USER_SAILBOATS_CONSTANTS,
} from '../constants';

import Sailboat from './sailboat';
import User from './user';
import { sequelize } from '../database';

export type UserSailboatsAttributesType = Attributes<UserSailboats>;
export type UserSailboatsCreationAttributesType = CreationAttributes<UserSailboats>;

class UserSailboats extends Model<InferAttributes<UserSailboats>, InferCreationAttributes<UserSailboats>> {
  declare userId: number;
  declare sailboatId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
}, {
  hooks: {
    afterBulkDestroy: async (options) => {
      const relatedSailboats = await Sailboat.findAll({
        attributes: ['id'],
        include: [{
          model: User,
          required: false,
          through: { attributes: [] },
        }],
        where: {
          '$users.id$': null,
        },
        transaction: options.transaction,
      });
      await Sailboat.destroy({
        where: {
          id: { [Op.in]: relatedSailboats.map(b => b.id) }
        },
        transaction: options.transaction,
      });
    },
    afterDestroy: async (instance, options) => {
      const relatedSailboatsCount = await UserSailboats.count({
        where: { sailboatId: instance.sailboatId },
        transaction: options.transaction,
      });

      if (relatedSailboatsCount === 0) {
        await Sailboat.destroy({
          where: { id: instance.sailboatId },
          transaction: options.transaction,
        });
      }
    },
  },
  sequelize,
  modelName: USER_SAILBOATS_CONSTANTS.MODEL_NAME,
  paranoid: false,
  timestamps: true,
  underscored: true,
});

export default UserSailboats;
