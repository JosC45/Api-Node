const { register, login } = require('../controllers/authcontrollers');
const bodyParser = require('../middlewares/bodyparser');
const authMiddleware = require('../middlewares/jwsvalidation');

const authRoutes = (req, res) => {
    // Ruta para registro de usuario (requiere el middleware bodyParser)
    if (req.url === '/register' && req.method === 'POST') {
        bodyParser(req, res, () => {
            register(req, res);
        });
    }
    
    // Ruta para login de usuario (requiere el middleware bodyParser)
    else if (req.url === '/login' && req.method === 'POST') {
        bodyParser(req, res, () => {
            login(req, res);
        });
    }
    
    // Ruta protegida (requiere autenticación)
    else if (req.url === '/protected' && req.method === 'GET') {
        authMiddleware(req, res, () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Acceso autorizado', user: req.user }));
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Ruta no encontrada' }));
    }
};

const crudRoutes=(req,res)=>{
    if(req.url==="/listar" && req.method==="GET"){
        bodyParser(req,res,()=>{
            
        });
    }
    if(req.url==="/agregar" && req.method==="POST"){
        bodyParser(req,res,()=>{
            
        });
    }
    if(req.url==="/editar" && req.method==="POST"){
        bodyParser(req,res,()=>{
            
        });
    }
    if(req.url==="/eliminar" && req.method=="POST"){

    }
    else{
        res.writeHead(401,{'Content-type':'application/json'})
        res.end(JSON.stringify)
    }
}

module.exports = authRoutes;