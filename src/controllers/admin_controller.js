const db = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");


//This function is for an admin to save or input products into the systems from the admin portal
exports.create_product = async (req, res) => {

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
}


exports.admin_register = async (req, res) => {

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
    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                response_code: "011",
                response_message: "Invalid credentials"
            });
        } else {
            return res.json({
                response_code: "012",
                response_message: "Login successful", data: user
            });
        }
    }
}


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
        const enquiries = await db.Enquiry.findAll({
            include: [{
                model: db.Customer,
                as: 'Customer',
                attributes: [
                    [db.sequelize.fn('concat', db.sequelize.col('first_name'), ' ', db.sequelize.col('last_name')), 'customer_name'],
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
                customer_name: Customer.customer_name, // Add the customer_name directly to the root
                phone_number: Customer.phone_number, // Add the phone_number directly to the root
                email: Customer.email // Add the email directly to the root
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
            response_message: "Internal server error"
        });
    }
};



exports.get_enquiries_details = async (req, res) => {
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
                [db.sequelize.fn('concat', db.sequelize.col('first_name'), ' ', db.sequelize.col('last_name')), 'customer_name'],
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

        res.json({
            response_code: '000',
            response_message: "Records found",
            data: response
        });
    } else {
        res.json({
            response_code: '001',
            response_message: "No records found",
        });
    }
};


exports.list_order = async (req, res) => {
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
}



exports.get_order_details = async (req, res) => {

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
        id: req.body.id, quote_id: quote_id, customer_id: customer_id,
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

}


exports.list_quotes = async (req, res) => {
    const quote = await db.Quote.findAll();
    if (quote) {
        return res.json({
            response_code: "212",
            response_message: "quote saved",
            data: quote
        })

    } else {
        return res.json({
            response_code: "313",
            response_message: "quote not saved",
        })
    }
}



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

}
