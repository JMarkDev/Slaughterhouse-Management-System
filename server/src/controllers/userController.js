const { Op } = require("sequelize");
const userModel = require("../models/userModel");
const { createdAt } = require("../utils/formattedTime");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const saltsRounds = 10;

const getUserByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await userModel.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ Error: "Get user by email error in server" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findOne({
      where: {
        id: id,
      },
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const verifiedUser = await userModel.findAll();

    return res.status(200).json(verifiedUser);
  } catch (error) {
    return res.status(500).json({ Error: "Get all users error in server" });
  }
};

const getUserByRole = async (req, res) => {
  const { role } = req.query;

  try {
    const user = await userModel.findAll({
      where: {
        role: role,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "No user found",
      });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ Error: "Get user by role error in server" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    } else {
      const officeId = user.officeId;
      await user.destroy();

      // Delete the associated office if the user is an office
      if (officeId) {
        const office = await officeModel.findByPk(officeId);
        await office.destroy();
      }
      return res.status(200).json({
        status: "success",
        message: "Deleted successfully!",
      });
    }
  } catch (error) {
    return res.status(500).json({ Error: "Delete user error in server" });
  }
};

const searchUser = async (req, res) => {
  const { name, role } = req.params;

  try {
    const searchCriteria = {
      where: {
        role: role,
        [Op.or]: [
          { firstName: { [Op.like]: `${name}%` } },
          { lastName: { [Op.like]: `${name}%` } },
        ],
      },
    };
    const users = await userModel.findAll(searchCriteria);
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Search user error in server" });
  }
};

const updateUserData = async (req, res) => {
  const { id } = req.params;
  const {
    image,
    officeName,
    firstName,
    lastName,
    middleInitial,
    contactNumber,
    password,
  } = req.body;

  try {
    // Fetch the officeId from the userModel
    const user = await userModel.findOne({ where: { id } });

    // upload image
    let newFileName = null;
    if (req.file) {
      let filetype = req.file.mimetype.split("/")[1];
      newFileName = req.file.filename + "." + filetype;
      fs.rename(
        `./uploads/${req.file.filename}`,
        `./uploads/${newFileName}`,
        async (err) => {
          if (err) throw err;
          console.log("uploaded successfully");
        }
      );
    }

    const hashPassword = await bcrypt.hash(password, saltsRounds);

    await userModel.update(
      {
        image: newFileName ? `/uploads/${newFileName}` : user.image,
        firstName: firstName,
        lastName: lastName,
        middleInitial: middleInitial,
        contactNumber: contactNumber,
        password: hashPassword,
        updatedAt: createdAt,
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { password, new_password, confirm_password } = req.body;

  try {
    const user = await userModel.findByPk(id);

    if (!password) {
      return res.status(404).json({ message: "Password is required" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (new_password.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters" });
    }

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (new_password !== confirm_password) {
      return res
        .status(400)
        .json({ message: "New password and Confirm password do not match" });
    }

    const hashPassword = await bcrypt.hash(new_password, saltsRounds);

    await userModel.update(
      {
        password: hashPassword,
        updatedAt: createdAt,
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { image, firstName, lastName, middleInitial, contactNumber } = req.body;

  try {
    // upload image
    let newFileName = null;
    if (req.file) {
      let filetype = req.file.mimetype.split("/")[1];
      newFileName = req.file.filename + "." + filetype;
      fs.rename(
        `./uploads/${req.file.filename}`,
        `./uploads/${newFileName}`,
        async (err) => {
          if (err) throw err;
          console.log("uploaded successfully");
        }
      );
    }

    await userModel.update(
      {
        image: newFileName ? `/uploads/${newFileName}` : image,
        firstName: firstName,
        lastName: lastName,
        middleInitial: middleInitial,
        contactNumber: contactNumber,
        updatedAt: createdAt,
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUserByEmail,
  getUserById,
  getAllUser,
  getUserByRole,
  deleteUser,
  searchUser,
  updateUserData,
  updatePassword,
  updateProfile,
};
