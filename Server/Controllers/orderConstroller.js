const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Menu = require("../models/Menu");
const Payment = require("../models/Payment");

const createOrder = async (req, res) => {
    try {
        const { customer, items,paidAmount } = req.body;

        // Find the customer selected by the admin
        const existingCustomer = await Customer.findById(customer);

        if (!existingCustomer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order must contain at least one menu item"
            });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            if (
                !item.menuItem ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    message: "Each item must have a menu ID and a valid quantity"
                });
            }

            const menuItem = await Menu.findById(item.menuItem);

            if (!menuItem) {
                return res.status(404).json({
                    message: "Menu item not found"
                });
            }

            if (!menuItem.available) {
                return res.status(400).json({
                    message: `${menuItem.name} is currently unavailable`
                });
            }

            const total = menuItem.price * item.quantity;

            orderItems.push({
                menuItem: menuItem._id,
                quantity: item.quantity,
                price: menuItem.price,
                total
            });

            totalAmount += total;
        }

        // Customer orders start unpaid
       const paid = Number(paidAmount || 0);

        if (!Number.isFinite(paid) || paid < 0) {
            return res.status(400).json({
                message: "Paid amount must be a valid non-negative number"
            });
        }

        if (paid > totalAmount) {
            return res.status(400).json({
                message: "Paid amount cannot exceed the total amount"
            });
        }

        const dueAmount = totalAmount - paid;

        const paymentStatus =
            paid === 0
                ? "Pending"
                : dueAmount === 0
                    ? "Paid"
                    : "Partial";

        const order = new Order({
            customer: existingCustomer._id,
            items: orderItems,
            totalAmount,
            paidAmount: paid,
            dueAmount,
            paymentStatus,
            orderStatus: "Pending"
        });

        const savedOrder = await order.save();

        await savedOrder.populate("customer", "name phone department");
        await savedOrder.populate("items.menuItem", "name price");

        existingCustomer.totalOrders += 1;
        existingCustomer.dueAmount += dueAmount;
        await existingCustomer.save();

        return res.status(201).json({
            message: "Order placed successfully",
            order: savedOrder
        });
    } catch (error) {
        console.error("Create order error:", error.message);

        return res.status(500).json({
            message: "Unable to place order"
        });
    }
};

const getOrders = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === "customer") {
            const customer = await Customer.findOne({
                user: req.user.id
            });

            if (!customer) {
                return res.status(404).json({
                    message: "Customer profile not found"
                });
            }

            filter.customer = customer._id;
        } else if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const orders = await Order.find(filter)
            .populate("customer", "name phone department")
            .populate("items.menuItem", "name price")
            .sort({ createdAt: -1 });

        return res.status(200).json({ orders });
    } catch (error) {
        console.error("Get orders error:", error.message);

        return res.status(500).json({
            message: "Unable to fetch orders"
        });
    }
};
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customer", "name phone department")
            .populate("items.menuItem", "name price");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (req.user.role === "customer") {
            const customer = await Customer.findOne({
                user: req.user.id
            });

            if (
                !customer ||
                order.customer._id.toString() !== customer._id.toString()
            ) {
                return res.status(403).json({
                    message: "You cannot access this order"
                });
            }
        } else if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        return res.status(200).json({ order });
    } catch (error) {
        console.error("Get order error:", error.message);

        return res.status(500).json({
            message: "Unable to fetch order"
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


const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Check whether this order has recorded payments
        const existingPayments = await Payment.find({
            order: order._id
        });

        console.log("Order ID being deleted:", order._id);
        console.log("Existing payments:", existingPayments);

        if (existingPayments.length > 0) {
            return res.status(400).json({
                message: "This order has payment records. Please handle its payment history before deleting it."
            });
        }

        // Update the customer's account before deleting the order
        const customer = await Customer.findById(order.customer);

        if (customer) {
            customer.dueAmount = Math.max(
                0,
                customer.dueAmount - order.dueAmount
            );

            customer.totalOrders = Math.max(
                0,
                customer.totalOrders - 1
            );

            await customer.save();
        }

        await Order.findByIdAndDelete(order._id);

        return res.status(200).json({
            message: "Order deleted successfully"
        });

    } catch (error) {
        console.log("Delete order error:", error.message);

        return res.status(500).json({
            message: "Server error"
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