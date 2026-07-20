const GoodsReceipt = require('./goodsReceipt.model');
const GoodsReceiptItem = require('./goodsReceiptItem.model');
const PurchaseOrder = require('../purchaseOrder/purchaseOrder.model');
const PurchaseOrderItem = require('../purchaseOrder/purchaseOrderItem.model');
const Ingredient = require('../inventory/ingredient.model');

// Create a goods receipt from a purchase order or ad-hoc
async function createGoodsReceipt(req, res) {
  try {
    const { purchaseOrderId, supplierId, restaurantId, receiptDate, notes, items } = req.body;

    // If linked to a PO, validate it exists
    let po = null;
    if (purchaseOrderId) {
      po = await PurchaseOrder.findByPk(purchaseOrderId);
      if (!po) {
        return res.status(404).json({ error: 'Purchase order not found' });
      }
    }

    // Create the receipt header
    const receipt = await GoodsReceipt.create({
      purchaseOrderId: purchaseOrderId || null,
      supplierId: supplierId || (po ? po.supplierId : null),
      restaurantId,
      receiptDate: receiptDate || new Date(),
      notes: notes || null,
      createdBy: req.user.id,
      status: 'draft',
    });

    // Create line items
    if (items && items.length > 0) {
      const receiptItems = items.map(item => ({
        goodsReceiptId: receipt.id,
        ingredientId: item.ingredientId,
        expectedQuantity: item.expectedQuantity || null,
        receivedQuantity: item.receivedQuantity,
        unitPrice: item.unitPrice || 0,
        notes: item.notes || null,
        expirationDate: item.expirationDate || null,
      }));
      await GoodsReceiptItem.bulkCreate(receiptItems);
    }

    // Return the created receipt with items
    const fullReceipt = await GoodsReceipt.findByPk(receipt.id, {
      include: [
        { model: GoodsReceiptItem, as: 'items', include: [{ model: Ingredient, as: 'ingredient' }] },
        { model: PurchaseOrder, as: 'purchaseOrder' },
      ],
    });

    res.status(201).json(fullReceipt);
  } catch (error) {
    console.error('Error creating goods receipt:', error);
    res.status(500).json({ error: 'Failed to create goods receipt' });
  }
}

// Validate the receipt: update stock and PO status
async function validateGoodsReceipt(req, res) {
  try {
    const receiptId = req.params.id;
    const receipt = await GoodsReceipt.findByPk(receiptId, {
      include: [
        { model: GoodsReceiptItem, as: 'items' },
        { model: PurchaseOrder, as: 'purchaseOrder' },
      ],
    });

    if (!receipt) {
      return res.status(404).json({ error: 'Goods receipt not found' });
    }

    if (receipt.status === 'received') {
      return res.status(400).json({ error: 'Goods receipt already validated' });
    }

    // Update stock for each item
    for (const item of receipt.items) {
      const ingredient = await Ingredient.findByPk(item.ingredientId);
      if (ingredient) {
        ingredient.stockQuantity += item.receivedQuantity;
        await ingredient.save();
      }
    }

    // Determine receipt status based on expected vs received
    let newStatus = 'received';
    if (receipt.purchaseOrderId) {
      const poItems = await PurchaseOrderItem.findAll({
        where: { purchaseOrderId: receipt.purchaseOrderId },
      });

      let allReceived = true;
      let anyReceived = false;

      for (const poItem of poItems) {
        const receiptItem = receipt.items.find(ri => ri.ingredientId === poItem.ingredientId);
        if (receiptItem) {
          if (receiptItem.receivedQuantity < poItem.quantity) {
            allReceived = false;
          }
          if (receiptItem.receivedQuantity > 0) {
            anyReceived = true;
          }
        } else {
          allReceived = false;
        }
      }

      if (!anyReceived) {
        newStatus = 'rejected';
      } else if (!allReceived) {
        newStatus = 'partial';
      }

      // Update PO status
      const po = await PurchaseOrder.findByPk(receipt.purchaseOrderId);
      if (po) {
        if (newStatus === 'received') {
          po.status = 'Received';
        } else if (newStatus === 'partial') {
          po.status = 'Partially Received';
        } else if (newStatus === 'rejected') {
          po.status = 'Rejected';
        }
        await po.save();
      }
    }

    receipt.status = newStatus;
    await receipt.save();

    res.json(receipt);
  } catch (error) {
    console.error('Error validating goods receipt:', error);
    res.status(500).json({ error: 'Failed to validate goods receipt' });
  }
}

