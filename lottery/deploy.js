const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
  'addict cloud cause scale fever cushion raccoon punch blame uncover ramp doll bottom lumber unhappy kit scrub square confirm organ robot palace island gallery',
  // remember to change this to your own phrase!
  // 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about', 
  // 'https://sepolia.infura.io/v3/e9f62e559d264acca5fe498412c1d9b9'
  // remember to change this to your own endpoint!
  'https://takecopter.cloud.agence.network'
  // 887
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(JSON.stringify(abi));
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
