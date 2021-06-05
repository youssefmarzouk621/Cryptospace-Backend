const express = require('express')
const connectDB = require('./dB/connection.js')
const app = express();

connectDB();
const XHR = require('xhr2-cookies').XMLHttpRequest
XHR.prototype._onHttpRequestError = function (request, error) {
  if (this._request !== request) {
      return;
  }
  // A new line
  console.log(error, 'request')
  this._setError();
  request.abort();
  this._setReadyState(XHR.DONE);
  this._dispatchProgress('error');
  this._dispatchProgress('loadend');
};
app.use(express.json({ extended: false }));

app.use('/uploads', express.static(__dirname + '/public'));

app.use('/api/users',require('./Controllers/usersController'))
app.use('/api/token',require('./Controllers/tokenController'))

app.use('/api/products',require('./Controllers/productsController'))
app.use('/api/categories',require('./Controllers/categoryController'))
app.use('/api/brands',require('./Controllers/brandsController'))


app.listen(process.env.PORT || 3000)