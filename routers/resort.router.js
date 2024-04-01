const express = require("express");
const { getAllResort, getResortByCity, getResortByDisabled,getResortByCategory, addResort, updateResort, deleteResort, getbyPrice, getResortById, getResortByOwnerId } = require("../controllers/resort.controller");
const { auth } = require("../middlewares/auth");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middlewares/multer");
const router = express.Router();

router.get("/getAll", auth(), getAllResort);
router.get("/getById/:id", auth(), getResortById);
router.get("/getByOwnerId/:id", auth(), getResortByOwnerId);
router.get("/getByCity/:city", auth(), getResortByCity);
router.get("/getByCategory/:cat", auth(), getResortByCategory);
router.get("/getByDisabled/:disable", auth(), getResortByDisabled);
router.get("/getResortByPrice", auth(), getbyPrice)
router.post("/addResort", auth(), addResort);
router.put("/updateResort/:id", auth(), updateResort);
router.delete("/deleteResort/:id", auth(), deleteResort)

router.post('/upload', upload.array('images', 15), function (req, res) {
    const files = req.files;
    console.log(req.files);
    if (!files || files.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No files uploaded."
        });
    }
    const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(file.path, function (err, result) {
                if (err) {
                    console.log("err------", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });

    Promise.all(uploadPromises)
        .then(results => {
            res.status(200).json({
                success: true,
                message: "Uploaded!",
                data: results
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: "Error uploading files.",
                error: error.message
            });
        });
});



// router.post('/upload', upload.single('image'), function (req, res) {
//     console.log("-----------------------------", req.file.path);
//     cloudinary.uploader.upload(req.file.path, function (err, result) {
//         if (err) {
//             console.log("err------", err);
//             return res.status(500).json({
//                 success: false,
//                 message: "Error"
//             })
//         }
//         res.status(200).json({
//             success: true,
//             message: "Uploaded!",
//             data: result
//         })
//     })
// });

module.exports = router;