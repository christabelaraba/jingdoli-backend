const express = require("express");
const router = express.Router();
const admin_controller = require('../controllers/admin_controller');
const { route } = require("./product_route");

//https:3000/api/admin/create_product

router.post("/login", admin_controller.admin_login);
router.post("/create_user_account", admin_controller.admin_register);
router.post("/create_product", admin_controller.create_product);

// get the list of products
router.get("/products", admin_controller.list_products);

// get the list of enquiries
router.get("/enquiries", admin_controller.list_enquiries);

// get the list of orders
router.get("/order", admin_controller.list_order);

// get the list of contact us
router.get("/contact", admin_controller.list_contact);

// create_quote endpoint 
router.post("/create_quote", admin_controller.create_quote);

router.get("/quote", admin_controller.list_quotes);


//search for the customer
router.get("/get_customer", admin_controller.get_customer_details);

//  generate quote id
// router.get("/generate_quote_id", admin_controller.generate_quote_id);

// get new quote id
router.get("/get_new_quote_id", admin_controller.get_new_quote_id);









module.exports = router;