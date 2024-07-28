module.exports = (sequelize, DataTypes) => {
    const Enquiry_Response = sequelize.define('enquiry_response', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        enquiry_id:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

    });
  
    return Enquiry_Response;
};