const sequelize = require('../../db/index');
const { DataTypes } = require('sequelize');

const RecipeIngredient = sequelize.define("RecipeIngredient",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true

    } , 

})

module.exports = RecipeIngredient;

