module.exports = (sequelize, DataTypes) => {
    const Enquiry = sequelize.define('Enquiry', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING,
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