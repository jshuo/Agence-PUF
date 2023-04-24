import Web3 from "web3";
const HDWalletProvider = require('@truffle/hdwallet-provider');

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const httpProvider = new HDWalletProvider(
    'flip february broom truck razor guard enter rebuild click return impulse census imitate sense news cruise swift cat response view cover evoke raw time',
    // remember to change this to your own phrase!
    'https://sepolia.infura.io/v3/e9f62e559d264acca5fe498412c1d9b9'
    // remember to change this to your own endpoint!
  );

  // Separate WebSocketProvider for subscriptions
  const wsProvider = new Web3.providers.WebsocketProvider(
    'wss://sepolia.infura.io/ws/v3/e9f62e559d264acca5fe498412c1d9b9'
    // remember to change this to your own WebSocket endpoint!
  );

  // Set the default provider for web3
  web3 = new Web3(httpProvider);

  // Set the provider for subscriptions separately
  web3.eth.subscribe = (type, options, callback) => {
    const subscription = new Web3(wsProvider).eth.subscribe(type, options, callback);
    return subscription;
  };
}

export default web3;
