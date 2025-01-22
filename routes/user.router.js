const express = require("express");
const {
  signUp,
  logIn,
  getUser,
  getAllUsers,
  sendForgetPasswordOtp,
  verifyForgetPasswordOtp,
  resetPassword,
  updateUser,
  changePassword,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.post("/signUp", signUp);
userRouter.post("/logIn", logIn);
userRouter.post("/sendOtp", sendForgetPasswordOtp);
userRouter.post("/verifyOtp", verifyForgetPasswordOtp);
userRouter.post("/resetPassword", resetPassword);

userRouter.get("/getUser", getUser);
userRouter.get("/getAllUsers",verifyToken, getAllUsers);
userRouter.put("/updateUser", verifyToken, updateUser);
userRouter.put("/changePassword",  verifyToken,changePassword);

module.exports = userRouter;
