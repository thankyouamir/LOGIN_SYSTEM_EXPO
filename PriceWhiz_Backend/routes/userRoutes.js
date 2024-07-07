import express from 'express';
const router = express.Router();
import {forgetPassword, getUser, login, register, resetPassword, } from '../controller/userController.js';
import { logout } from '../controller/userController.js';
import { isAuth } from '../middlewares/auth.js';

router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAuth,logout);

router.get("/me",isAuth,getUser);
// router.put("/update/password",isAuth,updatePassword);

router.post("/password/forgetpassword",forgetPassword);
router.put("/password/reset",resetPassword);

export default router;