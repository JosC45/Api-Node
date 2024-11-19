const Mongoose=require('mongoose')
const Music=require('./music')
const singerSchema=new Mongoose.Schema({
    name:{type:String,required:true},
    nacionality:{type:String},
    themes:[{type:Mongoose.Schema.Types.ObjectId, ref:"Music"}]
},{strict:false})

const Singer=Mongoose.model("Singer",singerSchema)

module.exports=Singer;