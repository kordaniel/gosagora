import { DataTypes, QueryInterface } from 'sequelize';

import { USER_CONSTANTS } from '../../constants';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable(USER_CONSTANTS.SQL_TABLE_NAME, {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email:{
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
      },
      firebase_uid: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
      },
      display_name: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: false,
      },
      lastseen_at:{
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      created_at:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      deleted_at:{
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      disabled_at:{
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable(USER_CONSTANTS.SQL_TABLE_NAME);
  },
};
