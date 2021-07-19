//Import Hyperledger Fabric 1.4 programming model - fabric-network
"use strict";

const { Gateway, Wallets } = require("fabric-network");
const { buildCCPOrg1, buildWallet } = require("./AppUtil");
const path = require("path");
const config = require("../../loaders/config");
const walletPath = path.join(__dirname, "wallet");

/**
 * Do all initialization needed to invoke chaincode
 * @param userId
 * @returns {Promise<{contract: Contract, gateway: Gateway, network: Network} | Error>} Network objects needed to interact with chaincode
 */
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
    discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
  });
  const network = await gateway.getNetwork(config.fabric.channelName);
  const contract = network.getContract(config.fabric.chaincodeName);
  await contract.submitTransaction("InitLedger");

  return {
    gateway,
    network,
    contract,
  };
}

/**
 * Invoke any chaincode using fabric sdk
 *
 * @param {String} func - The chaincode function to call
 * @param {[String]} args - Arguments to chaincode function
 * @param {Boolean} isQuery - True if query function, False if transaction function
 * @param {String} userEmail - Email of fabric user that invokes chaincode. Must be enrolled and have entity in wallet.
 * @returns {Promise<JSON>} Data returned from ledger in Object format
 */
async function invokeChaincode(func, args, isQuery, userId) {
  try {
    let networkObj = await connectToNetwork(userId);
    logger.debug("inside invoke");
    logger.debug(`isQuery: ${isQuery}, func: ${func}, args: ${args}`);

    if (isQuery === true) {
      logger.debug("inside isQuery");

      if (args) {
        logger.debug("inside isQuery, args");
        logger.debug(args);
        let response = await networkObj.contract.evaluateTransaction(
          func,
          ...args
        );
        logger.debug(response);
        logger.debug(
          `Transaction ${func} with args ${args} has been evaluated`
        );

        await networkObj.gateway.disconnect();
        return JSON.parse(response);
      } else {
        let response = await networkObj.contract.evaluateTransaction(func);
        logger.debug(response);
        logger.debug(`Transaction ${func} without args has been evaluated`);

        await networkObj.gateway.disconnect();

        return JSON.parse(response);
      }
    } else {
      logger.debug("notQuery");
      if (args) {
        logger.debug("notQuery, args");
        logger.debug("$$$$$$$$$$$$$ args: ");
        logger.debug(args);
        logger.debug(func);

        let response = await networkObj.contract.submitTransaction(
          func,
          ...args
        );
        logger.debug("after submit");

        logger.debug(response);
        logger.debug(
          `Transaction ${func} with args ${args} has been submitted`
        );

        await networkObj.gateway.disconnect();

        return JSON.parse(response);
      } else {
        let response = await networkObj.contract.submitTransaction(func);
        logger.debug(response);
        logger.debug(`Transaction ${func} with args has been submitted`);

        await networkObj.gateway.disconnect();

        return JSON.parse(response);
      }
    }
  } catch (error) {
    logger.error(`Failed to submit transaction: ${error}`);
    throw error;
  }
}

module.exports = { connectToNetwork, invokeChaincode };
