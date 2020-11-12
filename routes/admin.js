const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
	// res.end('hmmm');
	if (req.user) {
		var user = req.user;
		var status_user = user.status_user.toLowerCase();
		if (status_user=='admin') {
			res.render('dashboard/admin/index', {
	        user: req.user
	      });
		}else{
			res.redirect('../dashboard');
		}
		
	}else{
		res.redirect('../dashboard');
	}
});
module.exports = router;