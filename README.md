# hardhat-reef-examples

hardhat-reef-examples shows the use of [hardhat-reef](https://github.com/reef-defi/hardhat-reef) plugin to interact with the Reef chain.


## Installing

Install dependencies with `yarn`.


## Running

Define your Reef chain URL in `hardhat.config.js` (by default `ws://127.0.0.1:9944`):

```
module.exports = {
  solidity: "0.7.3",
  defaultNetwork: "reef",
  networks: {
    reef: {
      url: "ws://127.0.0.1:9944",
    },
    reef_testnet: {
      url: "wss://rpc-testnet.reefscan.com/ws",
      scanUrl: "https://testnet.reefscan.com", // Localhost verification testing: http://localhost:3000
      seeds: {
        testnet_account: "<MNEMONIC_SEED>",
      },
    },
    reef_mainnet: {
      url: "wss://rpc.reefscan.com/ws",
      scanUrl: "wss://reefscan.com",
      seeds: {
        mainnet_account: "<MNEMONIC_SEED>",
      },
    },
  },
};
```

Change `<MNEMONIC_SEED>` to your account seed for the corresponding network. Remove the `seeds` dictionary for the unneeded networks. You can have multiple accounts by listing them in dictionary with your custom name:

```
seeds: {
	account1: "<MNEMONIC_SEED1>",
	account2: "<MNEMONIC_SEED2>",
	...
},
```

In JS script you can select the account with:
```
const reef = await hre.reef.getSignerByName("account1");
```
where `account1` is the key of the item in the `seeds` dictionary.

If you get the following error:
```
Invalid Transaction: Inability to pay some fees , e.g. account balance too low
```

it is most likely because the accounts defined in the `hardhat.config.js` and JS script do not match.


## Scripts

See `scripts/` folder for example scripts, e.g. to deploy flipper run:

```
yarn hardhat run scripts/flipper/deploy.js 
```

After the contract is deployed, you can interact with it using the `flip.js` script:

```
yarn hardhat run scripts/flipper/flip.js 
```

make sure the `flipperAddress` corresponds to the deployed address.

Deploy and verify Token contract:
```
yarn hardhat run scripts/erc20/deploy_and_verify.js --network reef_testnet
```

## Deploying on testnet
The above commands will deploy on development (local) network by default. To deploy on testnet, use the `--network` flag:

```
yarn hardhat run scripts/flipper/deploy.js --network reef_testnet 
```

To get initial REEF tokens on the testnet, visit [dev Matrix chat](https://app.element.io/#/room/#reef:matrix.org) and use the following command:
```
!drip REEF_ADDRESS
```
