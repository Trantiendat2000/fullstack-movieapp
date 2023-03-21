const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const movieroute = require("./routes/movie");

app.use(cors());
app.use(express.json({ type: ["application/json"] }));

app.use(bodyParser.urlencoded({ extended: false }));

// router
app.use(movieroute);

// handling error
app.use((req, res, next) => {
  res.statusCode = 401;
  res.setHeader("Content-type", "application/json");
  res.write(JSON.stringify({ message: "Route not Found" }));
  res.end();
});

app.listen(5000, () => console.log(`Server running on 5000`));
