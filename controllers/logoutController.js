// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {this.users = data} // here an arrow function cannot be used, as *this* won't be referring to userDB but instead it would be *undefined*
// }

const User = require('../model/User');

// const fsPromises = require('fs').promises
// const path = require('path');

const handleLogout = async (req, res) => {
    // also delete the accessToken

    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(204); // In this case it's okay: "No content"
    const refreshToken = cookies.jwt;

    // const existUser = userDB.users.find(usr => usr.refreshToken === refreshToken);
    const existUser = await User.findOne({refreshToken}).exec();
    if (!existUser) {
        res.clearCookie('jwt', {httpOnly: true});
        res.sendStatus(204); // No content
    };
    existUser.refreshToken='';
    const result = await existUser.save();

    // Delete refresh token in db
    // const otherUsers = userDB.users.filter(person => person.refreshToken!== existUser.refreshToken)
    // const currentUser = {...existUser, refreshToken:''};
    // userDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(userDB.users)
    // );

    res.clearCookie('jwt', {httpOnly: true});  // at production we need to add "secure: true" so that we only serve on https
    res.status(204).json({"message" : "you have been logged out"});

}

module.exports= { handleLogout }