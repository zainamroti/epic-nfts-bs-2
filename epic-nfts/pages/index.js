import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState, useRef } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import { pickRandomFirstWord, pickRandomSecondWord, pickRandomThirdWord, pickRandomColor, svgPartOne, svgPartTwo, getBase64 } from '../utils/utils'
import { create } from 'ipfs-http-client'



const ifpsConfig = {
  // host: "ipfs.infura.io",
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
};

const ipfs = create(ifpsConfig);


// Constants
const TWITTER_HANDLE = 'zainamroti';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 11;


// or specifying a specific API path
// const ipfs = create({ host: 'infura-ipfs.io', port: '5001', apiPath: '/ipfs/api/v0' })

/* Create an instance of the client */
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')



export default function Home() {


  const [walletConnected, setWalletConnected] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  const [nftCount, setNFTCount] = useState(0);
  // const [currentAccount, setCurrentAccount] = useState("");
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  // const checkIfWalletIsConnected = async () => {
  //   const { ethereum } = window;

  //   if (!ethereum) {
  //     console.log("Make sure you have metamask!");
  //     return;
  //   } else {
  //     console.log("We have the ethereum object", ethereum);
  //   }

  //   const accounts = await ethereum.request({ method: 'eth_accounts' });

  //   if (accounts.length !== 0) {
  //     const account = accounts[0];
  //     console.log("Found an authorized account:", account);
  //     setCurrentAccount(account);

  //     // Setup listener! This is for the case where a user comes to our site
  //     // and ALREADY had their wallet connected + authorized.
  //     setupEventListener()
  //   } else {
  //     console.log("No authorized account found");
  //   }
  // }

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new ethers.providers.Web3Provider(provider);

    // If user is not connected to the Rinkeby network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  /*
      connectWallet: Connects the MetaMask wallet
    */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(`Connecting wallet failed > $err`);
    }
  };

  /*
  * Implement your connectWallet method here
  */
  // const connectWallet = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       alert("Get MetaMask!");
  //       return;
  //     }

  //     /*
  //     * Fancy method to request access to account.
  //     */
  //     const accounts = await ethereum.request({ method: "eth_requestAccounts" });

  //     /*
  //     * Boom! This should print out public address once we authorize Metamask.
  //     */
  //     console.log("Connected", accounts[0]);
  //     setCurrentAccount(accounts[0]);

  //     // Setup listener! This is for the case where a user comes to our site
  //     // and connected their wallet for the first time.
  //     setupEventListener()
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  // // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {

      const signer = await getProviderOrSigner(true);
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tokenId = await connectedContract.getNFTCount();
      setNFTCount(tokenId.toNumber());
      // THIS IS THE MAGIC SAUCE.
      // This will essentially "capture" our event when our contract throws it.
      // If you're familiar with webhooks, it's very similar to that!
      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        setNFTCount(tokenId.toNumber() + 1);
        alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`)
      });


      console.log("Setup event listener!")
    } catch (error) {
      console.log(error)
    }
  }



  const addDataToIPFS = async (metadata) => {
    const ipfsHash = await ipfs.add(metadata);
    return ipfsHash.cid.toString();
  };

  const retrieveImageFromIPFS = (ipfsHash) => {
    return fetch.get(`https://ipfs.io/ipfs/${ipfsHash}`);
  };


  /**
   * Upload to IPFS and get the SVG's Content ID (CID)
   */
  const uploadToIPFS = async (svg) => {
    let url;
    /* upload the file */
    try {
      const base64SVG = Buffer.from(svg).toString('base64');

      console.log(`BSCG> ${base64SVG}`);


      // // We set the title of our NFT as the generated word.
      const metaData = '{"name": "3w NFT # ' + (nftCount) + '","description": "A highly acclaimed collection of Legal NFTs.", "image": "data:image/svg+xml;base64,' + base64SVG + '"}';
      // We set the title of our NFT as the generated word.
      // const metaData = `'{"name": "My 3w NFT","description": "A highly acclaimed collection of Legal NFTs.","image": "data:image/svg+xml;base64,${base64SVG}}"'`;


      const base64JsonMetadata = Buffer.from(metaData).toString('base64');
      // data:application/json;base64,

      console.log(`MEtadata > ${base64JsonMetadata}`)
      const jsonFile = `data:application/json;base64,${base64JsonMetadata}`;
      const added = await ipfs.add(jsonFile);
      url = `https://infura-ipfs.io/ipfs/${added.path}`
      console.log(`Added svg: ${JSON.stringify(added)} && url: ${url}`);
    } catch (error) {
      console.log(`Error IPFS> ${error}`)
    }
    return url;

  }

  const getNFTcID = async () => {
    // We go and randomly grab one word from each of the three arrays.
    const first = pickRandomFirstWord();
    const second = pickRandomSecondWord();
    const third = pickRandomThirdWord();
    const combinedWord = `${first}${second}${third}`;

    // Add the random color in.
    const randomColor = pickRandomColor();
    const finalSvg = `${svgPartOne}${randomColor}${svgPartTwo}${combinedWord}</text></svg>`;

    console.log(`Getting NFT URL > SVg ==>   ${finalSvg}`);
    const url = await uploadToIPFS(finalSvg);
    return url;
    //Generate 3 word Square SVG NFTs here  
    //upload them to IPFS 
    //Then return the IPFS Content Hash ID to call MINT function.
  }


  const askContractToMintNft = async () => {

    try {
      const signer = await getProviderOrSigner(true);
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log("Going to pop wallet now to pay gas...")
      setLoading(true);

      let ipfsTokenURI = await getNFTcID();
      // ipfsTokenURI = `ipfs://${ipfsTokenURI}`

      let nftTxn = await connectedContract.mintIpfsNFT(ipfsTokenURI);
      // let nftTxn = await connectedContract.makeAnEpicNFT();
      console.log("Mining...please wait.")
      await nftTxn.wait();

      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      setLoading(false);


    } catch (error) {
      console.log(error)
    }
  }



  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className={[styles.ctaButton, styles.connectWalletButton].join(" ")}>
      Connect to Wallet
    </button>
  );

  useEffect(() => {

    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby", // optional
        // cacheProvider: true, // optional
        disableInjectedProvider: false,
        providerOptions: {} // required
      });
      connectWallet();
      console.log("WALLET CONNECTED..")
      setupEventListener();
    }


  }, [walletConnected])



  return (
    <div className={styles.container}>
      <Head>
        <title>My Epic NFTs</title>
        <meta name="description" content="epic nfts collection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>

          <p className={[styles.header, styles.gradientText].join(" ")}>My NFT Collection</p>
          <div className={styles.headerContainer}>
            <p className={styles.subText}>
              Each unique. Each beautiful. Discover your NFT today.
            </p>
          </div>
          {!walletConnected ? (
            renderNotConnectedContainer()
          ) : (
            <button disabled={loading} onClick={askContractToMintNft} className={[styles.ctaButton, styles.connectWalletButton].join(" ")}>
              Mint NFT
            </button>
          )}
          {loading && <div className={styles.loader}></div>}

          <div>
            <p className={styles.subText}>
              {`Total ${nftCount}/${TOTAL_MINT_COUNT} NFTs have been minted.`}
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footerContainer}>
        <img alt="Twitter Logo" className={styles.twitterLogo} src={"twitter-logo.svg"} />
        <a
          className={styles.footerText}
          href={TWITTER_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          Built with ❤ by SZeeS on @_buildspace
        </a>
      </footer>
    </div>
  )
}
