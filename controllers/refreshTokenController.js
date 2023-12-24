 // the purpose of this middleware is to verify the refresh token

// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {this.users = data} // here an arrow function cannot be used, as *this* won't be referring to userDB but instead it would be *undefined*
// }

const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // we are checking whether we have cookies, if yes we also check if cookies have the jwt property
    console.log(cookies);
    const refreshToken = cookies.jwt;
    const existUser = await User.findOne({refreshToken}).exec();             // we can simply do {refreshToken} because the key and the value have the same name
    // const existUser = userDB.users.find(usr => usr.refreshToken === refreshToken);
    if (!existUser) return res.sendStatus(403); // Forbidden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || existUser.username!==decoded.username) return res.sendStatus(403); // in this case we'd have an invalid token -> forbidden       existUser.username!==decoded.username checks whether the found user actually matches with the 
            // req.user = decoded.username; // I don't think this line is useful
            const accessToken = jwt.sign(
                {"username": existUser.username}, // the first argument is *payload*, we are going to use the username object, passing a password would thread the security. *payload* could be an object literal, buffer or string representing valid JSON.
                process.env.ACCESS_TOKEN_SECRET, // the second thing we need to create the access token is the secret of the access token
                { expiresIn: '30s' } // as options we pass the expiry time, at production this would be at least 5 minutes probably
            );
            res.json({accessToken})
        }
    );

}

module.exports= { handleRefreshToken }