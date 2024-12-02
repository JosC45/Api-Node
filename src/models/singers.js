const mongoose=require('mongoose')
const Music=require('./music');

const singerSchema=new mongoose.Schema({
    name:{type:String,required:true},
    nacionality:{type:String},
    themes: [{ type: mongoose.Schema.Types.Mixed}],
});

const Singer=mongoose.model("Singer",singerSchema)

module.exports=Singer;