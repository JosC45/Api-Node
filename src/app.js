require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authroutes');

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log('Error al conectar a MongoDB:', err));

// Crear servidor HTTP
const server = http.createServer((req, res) => {
    // Cualquier solicitud que entre pasará por las rutas de autenticación
    authRoutes(req, res);
});

// Arrancar el servidor en el puerto especificado
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});