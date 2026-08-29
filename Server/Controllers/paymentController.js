const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Customer = require("../models/Customer");

const createPayment = async (req,res) => {
    try{
        const { order,amount,paymentMethod } = req.body;

        const existingOrder = await Order.findById(order);

        if(!existingOrder)
            return res.status(404).json({
                message:"Order not found"
            });

            if(!amount || amount <= 0)
                return res.status(400).json({
                    message:"Payment can't be greater than due amount"
                });

                const payment = new Payment({
                    order,
                    customer:existingOrder.customer,
                    amount,
                    paymentMethod
                });

                const savedPayment = await payment.save();

                existingOrder.paidAmount += amount;
                existingOrder.dueAmount -= amount;

                if(existingOrder.dueAmount === 0)
                    existingOrder.paymentStatus = "Paid";
                else
                    existingOrder.paymentStatus = "Partial";

                await existingOrder.save();

                const customer = await Customer.findById(existingOrder.customer);

                if(customer){
                    customer.dueAmount -= amount;

                    if(customer.dueAmount<0)
                        customer.dueAmount = 0;

                    await customer.save();
                }

                return res.status(201).json({
                    message:"Payment recorded successfully",
                    payment:savedPayment,
                    order:existingOrder
                });
    }catch(error){
        console.log("Create payment error:",error.message);

        return res.status(500).json({
            message:"Server error"
        });
    }
};

module.exports = {
    createPayment
}