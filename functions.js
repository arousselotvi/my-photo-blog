const fs = require('fs');
const path = require('path');

module.exports = {
    storePhoto : function(req,res) {
        let myRegister = JSON.parse(fs.readFileSync('./photo-register.json'));
        let tempPath=req.file.path;
        let targetPath = "./public/photos/photo" + myRegister.myPhotos.length + path.extname(req.file.originalname); 
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
                        originalName: req.file.originalname,
                        actualName: "photo" + myRegister.myPhotos.length,
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
    }
}