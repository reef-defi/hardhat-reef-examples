const hre = require("hardhat");

// We will deploy Token contract with Bob
// It is going to have the pool of 1000000 tokens
async function main() {
  // define your testnet_account in hardhat.config.js and replace alice 
  const testnetAccount = await hre.reef.getSignerByName("alice");
  await testnetAccount.claimDefaultAccount();

  const Token = await hre.reef.getContractFactory("Token", testnetAccount);
  const token = await Token.deploy(1000000);

  console.log("Deploy done");
  console.log({
    token: token.address,
  });
  console.log({
    name: await token.name(),
    initialBalance: (await token.totalSupply()).toString(),
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
