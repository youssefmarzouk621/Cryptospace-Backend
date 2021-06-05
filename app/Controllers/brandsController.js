require('dotenv').config()

const express = require('express');

path = require('path');
const Brand = require('../Models/Brand').BrandModel

const route = express.Router();


//show Brands list
const index = (req,res,next)  => {
	Brand.find()
	.then(brands  => {
		res.json(brands)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Brands"
		})
	})
}


//add Brand
const addBrand = (req,res,next) => {
	let brand = new Brand({
        title:req.body.title,
        description:req.body.description,
        image:req.body.image,
        category:req.body.category,
        products:[],
	})
	brand.save()
	.then(response => {
		res.json({
			message:"brand Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding brand"
		})
	})
}









route.post('/add',addBrand)
route.get('/',index)

module.exports = route;