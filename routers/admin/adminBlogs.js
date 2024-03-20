const express= require("express")
const { deleteBlogsController, updateBlogsConroller, blockBlogController, createBlogsController } = require("../../controllers/adminController/blogsController")
const router= express.Router()

module.exports= router.delete("/admin/deleteBlog",deleteBlogsController )
module.exports= router.put("/admin/updateBlog", updateBlogsConroller)
module.exports= router.put("/admin/blocBlock", blockBlogController)
module.exports= router.post("/admin/createBlock", createBlogsController)