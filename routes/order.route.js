const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/filter', orderController.filterOrdersByDate);
router.get('/orders/search', orderController.searchOrdersByCustomerName);
router.put('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);



module.exports = router;


