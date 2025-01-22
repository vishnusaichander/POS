const Supplier = require("../models/supplier.model");

exports.createSupplier = async (req, res) => {
    try {
        const { name, contact_info, admin_id } = req.body;

        const supplier = new Supplier({
            name,
            contact_info,
            admin_id,
        });

        await supplier.save();
        res.status(201).json({ message: "Supplier created successfully", supplier });
    } catch (error) {
        res.status(500).json({ error: "Error creating supplier" });
    }
};


exports.deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;

        const supplier = await Supplier.findByIdAndUpdate(
            id,
            { deleted: true },
            { new: true }
        );

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json({ message: "Supplier soft deleted", supplier });
    } catch (error) {
        res.status(500).json({ error: "Error deleting supplier" });
    }
};


exports.updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const supplier = await Supplier.findOneAndUpdate(
            { _id: id, deleted: false },
            updates,
            { new: true }
        );

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found or already deleted" });
        }

        res.status(200).json({ message: "Supplier updated successfully", supplier });
    } catch (error) {
        res.status(500).json({ error: "Error updating supplier" });
    }
};


exports.getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ deleted: false });

        res.status(200).json({ suppliers });
    } catch (error) {
        res.status(500).json({ error: "Error fetching suppliers" });
    }
};


exports.getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;

        const supplier = await Supplier.findOne({ _id: id, deleted: false });

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.status(200).json({ supplier });
    } catch (error) {
        res.status(500).json({ error: "Error fetching supplier" });
    }
};
