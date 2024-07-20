
module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('customer', {
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
        location:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        active_status:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
        del_status:{
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },



    },
    {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // Set default value for created_at and allow null for updated_at
        hooks: {
          beforeCreate: (user, options) => {
            user.created_at = user.created_at || new Date();
          }
        }
      });

      
  return Customer;
}
