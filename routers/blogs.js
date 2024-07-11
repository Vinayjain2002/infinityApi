const express= require("express")
const { GetTopicBlogsController, BloggerBlogsController, RelatedBlogsController, CreateBlogsController,EditBlogsController, GetBlogsController, DeleteBlogsController } = require("../controllers/blogsController/blogsController")
const router= express.Router()

module.exports= router.get("/:topic/:pageNo",GetTopicBlogsController)
module.exports= router.get("/blogggerBlogs/:bloggerId/:pageNo", BloggerBlogsController)
module.exports= router.get("/detail/:pageNo",GetTopicBlogsController)
module.exports= router.post("/update/:bloggerToken/:blogId",EditBlogsController);
module.exports=router.put("/post/:bloggerToken",CreateBlogsController);
module.exports= router.get("/related/:pageNo", RelatedBlogsController);
module.exports= router.get("/delete/:bloggerToken/:blogId",DeleteBlogsController);
module.exports= router.get("/all/:pageNo", GetBlogsController)