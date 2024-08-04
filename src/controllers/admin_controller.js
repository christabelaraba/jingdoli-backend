const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');


//This function is for an admin to save or input products into the systems from the admin portal
exports.create_product = async (req, res) => {

    try {
        //validations
        if (!req.body.model || !req.body.description || !req.body.frequency || !req.body.fuel_type || !req.body.power || !req.body.voltage || !req.body.price || !req.body.amp_per_phase ||
            !req.body.color || !req.body.alternator || !req.body.engine || !req.body.prime || !req.body.price || !req.body.size || !req.body.warranty ||
            !req.body.type
        ) {
            return res.json({
                response_code: "004",
                response_message: "Please fill in the required fields"
            });

        }

        const product = await db.Product.findOne({
            where: { model: req.body.model }
        });


        if (product) {
            return res.json({
                response_code: "005",
                response_message: "The product you are trying to create already exists"
            });
        } else {

            //save product
            //save enquiry details in the database
            const product_record = await db.Product.create({
                model: req.body.model, description: req.body.description, frequency: req.body.frequency,
                fuel_type: req.body.fuel_type, power: req.body.power, amp_per_phase: req.body.amp_per_phase, voltage: req.body.voltage,
                alternator: req.body.alternator, engine: req.body.engine, prime: req.body.prime, price: req.body.price, size: req.body.size, color: req.body.color, type: req.body.type, warranty: req.body.warranty, other: req.body.other, picture_url: req.body.picture_url
            });

            if (product_record) {
                res.json({
                    response_code: '002',
                    response_message: "Records have been saved successfully",
                })
            } else {
                res.json({
                    response_code: '001',
                    response_message: " Records could not be saved successfully",
                });
            }

        }

    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }
}


exports.admin_register = async (req, res) => {

    try {

        if (!req.body.first_name || !req.body.last_name || !req.body.password || !req.body.email || !req.body.username) {
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

        } else {
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

    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }

}


exports.get_users = async (req, res) => {
    try {
        const users = await db.User.findAll({
            where: { del_status: false },
            attributes: { exclude: ['password'] } // Exclude password from the results for security
        });
        if (users.length > 0) {
            return res.json({
                response_code: "000",
                response_message: "Users retrieved successfully",
                data: users
            });
        } else {
            return res.json({
                response_code: "001",
                response_message: "No users found"
            });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Internal server error",
            error: error.message
        });
    }
};


exports.admin_login = async (req, res) => {

    try {
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
        } else {

            if (user.active_status != true) {
                return res.json({
                    response_code: "011",
                    response_message: "Sorry, your account has been deactivated. Kindly contact the administrator"
                });
            }

            if (user.del_status == true) {
                return res.json({
                    response_code: "010",
                    response_message: "User not found"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json({
                    response_code: "011",
                    response_message: "Invalid credentials"
                });
            } else {

                //Generate a JWT token
                const token = jwt.sign(
                    { id: user.id, role: user.user_role },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                const user_data = { ...user};
                delete user_data.dataValues.password;
                delete user_data.dataValues.createdAt;
                delete user_data.dataValues.updatedAt;

                return res.json({
                    response_code: "012",
                    response_message: "Login successful", 
                    accessToken: token,
                    data: user_data.dataValues
                });
            }
        }

    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }
}


exports.admin_logout = async (req, res) => {
    try {

        const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;
        if (!token) {
            return res.status(400).json({ response_code: "001", response_message: "No token provided" });
        }

        const decoded = jwt.decode(token);
        if (decoded && decoded.exp) {
            await db.Blacklisted_Token.create({
                token: token,
                expiry: new Date(decoded.exp * 1000)  // JWT exp is in seconds
            });
            res.status(200).json({ response_code: "000", response_message: "Successfully logged out" });
        } else {
            res.status(500).json({ response_code: "002", response_message: "Failed to decode token" });
        }
    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }
};


exports.change_password = async (req, res) => {

    try {

        const { old_password, new_password, confirm_new_password } = req.body;

        const user = await db.User.findByPk(req.user_id);
        if(!user) {
        return res.json({ response_code: "404", response_message: "User not found" });
        }else {
            const passwordIsValid = await bcrypt.compare(old_password, user.dataValues.password);
            if(!passwordIsValid) {
                return res.json({ response_code: "405", response_message: "Invalid password" });
            }else {

                if (new_password !== confirm_new_password) {
                    return res.json({ response_code: "406", response_message: "Sorry, the new passwords you provided don't match. Please check and try again." });
                }else{

                    const hash_new_password = await bcrypt.hashSync(new_password, 10);
                    user.password = hash_new_password;
                    await user.save();

                    return res.json({ response_code: "300", response_message: "Password changed successfully!" });
                }

            }
        }

    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }

}



exports.update_profile = async (req, res) => {
    try {

        const { first_name, last_name, phone_number } = req.body;

        const user = await db.User.findByPk(req.user_id);
        if(!user) {
        return res.json({ response_code: "404", response_message: "User not found" });
        }else {
            user.first_name = first_name;
            user.last_name = last_name;
            user.phone_number = phone_number;

            await user.save();
            return res.json({ response_code: "200", response_message: "Profile updated successfully!" });
        }
    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }
}



exports.profile_details = async (req, res) => {
    console.log(req.user_id);
    const user = await db.User.findOne({
        where: {
            id: req.user_id,
            del_status: false
        },
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });

    if(!user) {
        return res.json({ response_code: "404", response_message: "User not found" });
    }else{

        return res.json({ 
            response_code: "000", 
            response_message: "Profile details found", 
            data: user.dataValues 
        });
    }

}



exports.delete_user = async (req, res) => {
    try {
        const id = req.params.id; // Assuming ID is passed via route parameters
        const user = await db.User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                response_code: "002",
                response_message: "User not found"
            });
        }

        user.active_status = false;
        user.del_status = true;

        await user.save();

        return res.json({
            response_code: "003",
            response_message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Internal server error",
            error: error.message
        });
    }
};


