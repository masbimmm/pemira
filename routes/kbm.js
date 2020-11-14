const express = require('express');
const router = express.Router();
const kbmModel = require('../models/modelKBM');
var fs = require('fs'); 
var path = require('path'); 
var multer = require('multer'); 

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
    kbmModel.find({}, (err, items) => { 
        if (err) { 
            console.log(err); 
        } else { 
            if (req.user) {
            	res.render('dashboard/admin/kbm', { user:req.user, items: items, layout: "dashboard/admin/layout" }); 
            }else{
            	res.redirect('/dashboard');
            }
        } 
    }); 
}); 

router.post('/', upload.single('image'), (req, res, next) => { 
  	if (req.user) {
  	var user = req.user;
  	var _idu = user._id; 
		var uid =  req.body.uid;
    var status_user = user.status_user.toLowerCase();
      if (status_user=='admin') {
        if (uid == _idu) {
          var obj = { 
              uid: _idu, 
              nama: req.body.nama, 
              detail: req.body.detail,
              site: req.body.site, 
              img: { 
                  data: fs.readFileSync(path.join('public/uploads/' + req.file.filename)), 
                  contentType: 'image/png'
              } 
          } 
          kbmModel.create(obj, (err, item) => { 
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
        res.end('no permission');
      }
  	}else{
  		res.redirect('/dashboard')
  	}
    
}); 
module.exports = router;