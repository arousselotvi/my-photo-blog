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
app.use('/public', express.static(path.join(__dirname, '/public')));
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
    // Store the photo
    let myRegister = JSON.parse(fs.readFileSync('./photo-register.json'));
    let tempPath=req.file.path;
    let targetPath = "./public/photo" + myRegister.myPhotos.length + path.extname(req.file.originalname); 
    console.log(targetPath)
    if (path.extname(targetPath).toLowerCase() === ".jpg" || path.extname(targetPath).toLowerCase() === ".jpeg" || path.extname(targetPath).toLowerCase() === ".png")   {
        fs.rename(tempPath, targetPath , err => {
            if (err){
                console.log(err)  
            } else {
                // Add photo to register
                let myDate= new Date(0);
                myDate.setUTCMilliseconds(req.body.date)
                let myPhotoInfos = {
                    photoName: req.file.originalname,
                    photoUrl: "http://localhost:3000"+targetPath.slice(1),
                    uploadEpoch: req.body.date,
                    uploadDate: myDate,
                    uploadLocation: ""
                }
                // Add the the photo at the beggining of the array so that the photos are organized from newest to oldest
                myRegister.myPhotos.unshift(myPhotoInfos);
                fs.writeFileSync('./photo-register.json', JSON.stringify(myRegister))
                res.send({"message":"Image sent successfully!"})
            }
        });
    } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);
            res.send({"message":"Sorry, only .jpg and .png files are accepted"})
        });
    }
});

app.get('/api/photos', (req,res) => {
    res.send(fs.readFileSync('./photo-register.json'));
})

// Listen to port 3000
app.listen(port, () => {
    console.log(`Demarrage du serveur sur le port ${port}`);
});
