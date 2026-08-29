const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },

    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },

    amount:{
        type:Number,
        required:true,
        min:1
    },

    paymentMethod:{
        type:String,
        enum:["Cash","UPI","Card"],
        required:true
    }
},
{
    timestamps:true
});

const Payment = mongoose.model("Payment",paymentSchema);

module.exports = Payment;