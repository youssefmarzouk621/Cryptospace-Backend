const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = require('./Product').ProductSchema; 
const Brand = require('./Brand').BrandSchema; 

const category = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  products:[Product],
  brands:[Brand],
},{timestamps:true})

const Category = mongoose.model('categories', category);
module.exports = {
    CategoryModel : Category,
    CategorySchema : category
}