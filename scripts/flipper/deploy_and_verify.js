const hre = require("hardhat");

async function main() {
  // define your testnet_account in hardhat.config.js
  const alice = await hre.reef.getSignerByName("testnet_account");
  await alice.claimDefaultAccount();

  const Flipper = await hre.reef.getContractFactory("Flipper", alice);
  const args = [false];
  const flipper = await Flipper.deploy(...args);
  await flipper.deployed();
  console.log("Deploy done");
  console.log("Save the address to change the values in existing contract");
  console.log({
    flipper_contract_address: flipper.address,
    deploy_hash: flipper.deployTransaction,
  });

  await hre.reef.verifyContract(flipper.address, "Flipper", args);

  console.log("Initial value:", await flipper.get());

  // Flip value
  console.log("Flipping value ...");
  await flipper.flip();

  // Check new value
  console.log("New value:", await flipper.get());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
