module.exports = (sequelize, DataTypes) => {
    const Blacklisted_Token = sequelize.define('blacklisted_token', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    return Blacklisted_Token;
};