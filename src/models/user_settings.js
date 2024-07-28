module.exports = (sequelize, DataTypes) => {
    const User_settings = sequelize.define('user_settings', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        email_notify: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        sms_notify: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
    });
    return User_settings;
};