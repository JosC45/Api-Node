const {postSinger}=require("../controllers/musiccontroller")
const {postMusic}=require("../controllers/musiccontroller")
const {getMusic}=require("../controllers/musiccontroller")
const {deleteMusic}=require("../controllers/musiccontroller")
const {updateMusic}=require("../controllers/musiccontroller")
const {patchMusic}=require("../controllers/musiccontroller")
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
    else if(req.url==="/sing/postMusic" && req.method==="POST"){
        authvalidation(req,res,()=>{
            bodyParser(req,res,()=>{
                postMusic(req,res)
            })
        })
    }
    else if(req.url.startsWith("/sing/getMusic") && req.method==="GET"){
        const parsedURL=new URL(req.url,`http://${req.headers.host}`)
        const id=parsedURL.searchParams.get('id');
        console.log("ID recibido:",id)
        if(id){
            authvalidation(req,res,()=>{
                
                    getMusic(req,res,id)
                
            })
        }else{
            authvalidation(req,res,()=>{
                
                    getMusic(req,res)
                
            })
        }

    }

    else if(req.url.startsWith("/sing/deleteMusic") && req.method==="DELETE"){
        const parsedUrl=new URL(req.url,`http://${req.headers.host}`)
        const id=parsedUrl.searchParams.get('id');
        authvalidation(req,res,()=>{
            deleteMusic(req,res,id)
        })
    }
    else if(req.url.startsWith("/sing/putMusic") && req.method==="PUT"){
        const parsedUrl=new URL(req.url,`http://${req.headers.host}`)
        const id=parsedUrl.searchParams.get('id');
        authvalidation(req,res,()=>{
            bodyParser(req,res,()=>{
                updateMusic(req,res,id)
            })
        })
    }
    // else if(req.url.startsWith("/sing/patchMusic") && req.method==="PATCH"){
    //     const parsedURL=new URL(req.url,`https://${req.headers.host}`)
    //     const id=parsedURL.searchParams.get('id');
    //     authvalidation(req,res,()=>{
    //         bodyParser(req,res,()=>{
    //             patchMusic(req,res,id)
    //         })
    //     })
    // }
    
    else{
        res.writeHead(404,{"Content-Type":"application/json"})
        return res.end(JSON.stringify({message:"This routs doesn't exists"}))
    }
    console.log('Ruta recibida:', req.url);

}

module.exports=routesSinger