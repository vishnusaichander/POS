const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.router");
const categoryRouter = require("./routes/category.route")
const subCategory = require ("./routes/subCategory.route")
const supplier = require ("./routes/supplier.route")
const product = require ("./routes/product.route");
const customer = require ("./routes/customer.route")
const order = require ("./routes/order.route")
const coupon = require("./routes/coupon.route");
const path = require('path');

dotenv.config();

app.use(express.json());
// Middleware to serve images from the uploads folder
app.use('/uploads', express.static(path.join('./uploads')));
// app.use(express.urlencoded({extended:true}))

const db = process.env.DATABASE;

mongoose
  .connect(db, {})
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.error("DB connection error", err);
  });

app.use("/api/v1", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategory);
app.use("/api/v1/supplier", supplier);

app.use("/api/v1/product", product);
app.use("/api/v1/order", order);
app.use("/api/v1/coupon", coupon);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}.......`);
});

