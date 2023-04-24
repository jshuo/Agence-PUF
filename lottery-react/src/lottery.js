import web3 from './web3';

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
const lottery = new web3.eth.Contract(abi, address);

export default lottery;