// Get all goods receipts (filtered by restaurant)
async function getAllGoodsReceipts(req, res) {
  try {
    const { restaurantId } = req.query;
    const where = {};

    if (restaurantId) {
      where.restaurantId = restaurantId;
    } else if (req.user.role?.name !== 'Admin') {
      // Non-admin users must see only their restaurant's data
      where.restaurantId = req.user.restaurantId;
    }

    const receipts = await GoodsReceipt.findAll({
      where,
      include: [
        { model: GoodsReceiptItem, as: 'items', include: [{ model: Ingredient, as: 'ingredient' }] },
        { model: PurchaseOrder, as: 'purchaseOrder' },
      ],
      order: [['receiptDate', 'DESC']],
    });

    res.json(receipts);
  } catch (error) {
    console.error('Error fetching goods receipts:', error);
    res.status(500).json({ error: 'Failed to fetch goods receipts' });
  }
}

// Get single goods receipt by ID
async function getGoodsReceiptById(req, res) {
  try {
    const receiptId = req.params.id;
    const receipt = await GoodsReceipt.findByPk(receiptId, {
      include: [
        { model: GoodsReceiptItem, as: 'items', include: [{ model: Ingredient, as: 'ingredient' }] },
        { model: PurchaseOrder, as: 'purchaseOrder' },
      ],
    });

    if (!receipt) {
      return res.status(404).json({ error: 'Goods receipt not found' });
    }

    res.json(receipt);
  } catch (error) {
    console.error('Error fetching goods receipt:', error);
    res.status(500).json({ error: 'Failed to fetch goods receipt' });
  }
}

// Update a draft receipt (before validation)
async function updateGoodsReceipt(req, res) {
  try {
    const receiptId = req.params.id;
    const { notes, items } = req.body;

    const receipt = await GoodsReceipt.findByPk(receiptId);
    if (!receipt) {
      return res.status(404).json({ error: 'Goods receipt not found' });
    }

    if (receipt.status !== 'draft') {
      return res.status(400).json({ error: 'Cannot update a validated receipt' });
    }

    receipt.notes = notes || receipt.notes;
    await receipt.save();

    // If items provided, replace them
    if (items && items.length > 0) {
      await GoodsReceiptItem.destroy({ where: { goodsReceiptId: receiptId } });
      const newItems = items.map(item => ({
        goodsReceiptId: receiptId,
        ingredientId: item.ingredientId,
        expectedQuantity: item.expectedQuantity || null,
        receivedQuantity: item.receivedQuantity,
        unitPrice: item.unitPrice || 0,
        notes: item.notes || null,
      }));
      await GoodsReceiptItem.bulkCreate(newItems);
    }

    const fullReceipt = await GoodsReceipt.findByPk(receiptId, {
      include: [
        { model: GoodsReceiptItem, as: 'items', include: [{ model: Ingredient, as: 'ingredient' }] },
        { model: PurchaseOrder, as: 'purchaseOrder' },
      ],
    });

    res.json(fullReceipt);
  } catch (error) {
    console.error('Error updating goods receipt:', error);
    res.status(500).json({ error: 'Failed to update goods receipt' });
  }
}

// Delete a draft receipt
async function deleteGoodsReceipt(req, res) {
  try {
    const receiptId = req.params.id;
    const receipt = await GoodsReceipt.findByPk(receiptId);
    if (!receipt) {
      return res.status(404).json({ error: 'Goods receipt not found' });
    }

    if (receipt.status !== 'draft') {
      return res.status(400).json({ error: 'Cannot delete a validated receipt' });
    }

    await receipt.destroy();
    res.json({ message: 'Goods receipt deleted successfully' });
  } catch (error) {
    console.error('Error deleting goods receipt:', error);
    res.status(500).json({ error: 'Failed to delete goods receipt' });
  }
}

module.exports = {
  createGoodsReceipt,
  validateGoodsReceipt,
  getAllGoodsReceipts,
  getGoodsReceiptById,
  updateGoodsReceipt,
  deleteGoodsReceipt,
};
