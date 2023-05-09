import web3 from './web3';

// const address = '0xBc00c7AB72819315463813fF77a8914e8Fa58540';
const address = '0x61B3b9D9f1d4A3500044d8d9844c77Cc61860331';

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
      {
        indexed: false,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'RandomReceived',
    type: 'event',
    signature:
      '0x6a28a83c30527eb0e14ded931b39c019a5c569be94926dafae0e92c4b5f17ed4',
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
];
const lottery = new web3.eth.Contract(abi, address);

export default lottery;
