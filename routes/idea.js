const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const idea = require('../models/ideas.model.js');
const {ensureAuthenticated} = require('../helpers/auth');

/*   Add ideas  */
router.get('/add',ensureAuthenticated,(req,res)=>{
	res.render('./ideas/add');
});
// edit ideas
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
	idea.findOne({
		_id:req.params.id 
	}).then(ideaa=>{
		res.render('ideas/edit',{
			ideaa:ideaa
		})
	});
});
// put ideas
router.put('/:id',ensureAuthenticated,(req,res)=>{
	idea.findOne({
		_id: req.params.id
	}).then((ideaa)=>{
		ideaa.title = req.body.title;
		ideaa.details = req.body.details;
		ideaa.save().then(ideaa=>{
			res.redirect('/ideas');
		})
	});
});
// delete ideas
router.delete('/:id',ensureAuthenticated,(req,res)=>{
	idea.remove({
		_id: req.params.id
	}).then(()=>{
		req.flash('success_msg','Video idea removed');
		res.redirect('/ideas');
	});
});
/*posting ideas*/
router.post('/',ensureAuthenticated,(req,res)=>{
	let err = [];
	if(!req.body.title){
		err.push({text:'Please enter the title'});
	}
	if(!req.body.details){
		err.push({text:'Please enter the details'});
	}
	if(err.length>0){
		res.render('ideas/add',{
			title:req.body.title,
			details:req.body.details,
			err:err
		});
	}else{
		var newIdea = {
			title:req.body.title,
			details:req.body.details,
			user:req.user.id
		}
		new idea(newIdea).save().then(()=>{
			req.flash('success_msg','new Idea Added');
			res.redirect('/ideas');
		}).catch((err)=>{
			console.log(err);
		})
	}

});
router.get('/',ensureAuthenticated,(req,res)=>{
	idea.find({user:req.user.id}).sort({date:-1})
	.then((ideas)=>{
		res.render('ideas/index',{
			ideas:ideas
		});
	})
})


module.exports = router;