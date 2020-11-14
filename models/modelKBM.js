var mongoose = require('mongoose'); 
  
var xkasd = new mongoose.Schema({ 
    nama:{
        type:String,
        required:true
    },
    detail:{
        type:String,
        required:true
    },
    img: 
    { 
        data: Buffer, 
        contentType: String 
    },
    site:{
        type:String,
        required:false
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
  
  
module.exports = new mongoose.model('kbm', xkasd); 