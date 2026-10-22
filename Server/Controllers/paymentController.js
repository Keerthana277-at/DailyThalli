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

           
            if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
                return res.status(400).json({
                    message: "Payment amount must be greater than zero"
                });
            }

            console.log("Payment validation:", {
            amountReceived: amount,
            amountAsNumber: Number(amount),
            outstandingDue: existingOrder.dueAmount
        });


           if (Number(amount) > Number(existingOrder.dueAmount)) {
                return res.status(400).json({
                    message: "Payment cannot exceed the outstanding due amount"
                });
            }


                const payment = new Payment({
                    order,
                    customer:existingOrder.customer,
                    amount:Number(amount),
                    paymentMethod
                });

                const savedPayment = await payment.save();

                await savedPayment.populate("order");
                await savedPayment.populate("customer");


                const paymentAmount = Number(amount);

                existingOrder.paidAmount =
                    Number(existingOrder.paidAmount || 0) + paymentAmount;

                existingOrder.dueAmount =
                    Math.max(0, Number(existingOrder.totalAmount) - existingOrder.paidAmount);

                if (existingOrder.dueAmount === 0) {
                    existingOrder.paymentStatus = "Paid";
                } else {
                    existingOrder.paymentStatus = "Partial";
                }


                await existingOrder.save();

                const customer = await Customer.findById(existingOrder.customer);

                if(customer){
                   customer.dueAmount = Math.max(0, Number(customer.dueAmount || 0) - paymentAmount);


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


const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("order")
            .populate("customer");

        return res.status(200).json({
            message: "Payments fetched successfully",
            payments
        });

    } catch (error) {
        console.log("Get payments error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        const order = await Order.findById(payment.order);

        if (!order) {
            return res.status(404).json({
                message: "Associated order not found. Payment was not deleted."
            });
        }

        const customer = await Customer.findById(payment.customer);

        const paymentAmount = Number(payment.amount);
        const currentPaid = Number(order.paidAmount || 0);
        const totalAmount = Number(order.totalAmount || 0);

        if (paymentAmount > currentPaid) {
            return res.status(400).json({
                message: "Payment amount exceeds the order's recorded paid amount."
            });
        }

        // Reverse the payment's effect on the order.
        order.paidAmount = Math.max(0, currentPaid - paymentAmount);
        order.dueAmount = Math.max(0, totalAmount - order.paidAmount);

        if (order.dueAmount === 0) {
            order.paymentStatus = "Paid";
        } else if (order.paidAmount === 0) {
            order.paymentStatus = "Pending";
        } else {
            order.paymentStatus = "Partial";
        }

        await order.save();

        // Recalculate the customer's outstanding dues.
        if (customer) {
            const customerOrders = await Order.find({
                customer: customer._id
            });

            customer.dueAmount = customerOrders.reduce(
                (total, item) => total + Math.max(0, Number(item.dueAmount || 0)),
                0
            );

            await customer.save();
        }

        await payment.deleteOne();

        return res.status(200).json({
            message: "Payment deleted and balances updated successfully."
        });

    } catch (error) {
        console.error("Delete payment error:", error.message);

        return res.status(500).json({
            message: "Unable to delete payment."
        });
    }
};


module.exports = {
    createPayment,
    getPayments,
    deletePayment
}