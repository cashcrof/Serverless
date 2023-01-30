const express = require("express");
const database = require("./database");
const fs = require("fs");
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const app = express();
const crypto = require("crypto");
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

require("dotenv").config();

// Before the other routes
app.use(express.static("dist"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/images/:imageName", (req, res) => {
  // do a bunch of if statements to make sure the user is
  // authorized to view this image, then

  const imageName = req.params.imageName;
  const readStream = fs.createReadStream(`images/${imageName}`);
  readStream.pipe(res);
});

app.get("/api/images", (req, res) => {
  const images = database.getImages();
  res.send({ images });
});

app.post("/api/images", upload.single('image'), async (req, res) => {
  // Get the data from the post request
  const description = req.body.description
  const fileBuffer = req.file.buffer
  const mimetype = req.file.mimetype
  const fileName = generateFileName();

  // Store the image in s3
  const s3Result = await s3.uploadImage(fileBuffer, fileName, mimetype)

  // Store the image in the database
  const databaseResult = await database.addImage(fileName, description)

  res.status(201).send(result)
})


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port ${port}`));
