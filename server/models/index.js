const sequelize = require('../db'); // Update path to point to db.js in the server folder
const User = require('./User');
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');
const Contact = require('./Contact');
const ContactLegacy = require('./ContactLegacy');
const Employee = require('./Employee');
const Customer = require('./Customer');
const Quotation = require('./Quotation');
const QuotationItem = require('./QuotationItem');

// Sync models with the database (optional, for development)
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables synced');
});

module.exports = {
  sequelize,
  User,
  Invoice,
  InvoiceItem,
  Contact,
  ContactLegacy,
  Employee,
  Customer,
  Quotation,
  QuotationItem,
};
