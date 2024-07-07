import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js"; 
import crypto from "crypto";

import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";


export const register = catchAsyncErrors(async (req,res,next)=>{
   
    const {
        fullName,
        email,
        password,
        } = req.body;
    const user = await User.create({
            
        fullName,
        email,
        password
        });
       generateToken(user,"User Registred",201,res);
});
//log in controller
export const login = catchAsyncErrors( async(req,res,next)=>{
    const {email,password} =req.body;
    if(!email || !password){
        return next(new ErrorHandler("Email and password requires"));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("invalid email or password"));
    }
    const isPasswordMatch = await user.comparePassword(password)
    if(!isPasswordMatch){
        return next(new ErrorHandler("invalid password"));
    }

    generateToken(user,"Logged In ",200,res);
});

export const logout = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).cookie("cookie","",{
        //need to provide same option as it was during token creation otherwise it will not work
        expires : new Date(Date.now()),
        httpOnly : true
    }).json({
        success : true,
        message : "logout successfully"
    });
});

export const getUser = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success :true,
        user,
    })
});


// export const updatePassword = catchAsyncErrors(async(req,res,next)=>{
//     const {currentPassword , newPassword , confirmNewPassword} =req.body;
//     if(!currentPassword || !newPassword || !confirmNewPassword){
//         return next (new ErrorHandler("please fill all fields",400));
//     }
//     const user = await User.findById(req.user.id).select("+password");
//     const isPasswordMatched = await user.comparePassword(currentPassword);
//     if(!isPasswordMatched){
//         return next (new ErrorHandler("incorrect current password",400));
//     }
//     if(newPassword != confirmNewPassword){
//         return next (new ErrorHandler("new password and confirm password does'nt match",400));
//     }
//     user.password = newPassword;
//     await user.save();
//     res.status(200).json({
//         success : true,
//         message : "password updated"
//     })
    
// });



const generateOTP = () => {
    const otpLength = 8;
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let otp = '';
    for (let i = 0; i < otpLength; i++) {
      otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
  };
  
  export const forgetPassword = catchAsyncErrors(async(req,res,next)=>{
      const user =await User.findOne({email : req.body.email});
      if(!user){
          return next(new ErrorHandler("User not found",404));
      }
  
      const otp = generateOTP();
  
      try{
          await sendEmail({
              email:user.email,
              subject : "Password Reset OTP",
              message: `Your password reset OTP is: ${otp}. If you have not requested this, please ignore it.`,
          });
  
          user.resetPasswordToken = otp;
          user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
          await user.save({ validateBeforeSave: false });
  
          res.status(200).json({
              success: true,
              message: `OTP sent to ${user.email} successfully`, 
          });
      } catch(error) {
          user.resetPasswordExpire = undefined;
          user.resetPasswordToken = undefined;
          await user.save();
          return next(new ErrorHandler(error.message, 500));
      }
  });
  

  export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { otp, password, confirmNewPassword } = req.body;
  
    // Find user by resetPasswordToken (stored in req.body.otp)
    const user = await User.findOne({
      resetPasswordToken: otp,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(new ErrorHandler("Invalid or expired token", 400));
    }
  
    // Verify password and confirmNewPassword match
    if (password !== confirmNewPassword) {
      return next(new ErrorHandler("Password fields do not match", 400));
    }
  
    // Update user's password
    user.password = password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
  
    // Optionally, generate token and respond with success message
    generateToken(user, "Password reset successfully", 200, res);
  });
  
