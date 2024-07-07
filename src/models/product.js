module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
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
            altenator: {
                type: DataTypes.STRING,
            allowNull: true,
            },
            amp_per_phase: {
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
    });
  
    return Product;
};