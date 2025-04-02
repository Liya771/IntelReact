const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Quotation = require('./Quotation');

const QuotationItem = sequelize.define('QuotationItem', {
  item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quotation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Quotation,
      key: 'quotation_id',
    },
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
}, {
  tableName: 'quotation_items',
  timestamps: false,
});

Quotation.hasMany(QuotationItem, { foreignKey: 'quotation_id' });
QuotationItem.belongsTo(Quotation, { foreignKey: 'quotation_id' });

module.exports = QuotationItem;