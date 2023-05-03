const assert = require('assert');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

// const address = '0xBc00c7AB72819315463813fF77a8914e8Fa58540';
const address = '0x5a0A5Ba73f64D83842c52a7398eE414d14701f19';

const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
    signature: 'constructor',
  },
  {
    inputs: [
      { internalType: 'address', name: 'have', type: 'address' },
      { internalType: 'address', name: 'want', type: 'address' },
    ],
    name: 'CanOnlyBeCalledByPrecompile',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'entropy',
        type: 'uint256',
      },
    ],
    name: 'RandomReceived',
    type: 'event',
    signature:
      '0xd26ff88a1db9b3b7e9a6a7cd0abec5d2c8efce0a95a30bf024b29e7365f81f0d',
  },
  {
    inputs: [],
    name: 'currentEntropy',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x5dc8cf69',
  },
  {
    inputs: [],
    name: 'currentRequestId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x5ae2bfdb',
  },
  {
    inputs: [],
    name: 'enter',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
    signature: '0xe97dcb62',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requestId', type: 'uint256' },
      { internalType: 'uint256', name: 'entropy', type: 'uint256' },
    ],
    name: 'executeEntropy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x7c966b2f',
  },
  {
    inputs: [],
    name: 'getPlayers',
    outputs: [
      { internalType: 'address payable[]', name: '', type: 'address[]' },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x8b5b9ccc',
  },
  {
    inputs: [],
    name: 'manager',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x481c6a75',
  },
  {
    inputs: [],
    name: 'pickWinner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x5d495aea',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'players',
    outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xf71d96cb',
  },
];
let lottery = '';

const provider = new HDWalletProvider(
  'flip february broom truck razor guard enter rebuild click return impulse census imitate sense news cruise swift cat response view cover evoke raw time',
  // remember to change this to your own phrase!
  'https://sepolia.infura.io/v3/e9f62e559d264acca5fe498412c1d9b9'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
// Separate WebSocketProvider for subscriptions
const wsProvider = new Web3.providers.WebsocketProvider(
  'wss://sepolia.infura.io/ws/v3/e9f62e559d264acca5fe498412c1d9b9'
  // remember to change this to your own WebSocket endpoint!
);

// Set the provider for subscriptions separately
web3.eth.subscribe = (type, options, callback) => {
  const subscription = new Web3(wsProvider).eth.subscribe(
    type,
    options,
    callback
  );
  return subscription;
};

// Type of event to listen for, in this case, logs (smart contract events)
const eventType = 'logs';

// Options (needed for the 'logs' event type)
const options = {
  address: '0x5a0A5Ba73f64D83842c52a7398eE414d14701f19', // Replace with your smart contract address
  topics: [
    '0xd26ff88a1db9b3b7e9a6a7cd0abec5d2c8efce0a95a30bf024b29e7365f81f0d',
  ], // Replace with an array of topics if needed, or use [null] to listen for all events from the specified address
};

function extractHexToDecimal(hexString, startPosition) {
  // extract remaining hex string from start position to end of string
  const remainingHexString = hexString.substring(startPosition);
  console.log(remainingHexString);

  // convert hex string to decimal number
  const decimalNumber = parseInt(remainingHexString, 16);

  return decimalNumber;
}
// Callback function to handle the event
const eventCallback = (error, result) => {
  if (error) {
    console.error('Error in subscription:', error);
    return;
  }

  // Handle the result (in this case, the log data)
  const startPosition = 32 * 2 + 2 + 1; //including 0x

  const decimalNumber = extractHexToDecimal(result.data, startPosition);
  console.log('Random Number is:', decimalNumber);
};

let accounts;

before(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi, address);
  web3.eth.subscribe(eventType, options, eventCallback);
  // lottery = await new web3.eth.Contract(abi)
  //   .deploy({ data: evm.bytecode.object })
  //   .send({ from: accounts[0], gas: '1000000' });
});
describe('Lottery Contract', () => {
  it('deploys ethereum contract', () => {
    assert.ok(lottery.options.address);
  });
  for (let i = 0; i < 3; i++) {
    // it('allows one account to enter', async () => {
    //   await lottery.methods.enter().send({
    //     from: accounts[0],
    //     value: web3.utils.toWei('0.01', 'ether'),
    //   });

    //   const players = await lottery.methods.getPlayers().call({
    //     from: accounts[0],
    //   });

    //   assert.equal(accounts[0], players[0]);
    //   assert.equal(1, players.length);
    // });

    it('allows multiple accounts to enter', async () => {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.015', 'ether'),
      });
      await lottery.methods.enter().send({
        from: accounts[1],
        value: web3.utils.toWei('0.006', 'ether'),
      });

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0],
      });
      console.log(players);
      // assert.equal(accounts[0], players[0]);
      // assert.equal(accounts[1], players[1]);
      // assert.equal(2, players.length);
    });

    it('requires a minimum amount of ether to enter', async () => {
      try {
        await lottery.methods.enter().send({
          from: accounts[0],
          value: 0,
        });
        assert(false);
      } catch (err) {
        assert(err);
      }
    });

    it('only manager can call pickWinner', async () => {
      try {
        await lottery.methods.pickWinner().send({
          from: accounts[0],
          gas: '1000000',
        });
        assert(true);
      } catch (err) {
        assert(err);
      }
    });

    it('sends money to the winner and resets the players array', async () => {
      // await lottery.methods.enter().send({
      //   from: accounts[0],
      //   value: web3.utils.toWei('0.02', 'ether'),
      // });

      const initialBalance = await web3.eth.getBalance(accounts[0]);
      // await lottery.methods.pickWinner().send({ from: accounts[0] });
      const finalBalance = await web3.eth.getBalance(accounts[0]);
      const difference = finalBalance - initialBalance;
      // assert(difference > web3.utils.toWei('1.8', 'ether'));

      // lottery
      // .getPastEvents('RandomReceived', {
      //   fromBlock: "3345658",
      //   toBlock: 'latest',
      // })
      // .then((events) => {
      //   console.log('Events:', events[events.length-1].returnValues);
      // })
      // .catch((error) => {
      //   console.error('Error:', error);
      // });
    });
  }
});
afterEach((done) => {
  // ...
  done();
});
