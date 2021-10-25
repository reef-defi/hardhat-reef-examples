const hre = require("hardhat");

async function main() {
  // Bob is the owner of Token contract and he wants to send some token amount to dave
  const testnetAccount = await hre.reef.getSignerByName("testnet_account");
  const dave = await hre.reef.getSignerByName("dave");

  // Extracting user addresses
  const testnetAddress = await testnetAccount.getAddress();
  const daveAddress = await dave.getAddress();

  // Token contract address (copy from deploy.js log)
  const tokenAddress = "0x18BA6867215Be46d78997e13b8F80ee8f4d28af6";

  // Retrieving Token contract from chain
  const token = await hre.reef.getContractAt(
    "Token",
    tokenAddress,
    testnetAccount
  );

  // Let's see Dave's balance
  let daveBalance = await token.balanceOf(daveAddress);
  console.log(
    "Balance of to address before transfer:",
    await daveBalance.toString()
  );

  // testnetAccount transfers 10000 tokens to Dave
  await token.transfer(daveAddress, 10000);

  // Let's once again check Dave's balance
  daveBalance = await token.balanceOf(daveAddress);
  console.log(
    "Balance of to address after transfer:",
    await daveBalance.toString()
  );

  // testnetAccount's amount after transactions
  const testnetAccountBalance = await token.balanceOf(testnetAddress);
  console.log(
    "Balance of from address after transfer:",
    await testnetAccountBalance.toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
