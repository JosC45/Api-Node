const bodyParser = (req, res, next) => {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString(); // Concatenar los datos del cuerpo
    });

    req.on('end', () => {
        console.log("Cuerpo recibido:", body);
        try {
            req.body = JSON.parse(body); // Parsear el cuerpo como JSON
            console.log("JSON parseado:", req.body);
            next(); // Llamar al siguiente middleware o función de ruta
        } catch (error) {
            // Si hay un error al parsear el cuerpo, devolver un error de respuesta
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Cuerpo no válido: Debe ser JSON", error: error.message }));
        }
    });

    req.on('error', (err) => {
        // Manejo de errores de flujo de datos
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Error al leer el cuerpo", error: err.message }));
    });
};

module.exports = bodyParser;