import { DataTypes, QueryInterface } from 'sequelize';

import { RaceType } from '@common/types/race';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable('races', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // allow null values so the user can be deleted while keeping the races, requires SET NULL onDelete
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
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
      },
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.dropTable('races');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_races_type"');
  },
};
