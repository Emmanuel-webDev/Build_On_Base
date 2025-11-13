//import EthereumProvider from "https://esm.sh/@walletconnect/ethereum-provider@2.10.0";
//import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.7.0/dist/ethers.min.js";

//async function connectWalletConnect() {
  //const wcProvider = await EthereumProvider.init({
   //projectId: "77978d17ec9aba61aab14fc0ba6bcefe",
   //chains: [8453],
  //showQrModal: true,
  //});

  //await wcProvider.enable();
  //return new ethers.providers.Web3Provider(wcProvider);
//}

//export { connectWalletConnect };

/** 

const switchToBase = async () => {
  if (!provider) return;

  try {
    // 1. Attempt to switch network to BASE_CHAIN_ID_HEX (0x2105)
    await sdk.wallet.switchNetwork(BASE_CHAIN_ID_HEX);

    const network = await provider.getNetwork()
    console.log(network.name)

  } catch (switchError) {
    // 3. Check for error code 4902: Chain not added to the wallet
    if (switchError.code === 4902) {
      try {
        // 4. If 4902, request to add the Base Mainnet using BASE_NETWORK_INFO
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [BASE_NETWORK_INFO],
        });
        // 5. After successful addition, try connecting again (it usually switches automatically)
        await connectWallet();
      } catch (addError) {
        // Handle rejection of adding chain
        console.error("Add chain error:", addError);
      }
    } else if (switchError.code === 4001) {
      // Handle user rejection of switching chain
    } else {
      console.error("Switch failed:", switchError);
    }
  }
};

 // Check and switch network after connection
    if (chainId !== BASE_CHAIN_ID_DEC) {
      await switchToBase();
    }


    // --- Farcaster Wallet Logic ---
    const initFarcaster = async () => {
  try {
    const isMiniApp = await sdk.isInMiniApp();

    if (!isMiniApp) {
      console.log("Not in a Farcaster client. Wallet connection may not work.");
      return;
    }

    // 3. Get the native EIP-1193 provider
    const farcasterProvider = await sdk.wallet.getEthereumProvider();    
    provider = new ethers.providers.Web3Provider(farcasterProvider)
   

    if (!provider) {
      console.log(
        "Farcaster Mini App detected, but provider is unavailable.",
        "bg-red-600"
      );
      return;
    }

    // 4. App is ready to be displayed. This removes the splash screen.
    await sdk.actions.ready();
    await loadLeaderboard()
    console.log("Farcaster Ready. Click Connect to proceed.");

    // 5. Automatically attempt to connect/check status after ready.
  } catch (error) {
    console.error("Initialization error:", error);
  }
};
await initFarcaster();

const connectWallet = async () => {
  if (!provider) {
    console.log("not connected");
  }

  try {
    // eth_requestAccounts triggers the wallet connection prompt
    const accounts = await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();

    if (accounts.length === 0) {
      console.log("User rejected");
      return;
    }

    const address = await signer.getAddress();

    document.getElementById("connect").style.display = "none";

    document.getElementById(
      "msg"
    ).innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="12" fill="#0052FF"/>
  <path d="M14.45 11.32H9.55C9.22 11.32 8.95 11.59 8.95 11.92C8.95 12.25 9.22 12.52 9.55 12.52H14.45C14.78 12.52 15.05 12.25 15.05 11.92C15.05 11.59 14.78 11.32 14.45 11.32Z" fill="white"/>
</svg>
 ${address.slice(0, 6)}...${address.slice(-4)}`;
    document.getElementById("msg").style.display = "flex";

    const network = await provider.getNetwork();
    const chainId = network.chainId
    console.log("Connected to chain ID:", chainId);

  } catch (error) {
    console.error("Connection error:", error);
    // 4001 is standard EIP-1193 rejection error
    if (error.code === 4001) {
      console.log("Connection request rejected.");
    } else {
      console.log(`Connection failed: ${error.message || "Check console."}`);
    }
  }
};



    <!-- Farcaster miniapp SDK (UMD build) - exposes `miniapp` global -->
    <script type="module">
      import { sdk } from "https://esm.sh/@farcaster/miniapp-sdk";

      window.addEventListener("DOMContentLoaded", async () => {
        try {
          await sdk.actions.ready();
        } catch (err) {
          console.error(err);
        }
      });
    </script>

    // Base Chain Details
const BASE_CHAIN_ID_HEX = "0x2105"; // 8453 in decimal
const BASE_CHAIN_ID_DEC = 8453;
const BASE_NETWORK_INFO = {
  chainId: BASE_CHAIN_ID_HEX,
  chainName: "Base Mainnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};


    */

