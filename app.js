const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer')
const request = require('request')
const functions = require('./functions')
const app = express();
const port = 3000;

// Initialization of app variable 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Routes
// Managing the image upload using multer 
app.post("/upload-photo", multer({dest: "./public/photos"}).single('image'), function(req, res) {
    functions.storePhoto(req, res)
});

app.get('/api/photos', (req,res) => {
    res.send(fs.readFileSync('./photo-register.json'));
})

// Listen to port 3000
app.listen(port, () => {
    console.log(`Demarrage du serveur sur le port ${port}`);
});
