// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const {reef} = require("hardhat");

const greeterInitialData = { 
  name: "Greeter",
  filename: "Greeter.sol",
  arguments: ["How's your day doing?"],
}

const multiSigWallerData = {
  name: "MultiSigWallet",
  filename: "MultiSigWallet.sol",
  arguments: [['0x82A258cb20E2ADB4788153cd5eb5839615EcE9a0', '0x69535cB2F9Db4FC5f2867A27a1eD8e6612F787bA', '0x9ADdFbFB23974488e51389A19A38946d102e83fE'], 1],
}

const factoryTestContract = {
  name: "FactoryTestContract",
  filename: "PrecomputeContractAddress.sol",
  arguments: ["0x9ADdFbFB23974488e51389A19A38946d102e83fE", 1031245],
}

const uniDirectionalPaymentData = {
  name: 'UniDirectionalPaymentChannel',
  filename: "UniDirectionalPaymentChannel.sol",
  arguments: ["0x82A258cb20E2ADB4788153cd5eb5839615EcE9a0"]
}

const biDirectionalPaymentData = {
  name: 'BiDirectionalPayment',
  filename: 'BiDirectionalPaymentChannel.sol',
  arguments: [
    ['0x82A258cb20E2ADB4788153cd5eb5839615EcE9a0', '0x69535cB2F9Db4FC5f2867A27a1eD8e6612F787bA'],
    ["0", "0"],
    "12947124124124241812",
    "100000000"
  ]
}

const englishAuctionData = {
  name: 'EnglishAuction',
  filename: 'EnglishAuction.sol',
  arguments: ["0x82A258cb20E2ADB4788153cd5eb5839615EcE9a0", 231, 1223]
}

async function main() {
  const signer = await reef.getSignerByName("alice");
  const signer2 = await reef.getSignerByName("bob");

  await signer.claimDefaultAccount()
  await signer2.claimDefaultAccount()

  const address1 = await signer.getAddress();
  const address2 = await signer2.getAddress();
  console.log("Signer address 1: ", address1)
  console.log("Signer address 2: ", address2)

  const reefBalance1 = await signer.getBalance();
  const reefBalance2 = await signer2.getBalance();
  console.log("Signer balance 1: ", reefBalance1.toString());
  console.log("Signer balance 2: ", reefBalance2.toString());

  const Greeter = await reef.getContractFactory("Greeter", signer);
  const greeter = await Greeter.deploy(...greeterInitialData.arguments);

  await greeter.deployed();
  await reef.verifyContract(greeter.address, "Greeter", greeterInitialData.arguments)

  console.log("Greeter deployed to:", greeter.address);

  await greeter.setGreeting("Danes je lep dan");
  console.log("Greeting: ", await greeter.greet());

  const Creator = await reef.getContractFactory("Creator", signer);
  console.log("Deploying creator");
  const creator = await Creator.deploy();

  await creator.deployed();
  await reef.verifyContract(creator.address, "Creator", []);

  console.log("Triggering contract creation in creator");
  const i1 = await creator.addItem("1");
  const i2 = await creator.addItem("2");

  console.log("item address: ", i1);
  console.log("item address: ", i2);

  const items = await creator.items;
  console.log("items: ", items);

  console.log("Deploying testtoken");
  const ERC20 = await reef.getContractFactory("TestToken", signer);
  const token = await ERC20.deploy("10000000000000000000000");

  await token.deployed();
  console.log(token.address)
  console.log("Token deployed");
  await reef.verifyContract(token.address, "TestToken", ["10000000000000000000000"])

  console.log("Transfering token founds")
  await token.transfer(address2, 123455);

  console.log("Signer balance 1: ", (await token.balanceOf(address1)).toString());
  console.log("Signer balance 2: ", (await token.balanceOf(address2)).toString());

  console.log("Deploying MultiSigWallet")
  const MultiSigWallet = await reef.getContractFactory("MultiSigWallet", signer);
  const multiSigWaller = await MultiSigWallet.deploy(...multiSigWallerData.arguments, {
    gasLimit: 1000000,
    customData: { storageLimit: 1000000 }
  })
  await multiSigWaller.deployed()
  
  console.log("Deploying MerkleTree")
  const MerkleTree = await reef.getContractFactory("MerkleTree", signer);
  const merkleTree = await MerkleTree.deploy();
  await merkleTree.deployed();
  
  // NOT working
  // const TestIterableMap = await reef.getContractFactory("TestIterableMap", signer);
  // const iterableMapping = await TestIterableMap.deploy();
  // await iterableMapping.deployed();
  // console.log(iterableMapping);
  
  
  console.log("Deploying Factory")
  const Factory = await reef.getContractFactory("Factory", signer);
  const factory = await Factory.deploy();
  await factory.deployed();
  
  // factory test
  // const salt = 12345;
  // const bytecode = await factory.getBytecode(factoryTestContract.arguments[0], factoryTestContract.arguments[1]);
  // const testContractAddress = await factory.getAddress(bytecode, salt);
  // // console.log(testContractAddress);
  // await factory.deployed(bytecode, salt);
  
  const MinimumProxyContract = await reef.getContractFactory("MinimalProxy", signer);
  const minimumProxyContract = await MinimumProxyContract.deploy();
  await minimumProxyContract.deployed();
  
  console.log("Deploying UniDirectionalPaymentChannel")
  const UniDirectionalPayment = await reef.getContractFactory("UniDirectionalPaymentChannel", signer);
  const uniDirectionalPayment = await UniDirectionalPayment.deploy(...uniDirectionalPaymentData.arguments);
  await uniDirectionalPayment.deployed();
  
  console.log("Deploying BiDirectionalPaymentChannel")
  const BiDirectionalPayment = await reef.getContractFactory('BiDirectionalPaymentChannel', signer);
  const biDirectionalPayment = await BiDirectionalPayment.deploy(...biDirectionalPaymentData.arguments);
  await biDirectionalPayment.deployed()
  
  console.log("Deploying BasicNFT")
  const BasicNFT = await reef.getContractFactory('BasicNFT', signer);
  const basicNFT = await BasicNFT.deploy();
  await basicNFT.deployed();
  
  console.log("Deploying EnglishAuction")
  const EnglishAuction = await reef.getContractFactory('EnglishAuction', signer);
  const englishAuction = await EnglishAuction.deploy(...englishAuctionData.arguments);
  await englishAuction.deployed();

  console.log("Finished!")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
