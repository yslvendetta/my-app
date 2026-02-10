import Post from "../models/Post.js";
import User from "../models/User.js";

// Create a Post
export const createPost = async (req, res) => {
  try {
    const { userId, legalDomain, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      legalDomain,
      userPicturePath: user.picturePath,
      picturePath,
      interests: [],
      comments: [],
    });

    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Get All Posts (Feed)
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Get User's Posts
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Get Single Post by ID
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// Add Interest to Post
export const postInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.body;

    const post = await Post.findById(id);
    post.interests.push({ user });

    const updatePost = await Post.findByIdAndUpdate(
      id,
      { interests: post.interests },
      { new: true }
    );

    res.status(200).json(updatePost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Add Comment to Post
export const postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, comment } = req.body;

    const post = await Post.findById(id);
    post.comments.push({ user, comment });

    const updatePost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );

    res.status(200).json(updatePost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Edit/Update a Post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedPost = await Post.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Delete a Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
