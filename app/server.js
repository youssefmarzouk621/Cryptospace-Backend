const express = require('express')
const connectDB = require('./dB/connection.js')
const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use('/uploads', express.static(__dirname + '/public'));

app.use('/api/users',require('./Controllers/usersController'))
app.use('/api/token',require('./Controllers/tokenController'))

app.use('/api/products',require('./Controllers/productsController'))
app.use('/api/categories',require('./Controllers/categoryController'))
app.use('/api/brands',require('./Controllers/brandsController'))


app.listen(process.env.PORT || 3000)