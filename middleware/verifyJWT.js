const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization; // just in case the property authorization starts with capital letter
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(501); // unauthorized
    console.log('[This log is from verifyJWT ]',authHeader); // we'll see a line that looks like "Bearer token"
    const token = authHeader.split(' ')[1]; // the token would be the second "word" inside the string
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET, // the purpose of this middleware is to verify the access token
        (err, decoded) => {
            if (err) return res.sendStatus(403); // in this case we'd have an invalid token -> forbidden
            // req.user = decoded.username; // I don't think this line is useful
            next();
        }
    );
}

module.exports = verifyJWT // now we can add this middleware to the routes we want to protect
