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
// router.get('/', (req, res) => { 
//     kbmModel.find({}, (err, items) => { 
//         if (err) { 
//         } else { 
//             if (req.user) {
//             	res.render('dashboard/admin/kbm', { user:req.user, items: items, layout: "dashboard/admin/layout" }); 
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
              } else { 
                  res.json({"status":"1", "detail":"Data KBM Sukses Ditambahkan"});
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
              const removePost = await kbmModel.remove({_id:req.params.id});
              // res.json(removePost);
              if (removePost.deletedCount==1) {
               res.json({"status":"1", "detail":"Data KBM Sukses Dihapus"});
              }else{
               res.json({"status":"0", "detail":"Data KBM tidak ada dalam dalam database"});
              }
          }catch(err){
            res.json({"status":"0", "detail":"Unk delete data KBM"});
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
            const data = await kbmModel.find({"_id":req.params.id});
            var _idu = req.body.uid; 
            if (typeof req.file === "undefined") {
              var obj = { 
                uid: _idu, 
                nama: req.body.nama, 
                detail: req.body.detail,
                site: req.body.site 
              }
            }else{
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
            }
            const updateKbm = await kbmModel.updateOne({_id:req.params.id}, {$set:obj});
            if (updateKbm.n==1) {
              res.json({"status":"1", "detail":"Data KBM Sukses Di Perbaharui"});
            }else{
              res.json({"status":"0", "detail":"Data KBM Gagal Diperbaharui"});
            }

          }catch(err){
            // res.end('ga ada');
            res.json({"status":"1", "detail":"Data KBM tidak ada di database"});
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