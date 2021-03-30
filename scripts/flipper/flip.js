const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  // Get a Flipper contract on already deployed address
  const flipperAddress = "0x0230135fDeD668a3F7894966b14F42E65Da322e4";

  // TODO: this line is called solely to call the setup() function to instantiate hre.reef.wallet. This should be refactored! We should be able to instantiate any wallet we want! (using the .connect() call)
  //See: https://docs.ethers.io/v5/getting-started/#getting-started--writing
  await hre.reef.getContractFactory("Flipper");

  // Some magic right now to make it work, however this should also be refactored! Most likely by getContractAt() function
  const artifact = await hre.artifacts.readArtifact("Flipper");
  const flipper = new ethers.Contract(
    flipperAddress,
    artifact.abi,
    hre.reef.wallet
  );
  console.dir(hre.reef);

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
