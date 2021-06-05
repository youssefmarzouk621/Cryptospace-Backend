require('dotenv').config()

const express = require('express');

path = require('path');
const Category = require('../Models/Category').CategoryModel

const route = express.Router();


//show Categories list
const index = (req,res,next)  => {
	Category.find()
	.then(categories  => {
		res.json(categories)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying categories"
		})
	})
}


//add Category
const addCategory = (req,res,next) => {
	let category = new Category({
        title:req.body.title,
        description:req.body.description,
        image:req.body.image,
        products:[],
        brands:[],
	})
	category.save()
	.then(response => {
		res.json({
			message:"category Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding category"
		})
	})
}









route.post('/add',addCategory)
route.get('/',index)

module.exports = route;