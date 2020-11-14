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
// router.get('/', (req, res) => { 
//     artikelModel.find({}, (err, items) => { 
//         if (err) { 
//             console.log(err); 
//         } else { 
//             if (req.user) {
//             	res.render('app', { user:req.user, items: items, layout: "dashboard/admin/layout" }); 
//             }else{
//             	res.redirect('/dashboard');
//             }
//         } 
//     }); 
// }); 

router.post('/add', upload.single('image'), (req, res, next) => { 
  	if (req.user) {
  	var user = req.user;
  	var _idu = user._id; 
		var uid =  req.body.uid;
    var status_user = user.status_user.toLowerCase();
      if (status_user=='admin') {
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
                  res.json({"status":"1", "detail":"Artikel Sukses Ditambahkan"});
              } 
          });
        }else{
          res.json({"status":"0", "detail":"Access denied, UID required."});
        } 
      }else{
        res.json({"status":"0", "detail":"Access denied, No permission Account."});
      }
  	}else{
      res.json({"status":"0", "detail":"Please login before using this action."});
  	}
    
}); 

router.get('/delete/:id', async function(req, res){
    if (req.user) {
    var user = req.user;
    var _idu = user._id; 
    var uid =  req.body.uid;
    var status_user = user.status_user.toLowerCase();
      if (status_user=='admin') {
        // if (uid == _idu) {
          try{
              const removePost = await artikelModel.remove({_id:req.params.id});
              // res.json(removePost);
              if (removePost.deletedCount==1) {
               res.json({"status":"1", "detail":"Artikel Sukses Dihapus"});
              }else{
               res.json({"status":"0", "detail":"Artikel tidak ada dalam dalam database"});
              }
          }catch(err){
            res.json({"status":"0", "detail":"Unk delete Artikel"});
          }
        // }else{
          // res.json({"status":"0", "detail":"Access denied, UID required."});
        // }
      }else{
        res.json({"status":"0", "detail":"Access denied, No permission Account."});
      }

    }else{
      res.json({"status":"0", "detail":"Please login before using this action."});
    }
  
});

router.post('/update/:id', upload.single('image'),  async function(req, res){
  if (req.user) {
    var user = req.user;
    var _idu = user._id; 
    var uid =  req.body.uid;
    var status_user = user.status_user.toLowerCase();
      if (status_user=='admin') {
        if (uid == _idu) {
          try{
            const data = await artikelModel.find({"_id":req.params.id});
            var _idu = req.body.uid; 
            if (typeof req.file === "undefined") {
              var obj = { 
                uid: _idu, 
                judul: req.body.judul, 
                isi: req.body.isi
              }
            }else{
              var obj = { 
                uid: _idu, 
                judul: req.body.judul, 
                isi: req.body.isi, 
                img: { 
                    data: fs.readFileSync(path.join('public/uploads/' + req.file.filename)), 
                    contentType: 'image/png'
                } 
              }
            }
            const updateKbm = await artikelModel.updateOne({_id:req.params.id}, {$set:obj});
            if (updateKbm.n==1) {
              res.json({"status":"1", "detail":"Artikel Sukses Di Perbaharui"});
            }else{
              res.json({"status":"0", "detail":"Artikel Gagal Diperbaharui"});
            }

          }catch(err){
            // res.end('ga ada');
            res.json({"status":"1", "detail":"Artikel tidak ada di database"});
          }
        
        }else{
          res.json({"status":"0", "detail":"Access denied, UID required."});
        }
      }else{
        res.json({"status":"0", "detail":"Access denied, No permission Account."});
      }
  }else{
    res.json({"status":"0", "detail":"Please login before using this action."});
  }
  
});
module.exports = router;