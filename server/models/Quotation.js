const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Quotation = sequelize.define('Quotation', {
  quotation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quotation_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  quotation_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    get() {
      const value = this.getDataValue('total_amount');
      return value === null ? null : parseFloat(value);
    },
  },
}, {
  tableName: 'quotations',
  timestamps: false,
});

module.exports = Quotation;