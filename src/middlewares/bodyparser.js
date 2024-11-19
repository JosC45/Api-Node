const bodyParser = (req, res, next) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            req.body = JSON.parse(body); // Parsea el cuerpo como JSON
        } catch (error) {
            return res.status(400).json({ message: "Error al parsear el cuerpo" });
        }
        next(); // Llama al siguiente middleware o controlador
    });
};

module.exports = bodyParser;