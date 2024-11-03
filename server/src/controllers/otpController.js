const { sendOTP } = require("../utils/sendOTP");
const otpModel = require("../models/otpModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
require("dotenv").config();
const { setTokens } = require("../helpers/tokenHelpers");
const statusList = require("../constants/statusList");
const sequelize = require("../configs/database");
const date = require("date-and-time");

const postOTP = async (email) => {
  try {
    const createdOTP = await sendOTP({
      email: email,
      subject: "Slaughterhouse Management System Verification Code",
      message: "Verify your email with the code below.",
      duration: 5,
    });

    return createdOTP;
  } catch (error) {
    console.error(error);
    throw new Error("Error postOPT AND sending OTP");
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const createdAt = new Date();
  const formattedDate = date.format(createdAt, "YYYY-MM-DD HH:mm:ss", true); // true for UTC time;

  try {
    const userData = await userModel.findOne({ where: { email: email } });
    const { role: userRole, status } = userData;

    const matchedOTPRecord = await otpModel.findOne({
      where: { email: email },
    });

    const { expiresAt, otp: storedOTP } = matchedOTPRecord;

    // Check if the OTP matches
    const matchOTP = await bcrypt.compare(otp, storedOTP);

    if (!matchedOTPRecord || !matchOTP) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    // if (expiresAt < Date.now()) {
    //   console.log(expiresAt, Date.now());
    //   return res
    //     .status(400)
    //     .json({ message: "OTP expired. Pleae request a new OTP." });
    // }

    if (new Date(expiresAt).getTime() < Date.now()) {
      console.log(new Date(expiresAt).getTime(), Date.now());
      return res.status(400).json({
        message: `${new Date(
          expiresAt
        )} OTP expired. Please request a new OTP.`,
      });
    }

    // initialize access token
    let accessToken = null;

    await userModel.update(
      {
        status: statusList.verified,
        updatedAt: sequelize.literal(`'${formattedDate}'`),
      },
      { where: { email: email } }
    );

    //  generate tokens
    const tokens = setTokens(res, { email, userRole });
    accessToken = tokens.accessToken;

    //   accessToken = jwt.sign({ email, userRole }, process.env.ACCESS_TOKEN, {
    //     expiresIn: "30m",
    //   });
    //   const refreshToken = jwt.sign(
    //     { email, userRole },
    //     process.env.REFRESH_TOKEN,
    //     {
    //       expiresIn: "60m",
    //     }
    //   );

    //   // Set secure HTTP-only cookies
    //   res.cookie("accessToken", accessToken, {
    //     httpOnly: true,
    //     maxAge: 30 * 60 * 1000,
    //   }); // 30 minutes
    //   res.cookie("refreshToken", refreshToken, {
    //     httpOnly: true,
    //     maxAge: 60 * 60 * 1000,
    //   }); // 30 minutes

    // Delete the OTP after successful verification
    await otpModel.destroy({ where: { email: email } });

    return res.status(200).json({
      status: "success",
      message: "Registration Successful",
      role: userRole,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Error verify OTP" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await otpModel.destroy({
      where: {
        email: email,
      },
    });

    const createdOTP = await sendOTP({
      email: email,
      subject: "Slaughterhouse Management System Verification Code",
      message: "Verify your email with the code below.",
      duration: 5,
    });

    return res.status(200).json({
      status: "success",
      message: `Successfully resent OTP to ${email}`,
      createdOTP,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Error resending OTP" });
  }
};

const verifyChangeEmail = async (req, res) => {
  const { id } = req.params;
  const { email, otp } = req.body;

  try {
    const matchedOTPRecord = await otpModel.findOne({
      where: { email: email },
    });

    const { expiresAt, otp: storedOTP } = matchedOTPRecord;

    // Check if the OTP matches
    const matchOTP = await bcrypt.compare(otp, storedOTP);

    if (!matchedOTPRecord || !matchOTP) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    if (expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Pleae request a new OTP." });
    }

    await userModel.update(
      {
        email: email,
        updatedAt: createdAt,
      },
      { where: { id: id } }
    );
    // Delete the OTP after successful verification
    await otpModel.destroy({ where: { email: email } });

    return res.status(200).json({
      status: "success",
      message: "Email successfully changed",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  postOTP,
  verifyOTP,
  resendOTP,
  verifyChangeEmail,
};
