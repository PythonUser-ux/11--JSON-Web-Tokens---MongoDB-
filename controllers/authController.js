// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {this.users = data} // here an arrow function cannot be used, as *this* won't be referring to userDB but instead it would be *undefined*
// }

const User = require('../model/User');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
// const fsPromises = require('fs').promises // because we are not integrating Mongo or other database technologies
// const path = require('path');

const handleLogin = async (req, res) =>{
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required'});
    // const existUser = userDB.users.find(usr => usr.username === user);
    const existUser = await User.findOne({username:user}).exec(); // not every mongoose method needs exec();
    if (!existUser) return res.sendStatus(401); // unauthorized
    const match = await bcrypt.compare(pwd, existUser.password);
    if (match) {
        const accessToken = jwt.sign(
            {"username": existUser.username}, // the first argument is *payload*, we are going to use the username object, passing a password would thread the security. *payload* could be an object literal, buffer or string representing valid JSON.
            process.env.ACCESS_TOKEN_SECRET, // the second thing we need to create the access token is the secret of the access token
            { expiresIn: '230s' } // as options we pass the expiry time, at production this would be at least 5 minutes probably
        );
        const refreshToken = jwt.sign(        // similarly we create the refresh token
            {"username": existUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        existUser.refreshToken = refreshToken;
        const result = await existUser.save();
        console.log(existUser);
        // const otherUsers = userDB.users.filter(usr => usr.username!==existUser.username)
        // const currentUser = {...existUser, refreshToken};
        // userDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(userDB.users)
        // );
        // now we want to save the refresh token in a database so that in the future we can create a log out route to invalidate it
        res.cookie('jwt', refreshToken, {httpOnly:true, secure:false, maxAge: 24 * 60 * 60 * 1000, sameSite:'None'}); // httpOnly cookies are not accessible using JavaScript from client-side, i.e. using console.log(document.cookie);, maxAge is the lifespan of the cookie: 24 * 60 * 60 * 100 -> 1d, when switching from Thunder Client to Chrome also switch from secure:false -> secure:true
        res.json({accessToken}); // we want to store this token in memory, the local storage is not safe enough as everything JavaScript can access can be accessed by hackers
    } else {
        res.sendStatus(401); // unauthorized
    }
}

module.exports= { handleLogin };