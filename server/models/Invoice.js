const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Invoice = sequelize.define('Invoice', {
  invoice_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  invoice_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  invoice_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  customer_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  customer_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  customer_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tax_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
}, {
  tableName: 'invoices',
  timestamps: false,
});

module.exports = Invoice;