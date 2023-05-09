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
      address: '0x8166faD5d5FA00C861d025088BcAa9405802aDa4', // Replace with your smart contract address
      topics: ['0xf6faf575d299d9dad4669d63e412bf6520ed4be07be3bfcb8355976dcdf93262'] // Replace with an array of topics if needed, or use [null] to listen for all events from the specified address
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
      let previousPUFEntropy, previousMixedPUFEntropy, previousBlockNumber;
      if (error) {
        console.error('Error in subscription:', error);
        return;
      }
    
      // Handle the result (in this case, the log data)
      const PUFEntropyPosition = 32 * 2 + 2; //including 0x
      const MixedPUFEntropyPosition = 32 * 4+56 + 2; //including 0x
      if (previousBlockNumber !== result.blockNumber) {
        const PUFEntropy = extractHexToDecimal(result.data, PUFEntropyPosition);
        // eslint-disable-next-line
        previousPUFEntropy = PUFEntropy;
    
        const MixedPUFEntropy = extractHexToDecimal(result.data, MixedPUFEntropyPosition);
        this.setState({ randomNumber: (PUFEntropy >>> 0).toString(2) });
        // eslint-disable-next-line
        previousMixedPUFEntropy = MixedPUFEntropy;
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
        <h4>
          This contract is managed by {this.state.manager}.         There are currently{' '}
          {this.state.players.length} people entered, competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} HME(s)!
        </h4>

        <h1>{this.state.randomNumber}</h1>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Place your bet   <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            /> <label>HME(s)</label><button class="my-button" >Enter</button> <button onClick={this.onClick}>Pick a winner!</button> </h4>
          
        </form>

        <hr />

        
        <hr />

        <h1>{this.state.message}</h1>

      </div>
    );
  }
}
export default App;
