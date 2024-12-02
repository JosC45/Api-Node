const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(req.headers)
    if (!token) {
        
        res.writeHead(403, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({message: "Se requiere un token de autenticación" }));
    }

    const tokenWithoutBearer = token.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
 // Llamamos a next() para pasar al siguiente middleware o ruta
    } catch (error) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: "Token no válido" }));
    }
};

module.exports = authMiddleware;