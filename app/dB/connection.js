const mongoose = require('mongoose');

const URI ="mongodb+srv://dbYoussef:TCYvRcsjNcpcVZZz@cluster0.98vmi.mongodb.net/db_cryptospace?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;