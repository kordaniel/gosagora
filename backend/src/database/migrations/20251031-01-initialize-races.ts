import { DataTypes, QueryInterface } from 'sequelize';

import { RACE_CONSTANTS, USER_CONSTANTS } from '../../constants';

import { RaceType } from '@common/types/race';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable(RACE_CONSTANTS.SQL_TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // allow null values so the user can be deleted while keeping the races, requires SET NULL onDelete
        references: { model: USER_CONSTANTS.SQL_TABLE_NAME, key: 'id' },
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
      type: {
        type: DataTypes.ENUM,
        values: Object.values(RaceType),
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
      },
      email: {
        type: DataTypes.TEXT,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date_from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      date_to: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      registration_open_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      registration_close_date: {
        type: DataTypes.DATE,
        allowNull: false,
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
    await queryInterface.dropTable(RACE_CONSTANTS.SQL_TABLE_NAME);
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_races_type"');
  },
};
