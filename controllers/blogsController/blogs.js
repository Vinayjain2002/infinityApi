const mongoose= require("mongoose")
const bcrypt= require("bcryptjs")
const jwt= require("jsonwebtoken")
const Blogger= require('../../models/Blogger');
const Blog = require("../../models/Blogs");

const getTopicBlogsController= async (req,res)=>{
    try{

    }
    catch(err){
        console.log(err);
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

const bloggerBlogsController= async(req,res,next)=>{

}

const relatedBlogsController = async( req, res,next)=>{

}

const createBlogsController= async (req, res,next)=>{
    const bloggertoken = req.cookies.bloggertoken;
    if (!bloggertoken) {
      return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
    }

    // Validate token using JWT verify
    try {
      const decoded = jwt.verify(bloggertoken, "vinayBlogger"); // Replace "vinay" with your actual secret key
      const bloggerId = decoded._id;

      // Fetch user data using findOne()
      const blogger = await Blogger.findOne({ _id: bloggerId });
      if (!blogger) {
        return res.status(404).json({ message: "Blogger not found" }); // Use 404 for not found
      }
      else if(blogger.blocked){
        return res.status(405).json({
          "message": "Your Account is blocked"
        })
      }    

      // so the blogger id is not blocked and the blogger used to be exists
      const {blogTopic, blogContent,level, ...data }= req.body;
    if(blogTopic== undefined && blogContent== undefined && level== undefined){
        return res.status(404).json({"message": "Credential's not found"});
    }
    const createBlog= new Blog({
        blogTopic: blogTopic,
        blogContent: blogContent,
        level: level,
        ...data
    });
    // going to save the blog of the Blogger
    await createBlog.save();
    // now we need to append the blog id in the blogger data
    blogger.blogs.push(createBlog._id);
    await blogger.save();
    return res.status(200).json({"message": "Blog added successfully"})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            "message": "Internal Server Error"
        })
    }
}

const editBlogsController= async(req, res,next)=>{
    const bloggertoken = req.cookies.bloggertoken;
    if (!bloggertoken) {
      return res.status(401).json({ message: "Unauthorized: Token not found" }); // Use 401 for unauthorized access
    }

    // Validate token using JWT verify
    try {
      const decoded = jwt.verify(bloggertoken, "vinayBlogger"); // Replace "vinay" with your actual secret key
      const bloggerId = decoded._id;

      // Fetch user data using findOne()
      const blogger = await Blogger.findOne({ _id: bloggerId });
      if (!blogger) {
        return res.status(404).json({ message: "Blogger not found" }); // Use 404 for not found
      }
      else if(blogger.blocked){
        return res.status(405).json({
          "message": "Your Account is blocked"
        })
      }    

        // here the blogger is going to be update the data of the blog here
        const {blogId}= req.body;
        // checking is the same id present in the bloggerId
        const bloggerBlog=blogger.blogs.includes(blogId);
        if(!bloggerBlog){
            return res.status(404).json({"message": "You can't update the other's blogs"})
        }
        else{
            const {blogTopic, blogContent, blogImages, level,tags}= req.body;
            let updateFields = {};
            if (blogTopic) updateFields.blogTopic = blogTopic;
            if (blogContent) updateFields.blogContent = blogContent;
            if (blogImages) updateFields.blogImages = blogImages;
            if (level) updateFields.level = level;
            if (tags) updateFields.tags = tags;

            // Update the blog only if there are fields to update
            if (Object.keys(updateFields).length > 0) {
                Blog.updateOne({ _id: blogId }, { $set: updateFields }, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Internal Server Error" });
                    }
                    if (result.nModified === 0) {
                        return res.status(404).json({ message: "Blog not found" });
                    }
                    return res.status(200).json({ message: "Blog updated successfully" });
                });
            } else {
                return res.status(400).json({ message: "No fields to update" });
            }
        }
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

const getBlogsController= async(req,res,next)=>{
    try{
        // here we are going to find out all the blogs for the user
        const allBlogs= Blog.findOne();
        return res.status(200).json({"message": "Blogs Fetched Succesfully", data: allBlogs});
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}

const deleteBlogsController= async(req, res,next)=>{
    // here we are going to delete the blogs of the user
    try{
        const {blogId}= req.body;
        if(!blogId){
            return res.status(401).json({"message": "PLease Specify the BlogId"});
        }
        // going to check is 
    }
    catch(err){
        return res.status(500).json({"message": "Internal Server Error"});
    }
}
module.exports= {getTopicBlogsController, bloggerBlogsController, relatedBlogsController, createBlogsController,editBlogsController, getBlogsController, deleteBlogsController}
