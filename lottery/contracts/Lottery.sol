// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}


abstract contract RandomConsumerBase is Context {
    error CanOnlyBeCalledByPrecompile(address have, address want);

    /**
     * @dev Receives `entropy` for `requestId`.  Contract must override this function
     *
     * Returns null
     */
    function executeImpl(uint256 requestId, uint256 entropy) internal virtual;

    /**
     * @dev `executeEntropy` delegates the data to the `executeImpl`
     *
     * Returns null
     */
    function executeEntropy(uint256 requestId, uint256 entropy) external {
        if (msg.sender != 0x0000000000000000000000000000000000000801) {
            revert CanOnlyBeCalledByPrecompile(
                msg.sender,
                0x0000000000000000000000000000000000000801
            );
        }
        executeImpl(requestId, entropy);
    }
}

contract Lottery is RandomConsumerBase {


        
        event RandomReceived(uint256 requestId, uint256 entropy);
        uint256 public currentRequestId = 0;
        uint256 public currentEntropy = 0;
        address public manager;
        address payable[] public players;
        
        constructor() {
            manager = msg.sender;
        }

        function enter() public payable {
            require(msg.value > .005 ether);
            players.push(payable(msg.sender));
        }
        
        function random() private view returns (uint) {
            return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
        }
        function pickWinner() public restricted {
            uint index = random() % players.length;
            players[index].transfer(address(this).balance);
            players = new address payable[](0);
            emit RandomReceived(random() % 1000,random() % 1000);
        }
        
        modifier restricted() {
            require(msg.sender == manager);
            _;
        }
        
        function getPlayers() public view returns (address payable[] memory) {
            return players;
        }        
        function executeImpl(uint256 requestId, uint256 entropy) internal virtual override  {
            //my code
            currentRequestId = requestId;
            currentEntropy = entropy;
            emit RandomReceived(requestId,entropy);
        }
}

