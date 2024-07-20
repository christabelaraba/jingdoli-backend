module.exports = (sequelize, DataTypes) => {
    const Enquiry = sequelize.define('Enquiry', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customer_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        
        
    });
  
    return Enquiry;
};