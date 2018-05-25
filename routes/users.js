const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const user = require('../models/user.model.js');

router.get('/login',(req,res)=>{
	res.render('users/login');
});
router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('success_msg','You are logged out');
	res.redirect('/user/login');
});
router.get('/register',(req,res)=>{
	res.render('users/register');
});

router.post('/login',(req,res,next)=>{
	passport.authenticate('local',{
		successRedirect: '/',
		failureRedirect: '/user/login',
		failureFlash: true
	})(req,res,next);
});
router.post('/register',(req,res)=>{
	let err=[];
	if(req.body.password!==req.body.password2){
		err.push({text:"Confirm password don't match"});
	}
	if(req.body.password.length<=4){
		err.push({text:"Password should be of more than 4 characters"});
	}
	if(err.length!=0){
		res.render('users/register',{
			err:err,
			name:req.body.name,
			email:req.body.email,
			password:req.body.password
		});
	}else{
		user.findOne({email:req.body.email})
		.then(result=>{
			if(result){
				req.flash('error_msg','Email has been registered before');
				res.redirect('/user/register');
			}else{
				var newUser = new user({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
				});
				bcrypt.genSalt(10,(err,salt)=>{
					bcrypt.hash(newUser.password,salt,(err,hash)=>{
						if(err){
							throw err;
						}
						newUser.password = hash;
						newUser.save()
						.then((result)=>{
							req.flash('success_msg','successfully logged in');
							res.redirect('/user/login');
						}).catch(err=>{
							console.log(err);
							return;
						});
					})
				})
			}
		});
		
	}
});
module.exports = router;


