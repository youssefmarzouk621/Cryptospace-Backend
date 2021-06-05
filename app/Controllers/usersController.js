require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');

const User = require('../Models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

path = require('path');
crypto = require('crypto');

const route = express.Router();

const register = (req,res,next) => {
	bcrypt.hash(req.body.password,10,function(err,hashedPass) {
		
		if (err) {
			console.log('erreur password hash');
			res.json({
				msg: 'erreur password hash'
			})
		}
		var verifemail = req.body.email

		User.findOne({$or: [{email:verifemail}]})
		.then(user => {
			if (user) {//user found
				res.sendStatus(201);
			}else{//no user found
				let user = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					password: hashedPass,
					phone: req.body.phone,
					verified:0
				})
				user.save().then(user =>{
					res.status(200).send(JSON.stringify({
						message:'User Added Successfully!'
					}))
				})
				.catch(error => {
					res.json({
						message: "An error occured when adding user!"
					})
				})
			}//end else
		})//end then 
	})//end hash
}

const login = (req,res,next) => {
	console.log("inside login")
	var email = req.body.email
	var password = req.body.password

	User.findOne({$or: [{email:email},{phone:email}]})
	.then(user => {
		if (user) {
			bcrypt.compare(password,user.password,function(err,result) {
				if (err) {
					res.json({error:err})
				}
				if (result) {
					if (user.verified==0) {//not verified
						res.sendStatus(203)
					} else {//ready to go
                        const hash = { name: user._id }
                        const accessToken = generateAccessToken(hash)

						res.status(200).send(JSON.stringify(
                            {
                            _id:user._id,
                            firstName:user.firstName,
                            lastName:user.lastName,
                            email:user.email,
                            password:user.password,
                            phone:user.phone,
                            accessToken: accessToken
                            })
                        )
					}
				}else{//incorrect password
					res.sendStatus(201)
				}
			})
		}else{//not found
			res.sendStatus(202)
		}
	})
}

const index = (req,res,next)  => {
	User.find().then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying users"
		})
	})
}

const verifyAccount = (req,res,next) => {


	User.findOneAndUpdate({ email: req.body.email },{verified: 1},{useFindAndModify: false})
	.then((user) => {
		const hash = { name: user._id }
		const accessToken = generateAccessToken(hash)

		res.status(200).send(JSON.stringify(
			{
			_id:user._id,
			firstName:user.firstName,
			lastName:user.lastName,
			email:user.email,
			password:user.password,
			phone:user.phone,
			accessToken: accessToken
			})
		)
	})
	.catch(error => {
		res.sendStatus(204)
	})
}






function generateAccessToken(hash) {
    return jwt.sign(hash, process.env.ACCESS_TOKEN_SECRET)
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send(JSON.stringify({msg:"no token in headers"}))
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send(JSON.stringify({msg:"erreur in token"}))
      req.user = user
      next()
    })
}



route.post('/register',register)
route.post('/login',login)
route.post('/verifyAccount',verifyAccount)

route.get('/',authenticateToken,index)

module.exports = route;