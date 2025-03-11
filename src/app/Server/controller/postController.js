const Post = require("../../model/post/post");


const getPost = async (req, res) => {
  try {

    const posts = await Post.find();
    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const Posts = async (req, res) => {
  const { title, content, auther, image, User_id } = req.body;

  try {
    const existingPost = await Post.findOne({ auther });

    if (existingPost) {
      return res.status(400).json({ message: "A post with this author already exists" });
    }

    const createPost = new Post({
      title,
      content,
      auther,
      image,
      User_id,
    });

    await createPost.save();
    res.status(201).json({ message: "Post has been created", createPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getIdPost = async (req, res) => {
  try {
    const { User_id } = req.params;

    if (!User_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const posts = await Post.find({ userId: User_id });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { Posts, getPost, getIdPost };