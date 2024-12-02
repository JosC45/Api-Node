const mongoose=require('mongoose')
const Singer=require('./singers');

const musicSchema=new mongoose.Schema({
    nombre:{type:String,required:true},
    singer:[{type: mongoose.Schema.Types.ObjectId, ref:"Singer"}],
    gender:{type:String}
},{strict:false});

const Music=mongoose.model('Music',musicSchema);
module.exports=Music;