exports.list_products = async (req, res) => {
    const products = await db.Product.findAll({
        attributes: ['id', 'model', 'prime', 'createdAt', 'picture_url', 'description', 'voltage', 'engine', 'frequency', 'alternator',
            'amp_per_phase', 'power', 'fuel_type', 'size']
    });
    if (products) {
        return res.json({
            response_code: "000",
            response_message: "Records found",
            data: products
        })
    } else {
        return res.json({
            response_code: '001',
            response_message: " No records  found",
        })
    }
}


exports.list_enquiries = async (req, res) => {
    try {
        // Build the where clause dynamically based on req.query
        let enquiryWhereClause = {};
        let customerWhereClause = {};

        if (req.query.customer_id) {
            customerWhereClause.id = req.query.customer_id;
        }

        if (req.query.start_date && req.query.end_date) {
            enquiryWhereClause.createdAt = {
                [db.Sequelize.Op.between]: [new Date(req.query.start_date), new Date(req.query.end_date)]
            };
        }

        const enquiries = await db.Enquiry.findAll({
            where: enquiryWhereClause,
            include: [{
                model: db.Customer,
                as: 'Customer',
                where: customerWhereClause,
                attributes: [
                    [db.sequelize.fn('concat', db.sequelize.col('Customer.first_name'), ' ', db.sequelize.col('Customer.last_name')), 'customer_name'],
                    'phone_number', // Include phone number
                    'email' // Include email
                ]
            }]
        });

        // Manually flatten the response
        const flattenedEnquiries = enquiries.map(enquiry => {
            const { Customer, ...enquiryData } = enquiry.toJSON();
            return {
                ...enquiryData,
                customer_name: Customer ? Customer.customer_name : '',
                phone_number: Customer ? Customer.phone_number : '',
                email: Customer ? Customer.email : ''
            };
        });

        if (flattenedEnquiries.length > 0) {
            return res.json({
                response_code: "000",
                response_message: "Records found",
                data: flattenedEnquiries
            });
        } else {
            return res.json({
                response_code: "001",
                response_message: "No records found",
            });
        }
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return res.status(500).json({
            response_code: "999",
            response_message: "Internal server error",
            error: error.message
        });
    }
};



exports.get_enquiries_details = async (req, res) => {
    try {

    
        if (!req.params.id) {
            return res.json({
                response_code: "004",
                response_message: "Please fill in the required fields"
            });
        }

        const enquiry = await db.Enquiry.findOne({
            where: { id: req.params.id },
            include: [{
                model: db.Customer,
                as: 'Customer',
                attributes: [
                    [db.sequelize.fn('concat', db.sequelize.col('Customer.first_name'), ' ', db.sequelize.col('Customer.last_name')), 'customer_name'],
                    'phone_number',
                    'email'
                ]
            }]
        });

        if (enquiry) {
            const { Customer, ...enquiryData } = enquiry.toJSON();
            const response = {
                ...enquiryData,
                customer_name: Customer ? Customer.customer_name : null,
                phone_number: Customer ? Customer.phone_number : null,
                email: Customer ? Customer.email : null
            };


            //Add reply of the enquiry to the enquiry data.
            const enquiry_response = await db.Enquiry_Response.findOne({
                where: { enquiry_id: enquiry.id },
                attributes: ['id', 'email', 'subject', 'message', 'createdAt'
                ]
            });

            res.json({
                response_code: '000',
                response_message: "Records found",
                data: {...response, reply_data: enquiry_response}
            });
        } else {
            res.json({
                response_code: '001',
                response_message: "No records found",
            });
        }

    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return res.status(500).json({
            response_code: "999",
            response_message: "Internal server error"
        });
    }
};


