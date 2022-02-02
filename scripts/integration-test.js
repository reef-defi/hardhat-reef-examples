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

const REEF = "0x0000000000000000000000000000000001000000";

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
  const tokenArgs = ["10000543221123000000000000000000"]
  const token = await ERC20.deploy(...tokenArgs);

  await token.deployed();
  console.log(token.address)
  console.log("Token deployed");
  await reef.verifyContract(token.address, "TestToken", tokenArgs)

  console.log("Transfering token founds 1")
  await token.transfer(address2, "123455000000000000000000");
  console.log("Transfering token founds 2")
  await token.transfer(REEF, "7531000000000000000000");

  console.log("Reef balance: ", (await token.balanceOf(REEF)).toString());
  console.log("Signer balance 1: ", (await token.balanceOf(address1)).toString());
  console.log("Signer balance 2: ", (await token.balanceOf(address2)).toString());

  console.log("Deploying MultiSigWallet")
  const MultiSigWallet = await reef.getContractFactory("MultiSigWallet", signer);
  const multiSigWaller = await MultiSigWallet.deploy(...multiSigWallerData.arguments, {
    gasLimit: 1000000,
    customData: { storageLimit: 1000000 }
  })
  await multiSigWaller.deployed()
  await reef.verifyContract(multiSigWaller.address, "MultiSigWallet", multiSigWallerData.arguments);
  
  console.log("Deploying MerkleTree")
  const MerkleTree = await reef.getContractFactory("MerkleTree", signer);
  const merkleTree = await MerkleTree.deploy();
  await merkleTree.deployed();
  await reef.verifyContract(merkleTree.address, "MerkleTree", []);
  
  console.log("Deploying Factory")
  const Factory = await reef.getContractFactory("Factory", signer);
  const factory = await Factory.deploy();
  await factory.deployed();
  await reef.verifyContract(factory.address, "Factory", []);
  
  const MinimumProxyContract = await reef.getContractFactory("MinimalProxy", signer);
  const minimumProxyContract = await MinimumProxyContract.deploy();
  await minimumProxyContract.deployed();
  await reef.verifyContract(minimumProxyContract.address, "MinimalProxy", []);
  
  console.log("Deploying UniDirectionalPaymentChannel")
  const UniDirectionalPayment = await reef.getContractFactory("UniDirectionalPaymentChannel", signer);
  const uniDirectionalPayment = await UniDirectionalPayment.deploy(...uniDirectionalPaymentData.arguments);
  await uniDirectionalPayment.deployed();
  await reef.verifyContract(uniDirectionalPayment.address, "UniDirectionalPaymentChannel", uniDirectionalPaymentData.arguments);

  console.log("Deploying BiDirectionalPaymentChannel")
  const BiDirectionalPayment = await reef.getContractFactory('BiDirectionalPaymentChannel', signer);
  const biDirectionalPayment = await BiDirectionalPayment.deploy(...biDirectionalPaymentData.arguments);
  await biDirectionalPayment.deployed()
  await reef.verifyContract(biDirectionalPayment.address, "BiDirectionalPaymentChannel", biDirectionalPaymentData.arguments);
  
  console.log("Deploying BasicNFT")
  const BasicNFT = await reef.getContractFactory('BasicNFT', signer);
  const basicNFT = await BasicNFT.deploy();
  await basicNFT.deployed();
  await reef.verifyContract(basicNFT.address, "BasicNFT", []);
  
  console.log("Deploying EnglishAuction")
  const EnglishAuction = await reef.getContractFactory('EnglishAuction', signer);
  const englishAuction = await EnglishAuction.deploy(...englishAuctionData.arguments);
  await englishAuction.deployed();
  await reef.verifyContract(englishAuction.address, "EnglishAuction", englishAuctionData.arguments);

  console.log('Deploying NFT-721')
  const NFT721 = await reef.getContractFactory('TestNFT721', signer);
  const nft721 = await NFT721.deploy();
  await nft721.deployed();
  console.log('Contract deployed')
  await reef.verifyContract(nft721.address, 'TestNFT721', []);

  console.log('Transfering...')
  console.log(await nft721.awardItem(address2, 'Hello world'))

  console.log('Deploying NFT-1155')
  const NFT1155 = await reef.getContractFactory('TestNFT1155', signer);
  const nft1155 = await NFT1155.deploy();
  await nft1155.deployed();
  console.log('NFT-1155 deployed')
  await reef.verifyContract(nft1155.address, 'TestNFT1155', []);

  console.log('Transfer ERC115 from address1 -> address2, Silver')
  await nft1155.safeTransferFrom(address1, address2,  2, 1, "0x01")

  console.log('Transfer ERC115 batch from address1 -> address2')
  await nft1155.safeBatchTransferFrom(address1, address2, [0,1,3,4], [50,100,1,1], "0x01")

  console.log("Finished!")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
