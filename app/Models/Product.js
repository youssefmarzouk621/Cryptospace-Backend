const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },  
  price: {
    type: Number
  },
  vaultPrice: {
    type: Number
  },
  hexColor: {
    type: String
  },
  image: {
    type: String
  },           
  category: {
    type: Schema.ObjectId,
    ref: 'categories'
  },
  brand: {
    type: Schema.ObjectId,
    ref: 'brands'
  }
},{timestamps:true})

const Product = mongoose.model('products', product);
module.exports = {
    ProductModel : Product,
    ProductSchema : product
}