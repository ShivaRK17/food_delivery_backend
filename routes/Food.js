const express = require('express');
const mongoose = require('mongoose');
const router = express.Router()
const Food = mongoose.model('food',new mongoose.Schema({}),'food');
const FoodCategory = mongoose.model('foodCategory',new mongoose.Schema({}),'foodCategory');

router.post('/getFood',async (req,res)=>{
    const food_items = await Food.find();
    res.json(food_items)
})
router.post('/getFoodCat',async (req,res)=>{
    const food_items = await FoodCategory.find();
    res.json(food_items)
})
module.exports = router