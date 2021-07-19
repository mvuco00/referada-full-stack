const chaincode = require("./fabric/chaincode");

async function getStudentRecords() {
  try {
    let certLedgerDataArray =
      await chaincode.connectToNetwork.contract.evaluateTransaction(
        "GetAllAssets"
      );
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return certLedgerDataArray;
  } catch (e) {
    console.log(e);
    return e;
  }
}

module.exports = { getStudentRecords };
