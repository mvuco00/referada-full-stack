const chaincode = require("../services/fabric/chaincode");
const config = require("../loaders/config");

const addStudent = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  try {
    let networkObj = await chaincode.connectToNetwork(config.fabric.org1UserId);
    const data = req.body;
    await networkObj.contract.submitTransaction(
      "CreateAsset",
      data.Id,
      data.Name,
      data.Collage,
      data.Grade
    );
    res.status(200).send("Successfull");
  } catch (e) {
    console.log(e);
    return e;
  }
};

const getAllData = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  try {
    let networkObj = await chaincode.connectToNetwork(config.fabric.org1UserId);

    let result = await networkObj.contract.evaluateTransaction("GetAllAssets");
    console.log(`*** Result: ${result}`);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    return e;
  }
};

const readData = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  try {
    let networkObj = await chaincode.connectToNetwork(config.fabric.org1UserId);
    let result = await networkObj.contract.evaluateTransaction(
      "ReadAsset",
      req.params.studentId
    );
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    return e;
  }
};

module.exports = { addStudent, getAllData, readData };
