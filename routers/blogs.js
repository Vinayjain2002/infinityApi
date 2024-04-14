const express= require("express")
const { getTopicBlogsController, bloggerBlogsController, editBlogsController, createBlogsController, relatedBlogsController, getBlogsController, deleteBlogsController } = require("../controllers/blogsController/blogs")
const router= express.Router()

// module.exports= router.get("/blogs/:topic/:length",getTopicBlogsController)
// module.exports= router.get("/blogs/all/:userId", bloggerBlogsController)
// module.exports= router.get("/blogs/:BlogId",getBlogsController)
// module.exports= router.post("/blogs/update/:BlogId",editBlogsController);
// module.exports=router.put("/blogs/create",createBlogsController);
// module.exports= router.get("/blogs/related/:length", relatedBlogsController);
// module.exports= router.get("/blogs/delete/:BlogsId",deleteBlogsController);
