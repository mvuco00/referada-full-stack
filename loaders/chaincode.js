const { Gateway, Wallets } = require("fabric-network");
const { buildCCPOrg1, buildWallet } = require("../services/fabric/AppUtil.js");
const fs = require("fs");
const channelName = "mychannel";
const chaincodeName = "basic";

async function connectToNetwork() {
  let ccp = buildCCPOrg1();
  let wallet = await Wallets.newFileSystemWallet(config.fabric.walletPath);

  const identity = await wallet.get(userEmail);
  if (!identity) {
    logger.error(
      `An identity for the user with ${userEmail} does not exist in the wallet`
    );
    logger.info("Run the registerUser.js application before retrying");
    throw new Error(
      `An identity for the user with ${userEmail} does not exist in the wallet`
    );
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: userEmail,
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);

  return {
    gateway,
    network,
    contract,
  };
}

module.exports = { connectToNetwork };