exports.reply_enquiry = async (req, res) => {

    try {

        const { id, subject, message } = req.body;
        const user_id = req.user_id; //the admin user responding to the enquiry

        const enquiry = await db.Enquiry.findOne({
            where: { id: id },
            include: [{
                model: db.Customer,
                as: 'Customer',
                attributes: [
                    'first_name',
                    'last_name',
                    'phone_number',
                    'email'
                ]
            }]
        });

        if(!enquiry){
            res.json({
                response_code: '001',
                response_message: "No records found",
            });
        }else{


            const { Customer, ...enquiryData } = enquiry.toJSON();
            const response = {
                ...enquiryData,
                first_name: Customer ? Customer.first_name : null,
                last_name: Customer ? Customer.last_name : null,
                phone_number: Customer ? Customer.phone_number : null,
                email: Customer ? Customer.email : null
            };

            //create / save the response in the database
            await db.Enquiry_Response.create({
                enquiry_id: id, email: response.email, subject, message, user_id
            });


            // send an actual email to the customer using an actual email service

            res.json({
                response_code: '000',
                response_message: "Enquiry response saved and sent successfully"
            });
        }

    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return res.status(500).json({
            response_code: "999",
            response_message: "Internal server error"
        });
    }

};


exports.list_order = async (req, res) => {
    try {

        const order = await db.Order_online.findAll();
        if (order) {
            return res.json({
                response_code: "101",
                response_message: "order received",
                data: order
            })
        } else {
            return res.json({
                response_code: "100",
                response_message: "Order not received",
            })
        }
    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }
}



exports.update_order = async (req, res) => {

    try {
        const { id, price, quantity, order_status, payment_status, payment_method } = req.body;
        const user_id = req.user_id; //the admin user responding to the order


        const order = await db.Order_online.findByPk(id);
        if(!order) {
           return res.json({ response_code: "404", response_message: "Order record not found" });
        }else {
            order.price = price;
            order.quantity = quantity;
            const total = Number(price) * Number(quantity);
            order.total = total;
            order.order_status = order_status;
            order.payment_status = payment_status;
            order.payment_method = payment_method;
            order.user_id = user_id;
    
            await order.save();

            return res.json({ response_code: "200", response_message: "Your changes have been saved successfully. You can go back to orders or keep editing" });
        }

    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return res.status(500).json({
            response_code: "999",
            response_message: "Internal server error"
        });
    }

};


exports.get_order_details = async (req, res) => {
    try {
    
        if (!req.params.id) {
            return res.json({
                response_code: "004",
                response_message: "Please fill in the required fields"
            });
        }

        const order = await db.Order_online.findOne({
            where: { id: req.params.id }
        });
        if (order) {
            res.json({
                response_code: '000',
                response_message: "Records found",
                data: order
            });
        }
        else {
            res.json({
                response_code: '001',
                response_message: " No records  found",
            });
        }

    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }

}


exports.list_contact = async (req, res) => {
    const contact = await db.Contact_us.findAll();
    if (contact) {
        return res.json({
            response_code: "111",
            response_message: "contact saved",
            data: contact
        })
    } else {
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
    } else {
        quote_id = 1;
    }

    // Ensure the ID has at least 3 digits, padding with zeros if necessary
    return "QT" + quote_id.toString().padStart(3, '0');
}

exports.get_new_quote_id = async (req, res) => {
    const quote_id = await generate_quote_id();
    return res.json({
        response_code: "000",
        response_message: "Quote ID found",
        data: quote_id
    });
}




exports.create_quote = async (req, res) => {
    try {

        if (!req.body.product_id || !req.body.price || !req.body.message) {
            return res.json({
                response_code: "878",
                response_message: "Please fill in the required fields"

            });
        }

        let customer_id;
        const customer = await db.Customer.findOne({
            where: { first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, phone_number: req.body.phone_number }
        });

        //the customer is an existing customer
        if (customer) {
            customer_id = customer.id;
        } else {
            const customer_created = await db.Customer.create({
                first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, phone_number: req.body.phone_number, location: req.body.location
            });

            customer_id = customer_created.id;
        }


        const quote_id = await generate_quote_id();


        //save quote details in the database
        const quote_record = await db.Quote.create({
            quote_id: quote_id, customer_id: customer_id,
            price: req.body.price, message: req.body.message, status: req.body.status
        });

        if (quote_record) {
            return res.json({
                response_code: "007",
                response_message: "Thank you. Quote received. Review underway."
            });
        } else {
            res.json({
                response_code: "008",
                response_message: "Quote has not been received. Please resubmit."
            });
        }

    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }

}


