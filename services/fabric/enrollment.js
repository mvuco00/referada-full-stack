"use strict";
const { buildCCPOrg1, buildWallet } = require("./AppUtil");
const { buildCAClient, registerAndEnrollUser } = require("./CAUtil.js");
const networkObject = require("../../services/fabric/chaincode");
const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const path = require("path");
const config = require("../../loaders/config");
const fs = require("fs");

const walletPath = path.join(__dirname, "wallet");

const adminUserId = "admin";
const adminUserPasswd = "adminpw";

//Connection Profile;
const ccp = buildCCPOrg1();

/**
 * Enrolls Admin object into wallet.
 * @returns {Promise<{Keys}>}
 */
async function enrollAdmin() {
  let {contract} = await networkObject.connectToNetwork(config.fabric.org1UserId);
  try {
    // Create a new CA client for interacting with the CA.
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.org1.example.com"
    );

    // Create a new file system based wallet for managing identities.
    const wallet = await buildWallet(Wallets, walletPath);

    try {
      // Check to see if we've already enrolled the admin user.
      const identity = await wallet.get(adminUserId);
      if (identity) {
        console.log(
          "An identity for the admin user already exists in the wallet"
        );
        return;
      }

      // Enroll the admin user, and import the new identity into the wallet.
      const enrollment = await caClient.enroll({
        enrollmentID: adminUserId,
        enrollmentSecret: adminUserPasswd,
      });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: config.fabric.mspOrg1,
        type: "X.509",
      };
      await wallet.put(adminUserId, x509Identity);
      console.log(
        "Successfully enrolled admin user and imported it into the wallet"
      );

      await registerAndEnrollUser(
        caClient,
        wallet,
        config.fabric.mspOrg1,
        config.fabric.org1UserId,
        "org1.department1"
      );

      await contract.submitTransaction("InitLedger");

    } catch (error) {
      console.error(`Failed to enroll admin user : ${error}`);
    }
  } catch (error) {
    logger.error(`Failed to enroll admin user "admin": ${error}`);
    process.exit(1);
  }
}

module.exports = { enrollAdmin };
