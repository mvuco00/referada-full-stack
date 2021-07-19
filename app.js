const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 8080;
const app = express();
const chaincode = require("./services/fabric/chaincode");
const config = require("./loaders/config");
require("./loaders/fabric");
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/student/allData", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  try {
    let networkObj = await chaincode.connectToNetwork(config.fabric.org1UserId);
    
    let result = await networkObj.contract.evaluateTransaction("GetAllAssets");
    console.log(`*** Result: ${result}`);
    res.status(200).send(result)
  } catch (e) {
    console.log(e);
    return e;
  }
});

app.post('/student/readAsset', async(req,res)=>{
  res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    try {
      let networkObj = await chaincode.connectToNetwork(config.fabric.org1UserId);
      let data=req.body
      console.log(req)
      let result = await networkObj.contract.evaluateTransaction("ReadAsset",'0001');
      console.log(`*** Result: ${result}`);
      res.status(200).send(result)
    } catch (e) {
      console.log(e);
      return e;
    }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
