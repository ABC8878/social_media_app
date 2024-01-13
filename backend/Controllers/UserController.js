import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
// get a User
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      //const { password, ...otherDetails } = user._doc;
      res.status(200).json(user);
    } else {
      res.status(404).json("No such user exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllUsers = async (req, res) => {
    //console.log('fhdskjh')
  try {
    //console.log("inside get all users backend")
    const users = await UserModel.find();
    res.status(200).json(users);
    
  } catch (error) {
    res.status(400).json(error);
  }
};


// update a user
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! you can only update your own profile");
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const currentUserId  = req.body.userId;
//console.log(req.body,currentUserId);
  if (currentUserId === id ) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! you can only delete your own profile");
  }
};

// Follow a User
export const followUser = async (req, res) => {
  //console.log("inside followuser backend")
  const id = req.params.id;

  const currentUserId  = req.body.id;

  if (currentUserId === id) {
    res.status(200).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);
      //console.log(followUser,followingUser)

      if (!followUser.followers.includes(currentUserId)) {
        followUser.followers.push(currentUserId)
        followingUser.following.push(id);
        // await followUser.updateOne({ $push: { followers: currentUserId } });
        // await followingUser.updateOne({ $push: { following: id } });
        // res.status(200).json(followingUser);
      } else {
        //res.status(403).json("User is Already followed by you");
        // await followUser.updateOne({ $pull: { followers: currentUserId } });
        // await followingUser.updateOne({ $pull: { following: id } });
        // res.status(200).json(followingUser);
        followUser.followers = followUser.followers.filter((id) => id !== currentUserId)
        followingUser.following = followingUser.following.filter((_id) => _id !== id)
      }
      const updatedFollowUser = await UserModel.findByIdAndUpdate(id, followUser, { new: true })
      const updatedFollowingUser = await UserModel.findByIdAndUpdate(currentUserId, followingUser, { new: true })

      res.json(updatedFollowingUser)
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

// UnFollow a User
export const UnFollowUser = async (req, res) => {
  const id = req.params.id;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(currentUserId);

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User Unfollowed!");
      } else {
        res.status(403).json("User is not followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
