module.exports = (sequelize, DataTypes) => {
  const Quote = sequelize.define('Quote', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quote_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }, 
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    message:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    active_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    },
    del_status: {
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


  return Quote;
};
