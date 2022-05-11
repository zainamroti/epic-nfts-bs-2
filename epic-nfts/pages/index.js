import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect } from "react";
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = 'zainamroti';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;


export default function Home() {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className={[styles.ctaButton, styles.connectWalletButton].join(" ")}>
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


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
            {currentAccount === "" ? (
              renderNotConnectedContainer()
            ) : (
              <button onClick={null} className={[styles.ctaButton, styles.connectWalletButton].join(" ")}>
                Mint NFT
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className={styles.footerContainer}>
        <img alt="Twitter Logo" className={styles.twitterLogo} src={twitterLogo} />
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
