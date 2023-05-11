const assert = require('assert');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const address = '0x2c425684843D13C6fE88E03624e9b40748aFF7E7';

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
        name: 'PUFentropy',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'currentEntropy',
        type: 'uint256',
      },
    ],
    name: 'RandomReceived',
    type: 'event',
    signature:
      '0xf6faf575d299d9dad4669d63e412bf6520ed4be07be3bfcb8355976dcdf93262',
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
    name: 'oracle',
    outputs: [{ internalType: 'contract Oracle', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x7dc0d1d0',
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
  {
    inputs: [],
    name: 'tempEntropy',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x4d7d0db5',
  },
];
let lottery = '';

const httpProvider = new HDWalletProvider(
  'clock same voyage solar initial any cancel type draw brush roof sure desk discover ignore scrap gown shed save liberty senior lens onion south',
  // remember to change this to your own phrase!
  // 'https://sepolia.infura.io/v3/e9f62e559d264acca5fe498412c1d9b9'
  'https://takecopter.cloud.agence.network'
  // remember to change this to your own endpoint!
);

// Separate WebSocketProvider for subscriptions
const wsProvider = new Web3.providers.WebsocketProvider(
  'wss://ws.takecopter.cloud.agence.network'
  // remember to change this to your own WebSocket endpoint!
);

// Set the default provider for web3
const web3 = new Web3(httpProvider);

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
  address: '0x2c425684843D13C6fE88E03624e9b40748aFF7E7', // Replace with your smart contract address
  topics: [
    '0xf6faf575d299d9dad4669d63e412bf6520ed4be07be3bfcb8355976dcdf93262',
  ], // Replace with an array of topics if needed, or use [null] to listen for all events from the specified address
};

function extractHexToDecimal(hexString, startPosition) {
  // extract remaining hex string from start position to end of string
  const remainingHexString = hexString.substring(
    startPosition,
    startPosition + 64
  );
  // console.log(remainingHexString);
  // convert hex string to decimal number
  const decimalNumber = parseInt(remainingHexString, 16);

  return decimalNumber;
}

let PUFEntropyOdd = 0,
  PUFEntropyEven = 0,
  MixedPUFEntropyOdd = 0,
  MixedPUFEntropyEven = 0;
let previousPUFEntropy,
  previousMixedPUFEntropy,
  blockNumber,
  previousBlockNumber;
// Callback function to handle the event
const eventCallback = (error, result) => {
  if (error) {
    console.error('Error in subscription:', error);
    return;
  }

  // Handle the result (in this case, the log data)
  const PUFEntropyPosition = 32 * 2 + 2; //including 0x
  const MixedPUFEntropyPosition = 32 * 4 + 56 + 2; //including 0x
  if (previousBlockNumber !== result.blockNumber) {
    const PUFEntropy = extractHexToDecimal(result.data, PUFEntropyPosition);
    assert(PUFEntropy > 0);
    assert(previousPUFEntropy !== PUFEntropy);
    previousPUFEntropy = PUFEntropy;
    const MixedPUFEntropy = extractHexToDecimal(
      result.data,
      MixedPUFEntropyPosition
    );
    if (PUFEntropy % 2 === 0) {
      PUFEntropyEven++;
    } else if (PUFEntropy % 2 === 1) {
      PUFEntropyOdd++;
    }
    if (MixedPUFEntropy % 2 === 0) {
      MixedPUFEntropyEven++;
    } else if (MixedPUFEntropy % 2 === 1) {
      MixedPUFEntropyOdd++;
    }
    console.log(
      'PUFEntropy is:',
      PUFEntropy,
      'odd count: ',
      PUFEntropyOdd,
      'even count: ',
      PUFEntropyEven,
      'MixedPUFEntropy is:',
      MixedPUFEntropy,
      'odd count: ',
      MixedPUFEntropyOdd,
      'even count: ',
      MixedPUFEntropyEven
    );
    assert(MixedPUFEntropy > 0);
    assert(previousMixedPUFEntropy !== MixedPUFEntropy);
    previousMixedPUFEntropy = MixedPUFEntropy;
  }
  previousBlockNumber = result.blockNumber;
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let accounts;
before(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(abi, address);
  // Subscribe to the event
  web3.eth.subscribe(eventType, options, eventCallback);
  // lottery = await new web3.eth.Contract(abi)
  //   .deploy({ data: evm.bytecode.object })
  //   .send({ from: accounts[0], gas: '1000000' });
});
describe('Lottery Contract', () => {
  for (let i = 0; i < 60000; i++) {
    it(`allows multiple accounts to enter, test ${i + 1}`, async () => {
      await lottery.methods.enter().send({
        from: accounts[0],
        gasLimit: 2000000,
        value: web3.utils.toWei('2', 'ether'),
      });

      const players = await lottery.methods.getPlayers().call({
        from: accounts[0],
      });
      console.log(players);
      //      assert.equal(accounts[0], players[0]);
      //      assert.equal(accounts[1], players[1]);
      // assert.equal(2, players.length);
    });

    it('only manager can call pickWinner', async () => {
      try {
        PUFEntropy = 0;
        await lottery.methods.pickWinner().send({
          from: accounts[0],
          gas: '1000000',
        });
        // assert(PUFEntropy>0);
        // await delay(1000); // Add 10 seconds delay
      } catch (err) {
        assert(err);
      }
    });
  }
});
