// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  await hre.run("compile");

  const { wallet, provider } = await hre.bodhi.setup();
  const deployerAddress = await wallet.getAddress();
  const artifact = await hre.artifacts.readArtifact("Flipper");

  const factory = await ethers.ContractFactory.fromSolidity(artifact)
    .connect(wallet)
    .deploy(false);

  console.log("Deploy done");
  console.log({
    flipper: factory.address,
  });
  console.log("Initial value:", await factory.get());

  // Flip value
  console.log("Flipping value ...");
  await factory.flip();

  // Check new value
  console.log("New value:", await factory.get());

  provider.api.disconnect();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
