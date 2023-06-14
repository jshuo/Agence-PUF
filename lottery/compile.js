const path = require('path');
const fs = require('fs');
const solc = require('solc');

function getSource(filePath) {
  const resolvedPath = path.resolve(__dirname, 'contracts', filePath);
  return fs.readFileSync(resolvedPath, 'utf8');
}

const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: getSource('Lottery.sol'),
    },
    'RandomConsumerBase.sol': {
      content: getSource('RandomConsumerBase.sol'),
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};


const output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("output:", output); // Add this line to print the output

if (output && output.contracts && output.contracts['Lottery.sol']) {
  module.exports = output.contracts['Lottery.sol'].Lottery;
} else {
  console.error('Error: Unable to access compiled contract. Please check the compilation output for any issues.');
}
