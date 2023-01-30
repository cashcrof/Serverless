const express = require("express");
const database = require("./database");
const s3 = require("./sw3");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "images/" });
const app = express();
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

app.post("/api/images", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;
  const description = req.body.description;
  database.addImage(imagePath, description);

  console.log(description, imagePath);
  res.send({ description, imagePath });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port ${port}`));
