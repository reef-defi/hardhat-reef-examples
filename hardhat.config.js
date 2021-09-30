require("@reef-defi/hardhat-reef");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
var reef_ws = (process.env.REEF_WS) ? process.env.REEF_WS : "ws://127.0.0.1:9944"
module.exports = {
  solidity: "0.7.3",
  defaultNetwork: "reef",
  networks: {
    reef: {
      url: reef_ws,
    },
    reef_testnet: {
      url: "wss://rpc-testnet.reefscan.com/ws",
    },
  },
};
