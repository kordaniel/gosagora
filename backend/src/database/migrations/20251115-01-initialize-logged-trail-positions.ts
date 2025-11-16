import { DataTypes, QueryInterface } from 'sequelize';

import { LOGGED_TRAIL_POSITION_CONSTANTS, TRAIL_CONSTANTS } from '../../constants';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable(LOGGED_TRAIL_POSITION_CONSTANTS.SQL_TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      trail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: TRAIL_CONSTANTS.SQL_TABLE_NAME, key: 'id' },
        onDelete: 'CASCADE',
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lat: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      lon: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      acc: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      hdg: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      vel: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable(LOGGED_TRAIL_POSITION_CONSTANTS.SQL_TABLE_NAME);
  },
};
