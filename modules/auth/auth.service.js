import User from "../../models/user.js";
import { generateToken } from "../../src/utils/token/token.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "خطا في كلمه السر او البريد الالكتروني ",
        success: false,
      });
    }
    const token = generateToken(user._id);
    // console.log("tokrn is" ,  token)


    const userData = await User.findOne({ email }).select("-password");
    return res.status(200).json({
      message: "User login successfully",
      success: true,
      data: userData,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, password, role } = req.body;
    const isValidate = await User.findOne({ email: email });

    if (isValidate) {
      return res.status(400).json({ message: "user Exist", success: false });
    }
    const user = new User({
      name,
      phoneNumber,
      email,
      password,
      role,
    });
    await user.save();
    const token = generateToken(user._id);
    return res.status(201).json({
      message: "user registered successsfuly",
      success: true,
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, succes: false });
  }
};
