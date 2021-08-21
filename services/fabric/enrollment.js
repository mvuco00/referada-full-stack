"use strict";
const { buildCCPOrg1, buildWallet } = require("./AppUtil");
const { buildCAClient, registerAndEnrollUser } = require("./CAUtil.js");
const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const path = require("path");
const config = require("../../loaders/config");
const fs = require("fs");

const walletPath = path.join(__dirname, "wallet");
const adminUserId = "admin";
const adminUserPasswd = "adminpw";


const ccp = buildCCPOrg1();


async function enrollAdmin() {
  try {
    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.org1.example.com"
    );
    const wallet = await buildWallet(Wallets, walletPath);

    try {
      const identity = await wallet.get(adminUserId);
      if (identity) {
        console.log(
          "An identity for the admin user already exists in the wallet"
        );
        return;
      }

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
     
    } catch (error) {
      console.error(`Failed to enroll admin user : ${error}`);
    }
  } catch (error) {
    logger.error(`Failed to enroll admin user "admin": ${error}`);
    process.exit(1);
  }
}

module.exports = { enrollAdmin };
