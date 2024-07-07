const express = require("express");
const router = express.Router();
const product_controller = require('../controllers/product_controller');


router.get("/products", product_controller.get_product_list);

router.get("/products/:id", product_controller.get_product_details);
router.post("/make_enquiry", product_controller.make_enquiry);
router.post("/order_online", product_controller.order_online);
router.post("/contact_us", product_controller.contact_us);


module.exports = router;