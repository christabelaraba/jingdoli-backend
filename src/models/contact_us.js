module.exports = (sequelize, DataTypes) => {
    const Contact_us = sequelize.define('contact_us', {
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

        
    }, {
        timestamps: true, // Enable automatic timestamp management
        underscored: true, // Use underscored field names
      });
  
    return Contact_us;
};