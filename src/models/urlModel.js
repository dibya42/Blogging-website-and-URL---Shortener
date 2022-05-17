const mongoose=require('mongoose')
const urlModle=new mongoose.Schema({
    urlCode:{required:true,unique:true,lowercase:true,trim:true },
    longUrl:{required:true,unique:true}
})
module.exports=mongoose.model('url',urlModle)