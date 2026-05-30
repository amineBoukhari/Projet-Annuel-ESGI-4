const Supplier = require('./supplier.model');

async function createSupplier(req, res) {
    try {
        const { name, companyName, phone, email, address, notes, status, restaurantId } = req.body;
        const newSupplier = await Supplier.create({name,companyName,phone,email,address,notes,status,restaurantId
        });
        res.status(201).json(newSupplier);
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ error: 'Failed to create supplier' });
    }
  
}

async function updateSupplier(req, res) {
    try {
        const supplierId = req.params.id;
        const { name, companyName, phone, email, address, notes, status } = req.body;

        const supplier = await Supplier.findByPk(supplierId);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        supplier.for
        supplier.name = name || supplier.name;
        supplier.companyName = companyName || supplier.companyName;
        supplier.phone = phone || supplier.phone;
        supplier.email = email || supplier.email;
        supplier.address = address || supplier.address;
        supplier.notes = notes || supplier.notes;
        supplier.status = status || supplier.status;

        await supplier.save();
        res.json(supplier);
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ error: 'Failed to update supplier' });
    }
  
}

async function deleteSupplier(req, res) {
    try {
        const supplierId = req.params.id;
        const supplier = await Supplier.findByPk(supplierId);
        if (!supplier) {return res.status(404).json({ error: 'Supplier not found' });}
        await supplier.destroy();
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ error: 'Failed to delete supplier' });
    }
  
}

async function getSupplierById(req, res) {
    try {        
        const supplierId = req.params.id;
        const supplier = await Supplier.findByPk(supplierId);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (error) {
        console.error('Error fetching supplier:', error);
        res.status(500).json({ error: 'Failed to fetch supplier' });
    }
}



async function getAllSuppliers(req, res) {
    try {
        const restaurantId = req.query.restaurantId || req.user.restaurantId;
        if (!restaurantId) {
            return res.status(400).json({ error: 'restaurantId is required' });
        }
        const suppliers = await Supplier.findAll({where: { restaurantId }});
        res.json(suppliers);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ error: 'Failed to fetch suppliers' });
    }
  
}

module.exports = { createSupplier, updateSupplier, deleteSupplier, getSupplierById, getAllSuppliers };
