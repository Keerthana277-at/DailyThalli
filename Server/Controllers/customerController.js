const Customer = require("../models/Customer");

const createCustomer = async (req,res) => {
    const { name,phone,department,regular } = req.body;
    try{
        const customer = new Customer({
            name,
            phone,
            department,
            regular
        });

        console.log("Customer before save",customer);

        const savedCustomer = await customer.save();

        console.log("Customer after save:",savedCustomer);

        res.status(201).json({
            message:"Customer created successfully",
            customer:savedCustomer
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to create the customer",
            
        })

        console.log("Server error:",error.message);
    } 

};

const getCustomers = async (req,res) => {
    try{
        const customers = await Customer.find().sort({ createdAt:-1 });

        return res.status(200).json({
            message:"Customers fetched successfully",
            customers:customers
        })
    }catch(error){
        console.log("Server error:",error.message);
        return res.status(500).json({
            message:"server error"
        })
    }
};


const getCustomersByID = async (req,res) => {
    try{
        const customer = await Customer.findById(req.params.id);

        if(!customer)
            return res.status(404).json({
                message:"Customer not found"
            })

        return res.status(200).json({
            message:"Customer fetched!!",
            customer:customer
        })    
    }catch(error){
        console.log("Server error:",error.message);
        return res.status(500).json({
            message:"Server error"
        });
    }
};

const updateCustomer = async (req,res) => {
    try{
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,{
                new:true,
                runvalidators:true
            }
        );

        if(!customer)
            return res.status(404).json({
                message:"Customer not found"
            })

        return res.status(200).json({
            message:"Customer updated successfully",
            customer:customer
        })   
    }catch(error){
        console.log("Server error:",error.message);
        return res.status(500).json({
            message:"Server error"
        })
    }
    
};

const deleteCustomer = async (req,res) => {
    try{
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if(!customer)
            return res.status(404).json({
                message:"Customer not found"
            });

        return res.status(200).json({
            message:"Customer deleted successfully"
        })    ;
    }catch(error){
        console.log("Server error:",error.message);
        return res.status(500).json({
            message:"Server error"
        });
    }
}

module.exports = {
    createCustomer,
    getCustomers,
    getCustomersByID,
    updateCustomer,
    deleteCustomer
};