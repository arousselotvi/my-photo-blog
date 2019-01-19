const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors')
const request = require('request')

const app = express();
const port = 3000;

// Initialization of app variable 
// Middleware 
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// Specify where to look for static files
app.use(express.static(path.join(__dirname, 'public')));

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

app.post('/uploadphoto', (req,res) => {
    
})
// Listen to port 3000
app.listen(port, () => {
    console.log(`Demarrage du serveur sur le port ${port}`);
});
