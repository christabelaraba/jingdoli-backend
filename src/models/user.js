module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_role: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        active_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true

        },
        del_status: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
    },
        {
            timestamps: true, // Enable automatic timestamp management
            underscored: true, // Use underscored field names
        });


    return User;
};