import { createConfig, http, getAccount, connect } from "https://esm.sh/@wagmi/core";
import { base } from "https://esm.sh/wagmi/chains";
import { farcasterMiniApp } from "https://esm.sh/@farcaster/miniapp-wagmi-connector";
import { sdk } from "https://esm.sh/@farcaster/miniapp-sdk";

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

//Create Wagmi config with the MiniApp connector
const config = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  connectors: [farcasterMiniApp()],
});

// --- Farcaster Wallet connection ---
const initFarcaster = async () => {
  // Check if running in a Mini App
  const isMiniApp = await sdk.isInMiniApp();

  if (!isMiniApp) {
    console.log("Not in a Farcaster client. Wallet connection may not work.");
    return;
  }

  // skip splash screen
  await sdk.actions.ready();
  await loadLeaderboard();

  //Get the native EIP-1193 provider
  const farcasterProvider = await sdk.wallet.getEthereumProvider();
  provider = new ethers.providers.Web3Provider(farcasterProvider);

  signer = provider.getSigner();

  contract = new ethers.Contract(contractAddress, contractABI, signer);
};

await initFarcaster();

const connectFarcasterWallet = async () => {
  try {
    const account = getAccount(config);

    // If already connected
    if (account.status === "connected") {
      return;
    }

    // Otherwise, trigger connect
    const result = await connect(config, {
      connector: config.connectors[0],
    });

    document.getElementById("connect").style.display = "none";
    const userAddress = result.accounts[0];
    document.getElementById(
      "msg"
    ).innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="12" fill="#0052FF"/>
  <path d="M14.45 11.32H9.55C9.22 11.32 8.95 11.59 8.95 11.92C8.95 12.25 9.22 12.52 9.55 12.52H14.45C14.78 12.52 15.05 12.25 15.05 11.92C15.05 11.59 14.78 11.32 14.45 11.32Z" fill="white"/>
</svg>
 ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
    document.getElementById("msg").style.display = "flex";

    console.log("Connected:", result);
  } catch (err) {
    console.error(err);
  }
};

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
    } else {
      // If no Ethereum provider detected, try Farcaster MiniApp connection
      await connectFarcasterWallet();
    }
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
    const gasLimit = await contract.connect(RPC).estimateGas.play(userGuess);

    const tx = await contract.play(userGuess, { gasLimit: gasLimit });

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
  //await playerStat();
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
    console.log(userAddress);
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
