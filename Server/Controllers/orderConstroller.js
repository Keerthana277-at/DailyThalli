const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Menu = require("../models/Menu");

const createOrder = async (req,res) => {
    try{
        const {customer,items,paidAmount} = req.body;

        const existingCustomer = await Customer.findById(customer);

        if(!existingCustomer)
            return res.status(404).json({
        message:"Customer not found"
    });

    if(!items || items.length == 0)
        return res.status(400).json({
            message:"Order must contain at least one menu item"
        });

     const orderItems = [];
     let totalAmount = 0;
     
     for(const item of items){
        const menuItem = await Menu.findById(item.menuItem);

        if(!menuItem)
            return res.status(404).json({
                message:"Menu item not found"
            });


            if(!menuItem.available)
                return res.status(400).json({
                    message:`${menuItem.name} is currently unavailable.`
                });

                const total = menuItem.price*item.quantity;

                orderItems.push({
                    menuItem:menuItem._id,
                    quantity:item.quantity,
                    price:menuItem.price,
                    total
                });

                totalAmount += total;
     }

     const dueAmount = totalAmount - paidAmount;

     if(paidAmount > totalAmount)
        return res.status(400).json({
            message:"paid amount can't be greater than total amount"
        });

        let paymentStatus = "Pending";

        if(paidAmount === totalAmount)
            paymentStatus = "Paid"

        else if(paidAmount>0)
            paymentStatus = "Partial";

        const order = new Order({
            customer,
            itmes:orderItems,
            totalAmount,
            paidAmount,
            dueAmount,
            paymentStatus
        });

        const saveOrder = await order.save();

        existingCustomer.totalOrders += 1;
        existingCustomer.dueAmount += dueAmount;

        await existingCustomer.save();

        return res.status(201).json({
            message:"Order created successfully",
            order:saveOrder
        });
  }catch(error){
    console.log("Create order error:",error.message);

    return res.status(500).json({
        message:"Server error"
    })
  }
};


const getOrders = async (req,res) => {
    try{
        const orders = await Order.find()
        .populate("customer","name phone department")
        .populate("items.menuItem","name price")
        .sort({ createdAt:-1 });

        return res.status(200).json({
            message:"Orders fetched successfully",
            orders
        });
    }catch(error){
        console.log("Get orders error:",error.message);

        return res.status(500).json({
            message:"Server error"
        });
    }
};

const getOrderById = async (req,res) => {
    try{
        const order = await Order.findById(req.params.id)
        .populate("customer","name phone department")
        .populate("items.menuItem","name price");

        if(!order)
            return res.status(404).json({
                message:"Orders not found"
            });

            return res.status(200).json({
                message:"Order fetched successfully",
                order
            });
    }catch(error){
        console.log("get order error:",error.message);
        return res.status(500).json({
            message:"Server error"
        });
    }
};

const updateOrder = async (req,res) => {
    try{
        const order = await Order.findById(req.params.id);

        if(!order)
            return res.status(404).json({
                message:"Order not found"
            });

            const { orderStatus } = req.body;

            if(orderStatus)
                order.orderStatus = orderStatus;

            const updateOrder = await order.save();

            return res.status(200).json({
                message:"Order updated successfully",
                order:updateOrder
            });
    }catch(error)
{
    console.log("Update order error:",error.message);
    return res.status(500).json({
        message:"Server error"
    })
 }
};

const deleteOrder = async (req,res) => {
    try{
        const order = await Order.findByIdAndDelete(req.params.id);

        if(!order)
            return res.status(404).json({
                message:"Order not found"
            });

            return res.status(200).json({
                message:"Order deleted successfully"
            });
    }catch(error){
        console.log("Delete order error:",error.message);
        return res.status(500).json({
            message:"Server error"
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
}