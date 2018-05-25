const express = require('express');
const exhbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const bodyparser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
/* mongoose connection */
mongoose.Promise = global.Promise;
const dbURI = require('./helpers/database');
mongoose.connect(dbURI)
.then(()=>{
	console.log('connected to the database');
}).catch(err=>{
	console.log(err);
});

// passport config
const pass = require('./passport/passport');
pass(passport);
// ROUTES 
const ideas = require('./routes/idea');
const users = require('./routes/users');
/* */


const app = express();

app.engine('handlebars',exhbs({
	defaultLayout: 'main'
}));

app.set('view engine','handlebars');

app.use(express.static(path.join( __dirname,'public')));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(methodOverride('_method'));
app.use(session({
	secret:'secret',
	resave:true,
	saveUninitialized: true
}));
app.use(flash());
// passport middlewares
app.use(passport.initialize());
app.use(passport.session());
//global variables
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user;
	next();
});
/* */
app.get('/',(req,res)=>{
	res.render('index');
});
app.get('/about',(req,res)=>{
	res.render('about');
});

app.use('/ideas',ideas);
app.use('/user',users);


var port = process.env.PORT||3000;
app.listen(port,()=>{
	console.log('listening to port '+port);
})