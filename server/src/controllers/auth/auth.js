import { Customer, DeliveryPartner } from "../../models/index.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  return { accessToken, refreshToken };
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).send({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;
    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return res.status(403), send({ message: "Invalid Role" });
    }
    if (!user) {
      return res.status(403), send({ message: "Invalid refresh token" });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
    return res.send({
      message: "Token Refreshed",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(403), send({ message: "Invalid Refresh Token" });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true,
      });

      await customer.save();
    }

    const { accessToken, refreshToken } = generateToken(customer);
    res.send({
      message: customer ? "Login Successful" : "Customer created and logged in",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occured", error });
  }
};

export const loginDeliveryPartner = async (req, res) => {
  try {
    const { email, password } = req.body;
    let deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      return res.status(404).send({ message: "Delivery partner not found" });
    }
    const isMatch = password === deliveryPartner.password;
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    const { accessToken, refreshToken } = generateToken(deliveryPartner);
    res.send({
      message: deliveryPartner
        ? "Login Successful"
        : "Delivery Partner created and logged in",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occured", error });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const { userId, role } = req.user;
    let user;
    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    } else {
      return res.status(403), send({ message: "Invalid Role" });
    }
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.send({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occured", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const updatedData = req.body;
    let user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId));
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    let userModel;
    if (role === "Customer") {
      userModel = Customer;
    } else if (role === "DeliveryPartner") {
      userModel = DeliveryPartner;
    } else {
      return res.status(403), send({ message: "Invalid user role" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );
    if (!updateUser) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.send({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).send({ message: "An error occured", error });
  }
};
