//import EthereumProvider from "https://esm.sh/@walletconnect/ethereum-provider@2.10.0";
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.7.0/dist/ethers.min.js";
import { sdk } from "https://esm.sh/@farcaster/miniapp-sdk";
import { createConfig, WagmiClient } from "https://esm.sh/wagmi@1.3.0";
import { farcasterMiniApp } from "https://esm.sh/@farcaster/miniapp-wagmi-connector@latest";

async function connectWalletConnect() {
  //const wcProvider = await EthereumProvider.init({
  // projectId: "77978d17ec9aba61aab14fc0ba6bcefe",
  // chains: [8453],
  //showQrModal: true,
  //});

  //await wcProvider.enable();
  //return new ethers.providers.Web3Provider(wcProvider);

  const client = new WagmiClient({
    autoConnect: true,
    connectors: [farcasterMiniApp()],
  });

  try {
    await sdk.actions.ready();
    const accnt = await sdk.wallet.accounts();
    if (accnt.length > 0) {
      console.log("connected");
    } else {
      await sdk.wallet.connect();
      const newAccnt = await sdk.wallet.accounts();
    }
  } catch (err) {
    console.error(err);
  }
}

export { connectWalletConnect };
