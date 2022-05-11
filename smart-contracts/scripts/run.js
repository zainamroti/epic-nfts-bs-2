

const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const myNftContract = await nftContractFactory.deploy("https://epic-nfts-bs-2.vercel.app/api/0");

    await myNftContract.deployed();

    console.log(`NFT Deployed Address: ${myNftContract.address}`);


    // Call the function.
    let txn = await myNftContract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn.wait()
    console.log("Minted NFT #1");
}

main().then(() => process.exit(0)).catch(() => {
    console.error(error);
    process.exit(1);
});