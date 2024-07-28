module.exports = (sequelize, DataTypes) => {
    const Order_online = sequelize.define('Order_online', {
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
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        power_required: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        order_status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payment_status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payment_method: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    });
    return Order_online;
};