const allowedOrigins = ['https://www.yoursite.com','http://127.0.0.1:5500','https://localhost:3500','https://www.google.com'];     // a list of domains that won't be stopped by CORS. 'http://127.0.0.1:5500' is used by the Live Server Extension, 'http://127.0.0.1:5500','https://localhost:3500' (but also !origin) would be removed after development

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)){
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();

}

module.exports = credentials;