exports.list_quotes = async (req, res) => {
    try {
        // Build the where clause dynamically based on req.params
        let whereClause = {};

        if (req.query.customer_id) {
            whereClause.customer_id = req.query.customer_id;
        }

        if (req.query.status) {
            whereClause.status = req.query.status;
        }

        if (req.query.start_date && req.query.end_date) {
            whereClause.created_at = {
                [db.Sequelize.Op.between]: [new Date(req.query.start_date), new Date(req.query.end_date)]
            };
        }

        const quotes = await db.Quote.findAll({
            where: whereClause
        });

        if (quotes && quotes.length > 0) {
            return res.json({
                response_code: "212",
                response_message: "Quotes found",
                data: quotes
            });
        } else {
            return res.json({
                response_code: "313",
                response_message: "No records found"
            });
        }
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return res.status(500).json({
            response_code: "500",
            response_message: "Internal server error",
            error: error.message
        });
    }
};




exports.get_quote_details = async (req, res) => {

    if (!req.params.id) {
        return res.json({
            response_code: "004",
            response_message: "Please fill in the required fields"
        });
    }

    const quote = await db.Quote.findOne({
        where: { id: req.params.id }
    });
    if (quote) {
        res.json({
            response_code: '000',
            response_message: "Records found",
            data: enquiry
        });
    }
    else {
        res.json({
            response_code: '001',
            response_message: " No records  found",
        });
    }

}



exports.get_customer_details = async (req, res) => {
    const name = req.query.name;

    const customer = await db.Customer.findAll({
        where: {
            [Op.or]: {
                first_name: name,
                last_name: name,
            },
        }
    });

    if (customer.length > 0) {
        return res.json({
            response_code: "213",
            response_message: "customer records found",
            data: customer
        })

    } else {
        return res.json({
            response_code: "214",
            response_message: "customer record not found",
        })
    }

}



exports.get_quotes_statistics = async (req, res) => {
    try {

    
        //Here will get the count or number of the following:
        // 1. all quotes in the system
        // 2. pending quotes
        // 3. approved quotes
        // 4. Rejected quotes

        //total quotes in the system(quotes that haven't been deleted)
        const totalQuoteCount = await db.Quote.count({
            where: {
                del_status: false
            },
        });
        
        console.log(`totalQuoteCount: ${totalQuoteCount}`);

        // Here are the statuses of the quotes: 
            // P means Pending, A means Approved, R means Rejected

        //pending quotes in the system
        const pendingQuoteCount = await db.Quote.count({
            where: {
                status: 'P',
                del_status: false
            },
        });


        //approved quotes in the system
        const approvedQuoteCount = await db.Quote.count({
            where: {
                status: 'A',
                del_status: false
            },
        });

        //rejected quotes in the system
        const rejectedQuoteCount = await db.Quote.count({
            where: {
                status: 'R',
                del_status: false
            },
        });

        
        return res.json({
            response_code: "315",
            response_message: "Statistics records found",
            data: { 
                    totalQuoteCount: totalQuoteCount, 
                    pendingQuoteCount: pendingQuoteCount, 
                    approvedQuoteCount: approvedQuoteCount, 
                    rejectedQuoteCount: rejectedQuoteCount
                }
        });

    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }

}




exports.update_settings = async (req, res) => {
    try {
    
        const { email_notify, sms_notify } = req.body;

        const user_settings = await db.User_settings.findOne({
            where: { user_id: req.user_id }
        });

        if(!user_settings) {

            await db.User_settings.create({
                user_id: req.user_id, email_notify, sms_notify
            })

        return res.json({ response_code: "200", response_message: "User settings have been updated successfully!" });
        }else {
            user_settings.email_notify = email_notify;
            user_settings.sms_notify = sms_notify;

            await user_settings.save();
            return res.json({ response_code: "200", response_message: "User settings have been updated successfully!" });
        }

    } catch (error) {
        // Error handling
        console.error("Error saving contact message:", error);
        res.status(500).json({
            response_code: '999',
            response_message: "Sorry, something went wrong. Please try again",
            error: error.message
        });
    }
}

