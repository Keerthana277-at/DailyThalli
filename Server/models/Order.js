const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },

    items:[
        {
            menuItem:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Menu",
                required:true
            },

            quantity:{
                type:Number,
                required:true,
                min:1
            },

            price:{
                type:Number,
                required:true
            },

            total:{
                type:Number,
                required:true
            }
        }
    ],

    totalAmount:{
        type:Number,
        required:true,
        default:0
    },

    paidAmount:{
        type:Number,
        default:0
    },

    dueAmount:{
        type:Number,
        default:0
    },

    paymentStatus:{
        type:String,
        enum:["Pending","Partial","Paid"],
        default:"Pending"
    },

    orderStatus:{
        type:String,
        enum:["Pending","Preparing","Completed","Cancelled"],
        default:"Pending"
    }
},
{
    timestamps:true
});

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;