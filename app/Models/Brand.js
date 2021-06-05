const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = require('./Product').ProductSchema; 

const brand = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },  
  image: {
    type: String
  },           
  category: {
    type: Schema.ObjectId,
    ref: 'categories'
  },
  products:[Product]
},{timestamps:true})

const Brand = mongoose.model('brands', brand);
module.exports = {
    BrandModel : Brand,
    BrandSchema : brand
}