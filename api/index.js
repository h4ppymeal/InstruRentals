// used to make api
const express = require("express");
// allows api to accept calls from client
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const Instrument = require("./models/Instruments");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Renting = require("./models/Renting.js");

// adding environment variables
require("dotenv").config();
const app = express();

// hash password for encryption
const bcryptSalt = bcrypt.genSaltSync(10);
// a way to encrypt (dont matter)
const jwtSecret = "laskejflskaejflkeasjf";

// ensure server uses express
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
// connect to mongodb
mongoose.connect(process.env.MONGO_URL);

// Promise = async await
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

// makes the api in /test endpoint
// gets data
app.get("/test", (req, res) => {
  // response is in json format, content is "test ok"
  res.json("test ok");
});

// creates new data
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // token = a pass given to frontend so client does not need to log in again
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          // send out error to client
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    // array of every part of the string divided by dot (?)
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

app.post("/instruments", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const instrumentDoc = await Instrument.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      price,
    });
    res.json(instrumentDoc);
  });
});

app.get("/user-instruments", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Instrument.find({ owner: id }));
  });
});

app.get("/instruments/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Instrument.findById(id));
});

app.put("/instruments", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const instrumentDoc = await Instrument.findById(id);
    if (userData.id === instrumentDoc.owner.toString()) {
      instrumentDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        price,
      });
      await instrumentDoc.save();
      res.json("ok");
    }
  });
});

app.get("/instruments", async (req, res) => {
  res.json(await Instrument.find());
});

app.post("/rentals", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { instrument, checkIn, checkOut, name, phone, price } = req.body;
  Renting.create({
    instrument,
    checkIn,
    checkOut,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/rentals", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Renting.find({ user: userData.id }).populate("instrument"));
});

// makes server listen on port 4000
app.listen(4000);
