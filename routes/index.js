const express = require('express');
const router = express.Router();
const artikelModel = require('../models/Artikel');
router.get('/', async function(req, res){
	try{
        const data = await artikelModel.find({});
        artikel = data;
    }catch(err){
        console.log(err);
    }
	
	res.render('home/dashboard',{ artikel:artikel, layout: "home/layout"});
})

module.exports = router;