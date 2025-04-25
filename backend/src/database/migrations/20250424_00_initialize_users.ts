import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.createTable('users', {
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
    await queryInterface.dropTable('users');
  },
};
