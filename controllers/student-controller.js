const networkObject = require("../services/fabric/chaincode");
const config = require("../loaders/config");

const addStudent = async (req, res) => {
  try {
    let { contract } = await networkObject.connectToNetwork(
      config.fabric.org1UserId
    );
    const data = req.body;
    await contract.submitTransaction(
      "CreateAsset",
      data.Id,
      data.Name,
      data.Collage,
      data.Grade,
      data.Level
    );
    res.status(200).send("Successfull");
  } catch (e) {
    res.status(500).send("Internal Server Error");
    return e;
  }
};

const getAllData = async (req, res) => {
  try {
    let { contract } = await networkObject.connectToNetwork(
      config.fabric.org1UserId
    );

    let result = await contract.evaluateTransaction("GetAllAssets");
    console.log(`*** Result: ${result}`);
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send("Internal Server Error");
    return e;
  }
};

const readData = async (req, res) => {
  try {
    let { contract } = await networkObject.connectToNetwork(
      config.fabric.org1UserId
    );
    let result = await contract.evaluateTransaction(
      "ReadAsset",
      req.params.studentId
    );
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const updateAsset = async (req, res) => {
  const data = req.params;
  try {
    let { contract } = await networkObject.connectToNetwork(
      config.fabric.org1UserId
    );
    await contract.submitTransaction(
      "UpdateAsset",
      data.studentId,
      data.name,
      data.collage,
      data.grade,
      data.level
    );
    res.status(200).send("success");
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const transferAsset = async (req, res) => {
  try {
    let { contract } = await networkObject.connectToNetwork(
      config.fabric.org1UserId
    );
    let result = await contract.submitTransaction(
      "TransferAsset",
      req.params.studentId.toString(),
      req.params.collage.toString()
    );
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const assetHistory = async (req, res) => {
  try {
    let { contract } = await networkObject.connectToNetwork(
      config.fabric.org1UserId
    );
    let result = await contract.evaluateTransaction(
      "GetAssetHistory",
      req.params.studentId.toString()
    );
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const deleteAsset = async (req, res) => {
  try {
    let { contract } = await networkObject.connectToNetwork(
      config.fabric.org1UserId
    );
    let result = await contract.submitTransaction(
      "DeleteAsset",
      req.params.studentId.toString()
    );
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const queryByCollage = async (req, res) => {
  console.log(req.params.collage.toString());
  try {
    let { contract } = await networkObject.connectToNetwork(
      config.fabric.org1UserId
    );
    result = await contract.evaluateTransaction(
      "QueryAssetsByCollage",
      req.params.collage.toString()
    );
    res.status(200).send(result);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addStudent,
  queryByCollage,
  getAllData,
  readData,
  updateAsset,
  transferAsset,
  assetHistory,
  deleteAsset,
};
