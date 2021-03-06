

const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const myNftContract = await nftContractFactory.deploy();

  await myNftContract.deployed();

  console.log(`NFT Deployed Address: ${myNftContract.address}`);

  // // Call the function.
  // let txn = await myNftContract.makeAnEpicNFT()
  // // Wait for it to be mined.
  // await txn.wait()
  // console.log("Minted NFT #1")
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});