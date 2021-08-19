const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8080;
const app = express();
const chaincode = require("./services/fabric/chaincode");
const {
  addStudent,
  getAllData,
  readData,
  updateAsset,
  transferAsset
} = require("./controllers/student-controller");
const config = require("./loaders/config");

require("./loaders/fabric");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/student/allData", getAllData);

app.post("/student/readAsset/:studentId", readData);

app.post("/student/addAsset", addStudent);
app.post("/student/updateAsset/:studentId/:name/:collage/:grade", updateAsset);
app.put("/student/updateAsset/:studentId/:collage", transferAsset);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
