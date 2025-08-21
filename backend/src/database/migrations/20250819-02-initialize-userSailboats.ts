import { DataTypes, QueryInterface } from 'sequelize';

import {
  SAILBOAT_CONSTANTS,
  USER_CONSTANTS,
  USER_SAILBOATS_CONSTANTS,
} from '../../constants';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable(USER_SAILBOATS_CONSTANTS.SQL_TABLE_NAME, {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: USER_CONSTANTS.SQL_TABLE_NAME, key: 'id' },
        primaryKey: true,
        //onUpdate: 'CASCADE', ???
        //onDelete: 'SET NULL',
      },
      sailboat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: SAILBOAT_CONSTANTS.SQL_TABLE_NAME, key: 'id' },
        primaryKey: true,
        //onUpdate: 'CASCADE', ???
        //onDelete: 'SET NULL',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable(USER_SAILBOATS_CONSTANTS.SQL_TABLE_NAME);
  },
};
