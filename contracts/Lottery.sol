pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender; // set manager equal to contract creator
    }

    function enter() public payable {
        require(msg.value > .01 ether); // global require used for validations

        players.push(msg.sender); // use global msg object to add sender address to players array
    }

    function random() private view returns (uint) {
      return uint(keccak256(block.difficulty, now, players)); // global sha3 same/sim as keccak256
    }

    function pickWinner() public restricted{ // including restricted takes this block of code and places it in place of _ in restricted method
        uint index = random() % players.length; // create random index of winner
        players[index].transfer(this.balance); // address type comes w/ transfer method, transfer entire contract balance
        players = new address[](0); // reset players array w/ new intialized dynamic address array of 0 length/elements
    }

    modifier restricted() { // create 'function modifier' called 'restricted' for manager validation to keep code DRY
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[]){
        return players;
    }
}
