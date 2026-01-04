import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv/config";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

export function createUser(req, res) {
  if (req.body.role == "admin") {
    if (req.user != null) {
      if (req.user.role != "admin") {
        res.status(403).json({
          massage: "You not autherize to create an account ",
        });
        return;
      }
    } else {
      res.status(403).json({
        message:
          "You are not autherize to create admin accounts .please login first. ",
      });
      return;
    }
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  });

  user
    .save()
    .then(() => {
      res.json({
        message: "User created successfully!",
      });
    })
    .catch(() => {
      res.json({
        message: "An error occurred while creating the user.",
      });
    });
}

export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid password" });
        } else {
          //genarate token and send to user
          const token = jwt.sign(
            {
              email: user.email,
              role: user.role,
              firstname: user.firstname,
              lastname: user.lastname,
              img: user.img,
            },
            process.env.JWT_KEY
          );

          return res.status(200).json({
            message: "Login successful",
            user: user,
            token: token,
            role: user.role,
          });
        }
      }
    })
    .catch(() => {
      res.status(500).json({ message: "An error occurred during login" });
    });
}

export function isAdmin(req) {
  if (req.user != null && req.user.role === "admin") {
    return true;
  } else {
    return false;
  }
}

export async function loginWithGoogle(req, res) {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    const googleUser = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let user = await User.findOne({ email: googleUser.data.email });
    if (!user) {
      user = new User({
        firstname: googleUser.data.given_name,
        lastname: googleUser.data.family_name,
        email: googleUser.data.email,
        password: bcrypt.hashSync(Math.random().toString(36).slice(-8), 10),
        role: "customer",
        img: googleUser.data.picture,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        img: user.img,
      },
      process.env.JWT_KEY
    );

    return res.status(200).json({
      message: "Login successful",
      user: user,
      token: jwtToken,
      role: user.role,
    });
  } catch (err) {
    console.log("Google error:", err.response?.status);
    console.log("Google data:", err.response?.data);
    console.log("Msg:", err.message);
    return res.status(500).json({
      message: "An error occurred during Google login",
      error: err.response?.data || err.message,
    });
  }
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtp(req, res) {
  //cmmn aaom qhtj bgzc
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const email = req.body.email;

  const userExists = await User.findOne({ email: email });
  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  await OTP.deleteMany({ email: email });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP code is: ${otp}`,
  };

  const newOtp = new OTP({
    email: email,
    code: otp,
  });

  await newOtp.save();

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      return res.status(500).json({ message: "Error sending OTP email" });
    } else {
      console.log("Email sent:", info.response);
      return res
        .status(200)
        .json({ message: "OTP sent successfully", otp: otp });
    }
  });
}

export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email: email, code: otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await User.updateOne({ email: email }, { password: hashedPassword });

    await OTP.deleteMany({ email: email });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error occurred during password reset" });
  }
}
