const express = require('express');
const router = express.Router();
const recipeController = require('./recipe.controller');
const {requireRole} = require('../../middlewares/role.middlewares');

router.post('/add', requireRole('Admin,Owner'), recipeController.addRecipe);
router.get('/get/:id', recipeController.getRecipeById);
router.get('/getAll', recipeController.getAllRecipes);
router.put('/update/:id', requireRole('Admin,Owner'), recipeController.updateRecipe);
router.delete('/delete/:id', requireRole('Admin,Owner'), recipeController.deleteRecipe);

module.exports = router;