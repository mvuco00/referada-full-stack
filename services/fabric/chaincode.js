//Import Hyperledger Fabric 1.4 programming model - fabric-network
"use strict";

const { Gateway, Wallets } = require("fabric-network");
const { buildCCPOrg1, buildWallet } = require("./AppUtil");
const path = require("path");
const config = require("../../loaders/config");
const walletPath = path.join(__dirname, "wallet");


async function connectToNetwork() {
  const ccp = buildCCPOrg1();
  const wallet = await buildWallet(Wallets, walletPath);

  const identity = await wallet.get(config.fabric.org1UserId);
  if (!identity) {
    console.log(
      `An identity for the user with ${config.fabric.org1UserId} does not exist in the wallet`
    );
    console.log("Run the registerUser.js application before retrying");
    throw new Error(
      `An identity for the user with ${config.fabric.org1UserId} does not exist in the wallet`
    );
  }

  const gateway = new Gateway();

  await gateway.connect(ccp, {
    wallet,
    identity: config.fabric.org1UserId,
    discovery: { enabled: true, asLocalhost: true }, 
  });
  const network = await gateway.getNetwork(config.fabric.channelName);
  const contract = network.getContract(config.fabric.chaincodeName);

  return {
    gateway,
    network,
    contract,
  };
}

module.exports = { connectToNetwork };
