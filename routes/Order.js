const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')

router.post('/createOrder',fetchUser,async (req,res)=>{
    try {
        const userId = req.user.id;
        const {totalPrice,orderData} = req.body;
        let desiredKeys = ['id','name','price','qty','size'];
        let filteredArray = orderData.filter((e)=>{
            return desiredKeys.reduce((acc,key)=>{
                acc[key] = e[key];
                return acc;
            },{})
        })
        // console.log(filteredArray);
        const Orderbody = new Order({
            user:userId,
            totalPrice,
            order_data:filteredArray
        })
        // console.log(Orderbody);
        await Orderbody.save();
        res.json(Orderbody);
    } catch (err) {
        console.log(err);
    }
})

router.post('/getOrders/:id',async (req,res)=>{
    try {
        const userId = req.params.id;
        const orderData = await Order.find({user:userId}).sort({ordered_at:-1});
        res.json(orderData);
    } catch (error) {
        console.log(error);
    }
    
})

router.post('/getOrders',async (req,res)=>{
    try {
        const allOrders = await Order.find();
        res.json(allOrders)
    } catch (error) {
        console.log(error);
    }
})

module.exports = router