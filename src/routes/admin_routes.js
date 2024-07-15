const express = require("express");
const router = express.Router();
const admin_controller = require('../controllers/admin_controller');

//https:3000/api/admin/create_product

router.post("/login", admin_controller.admin_login);
router.post("/create_user_account", admin_controller.admin_register);


router.post("/create_product", admin_controller.create_product);


module.exports = router;