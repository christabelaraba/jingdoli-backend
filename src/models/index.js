const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');


const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.Product = require("./product")(sequelize, DataTypes);
db.Enquiry = require("./enquiry")(sequelize, DataTypes);
db.Order_online = require("./order_online")(sequelize, DataTypes);
db.Contact_us = require("./contact_us")(sequelize, DataTypes);
db.User = require("./user")(sequelize, DataTypes);
db.Quote = require("./quote")(sequelize, DataTypes);
db.Customer = require("./customer")(sequelize, DataTypes);
db.Enquiry_Response = require("./enquiry_responses")(sequelize, DataTypes);
db.Blacklisted_Token = require("./blacklisted_tokens")(sequelize, DataTypes);
db.User_settings = require("./user_settings")(sequelize, DataTypes);



// Define relationships
db.Enquiry.belongsTo(db.Customer, { foreignKey: 'customer_id', as: 'Customer' });
db.Customer.hasMany(db.Enquiry, { foreignKey: 'customer_id', as: 'Enquiries' });




module.exports = db;