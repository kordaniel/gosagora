import { DataTypes, QueryInterface } from 'sequelize';

import { SAILBOAT_CONSTANTS } from '../../constants';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable(SAILBOAT_CONSTANTS.SQL_TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sail_number: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable(SAILBOAT_CONSTANTS.SQL_TABLE_NAME);
  },
};
