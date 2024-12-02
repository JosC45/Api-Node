require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authroutes');
const music_routes=require('./routes/music_routes.js')

// Conectar a la base de datos
if (!process.env.MONGO_URI) {
    console.error('La URI de conexión a MongoDB no está definida');
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log('Error al conectar a MongoDB:', err));

// Crear servidor HTTP
const server = http.createServer((req, res) => {
    // Cualquier solicitud que entre pasará por las rutas de autenticación
    if(req.url.startsWith("/users")){
        authRoutes(req, res);
    }
    else if(req.url.startsWith("/sing")){
        music_routes(req,res);
    }
}
);

// Arrancar el servidor en el puerto especificado
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});