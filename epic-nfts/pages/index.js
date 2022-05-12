import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState, useRef } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
// Constants
const TWITTER_HANDLE = 'zainamroti';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 11;


export default function Home() {


  const [walletConnected, setWalletConnected] = useState(false);
  const [nftCount, setNFTCount] = useState(-1);
  // const [currentAccount, setCurrentAccount] = useState("");
  const web3ModalRef = useRef(null);

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

    // If user is not connected to the Ropsten network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 3) {
      window.alert("Change the network to Ropsten");
      throw new Error("Change network to Ropsten");
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
      const signer = await getProviderOrSigner(true);
      setWalletConnected(true);
      return signer;
    } catch (err) {
      console.error(err);
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
  // const setupEventListener = async () => {
  //   // Most of this looks the same as our function askContractToMintNft
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       // Same stuff again
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  //       // THIS IS THE MAGIC SAUCE.
  //       // This will essentially "capture" our event when our contract throws it.
  //       // If you're familiar with webhooks, it's very similar to that!
  //       connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
  //         console.log(from, tokenId.toNumber())
  //         alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
  //       });

  //       console.log("Setup event listener!")

  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


  const askContractToMintNft = async () => {

    try {
      const signer = await getProviderOrSigner(true);
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);



      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      await nftTxn.wait();

      console.log(`Mined, see transaction: https://ropsten.etherscan.io/tx/${nftTxn.hash}`);


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
    let connectedContract;
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "ropsten", // optional
        // cacheProvider: true, // optional
        disableInjectedProvider: false,
        providerOptions: {} // required
      });
      const signer = connectWallet();
      connectedContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }

    // THIS IS THE MAGIC SAUCE.
    // This will essentially "capture" our event when our contract throws it.
    // If you're familiar with webhooks, it's very similar to that!
    connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
      console.log(from, tokenId.toNumber())
      alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
    });

    const count = connectedContract.getNFTCount();
    setNFTCount(count.toNumber());

    console.log("Setup event listener!")



    return () => {
      connectedContract.off("NewEpicNFTMinted");
    }
  }, [walletConnected])

  // useEffect(() => {
  //   if(walletConnected && nftCount === -1) {
  //   const provider = getProviderOrSigner();
  //   const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  //   }
  // }, [nftCount])


  return (
    <div className={styles.container}>
      <Head>
        <title>My Epic NFTs</title>
        <meta name="description" content="epic nfts collection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.headerContainer}>
            <p className={[styles.header, styles.gradientText].join(" ")}>My NFT Collection</p>
            <p className={styles.subText}>
              Each unique. Each beautiful. Discover your NFT today.
            </p>
            {!walletConnected ? (
              renderNotConnectedContainer()
            ) : (
              <button onClick={askContractToMintNft} className={[styles.ctaButton, styles.connectWalletButton].join(" ")}>
                Mint NFT
              </button>
            )}
          </div>
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
