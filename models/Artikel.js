var mongoose = require('mongoose'); 
  
var imageSchema = new mongoose.Schema({ 
    judul:{
        type:String,
        required:true
    },
    isi:{
        type:String,
        required:true
    },
    img: 
    { 
        data: Buffer, 
        contentType: String 
    },
    uid:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    } 
}); 
  
  
module.exports = new mongoose.model('artikel', imageSchema); 