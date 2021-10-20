const hre = require("hardhat");

async function main() {
  // Bob is the owner of Token contract and he wants to send some token amount to dave
  const testnetAccount = await hre.reef.getSignerByName("testnet_account");
  const dave = await hre.reef.getSignerByName("dave");

  // Extracting user addresses
  const bobAddress = await bob.getAddress();
  const daveAddress = await dave.getAddress();

  // Token contract address
  const tokenAddress = "0x4a4fA87b810A30BE84a3a30318D6D9feEae126e5";

  // Retrieving Token contract from chain
  const token = await hre.reef.getContractAt("Token", tokenAddress, bob);

  // Let's see Dave's balance
  let daveBalance = await token.balanceOf(daveAddress);
  console.log(
    "Balance of to address before transfer:",
    await daveBalance.toString()
  );

  // Bob transfers 10000 tokens to Dave
  await token.transfer(daveAddress, 10000);

  // Let's once again check Dave's balance
  daveBalance = await token.balanceOf(daveAddress);
  console.log(
    "Balance of to address after transfer:",
    await daveBalance.toString()
  );

  // Bob's amount after transactions
  const bobBalance = await token.balanceOf(bobAddress);
  console.log(
    "Balance of from address after transfer:",
    await bobBalance.toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
