const ingredientService = require('./ingredient.service');
const ingredientModel = require('./ingredient.model');
const Ingredient = require('./ingredient.model');


async function addIngredient(req, res) {
  try {
    
    const { name, unit, stockQuantity, minStockLevel, imageUrl } = req.body;
    const ingredient = await ingredientModel.create({ name, unit, stockQuantity, minStockLevel, imageUrl });
    res.status(201).json(ingredient);
  } catch (error) {
    console.error('Error adding ingredient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getIngredientById(req, res) {
  try {
    const ingredient = await ingredientModel.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json(ingredient);
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllIngredients(req, res) {
  try {
    const ingredients = await Ingredient.findAll();
    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateIngredient(req, res) {
  try {
    const updatedIngredient = await Ingredient.findByPk(req.params.id);
    if (!updatedIngredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    const { name, unit, stockQuantity, minStockLevel, imageUrl } = req.body;
    await updatedIngredient.update({ name, unit, stockQuantity, minStockLevel, imageUrl });
    res.json(updatedIngredient);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteIngredient(req, res) {
  try {
    const deleted = await Ingredient.findByPk(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    await deleted.destroy();
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {addIngredient,getIngredientById,getAllIngredients,updateIngredient,deleteIngredient,
};