const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
	// res.end('hmmm');
	if (req.user) {
		var user = req.user;
		var status_user = user.status_user.toLowerCase();
		if (status_user=='panitia') {
			res.render('dashboard/panitia/index', {
	        user: req.user,
	        layout: "dashboard/panitia/layout"
	      });
		}else{
			res.redirect('../dashboard');
		}
		
	}else{
		res.redirect('../dashboard');
	}
});
module.exports = router;