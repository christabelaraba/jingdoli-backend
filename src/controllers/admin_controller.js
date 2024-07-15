const db = require("../models");
const bcrypt = require("bcrypt");


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

exports.admin_login = async (req, res) =>{
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


        

            
            

            
    
    

