From some reason npm install could cause the following 

/Users/jmh_cheng/workspace/Agence-PUF/lottery/node_modules/solc/soljson.js:133
    process["on"]("unhandledRejection", function (reason) { throw reason; });
                                                            ^

Error: The contract code couldn't be stored, please check your gas limit.
    at Object.TransactionError (/Users/jmh_cheng/workspace/Agence-PUF/lottery/node_modules/web3-core-helpers/lib/errors.js:90:21)
    at Object.ContractCodeNotStoredError (/Users/jmh_cheng/workspace/Agence-PUF/lottery/node_modules/web3-core-helpers/lib/errors.js:98:21)
    at /Users/jmh_cheng/workspace/Agence-PUF/lottery/node_modules/web3-core-method/lib/index.js:337:49
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {


# using previous nodule modules for now.. 