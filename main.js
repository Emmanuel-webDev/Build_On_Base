//import {connectWalletConnect} from "./wallet.js";

import { sdk } from "https://esm.sh/@farcaster/miniapp-sdk";
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

// --- Farcaster Wallet Logic ---

const connectWallet = async () => {
  if (!provider) {
    console.log("not connected");
    return;
  }

  try {
    // eth_requestAccounts triggers the wallet connection prompt
    const accounts = await provider.request({ method: "eth_requestAccounts" });

    if (accounts.length === 0) {
      console.log("User rejected");
      return;
    }

    const address = accounts[0];

    document.getElementById(
      "msg"
    ).innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="12" fill="#0052FF"/>
  <path d="M14.45 11.32H9.55C9.22 11.32 8.95 11.59 8.95 11.92C8.95 12.25 9.22 12.52 9.55 12.52H14.45C14.78 12.52 15.05 12.25 15.05 11.92C15.05 11.59 14.78 11.32 14.45 11.32Z" fill="white"/>
</svg>
 ${addr.slice(0, 6)}...${addr.slice(-4)}`;
    document.getElementById("msg").style.display = "flex";

    const chainIdHex = await provider.request({ method: "eth_chainId" });
    const chainId = parseInt(chainIdHex, 16);

    // Check and switch network after connection
    if (chainId !== BASE_CHAIN_ID_DEC) {
      await switchToBase();
    }
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

const switchToBase = async () => {
  if (!provider) return;

  try {
    // 1. Attempt to switch network to BASE_CHAIN_ID_HEX (0x2105)
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BASE_CHAIN_ID_HEX }],
    });
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

const initFarcaster = async () => {
  try {
    const isMiniApp =
      (await sdk.isInMiniApp()) || window.farcaster?.miniapp?.ethereum;

    if (!isMiniApp) {
      console.log("Not in a Farcaster client. Wallet connection may not work.");
      return;
    }

    // 3. Get the native EIP-1193 provider
    provider = sdk.wallet.getEthereumProvider();
    if (!provider) {
      console.log(
        "Farcaster Mini App detected, but provider is unavailable.",
        "bg-red-600"
      );
      return;
    }

    // 4. App is ready to be displayed. This removes the splash screen.
    await sdk.actions.ready();
    console.log("Farcaster Ready. Click Connect to proceed.");

    // 5. Automatically attempt to connect/check status after ready.
  } catch (error) {
    console.error("Initialization error:", error);
  }
};

const contractAddress = "0x6F8Bf9b227da8c2bA64125Cbf15aDC85B1F6AF4B"; // Contract address

//Contract ABI
const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "guess",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "answer",
        type: "uint256",
      },
    ],
    name: "GuessFailed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "num",
        type: "uint256",
      },
    ],
    name: "play",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allPlayers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "generatedNum",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "leaderBoard",
    outputs: [
      {
        internalType: "address[]",
        name: "players",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "guesses",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "corrects",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "usersInfo",
    outputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isRegistered",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "guessCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountWon",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let provider, signer, contract;

const RPC = "https://mainnet.base.org"; // Base RPC
const readProvider = new ethers.providers.JsonRpcProvider(RPC);

const readContract = new ethers.Contract(
  contractAddress,
  contractABI,
  readProvider
);

document.getElementById("connect").onclick = async function init() {
  try {
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); //ask user to connect wallet

      try {
        // Try switching the network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            { chainId: "0x2105" }, // Base Mainnet chain ID
          ],
        });
      } catch (switchError) {
        // If the chain is not added yet, we can add it
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x2105",
                  chainName: "Base Mainnet",
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://mainnet.base.org"],
                  blockExplorerUrls: ["https://basescan.org"],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add network:", addError);
          }
        } else {
          console.error("Failed to switch network:", switchError);
        }
      }
    } else {
      //      provider = await connectWalletConnect();
      await initFarcaster();
      await connectWallet();
      return;
    }

    signer = provider.getSigner(); //account that is connected
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    document.getElementById("connect").style.display = "none";
    let addr = await signer.getAddress();
    document.getElementById(
      "msg"
    ).innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="12" fill="#0052FF"/>
  <path d="M14.45 11.32H9.55C9.22 11.32 8.95 11.59 8.95 11.92C8.95 12.25 9.22 12.52 9.55 12.52H14.45C14.78 12.52 15.05 12.25 15.05 11.92C15.05 11.59 14.78 11.32 14.45 11.32Z" fill="white"/>
</svg>
 ${addr.slice(0, 6)}...${addr.slice(-4)}`;
    document.getElementById("msg").style.display = "flex";

    await playerStat();
  } catch (error) {
    alert("Error connecting wallet:", error);
  }
};

