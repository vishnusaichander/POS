const Customer = require("../models/customer.schema");

exports.createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json({ message: "Customer created successfully", customer });
    } catch (error) {
        res.status(500).json({ error: "Error creating customer" });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findByIdAndUpdate(
            id,
            { deleted: true },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ message: "Customer soft deleted", customer });
    } catch (error) {
        res.status(500).json({ error: "Error deleting customer" });
    }
};


exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const customer = await Customer.findOneAndUpdate(
            { _id: id, deleted: false },
            updates,
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found or already deleted" });
        }

        res.status(200).json({ message: "Customer updated successfully", customer });
    } catch (error) {
        res.status(500).json({ error: "Error updating customer" });
    }
};


exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();

        res.status(200).json({ customers });
    } catch (error) {
        res.status(500).json({ error: "Error fetching customers" });
    }
};


exports.getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findOne({ _id: id, deleted: false });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ error: "Error fetching customer" });
    }
};
