const Music = require("../models/music.js")
const Singer = require("../models/singers.js")

const postSinger=async (req,res)=>{
    const {name,nacionality,themes}=req.body
    try{
        const existingSinger= await Singer.findOne({name});
        if(existingSinger){
            res.writeHead(400,{'Content-type':'application/json'});
            return res.end(JSON.stringify({message:'This user already exists'}))
        }
        const procesedthemes=[]
        for (const theme of themes) {
            const searchMusic = await Music.findOne({ theme }); // Busca el tema en la colección Music
            if (searchMusic) {
                console.log(`Tema encontrado: ${theme}, ID: ${searchMusic._id}`);
                procesedthemes.push(searchMusic._id); // Si existe, usa su ObjectId
            } else {
                console.log(`Tema no encontrado, agregando como string: ${theme}`);
                procesedthemes.push(theme); // Si no existe, almacénalo como string
            }
        }
        const newSinger= new Singer({name:name,nacionality:nacionality,themes:procesedthemes});
        await newSinger.save();

        for(const theme of procesedthemes){
            if(typeof theme==="string"){
            const id_singer=await Singer.findOne({themes});
            const newMusic= new Music({name:theme,singer:id_singer})
            await newMusic.save();
            }
        }

        res.writeHead(201,{"Content-type":'application/json'});
        res.end(JSON.stringify({message:"Suscesfully register"}))

    }catch(err){
        console.error("Error al registrar el cantante:", err);
        res.writeHead(500,{"Content-type":"application/json"});
        res.end(JSON.stringify({message:"Error for register singer"}))
    }
}

const getSinger=async (req,res)=>{
    try{
    const Singers=await Singer.find()
    if(Singers){
        res.writeHead(200,{"Content-type":"application/json"});
        res.end(JSON.stringify({message:"Cantantes listados",Singers}))
    }else{
        res.writeHead(400,{"Content-type":"application/json"})
        res.end(JSON.stringify({message:"No se encuentran cantantes"}))
    }}catch(err){
        console.error("Error al obtener los cantantes",err);
        res.writeHead(500,{"Content-type":"application/json"});
        res.end(JSON.stringify({message:"Error al obtener los cantantes"}))
    }
};

const deleteSinger=async(id,req,res)=>{
    try{
        if (!id) {
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(JSON.stringify({message:"Id es necesario"}))
        }
        const sing_delete=await Singer.deleteOne({_id:id})  
        if(sing_delete.deletedCount===0){
            res.writeHead(400, {"Content-Type": "application/json"})
            res.end(JSON.stringify({message:"No se encuentra"}))
        }
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify({message:"Se borro con exito"}))
    }catch(err){
        res.writeHead(400,{"Content-type":"application/json"})
        res.end(JSON.stringify({message:"Error interno en el servidor",err}))
    }
}
const updateSinger=async(id,req,res)=>{
    if(!id){
        res.writeHead(400,{"Content-Type":"application/json"})
        return res.end(JSON.stringify({message:"The ID is necessary"}))
    }
    const {name,nacionality,themes}=req.body
    if (!name || !nacionality || !Array.isArray(themes)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ 
            message: "Los campos name, nacionality y themes son obligatorios y themes debe ser un arreglo" 
        }));
    }
    const updatedSinger=await Singer.findById(id)
    if (!updatedSinger){
        res.writeHead(400,{"Content-Type":"application/json"})
        res.end(JSON.stringify({message:"No se encontro con ese ID"}))
    }
    try{
        updatedSinger.name=name
        updatedSinger.nacionality=nacionality
        updatedSinger.themes=themes
        await updatedSinger.save()
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(JSON.stringify({message:"Se actualzio correctamente"}))
    }catch(err){
        console.log(err.message)
        res.writeHead(500,{"Content-Type":"application/json"})
        res.end(JSON.stringify({message:"Ocurrio un error"}))
    }
    
}


module.exports = { postSinger, getSinger,updateSinger,deleteSinger};