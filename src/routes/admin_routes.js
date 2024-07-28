const express = require("express");
const router = express.Router();
const { verifyToken } = require('../config/auth_middleware');
const admin_controller = require('../controllers/admin_controller');
const { route } = require("./product_route");

//https:3000/api/admin/create_product

router.post("/login", admin_controller.admin_login);

router.post("/logout", verifyToken, admin_controller.admin_logout);

router.post("/change_password", verifyToken, admin_controller.change_password);

router.post("/update_profile", verifyToken, admin_controller.update_profile);

router.post("/update_settings", verifyToken, admin_controller.update_settings);

router.get("/profile", verifyToken, admin_controller.profile_details);

router.post("/create_user_account", verifyToken, admin_controller.admin_register);
router.post("/create_product", verifyToken, admin_controller.create_product);

// get the list of products
router.get("/products", verifyToken, admin_controller.list_products);

// get the list of enquiries
router.get("/enquiries", verifyToken, admin_controller.list_enquiries);
router.get("/enquiries/:id", verifyToken, admin_controller.get_enquiries_details);
router.post("/reply_enquiry", verifyToken, admin_controller.reply_enquiry);


// get the list of orders
router.get("/order", verifyToken, admin_controller.list_order);
router.get("/order/:id", verifyToken, admin_controller.get_order_details);
router.post("/update_order", verifyToken, admin_controller.update_order);

// get the list of contact us
router.get("/contact", verifyToken, admin_controller.list_contact);

// create_quote endpoint 
router.post("/create_quote", verifyToken, admin_controller.create_quote);

router.get("/quote", verifyToken, admin_controller.list_quotes);
router.get("/quote/:id", verifyToken, admin_controller.get_quote_details);


//search for the customer
router.get("/get_customer", verifyToken, admin_controller.get_customer_details);

//  generate quote id
// router.get("/generate_quote_id", admin_controller.generate_quote_id);

// get new quote id
router.get("/get_new_quote_id", verifyToken, admin_controller.get_new_quote_id);


//We want to create some endpoints for the statistics/dashboard

router.get("/quotes_statistics", verifyToken, admin_controller.get_quotes_statistics);







module.exports = router;