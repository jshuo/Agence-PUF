import React from 'react';
import web3 from './web3';
import lottery from './lottery';


class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    randomNumber: ''
  };
  componentDidMount() {
    let manager, players, balance;

    lottery
      .getPastEvents('RandomReceived', {
        fromBlock: "3345658",
        toBlock: 'latest',
      })
      .then((events) => {
        console.log('Events:', events);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Type of event to listen for, in this case, logs (smart contract events)
    const eventType = 'logs';

    // Options (needed for the 'logs' event type)
    const options = {
      address: '0x61B3b9D9f1d4A3500044d8d9844c77Cc61860331', // Replace with your smart contract address
      topics: ['0x6a28a83c30527eb0e14ded931b39c019a5c569be94926dafae0e92c4b5f17ed4'] // Replace with an array of topics if needed, or use [null] to listen for all events from the specified address
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
    

    // Callback function to handle the event
    const eventCallback = (error, result) => {
      let previousBlockNumber;
      if (error) {
        console.error('Error in subscription:', error);
        return;
      }
    
      // Handle the result (in this case, the log data)
      const startPosition = 32 * 2 + 2; //including 0x
      if (previousBlockNumber !== result.blockNumber) {
        const randomNumber = extractHexToDecimal(result.data, startPosition);
        this.setState({ randomNumber: randomNumber });
      }
      previousBlockNumber = result.blockNumber;
    };

    // Subscribe to the event
   web3.eth.subscribe(eventType, options, eventCallback);

      


    setInterval(async () => {
      manager = await lottery.methods.manager().call();
      players = await lottery.methods.getPlayers().call();
      balance = await web3.eth.getBalance(lottery.options.address);
      this.setState({ manager, players, balance });
    }, 5000);
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    return (
      <div>
        <h2>Agence - SecuX PUF Demo</h2>
        <h4> <a href="https://blockscout.takecopter.cloud.agence.network/address/0xfC10126E2F41cbB264BceEE6c6093133AA45f317/transactions">Agence EVM Explorer</a></h4>
        <h4>
          This contract is managed by {this.state.manager}. 
        </h4>
        <h5>
        There are currently{' '}
          {this.state.players.length} people entered, competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </h5>

        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Place your bet</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <h1>{this.state.randomNumber}</h1>
        <hr />

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}
export default App;
