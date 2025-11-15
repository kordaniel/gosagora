import { DataTypes, QueryInterface } from 'sequelize';

import { SAILBOAT_CONSTANTS, TRAIL_CONSTANTS, USER_CONSTANTS } from '../../constants';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable(TRAIL_CONSTANTS.SQL_TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: USER_CONSTANTS.SQL_TABLE_NAME, key: 'id' },
        onDelete: 'SET NULL'
      },
      sailboat_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: SAILBOAT_CONSTANTS.SQL_TABLE_NAME, key: 'id' },
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
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      avg_velocity: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
      },
      length: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ended_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable(TRAIL_CONSTANTS.SQL_TABLE_NAME);
  },
};
