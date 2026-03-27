const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    restaurantId  : {
        type : DataTypes.UUID,
        allowNull : true,
    },
    mustChangePassword : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
    }
}, {
    timestamps: true, 
});
User.associate = (models) => {

  User.belongsTo(models.Restaurant, { 
    foreignKey: 'restaurantId', 
    as: 'restaurant',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
  User.belongsTo(models.Role, { 
    foreignKey: 'roleId', 
    as: 'role',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });

};

module.exports = User;