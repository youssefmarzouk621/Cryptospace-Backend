require('dotenv').config()

const express = require('express');

path = require('path');
const Product = require('../Models/Product').ProductModel

const route = express.Router();


//show products list
const index = (req,res,next)  => {
	Product.find().select({'description':0,'brand':0,'createdAt':0,'updatedAt':0,'__v':0})
	//.populate('municipalite',{"gouvernorat": 0}) //eviter l'affichage cerculaire
    .populate('category',{"products": 0,"brands": 0})
	.populate('brand',{"category": 0,"products": 0})
	.then(products  => {
		filteredProducts = [];
		for (let i = 0; i < products.length; i++) {
			filteredProducts.push({
				"_id": products[i]._id,
				"title": products[i].title,
				"price": products[i].price,
				"vaultPrice": products[i].vaultPrice,
				"hexColor": products[i].hexColor,
				"image" :products[i].image,
				"category":products[i].category.title
			});
		}
		res.json(filteredProducts);
		
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying products"
		})
	})
}


//add Ministere
const addProduct = (req,res,next) => {
	let product = new Product({
        title:req.body.title,
        description:req.body.description,
        price:req.body.price,
        vaultPrice:req.body.vaultPrice,
        hexColor:req.body.hexColor,
        image:req.body.image,
        category:req.body.category,
		brand:req.body.brand,
	})
	product.save()
	.then(response => {
		res.json({
			message:"product Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding product"
		})
	})
}

//show products list
const getById = (req,res,next)  => {
	Product.findOne({'_id': req.body.productId})
	//.select({'description':0,'category':0,'brand':0,'createdAt':0,'updatedAt':0,'__v':0})
	//.populate('municipalite',{"gouvernorat": 0}) //eviter l'affichage cerculaire
    .populate('category',{"products": 0,"brands": 0})
	.populate('brand',{"category": 0,"products": 0})
	.then(product  => {
		
		res.json(			{
			"_id": product._id,
			"title": product.title,
			"price": product.price,
			"vaultPrice": product.vaultPrice,
			"hexColor": product.hexColor,
			"description":product.description,
			"image" :product.image,
			"category":product.category.title
		});
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying products"
		})
	})
}



const getCategories = (req,res,next)  => {
	Product.find().select({'description':0,'brand':0,'createdAt':0,'updatedAt':0,'__v':0})
	//.populate('municipalite',{"gouvernorat": 0}) //eviter l'affichage cerculaire
    .populate('category',{"products": 0,"brands": 0})
	.populate('brand',{"category": 0,"products": 0})
	.then(products  => {
		filteredCategories = [];
		for( var i=0 ; i <products.length; i++ ) {
			if(!filteredCategories.includes(products[i].category.title)){
			  	filteredCategories.push(products[i].category.title);
			}
		  }
		res.json(filteredCategories);
		
	})
	.catch(error  =>{
		console.log(error)
		res.json({
			message: "an error occured when displaying products"
		})
	})
}








route.post('/add',addProduct)
route.post('/id',getById)
route.get('/',index)
route.get('/getCategories',getCategories)

module.exports = route;