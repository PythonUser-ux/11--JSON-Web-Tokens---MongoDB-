// const userDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {this.users = data} // here an arrow function cannot be used, as *this* won't be referring to userDB but instead it would be *undefined*
// }

const User = require('../model/User');

// const fsPromises = require('fs').promises;
// const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required'});

    // check for duplicate usernames in the database
    // const duplicate = userDB.users.find(usrs => usrs.username === user);
    const duplicate = await User.findOne({username:user}).exec(); // not every mongoose method needs exec();
    if (duplicate) return res.sendStatus(409); // Conflict
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const result = await User.create({ "username":user, "password":hashedPwd});
        // const newUser = { "username":user, "password":hashedPwd};
        // userDB.setUsers([...userDB.users, newUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model','users.json'),
        //     JSON.stringify(userDB.users)
        // );
        // console.log(userDB.users);
        console.log(result);
        res.status(201).json({'success': `New user ${user} created!`});
    } catch (err) {
        res.status(500).json({'message': err.message});
        }
}

module.exports = {handleNewUser};