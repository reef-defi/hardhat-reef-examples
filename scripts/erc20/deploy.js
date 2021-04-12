const hre = require("hardhat");

async function main() {
  // We will deploy Token contract with Bob
  // It is going to have the pool of 1000000 tokens
  const bob = await hre.reef.getSignerByName("bob");
  const Token = await hre.reef.getContractFactory("Token", bob);
  const token = await Token.deploy(1000000);

  console.log("Deploy done");
  console.log({
    token: token.address,
  });
  console.log({
    name: await token.name(),
    initialBalance: await token.totalSupply(),
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
