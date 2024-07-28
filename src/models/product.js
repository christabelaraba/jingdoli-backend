module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('product', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        voltage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        alternator: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        amp_per_phase: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        engine: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        picture_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        frequency: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fuel_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        prime: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        createdAt: {
            field: 'created_at',
            type: DataTypes.DATE,
        },
        updatedAt: {
            field: 'updated_at',
            type: DataTypes.DATE,
        },
        power: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        size: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        warranty: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        other: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        active_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: true
        },
        delete_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: false

        },


    });

    return Product;
};