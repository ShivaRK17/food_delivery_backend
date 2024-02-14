const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    totalPrice:Number,
    order_data:{
        type:[{
            id:mongoose.Schema.Types.ObjectId,
            name:String,
            price:Number,
            qty:Number,
            size:String
        }],
        required:true,
    },
    ordered_at:{
        type:Date,
        default:Date.now,
        required:true
    }
})

const Order = mongoose.model("Order",OrderSchema);
module.exports = Order;