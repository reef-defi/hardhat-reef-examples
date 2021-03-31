const hre = require("hardhat");

async function main() {
  const Token = await hre.reef.getContractFactory("Token");
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
