const express = require('express');
const router = express.Router();
const artikelModel = require('../models/Artikel');
var fs = require('fs'); 
var path = require('path'); 
var multer = require('multer'); 


router.get('/:judul', function(req, res){
    var judul = req.params.judul.replace(/\s\s+/g, ' ');
    if (/\s/.test(judul)) {
        res.redirect(judul.replace(/\s/g, '+'));
    }else{
        if (judul.match(/\+\++/g)) {
            res.redirect(judul.replace(/\+\++/g, '+'));
        }else{
            judul = judul.replace(/\+/g, ' ');
            res.end(judul);
        }
    }
});

var storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'public/uploads') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now()) 
    } 
}); 
  
var upload = multer({ storage: storage }); 
router.get('/', (req, res) => { 
    artikelModel.find({}, (err, items) => { 
        if (err) { 
            console.log(err); 
        } else { 
            if (req.user) {
            	res.render('app', { user:req.user, items: items, layout: "dashboard/admin/layout" }); 
            }else{
            	res.end('hmmmm');
            }
        } 
    }); 
}); 

router.post('/', upload.single('image'), (req, res, next) => { 
  	if (req.user) {
  	var user = req.user;
  	var _idu = user._id; 
		var uid =  req.body.uid;
  		if (uid == _idu) {
  			var obj = { 
		        uid: _idu, 
		        judul: req.body.judul, 
		        isi: req.body.isi, 
		        img: { 
		            data: fs.readFileSync(path.join('public/uploads/' + req.file.filename)), 
		            contentType: 'image/png'
		        } 
		    } 
		    artikelModel.create(obj, (err, item) => { 
		        if (err) { 
		            console.log(err); 
		        } else { 
		            // item.save(); 
		            res.redirect('/image'); 
		        } 
		    });
  		}else{
  			res.end('fail');
  		}	
  	}else{
  		res.end('Permission not found')
  	}
    
}); 
module.exports = router;