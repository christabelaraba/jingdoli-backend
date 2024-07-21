const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");


//This function is for an admin to save or input products into the systems from the admin portal
exports.create_product = async (req, res) => {

  //validations
  if(!req.body.model ||!req.body.description||!req.body.frequency || !req.body.fuel_type || !req.body.power || !req.body.voltage || !req.body.price || ! req.body.amp_per_phase|| 
    !req.body.color || !req.body.alternator || ! req.body.engine || ! req.body.prime || ! req.body.price || ! req.body.size || ! req.body.warranty ||
     !req.body.type 
  ){
    return res.json({
        response_code: "004",
        response_message: "Please fill in the required fields"
    });

  }

  const product = await db.Product.findOne({
    where: {model: req.body.model}
  });


if (product) {
    return res.json({
        response_code: "005",
        response_message: "The product you are trying to create already exists"
    });
}else{

    //save product
       //save enquiry details in the database
       const product_record = await db.Product.create({
        model: req.body.model, description: req.body.description, frequency: req.body.frequency,
        fuel_type: req.body.fuel_type, power: req.body.power, amp_per_phase: req.body.amp_per_phase,voltage: req.body.voltage,
        alternator: req.body.alternator,engine: req.body.engine,prime: req.body.prime,price: req.body.price,
size: req.body.size, color: req.body.color, type: req.body.type,  warranty: req.body.warranty,other: req.body.other,picture_url: req.body.picture_url
        
       });
    
       if (product_record) {
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
    
         
        }
    }
exports.admin_register = async (req, res) => {
    
    if(!req.body.first_name ||!req.body.last_name ||!req.body.password ||!req.body.email ||!req.body.username
      ){
        return res.json({
            response_code: "004",
            response_message: "Please fill in the required fields"
        });
}

const user = await db.User.findOne({
    where: { email: req.body.email } 
});

if (user) {
    return res.json({
        response_code: "010",
        response_message: "User already exists"
    }); 

       }else{
                const hashedpassword = await bcrypt.hash(req.body.password, 10);

                 await db.User.create({
                    first_name: req.body.first_name, last_name: req.body.last_name, username: req.body.username, email: req.body.email,
                    password: hashedpassword, user_role: req.body.user_role,

                });

                return res.json({
                    response_code: "014",
                    response_message: "User account has been created successfully"
                    
                    

                });

            }

}

exports.admin_login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await db.User.findOne({
        where: { email: email } 
    });

    if (!user) {
        return res.json({
            response_code: "010",
            response_message: "User not found"
        }); 
    }else{
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({
                response_code: "011",
                response_message: "Invalid credentials"
            }); 
        }else{
            return res.json({
                response_code: "012",
                response_message: "Login successful", data: user
            }); 
        }
    }
}


exports.list_products = async (req, res) => {
    const products = await db.Product.findAll({
        attributes: ['id', 'model', 'prime', 'createdAt','picture_url','description','voltage','engine','frequency','alternator',
            'amp_per_phase','power','fuel_type','size']});
    if(products){
        return res.json ({
            response_code : "000",
            response_message : "Records found",
            data : products
        })
    }else{
        return res.json({
            response_code:'001',
            response_message: " No records  found",
        })
    }
} 


exports.list_enquiries = async (req, res) => {
    const enquiry = await db.Enquiry.findAll();
    if(enquiry){
        return res.json({
            response_code : "000",
            response_message : "Records found",
            data : enquiry
        })
    }else{
        return res.json({
            response_code: "001",
            response_message: "No records found",
        })
    }
}
        

exports.list_order = async (req, res) => {
    const order = await db.Order_online.findAll();
    if(order){
        return res.json({
            response_code : "101",
            response_message : "order received",
            data : order
        })
    }else{
        return res.json({
            response_code: "100",
            response_message: "Order not received",
        })
    }
}


exports.list_contact = async (req , res) => {
    const contact = await db.Contact_us.findAll();
    if(contact){
        return res.json({
            response_code: "111",
            response_message: "contact saved",
            data : contact
        })
    }else{
        return res.json({
            response_code: "112",
            response_message: "contact not saved",
        })
    }
}


generate_quote_id = async () => {
    let quote_id;
    const latest_quote = await db.Quote.findOne({
        order: [
            ['created_at', 'DESC'],
        ]
    });


    if (latest_quote) {
        quote_id = Number(latest_quote.id) + 1;
    }else{
        quote_id = 1;
    }

    // Ensure the ID has at least 3 digits, padding with zeros if necessary
    return "QT" + quote_id.toString().padStart(3, '0');
}

exports.get_new_quote_id = async(req, res) =>{
    const quote_id = await generate_quote_id();
    return res.json({
        response_code: "000",
        response_message: "Quote ID found",
        data: quote_id
   });
}




exports.create_quote = async (req , res) => {
    
    if( !req.body.customer_id || !req.body.product_id || !req.body.price || !req.body.message ){
        return res.json({
             response_code: "878",
            response_message: "Please fill in the required fields"

        });
    }

    const quote_id = await generate_quote_id();

  //save quote details in the database
  const quote_record = await db.Quote.create({
    id: req.body.id, quote_id: quote_id, customer_id: req.body.customer_id,
    price: req.body.price, message: req.body.message
    });

    if(quote_record){
        return res.json({
            response_code: "007",
            response_message: "Thank you. Quote received. Review underway."
        });
    }else{
        res.json({
            response_code: "008",
            response_message: "Quote has not been received. Please resubmit."
        });
    }
    
}

exports.list_quotes = async ( req , res) => {
    const quote = await db.Quote.findAll();
    if(quote){
        return res.json({
            response_code: "212",
            response_message: "quote saved",
            data : quote
        })

    }else{
        return res.json({
            response_code: "313",
            response_message: "quote not saved",
        })
    }
}

            
           

exports.get_customer_details = async(req, res) => {
    const name = req.query.name;

    const customer = await db.Customer.findAll({
        where: {
            [Op.or]: {
                first_name: name,
                last_name: name,
            },
        }
    });

    if(customer.length > 0 ){
        return res.json({
            response_code: "213",
            response_message: "customer records found",
            data : customer
        })

    }else{
        return res.json({
            response_code: "214",
            response_message: "customer record not found",
        })
    }

}
    
    

