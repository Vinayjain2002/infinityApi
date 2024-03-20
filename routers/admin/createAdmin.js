const express = require("express")
const { createAdminController, updatePermissionController, deleteAdminController } = require("../../controllers/createAdminController.js/createAdmin")
const router= express.Router()

module.exports= router.post("/admin/createAdmin", createAdminController)
module.exports= router.put("/admin/updatePermission",updatePermissionController)
module.exports= router.delete("/admin/deleteAdmin", deleteAdminController)