document.getElementById("actionButton").onclick = async function () {
  if (!signer) {
    alert("Please connect your wallet first.");
    return;
  }
  const userGuess = document.getElementById("userGuess").value;
  if (userGuess < 0 || userGuess > 100) {
    alert("Expected values is between 0 and 100.");
    return;
  }

  if (!userGuess) {
    alert("Please enter a valid guess between 0 and 100.");
    return;
  }

  try {
    const tx = await contract.play(userGuess);

    let generated = await contract.generatedNum();
    Number(generated);

    if (userGuess == generated) {
      document.getElementById("feedback").innerText =
        "✅ Correct! 🎉 You Win! 🥳";
    } else {
      document.getElementById(
        "feedback"
      ).innerText = `❌ Wrong Guess, Try Again! 🔁, Answer is ${generated}`;
    }
  } catch (err) {
    alert("Error submitting your guess. Make sure it's between 0 and 100.");
  }

  await loadLeaderboard();
  await playerStat();
};

document.getElementById("resetGame").onclick = async function () {
  document.getElementById("userGuess").value = "";
  document.getElementById("feedback").innerText = "";
  await loadLeaderboard();
};

async function loadLeaderboard() {
  try {
    const [players, guesses, corrects] = await readContract.leaderBoard();

    let leaderboard = players.map((player, index) => {
      return {
        player,
        guesses: Number(guesses[index]),
        corrects: Number(corrects[index]),
      };
    });

    // ✅ Sort by highest correct guesses
    leaderboard.sort((a, b) => b.corrects - a.corrects);

    const leaderboardBody = document.getElementById("leaderboardBody");
    leaderboardBody.innerHTML = ""; // Clear before refill

    leaderboard.forEach((entry, index) => {
      const shortened =
        entry.player.slice(0, 6) + "..." + entry.player.slice(-4);

      let row = `
        <tr>
          <td>${index + 1}</td>
          <td>${shortened}</td>
          <td>${entry.corrects}</td>
          <td>${entry.guesses}</td>
        </tr>
      `;
      leaderboardBody.innerHTML += row;
    });

    return leaderboard;
  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
}

async function playerStat() {
  try {
    if (!signer) {
      document.getElementById("info").style.display = "none";
      return;
    }

    const userAddress = await signer.getAddress();
    const loadLeaderboardData = await loadLeaderboard();

    const userData = await contract.usersInfo(userAddress);

    const guessCount = Number(userData.guessCount);
    const amountWon = Number(userData.amountWon);

    let userRank = loadLeaderboardData.findIndex(
      (entry) => entry.player.toLowerCase() === userAddress.toLowerCase()
    );

    if (userRank !== -1) {
      userRank = userRank + 1; // convert from array index → rank number
      document.getElementById("info").style.display = "block";
      document.getElementById(
        "playerStat"
      ).innerHTML = `Your Rank: ${userRank} | Total Guesses: ${guessCount} | Amount Won: ${amountWon}`;
    } else {
      document.getElementById("playerStat").style.innerHTML = "N/A";
      return;
    }
  } catch (error) {
    console.error("Error fetching player stats:", error);
  }
}

// Initial load of leaderboard
window.onload = loadLeaderboard;
