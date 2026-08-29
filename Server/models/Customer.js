const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    phone:{
        type:String,
        required:true
    },

    department:{
        type:String,
        required:true
    },

    regular:{
        type:Boolean,
        default:false
    },

    dueAmount:{
        type:Number,
        default:0
    },

    totalOrders:{
        type:Number,
        default:0
    },
    
},
    {
        timestamps:true
    }
);

const Customer = mongoose.model("Customer",CustomerSchema);

module.exports = Customer;
