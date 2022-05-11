

const main = async () => {
    const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
    const myNftContract = await nftContractFactory.deploy("https://epic-nfts-bs-2.vercel.app/api/");

    await myNftContract.deployed(); 

    console.log(`NFT Deployed Address: ${myNftContract.address}`);
}

main().then(() => process.exit(0)).catch(() => {
    console.error(error);
    process.exit(1);
});