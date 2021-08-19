const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("../services/fabric/CAUtil.js");
const { buildCCPOrg1, buildWallet } = require("../services/fabric/AppUtil.js");

const channelName = "mychannel";
const chaincodeName = "basic";
const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "appUser";

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
  try {
    const ccp = buildCCPOrg1();
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.org1.example.com"
    );

    const wallet = await buildWallet(Wallets, walletPath);
    await enrollAdmin(caClient, wallet, mspOrg1);

    await registerAndEnrollUser(
      caClient,
      wallet,
      mspOrg1,
      org1UserId,
      "org1.department1"
    );

    const gateway = new Gateway();

      await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
      });
      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);
      console.log(
        "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
      );
      await contract.submitTransaction("InitLedger");

      console.log(
        "\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger"
      );
      let result = await contract.evaluateTransaction("GetAllAssets");
      console.log(`*** Result: ${prettyJSONString(result.toString())}`);

    
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
  }
}

main();
