import express from "express";
import {
  createUser,
  loginUser,
  resetPassword,
  sendOtp,
} from "../controllers/userController.js";
import { loginWithGoogle } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/login/google", loginWithGoogle);
userRouter.post("/sendOtp", sendOtp);
userRouter.post("/resetPassword", resetPassword);

export default userRouter;
