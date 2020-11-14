const express = require('express');
const router = express.Router();
const artikelModel = require('../models/Artikel');
const kbmModel = require('../models/modelKBM');
router.get('/', async function(req, res){
	try{
        const datArtikel = await artikelModel.find({});
        artikel = datArtikel;
    }catch(err){
        console.log(err);
    }

	try{
        const datkbm = await kbmModel.find({});
        kbm = datkbm;
    }catch(err){
        console.log(err);
    }
	
	res.render('home/dashboard',{ artikel:artikel, kbm:kbm, layout: "home/layout"});
})

module.exports = router;