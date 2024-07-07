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





module.exports = db;