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
      address: '0x5a0A5Ba73f64D83842c52a7398eE414d14701f19', // Replace with your smart contract address
      topics: ['0xd26ff88a1db9b3b7e9a6a7cd0abec5d2c8efce0a95a30bf024b29e7365f81f0d'] // Replace with an array of topics if needed, or use [null] to listen for all events from the specified address
    };

    // Callback function to handle the event
    const eventCallback = (error, result) => {
      if (error) {
        console.error('Error in subscription:', error);
        return;
      }

      // Handle the result (in this case, the log data)
      console.log('New event:', result.data);
    };

    // Subscribe to the event
    const subscription = web3.eth.subscribe(eventType, options, eventCallback);

      


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

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
