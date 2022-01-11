const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
app.use(cors());

dotenv.config({ path: "../cfg/configuration.env" });

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.json("API is running.");
});

app.listen(PORT, () => {
    console.log("API is listening on port " + PORT);
});