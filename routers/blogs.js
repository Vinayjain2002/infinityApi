const express= require("express")
const { getTopicBlogsController, bloggerBlogsController, editBlogsController, createBlogsController, relatedBlogsController, getBlogsController, deleteBlogsController } = require("../controllers/blogsController/blogsController")
const router= express.Router()

module.exports= router.get("/:topic/:pageNo",getTopicBlogsController)
module.exports= router.get("/blogggerBlogs/:bloggerId/:pageNo", bloggerBlogsController)
module.exports= router.get("/detail/:pageNo",getBlogsController)
module.exports= router.post("/update/:blogId",editBlogsController);
module.exports=router.put("/post",createBlogsController);
module.exports= router.get("/related/:pageNo", relatedBlogsController);
module.exports= router.get("/delete/:blogId",deleteBlogsController);
