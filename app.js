const express = require("express");
const cors = require("cors");
const PORT = 8080;
const app = express();
const {
  addStudent,
  getAllData,
  readData,
  updateAsset,
  transferAsset
} = require("./controllers/student-controller");


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


app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
