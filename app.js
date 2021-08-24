const express = require("express");
const cors = require("cors");
const PORT = 8080;
const app = express();
const {
  addStudent,
  getAllData,
  readData,
  updateAsset,
  transferAsset,
  assetHistory,
  deleteAsset,
  queryByCollage,
} = require("./controllers/student-controller");

require("./loaders/fabric");
app.use(cors());
app.use(express.json());

app.get("/student/allData", getAllData);
app.put("/student/queryByCollage/:collage", queryByCollage);

app.post("/student/readAsset/:studentId", readData);

app.post("/student/addAsset", addStudent);
app.post(
  "/student/updateAsset/:studentId/:name/:collage/:grade/:level",
  updateAsset
);
app.put("/student/transferAsset/:studentId/:collage", transferAsset);
app.put("/student/assetHistory/:studentId", assetHistory);
app.delete("/student/deleteAsset/:studentId", deleteAsset);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
