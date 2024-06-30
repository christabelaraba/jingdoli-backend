const express = require("express");
const router = express.Router();
const product_controller = require('../controllers/product_controller');


router.get("/products", product_controller.get_product_list);


module.exports = router;