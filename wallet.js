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

    */