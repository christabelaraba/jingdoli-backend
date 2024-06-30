const db = require("../models");

//responsible for getting the product list
exports.get_product_list = async (req, res) => {
    const products = await db.Product.findAll();
    res.json(products);

};
