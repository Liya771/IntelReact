const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ContactLegacy = sequelize.define('ContactLegacy', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  department: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  company_name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'contacts',
  timestamps: false,
});

module.exports = ContactLegacy;