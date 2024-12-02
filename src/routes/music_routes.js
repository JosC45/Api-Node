const {postSinger}=require("../controllers/musiccontroller")
const bodyParser = require("../middlewares/bodyparser")
const authvalidation=require("../middlewares/jwsvalidation")
const {getSinger}=require("../controllers/musiccontroller")
const {deleteSinger}=require("../controllers/musiccontroller")
const {updateSinger}=require("../controllers/musiccontroller")
const {URL}=require('url')


const routesSinger=(req,res)=>{
    if(req.url==="/sing/save_singer" && req.method==="POST"){
        authvalidation(req,res,()=>{
            bodyParser(req,res,()=>{
                postSinger(req,res)
            })
        })
    }
    else if(req.url==="/sing/get_singers" && req.method==="GET"){
        authvalidation(req,res,()=>{
            getSinger(req,res)
        })
    }
    else if(req.url.startsWith("/sing/delete_singer") && req.method==="DELETE"){
        const parsedURL=new URL(req.url,`http://${req.headers.host}`)
        const id=parsedURL.searchParams.get('id');
        console.log('ID recibido:', id);
        if(id){
            authvalidation(req,res,()=>{
                deleteSinger(id,req,res)
            })
        }else{
            res.writeHead(400,{"Content-Type":"application/json"})
            res.end(JSON.stringify({"message":"Id es requerido"}))
        }
    }
    else if(req.url.startsWith("/sing/update_singer") && req.method==="PUT"){
        const parsedURL=new URL(req.url,`http://${req.headers.host}`)
        const id=parsedURL.searchParams.get('id');
        console.log('ID Recibido:',id);
        if(id){
            authvalidation(req,res,()=>{
                bodyParser(req,res,()=>{
                    updateSinger(id,req,res)
                })
            })
        }
    }
    
    else{
        res.writeHead(404,{"Content-Type":"application/json"})
        return res.end(JSON.stringify({message:"This routs doesn't exists"}))
    }
    console.log('Ruta recibida:', req.url);

}

module.exports=routesSinger