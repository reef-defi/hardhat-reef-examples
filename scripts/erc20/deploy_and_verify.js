const hre = require("hardhat");

async function main() {
  // We will deploy Token contract with alice
  // It is going to have the pool of 1000000 tokens
  const acc = await hre.reef.getSignerByName("alice");
  const Token = await hre.reef.getContractFactory("Token", acc);
  const args = [1000000]
  const token = await Token.deploy(1000000);

  await token.deployed();
  console.log("Deploy done");
  console.log({
    token: token.address,
  });
  console.log({
    name: await token.name(),
    initialBalance: await token.totalSupply(),
  });
  await hre.reef.verifyContract(token.address, "Token", args);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
