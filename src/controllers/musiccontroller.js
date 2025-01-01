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
            const newMusic= new Music({nombre:theme,singer:id_singer});
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

const postMusic = async(req,res) =>{
    try{
        const {nombre,singer,gender, ...additionalsFields }=req.body;
        if(!nombre||!gender||!Array.isArray(singer)){
            res.writeHead(400,{"Content-Type":"application/json"})
            return res.end(JSON.stringify({message:"Esos campos son obligatorios"}))
        }
        const existingMusic=await Music.findOne({nombre:nombre})
        if (existingMusic){
            res.writeHead(400,{"Content-Type":"application/json"})
            return res.end(JSON.stringify({message:"Ya existe la musica"}))
        }

        procesedSinger=[]

        for (const singe of singer) {
            const searchSinger = await Singer.findOne({ name:singe }); // Busca el tema en la colección Music
            if (searchSinger) {
                console.log(`Cantante encontrado: ${singe}, ID: ${searchSinger._id}`);
                procesedSinger.push(searchSinger._id); // Si existe, usa su ObjectId
            } else {
                console.log(`Cantante no encontrado, agregando como string: ${singe}`);
                procesedSinger.push(singe); // Si no existe, almacénalo como string
            }
        }
        try{
        const newMusic=new Music({nombre:nombre,singer:procesedSinger,gender:gender,...additionalsFields});
        console.log(newMusic);
        await newMusic.save();
        res.writeHead(200,{"Content-Type":"application/json"})
        res.end(JSON.stringify({message:"Se guardo correctamente"}))
        }catch(err){
        res.writeHead(400,{"Content-Type":"application/json"})
        return res.end(JSON.stringify({message:"No existen esos artistas"}))
        }
        
    }catch(err){
        console.error(err.message)
        res.writeHead(400,{"Content-type":"application/json"})
        res.end(JSON.stringify({message:"Ocurrio un error"}))
    }    
}

const getMusic = async(req,res,id)=>{
    if(id){
        try{
            const idSelection=await Music.findById(id);
            res.writeHead(200,{"Content-Type":"application/json"})
            return res.end(JSON.stringify({idSelection}))
        }catch(err){
            console.log(err.message)
            res.writeHead(401,{"Content-Type":"application/json"})
            return res.end(JSON.stringify({message:"Hubo un error "}))
        }
    }else{
        try{
        const Musica=await Music.find();
        res.writeHead(200,{"Content-Type":"application/json"})
        return res.end(JSON.stringify({message:"Canciones listados",Musica}))
        }catch(err){
            console.log(err.message)
            res.writeHead(401,{"Content-Type":"application/json"})
            return res.end(JSON.stringify({message:"Hubo un error "}))
        }
    }
}

const deleteMusic=async(req,res,id)=>{
    try{
    if(!id){
        res.writeHead(400,{"Content-Type":"application/json"});
        return res.end(JSON.stringify({message:"Es necesario el ID"}))
    }
    try{
        const deletedMusic=await Music.findOneAndDelete({_id:id});
        if (!deletedMusic) {
            res.writeHead(404, { "Content-Type": "application/json" }); // 404 si no se encuentra el documento
            return res.end(JSON.stringify({ message: "No se encontró música con ese ID" }));
        }
        res.writeHead(200,{"Content-Type":"application/json"})
        return res.end(JSON.stringify({message:"Eliminado con exito",deletedMusic}))
    }catch(err){
        res.writeHead(401,{"Content-Type":"application/json"})
        return res.end(JSON.stringify({message:"Se encontro un error"}))
    }
    }catch(err){
        console.error(err.message)
        res.writeHead(500,{"Content-Type":"application/json"})
        return res.end(JSON.stringify({message:"Hubo un error al intenetar deletear"}))
    }

}

    const updateMusic=async(req,res,id)=>{
        try{
            if(!id){
                res.writeHead(400,{"Content-Type":"application/json"})
                return res.end(JSON.stringify({message:"No hay un id"}))
            }
            console.log(req.body)
            let nombre,singer,gender,additionalsFields;
            try{
                ({ nombre, singer, gender, ...additionalsFields }=req.body);
            }catch(err){
                console.error(err.message)
                res.writeHead(400,{"Content-Type":"application/json"})
                return res.end(JSON.stringify({message:"No hay cuerpo del json"}))
            }
            const procesedSingers=[]
            for(const sing of singer){
                console.log(sing)
                const addedSinger=await Singer.findOne({name:sing})
                if(!addedSinger){
                    res.writeHead(400,{"Content-Type":"application/json"})
                    return res.end(JSON.stringify({message:"No esta ese cantante"}))
                }
                procesedSingers.push(addedSinger._id)
            }
            const findedMusic=await Music.findById(id)
            if (!findedMusic) {
                res.writeHead(404, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "Música no encontrada" }));
            }
            // const unsetFields=Object.fromEntries(
            //     Object.keys(findedMusic.toObject()).map(key=>[key,""])
            // );
            // const updatedMusic=await Music.findById(id)
            // updatedMusic.nombre=nombre;
            // updatedMusic.singer=procesedSingers;
            // updatedMusic.gender=gender;
            // updatedMusic.save();
            const updatedMusic=await Music.updateOne(
                {_id:id},
                {
                    $set:{
                        nombre,
                        singer:procesedSingers,
                        gender,
                    ...additionalsFields}
                }    
            );
            if (updatedMusic.modifiedCount === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "No se realizaron cambios" }));
            }
            
            res.writeHead(200,{"Content-type":"application/json"})
            return res.end(JSON.stringify({message:"Actualizado con exito"}))


        }catch(err){
            console.error(err.message)
            res.writeHead(500,{"Content-Type":"application/json"})
            return res.end(JSON.stringify({message:"Error en el servidor"}))
        }
    }

    // const patchMusic = async (req, res, id) => {
    //     try {
    //         // Definir los campos que queremos actualizar
    //         const campos = ['nombre', 'singer', 'gender'];
    //         const cambios = [];
    
    //         // Iterar sobre los campos del cuerpo de la solicitud (req.body)
    //         for (let campo of campos) {
    //             if (req.body[campo]) {  // Si el campo está presente en el cuerpo de la solicitud
    //                 cambios.push({ campo, valor: req.body[campo] });
    //             }
    //         }
    
    //         // Extraer campos adicionales si los hay
    //         let additionalsFields = req.body.additionalsFields || {};  // Si hay campos adicionales
    
    //         // Buscar el documento de música por su ID
    //         const patchMusic = await Music.findById(id);
    //         if (!patchMusic) {
    //             return res.status(404).json({ message: "Música no encontrada" });
    //         }
    
    //         // Actualizar los campos existentes
    //         for (let cambio of cambios) {
    //             patchMusic[cambio.campo] = cambio.valor;
    //         }
    
    //         // Si hay campos adicionales, agregarlos
    //         if (Object.keys(additionalsFields).length > 0) {
    //             patchMusic.set(additionalsFields); // Usamos .set() para agregar nuevos campos dinámicamente
    //         }
    
    //         // Guardar los cambios en la base de datos
    //         await patchMusic.save();
    
    //         // Responder con éxito
    //         res.status(200).json({ message: "Música actualizada con éxito", data: patchMusic });
    //     } catch (err) {
    //         console.error(err.message);
    //         res.status(500).json({ message: "Error en el servidor" });
    //     }
    // };


module.exports = { postSinger, getSinger,updateSinger,deleteSinger,postMusic ,getMusic, deleteMusic , updateMusic,patchMusic};