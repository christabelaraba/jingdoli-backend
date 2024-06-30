const db = require("../models");
// responsible for getting the product list
exports.get_product_list = async (req, res) => {
    const products = await db.Product.findAll({
        attributes: ['id', 'model', 'prime', 'createdAt']
    });
    if(products){
        res.json({
            response_code:'000',
            response_message: "Records found",
            data: products
        });
    }
    else{
        res.json({
            response_code:'001',
            response_message: " No records  found",
        });
    }
};


exports.get_product_details = async (req, res) => {
    const products = await db.Product.findOne({
      where: {id: req.params.id}
    });
    if(products){
        res.json({
            response_code:'000',
            response_message: "Records found",
            data: products
        });
    }
    else{
        res.json({
            response_code:'001',
            response_message: " No records  found",
        });
    }
}


exports.make_enquiry = async(req, res) => {
    console.log(req.body);
    //validation
   if(!req.body.first_name || !req.body.last_name || !req.body.phone_number || !req.body.message){
        return res.json({
        return_code: "004",
        response_message: "Please fill in the required fields"
        });
   }
   //save enquiry details in the database
   const enquiry_record = await db.Enquiry.create({
    first_name: req.body.first_name, last_name: req.body.last_name, phone_number: req.body.phone_number,
    email: req.body.email, message: req.body.message, product_id: req.body.product_id
   });
   if (enquiry_record) {
        res.json({
            response_code:'002',
            response_message: "Records have been saved successfully",
        })
    }else{
        res.json({
            response_code:'001',
            response_message: " Records could not be saved successfully",
        });
    }
   
  
};
    exports.order_online = async(req, res) => {
         //save order details in the database
   const order_record = await db.Order_online.create({
    first_name: req.body.first_name, last_name: req.body.last_name, phone_number: req.body.phone_number,
    email: req.body.email, message: req.body.message, company_name: req.body.company_name,company_address: req.body.company_address,
    power_required: req.body.power_required, location: req.body.location
   });
   if (order_record) {
        res.json({
            response_code:'009',
            response_message: "Records have been saved successfully",
        })
    }else{
        res.json({
            response_code:'008',
            response_message: " Records could not be saved successfully",
        });
    }
    }