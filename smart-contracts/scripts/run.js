

const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const myNftContract = await nftContractFactory.deploy();

    await myNftContract.deployed();

    console.log(`NFT Deployed Address: ${myNftContract.address}`);

    myNftContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
    });

    // Call the function.
    let txn = await myNftContract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn.wait()
    console.log("Minted NFT #1");

    // Call the function.
    txn = await myNftContract.makeAnEpicNFT()
    // Wait for it to be mined.
    await txn.wait()
    console.log("Minted NFT #2");
}

main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
});