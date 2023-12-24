// with this script we are going to handle the subdirectories inside the 'view' folder

const express = require('express');
const router = express.Router(); // this time we are defining a router rather than an app
const path = require('path');

router.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views','index.html'));
});

module.exports = router;