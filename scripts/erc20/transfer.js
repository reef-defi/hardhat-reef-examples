const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  const tokenAddress = "0x0230135fDeD668a3F7894966b14F42E65Da322e4";

  await hre.reef.getContractFactory("Token");

  const artifact = await hre.artifacts.readArtifact("Token");
  const token = new ethers.Contract(
    tokenAddress,
    artifact.abi,
    hre.reef.wallet
  );

  const transferTo = "0x0000000000000000000000000000000000000001";

  console.log(
    "Balance of to address before transfer:",
    await token.balanceOf(transferTo).then((val) => val.toString())
  );
  await token.transfer(transferTo, 10000);

  console.log(
    "Balance of to address after transfer:",
    await token.balanceOf(transferTo).then((val) => val.toString())
  );

  console.log(
    "Balance of from address after transfer:",
    await token
      .balanceOf(hre.reef.wallet.getAddress())
      .then((val) => val.toString())
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
