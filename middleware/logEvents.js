const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `today at 8 a.m. ${message}\n`;
    try{
        if(!fs.existsSync(path.join(__dirname, "..", "logs"))){
            await fsPromises.mkdir(path.join(__dirname, "..", "logs")); 
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logName), dateTime)
    }
    catch (err){
        console.log(err);
    }
}

const logger = (req, res, next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt"); // ${req.headers.origin} would be "undefined" because we are running our server on localhost
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = {logEvents, logger};