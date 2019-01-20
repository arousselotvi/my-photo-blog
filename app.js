const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer')
const request = require('request')

const app = express();
const port = 3000;

// Initialization of app variable 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// Specify where to look for static files
app.use(express.static(path.join(__dirname, 'public')));
// Accept headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Routes
app.get('/', (req,res) => {
    res.send("Display photos sorted by upload date");
})

app.get('/photo/:photoId', (req,res) => {
    var photoId = req.params.photoId;
    res.send("Display photo with id " + photoId);
})

app.get('/upload', (req,res) => {
    res.send("Upload form");
})

// Managing the image upload using multer 
app.post("/upload-photo", multer({dest: "./public/"}).single('image'), function(req, res) {
    tempPath=req.file.path;
    targetPath="./public/" + req.file.originalname;
    if (path.extname(targetPath).toLowerCase() === ".jpg" || path.extname(targetPath).toLowerCase() === ".jpeg" || path.extname(targetPath).toLowerCase() === ".png")   {
        fs.rename(tempPath, targetPath, err => {
            if (err){
                console.log(err)  
            } 
            res.send({"message":"Image sent successfully!"})
        });
    } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);
            res.send({"message":"Sorry, only .jpg and .png files are accepted"})
        });
    }   
});

// Listen to port 3000
app.listen(port, () => {
    console.log(`Demarrage du serveur sur le port ${port}`);
});
