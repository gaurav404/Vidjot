const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

module.exports = function(passport){
	passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
		User.findOne({email:email},(err,user)=>{
			if(!user){
				return done(null,false,'User not found');
			}else{
				bcrypt.compare(password,user.password,(err,isMatch)=>{
					if(err){
						throw err;
					}
					if(isMatch){
						return done(null,user);
					}else{
						return done(null,false,'Password not matched');
					}
				});
			}
		});
	}));	
	passport.serializeUser((user,done)=>{
		done(null,user.id);
	});
	passport.deserializeUser((id,done)=>{
		User.findById(id,(err,user)=>{
			done(err,user);
		});
	});
}