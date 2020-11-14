const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
	// res.end('hmmm');
	if (req.user) {
		var user = req.user;
		var status_user = user.status_user.toLowerCase();
		if (status_user=='user') {
			res.render('dashboard/user/index', {
	        user: req.user,
	        layout: "dashboard/user/layout"
	      });
		}else{
			res.redirect('../dashboard');
		}
		
	}else{
		res.redirect('../dashboard');
	}
});
module.exports = router;