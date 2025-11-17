import { DataTypes, QueryInterface } from 'sequelize';

import {
  LOGGED_TRAIL_POSITION_CONSTANTS,
  SAILBOAT_CONSTANTS,
  TRAIL_CONSTANTS,
  USER_CONSTANTS,
} from '../../constants';

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
      max_velocity: {
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
    await queryInterface.dropTable(TRAIL_CONSTANTS.SQL_TABLE_NAME);
  },
};
