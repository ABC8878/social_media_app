import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
//const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";

// Registering a new User
export const registerUser = async (req, res) => {
  const { email, password, firstname, lastname ,isAdmin} = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newUser = new UserModel({
    email,
    password: hashedPass,
    firstname,
    lastname,
    isAdmin,
  });

  var token = jwt.sign({ email: email }, "shhhhh");
  newUser.token = token;

  try {
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login User

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //console.log(req.body);

  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (validity) {
        var token = jwt.sign({ email: email }, "shhhhh");
        user.token = token;
        await user.save();
        res.status(200).json(user);
      } else {
        res.status(400).json("Wrong Password");
      }

    } else {
      res.status(404).json("User does not exists");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
