const express = require('express');
const router = express.Router();
const {requireRole} = require('../../middlewares/role.middlewares');
const ingredientController = require('./ingredient.controller');

router.post('/add', requireRole('Admin','Owner','Manager'), ingredientController.addIngredient);
router.get('/get/:id', ingredientController.getIngredientById);
router.get('/getAll', ingredientController.getAllIngredients);
router.put('/update/:id', requireRole('Admin','Owner','Manager'), ingredientController.updateIngredient);
router.delete('/delete/:id', requireRole('Admin','Owner','Manager'), ingredientController.deleteIngredient);

module.exports = router;

