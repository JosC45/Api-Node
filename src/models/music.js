const Mongoose=require('mongoose')
const Singer=require('./singers')
const musicSchema=new Mongoose.schema({
    nombre:{type:String,required:true},
    singer:[{type: Mongoose.Schema.Types.ObjectId, ref:"Singer"}],
    gender:{type:String}
},{strict:false});

const Music=Mongoose.model('Music',musicSchema);
module.exports=Music;

