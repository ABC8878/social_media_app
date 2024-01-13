import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

// Creat new Post
export const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get a post

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a post
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post Updated");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  const postid = req.params.id;
  const  userId  = req.body.userId;
  //console.log(req.body.userId)
//console.log(postid,userId)
  try {
    const post = await PostModel.findById(postid);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("Post deleted successfully");
    } else {
      res.status(403).json("You can delete your own posts only");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// like/dislike a post
export const likePost = async (req, res) => {
  const postid = req.params.id;
  const { userId } = req.body;

 // console.log(userId);

  try {
    const post = await PostModel.findById(postid);

    if (!post.likes.includes(userId)) {
      // await post.updateOne({ $push: { likes: userId } });
      // const updatedpost = await PostModel.findById(postid);
      // res.status(200).json(updatedpost);
      post.likes.push(userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(userId));
    }

    const updatedPost = await PostModel.findByIdAndUpdate(postid, post, {
      new: true,
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get Timeline POsts
export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    // const currentUserPosts = await PostModel.find({ userId: userId });
    const allposts = await PostModel.find();

    res.status(200).json(
      allposts.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  } catch (error) {
    res.status(500).json(error);
  }};


  // const followingPosts = await UserModel.aggregate([
  //   {
  //     $match: {
  //       _id: new mongoose.Types.ObjectId(userId),
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "posts",
  //       localField: "following",
  //       foreignField: "userId",
  //       as: "followingPosts",
  //     },
  //   },
  //   {
  //     $project: {
  //       followingPosts: 1,
  //       _id: 0,
  //     },
  //   },
  // ]);

  //   res
  //     .status(200)
  //     .json(currentUserPosts.concat(...followingPosts[0].followingPosts)
  //     .sort((a,b)=>{
  //         return b.createdAt - a.createdAt;
  //     })
  //     );
  // } catch (error) {
  //   res.status(500).json(error);
  // }

