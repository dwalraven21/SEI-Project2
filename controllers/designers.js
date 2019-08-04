const bcrypt = require('bcrypt')
const express = require('express')
const designers = express.Router()
const Mockup = require('../models/mockups.js')
const User = require('../models/users.js')
const seed = require('../models/seed.js')

designers.get('/seed', (req, res) => {
	Mockup.create(seed, (err, data) => {
		res.redirect('/designers')
	})
})

designers.get('/new', (req, res) => {
    res.render('new.ejs', {
		currentUser: req.session.currentUser,
	});
});

designers.post('/', (req, res) => {
	console.log(req.body);
	Mockup.create(req.body, () => {
		res.redirect('/designers');
	})
})

designers.get('/', (req, res) => {
    Mockup.find({}, (error, allMockups) => {
		console.log(allMockups);
		if(req.session.currentUser){
	        res.render('index.ejs', {
			mockups: allMockups,
			currentUser: req.session.currentUser,
	    })
		} else {
	        res.redirect('/sessions/new');
	    }
    })
});

designers.get('/:id/show', (req, res)=>{
    Mockup.findById(req.params.id, (err, foundMockup)=>{
        res.render('show.ejs', {
            mockup: foundMockup,
			currentUser: req.session.currentUser,
        });
    });
});

designers.delete('/:id', (req, res)=>{
    Mockup.findByIdAndRemove(req.params.id, (err, data)=>{
        res.redirect('/designers')
    });
});

designers.get('/:id/edit', (req, res)=>{
    Mockup.findById(req.params.id, (err, foundMockup)=>{
        res.render(
    		'edit.ejs',
    		{
    			mockup: foundMockup,
				currentUser: req.session.currentUser
    		}
    	);
    });
});


designers.put('/:id', (req, res)=>{
	if (req.body.built === "on") {
		req.body.built = true
	} else {
		req.body.built = false
	}
	if (req.body.selected === "on") {
		req.body.selected = true
	} else {
		req.body.selected = false
	}
	console.log(req.body);
    //{new: true} tells mongoose to send the updated model into the callback
    Mockup.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedModel)=>{
        res.redirect('/designers');
    });
});

module.exports = designers
