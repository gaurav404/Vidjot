const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
/*
	http://walidhosseini.com/journal/2014/10/18/passport-local-strategy-auth.html
*/
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
/*
passport.serializeUser(function(user, done) {
    done(null, user.id);
                 |
});              | 
                 |
                 |____________________> saved to session req.session.passport.user = {id:'..'}
                                   |
                                  \|/           
passport.deserializeUser(function(id, done) {
                   ________________|
                   |
                  \|/ 
    User.findById(id, function(err, user) {
        done(err, user);
                   |______________>user object attaches to the request as req.user

 });
  });
*/