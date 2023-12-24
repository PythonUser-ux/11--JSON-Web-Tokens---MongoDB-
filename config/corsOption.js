const allowedOrigins = ['https://www.yoursite.com','http://127.0.0.1:5500','http://localhost:3500','https://www.google.com'];     // a list of domains that won't be stopped by CORS. 'http://127.0.0.1:5500' is used by the Live Server Extension, 'http://127.0.0.1:5500','http://localhost:3500' (but also !origin) would be removed after development

const corsOptions = {
    origin : (origin, callback) => {
        console.log("[this log is from",__filename.split('\\').pop(),"]   origin =", origin);
        if (allowedOrigins.indexOf(origin)!== -1 || !origin){ // it checks whether the domain is in the whitelist or if it is undefined (!origin)
            callback(null,true)
        } else {
            callback(new Error('Not allowed by CORS!!!')); // this error will be handled by the Exress built-in error handler
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;