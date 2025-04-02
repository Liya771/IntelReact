const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const InvoiceItem = sequelize.define('InvoiceItem', {
  invoice_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  tax_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    // Mark this as a generated column
    generated: {
      type: 'ALWAYS',
      expression: 'quantity * unit_price * (1 + tax_percentage / 100)',
    },
  },
}, {
  tableName: 'invoice_items',
  timestamps: false,
});

module.exports = InvoiceItem;