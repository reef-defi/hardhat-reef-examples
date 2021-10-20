const hre = require("hardhat");

async function main() {
  // Get a Flipper contract on already deployed address
  const flipperAddress = "0x0230135fDeD668a3F7894966b14F42E65Da322e4";

  const testnetAccount = await hre.reef.getSignerByName("testnet_account");
  const flipper = await hre.reef.getContractAt(
    "Flipper",
    flipperAddress,
    testnetAccount
  );

  // Call flip()
  console.log("Current value:", await flipper.get());
  await flipper.flip();
  console.log("New value after flip():", await flipper.get());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
