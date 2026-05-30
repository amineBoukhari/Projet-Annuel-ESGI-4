const PurchaseOrder = require('./purchaseOrder.model');
const PurchaseOrderItem = require('./purchaseOrderItem.model');
const Ingredient = require('../inventory/ingredient.model');


async function createPurchaseOrder(req, res) {
  try {
    const { supplierId, restaurantId, orderDate, expectedDeliveryDate, notes, items } = req.body;


    const purchaseOrder = await PurchaseOrder.create({supplierId,restaurantId,orderDate,expectedDeliveryDate,notes,});
    if (items && items.length > 0) {
      const purchaseOrderItems = items.map(item => ({
        purchaseOrderId: purchaseOrder.id,
        ingredientId: item.ingredientId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
      await PurchaseOrderItem.bulkCreate(purchaseOrderItems);
    }
    res.status(201).json(purchaseOrder);
} catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  } 

}

async function updatePurchaseOrder(req, res) {
  try {
    const purchaseOrderId = req.params.id;
    const { supplierId, orderDate, expectedDeliveryDate, notes, status } = req.body;

    const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId);
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    purchaseOrder.supplierId = supplierId || purchaseOrder.supplierId;
    purchaseOrder.orderDate = orderDate || purchaseOrder.orderDate;
    purchaseOrder.expectedDeliveryDate = expectedDeliveryDate || purchaseOrder.expectedDeliveryDate;
    purchaseOrder.notes = notes || purchaseOrder.notes;
    purchaseOrder.status = status || purchaseOrder.status;

    await purchaseOrder.save();
    res.json(purchaseOrder);
  } catch (error) {
    console.error('Error updating purchase order:', error);
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
}

async function deletePurchaseOrder(req, res) {
  try {
    const purchaseOrderId = req.params.id;
    const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId);
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    await purchaseOrder.destroy();
    res.json({ message: 'Purchase order deleted successfully' });
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    res.status(500).json({ error: 'Failed to delete purchase order' });
  }
}

async function getPurchaseOrderById(req, res) {
  try {
    const purchaseOrderId = req.params.id;
    const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId, {
      include: [
        { model: PurchaseOrderItem, as: 'items' },
      ],
    });
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json(purchaseOrder);
  } catch (error) {
    console.error('Error fetching purchase order:', error);
    res.status(500).json({ error: 'Failed to fetch purchase order' });
  }
}

async function getAllPurchaseOrders(req, res) {
  try {
    const restaurantId = req.query.restaurantId || req.user.restaurantId;
    if (!restaurantId) {
      return res.status(400).json({ error: 'restaurantId is required' });
    }
    const purchaseOrders = await PurchaseOrder.findAll({
      where: { restaurantId },
      include: [
        { model: PurchaseOrderItem, as: 'items' },
      ],
    });
    res.json(purchaseOrders);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
}

async function updatePurchaseOrderStatus(req, res) {
  try {
    const purchaseOrderId = req.params.id;
    const { status } = req.body;

    const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId);
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    purchaseOrder.status = status || purchaseOrder.status;
    await purchaseOrder.save();
    res.json(purchaseOrder);
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    res.status(500).json({ error: 'Failed to update purchase order status' });
  }
}

async function receivePurchaseOrder(req, res) {
  try {
    const purchaseOrderId = req.params.id;

    const purchaseOrder = await PurchaseOrder.findByPk(purchaseOrderId);
    const receivedItems = await PurchaseOrderItem.findAll({ where: { purchaseOrderId } });

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    purchaseOrder.status = 'Received';
    await purchaseOrder.save();
    for (const item of receivedItems) {
      const ingredient = await Ingredient.findByPk(item.ingredientId);
      console.log(`Updating stock for ingredient ${ingredient.name}: +${item.quantity}`);
      
      ingredient.stockQuantity += item.quantity;
      await ingredient.save();
      console.log(`Updated stock for ingredient ${ingredient.name}: ${ingredient.stockQuantity}`);
     
    }
    res.json(purchaseOrder);
  } catch (error) {
    console.error('Error receiving purchase order:', error);
    res.status(500).json({ error: 'Failed to receive purchase order' });
  }
}

module.exports = {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  getAllPurchaseOrders,
  updatePurchaseOrderStatus,
  receivePurchaseOrder,
};

